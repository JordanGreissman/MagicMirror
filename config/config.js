let config = {
	address: "localhost", // Address to listen on, can be:
	// - "localhost", "127.0.0.1", "::1" to listen on loopback interface
	// - another specific IPv4/6 to listen on a specific interface
	// - "0.0.0.0", "::" to listen on any interface
	// Default, when address config is left out or empty, is "localhost"
	port: 8080,
	basePath: "/", // The URL path where MagicMirrorÂ² is hosted. If you are using a Reverse proxy
	// you must set the sub path here. basePath must end with a /
	ipWhitelist: ["127.0.0.1", "::ffff:127.0.0.1", "::1"], // Set [] to allow all IP addresses
	// or add a specific IPv4 of 192.168.1.5 :
	// ["127.0.0.1", "::ffff:127.0.0.1", "::1", "::ffff:192.168.1.5"],
	// or IPv4 range of 192.168.3.0 --> 192.168.3.15 use CIDR format :
	// ["127.0.0.1", "::ffff:127.0.0.1", "::1", "::ffff:192.168.3.0/28"],

	useHttps: false, // Support HTTPS or not, default "false" will use HTTP
	httpsPrivateKey: "", // HTTPS private key path, only require when useHttps is true
	httpsCertificate: "", // HTTPS Certificate path, only require when useHttps is true

	language: "en",
	locale: "en-US", // this variable is provided as a consistent location
	// it is currently only used by 3rd party modules. no MagicMirror code uses this value
	// as we have no usage, we  have no constraints on what this field holds
	// see https://en.wikipedia.org/wiki/Locale_(computer_software) for the possibilities

	timeFormat: 12,
	units: "imperial",

	modules: [
		{
			module: "clock",
			position: "top_left",
			config: {
				timeFormat: 12,
				displaySeconds: false,
			}
		},
		{
			module: "compliments",
			position: "middle_center",
			config: {
				remoteFile: "https://gist.githubusercontent.com/JordanGreissman/ff7db55a908ac5bc32e9a6f5735d07a2/raw/d60e88720d116518af48ae7f546b4c651db75e0c/compliments.json",
				classes: "thin xxlarge bright"
			}
		},
		{
			module: "weather",
			position: "top_right",
			classes: "weather_current",
			config: {
				colored: true,
				weatherProvider: "openmeteo",
				type: "current",
				lat: 38.9072,
				lon: -77.0369,
				roundTemp: true,
				showSun: false,
				appendLocationNameToHeader: false,
			}
		},
		{
			module: "weather",
			position: "top_right",
			classes: "weather_hourly",
			config: {
				colored: true,
				weatherProvider: "openmeteo",
				type: "hourly",
				lat: 38.9072,
				lon: -77.0369,
				appendLocationNameToHeader: false,
				roundTemp: true,
				maxEntries: 12,
				fade: false,
				tableClass: "large",
				tempColors: { cold: 40, warm: 70 }
			}
		},
		{
			module: "metro",
			position: "top_left",
			config: {}
		}
	]
};

/*************** DO NOT EDIT THE LINE BELOW ***************/
if (typeof module !== "undefined") {
	module.exports = config;
}
