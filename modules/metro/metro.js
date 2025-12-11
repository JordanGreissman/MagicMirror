Module.register("metro", {
	defaults: {
		apiKey: "",
		stationCode: "A05",
		group: "1",
		line: "RD", // optional filter; set to "" to disable
		limit: 2,
		updateInterval: 30 * 1000 // 30s
	},

	start() {
		this.trains = [];
		this.stationName = null;
		this.error = null;

		// this.sendSocketNotification("METRO_CONFIG", this.config);
		// this._schedule = setInterval(() => {
		// 	this.sendSocketNotification("METRO_FETCH", null);
		// }, this.config.updateInterval);
	},

	// called when module is stopped / MM shuts down
	stop() {
		if (this._schedule) clearInterval(this._schedule);
	},

	getStyles() {
		return ["metro.css"];
	},

	socketNotificationReceived(notification, payload) {
		if (notification === "METRO_DATA") {
			this.error = null;
			this.stationName = payload.stationName;
			this.trains = payload.trains;
			this.updateDom();
		}

		if (notification === "METRO_ERROR") {
			this.error = payload?.message || "WMATA fetch error";
			this.updateDom();
		}
	},

	getDom() {
		const wrapper = document.createElement("div");
		wrapper.className = "wmata";

		if (this.error) {
			const msg = document.createElement("div");
			msg.className = "wmata-error";
			msg.innerText = this.error;
			wrapper.appendChild(msg);
			return wrapper;
		}

		if (!this.trains?.length) {
			const msg = document.createElement("div");
			msg.className = "wmata-loading";
			msg.innerText = "No predictions yet…";
			wrapper.appendChild(msg);
			return wrapper;
		}

		const list = document.createElement("div");
		list.className = "wmata-list";

		this.trains.forEach((t) => {
			const row = document.createElement("div");
			row.className = "wmata-row";

			const left = document.createElement("div");
			left.className = "wmata-left";
			left.innerText = `${t.Line || ""}`.trim() || "—";

			const right = document.createElement("div");
			right.className = "wmata-right";
			right.innerText = `${t.Min}`;

			row.appendChild(left);
			row.appendChild(right);
			list.appendChild(row);
		});

		wrapper.appendChild(list);
		return wrapper;
	}
});
