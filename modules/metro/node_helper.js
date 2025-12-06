const NodeHelper = require("node_helper");
const https = require("https");

function httpGetJson(url, headers = {}) {
	return new Promise((resolve, reject) => {
		const req = https.request(url, { method: "GET", headers }, (res) => {
			let data = "";
			res.on("data", (chunk) => (data += chunk));
			res.on("end", () => {
				try {
					resolve(JSON.parse(data));
				} catch (e) {
					reject(new Error(`Invalid JSON: ${e.message}`));
				}
			});
		});

		req.on("error", reject);
		req.end();
	});
}

// Sort "BRD"/"ARR"/numbers in a sensible order
function parseMin(min) {
	if (min === "BRD") return -1;
	if (min === "ARR") return 0;
	const n = Number(min);
	return Number.isFinite(n) ? n : 9999;
}

module.exports = NodeHelper.create({
	start() {
		this.config = null;
		this.lastFetch = 0;
	},

	async socketNotificationReceived(notification, payload) {
		if (notification === "METRO_CONFIG") {
			this.config = payload;
			// fetch immediately
			this.fetchPredictions().catch((e) => {
				this.sendSocketNotification("METRO_ERROR", { message: e.message });
			});
			return;
		}

		if (notification === "METRO_FETCH") {
			this.fetchPredictions().catch((e) => {
				this.sendSocketNotification("METRO_ERROR", { message: e.message });
			});
		}
	},

	async fetchPredictions() {
		if (!this.config?.apiKey) throw new Error("Missing apiKey");
		const stationCode = this.config.stationCode;
		if (!stationCode) throw new Error("Missing stationCode");

		// WMATA rail predictions endpoint:
		// https://api.wmata.com/StationPrediction.svc/json/GetPrediction/{StationCodes}
		// (We pass api_key as query param here.) :contentReference[oaicite:4]{index=4}
		const url = `https://api.wmata.com/StationPrediction.svc/json/GetPrediction/${encodeURIComponent(stationCode)}?api_key=${encodeURIComponent(this.config.apiKey)}`;

		const json = await httpGetJson(url);

		const trains = Array.isArray(json?.Trains) ? json.Trains : [];

		const filtered = trains
			.filter((t) => (t?.Group || "").toLowerCase() === this.config.group)
			.sort((a, b) => parseMin(a.Min) - parseMin(b.Min))
			.slice(0, this.config.limit || 2)
			.map((t) => ({
				Line: t.Line,
				DestinationName: t.DestinationName,
				Min: t.Min,
				LocationName: t.LocationName
			}));

		const stationName = filtered[0]?.LocationName || null;

		this.sendSocketNotification("METRO_DATA", {
			stationName,
			trains: filtered
		});
	}
});
