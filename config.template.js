/**
 * @file Main config file
 * @author Ervis Semanaj <ervis.semanaj@outlook.com>
 */

export const server = {
	port: 8099,
	host: 'localhost',

	get serverUrl() {
		return `http://${this.host}:${this.port}`;
	},
	get apiUrl() {
		return `http://${this.host}:${this.port}/api`;
	},
};

export default {
	emailServer: '',
	emailPort: 465,
	emailUser: '',
	emailPasswd: '',
	adminEmail: '',

	projectPath: 'WORKER',

	declareXML: '<?xml version="1.0" encoding="UTF-8"?>\n<!DOCTYPE mlt SYSTEM "https://raw.githubusercontent.com/mltframework/mlt/master/src/modules/xml/mlt-xml.dtd">',

	mapFilterNames: {
		fadeInBrightness: 'brightness',
		fadeOutBrightness: 'brightness',
		fadeInVolume: 'volume',
		fadeOutVolume: 'volume',
	}
};
