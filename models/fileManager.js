/**
 * @file Manager for work with media files
 * @author Ervis Semanaj
 */

const { exec } = require('child_process');
import log from './logger';

export default {

	/**
	 * Get time duration of file. Return null when file is not video.
	 *
	 * @param filepath
	 * @param mimeType
	 * @return {Promise<any>}
	 */
	getDuration(filepath, mimeType) {
		return new Promise((resolve) => {
			if (new RegExp(/^video\//).test(mimeType) || new RegExp(/^audio\//).test(mimeType)) {
				exec(`ffmpeg -i ${filepath} 2>&1 | grep Duration | cut -d ' ' -f 4 | sed s/,// | sed s/\\\\./,/`, (err, stdout) => {
					if (err) log.error(err);
					else resolve(stdout.trim().replace('.', ',')); // Windows version is not working 2019.12.16 Not needed for Ubuntu
				});
			}
			else {
				resolve(null);
			}
		});
	},

	/**
	 * Get the thumbnail of video. Return 00:00:00 snapshot for given video
	 * 
	 * @param {*} filepath 
	 * @param {*} mimeType 
	 * @param {*} destpath 
	 * @return {Promise<any>}
	 */
	generateThumbnail(filepath, mimeType, destpath) {
		return new Promise((resolve) => {
			if (new RegExp(/^video\//).test(mimeType)) {
				exec(`ffmpeg -ss 00:00:00 -i ${filepath} -vframes 1 -q:v 2 ${destpath}`, (err, stdout) => {
					if (err) log.error(err);
					else resolve(destpath);
				});
			}
			else {
				resolve(null);
			} 
		});
	},

	/**
	 * 
	 * @param {*} filepath 
	 * @param {*} destpath 
	 * @param {*} filename 
	 */
	copyFile(filepath, destpath) {
		return new Promise((resolve) => {
			exec(`cp ${filepath} ${destpath}`, (err, stdout) => {
				if (err) log.error(err);
				else resolve(stdout.trim());
			});
		});
	}

};
