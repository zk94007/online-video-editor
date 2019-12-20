/**
 * @file Manager for work with RENDER files
 * @author Ervis Semanaj
 */

import config from '../config';
import timeManager from './timeManager';
import log from './logger';

const fs = require('fs');
const path = require('path');
const RWlock = require('rwlock');
const jsonfile = require('jsonfile');

const lock = new RWlock();

export default {
    /**
     * 
     * @param {string} project 
     * @param {json} renderer 
     * @param {function|undefined} release 
     * @return {Promise<any>}
     */
    saveRenderer(project, renderer, release = undefined) {
        const filepath = path.join(config.projectPath, project, 'renderer.json');

        return new Promise((resolve, reject) => {
            jsonfile.writeFile(filepath, renderer, (err) => {
                if (typeof release !== 'undefined') release();

                if (err) {
                    log.error(`Unable to update file ${filepath}`);
                    reject(err);
                }

                log.info(`File ${filepath} updated.`);
                resolve();
            });
		});
    },

    loadRenderer(project) {
        const filepath = this.getRendererpath(project);
        return new Promise((resolve, reject) => {
            jsonfile.readFile(filepath, (err, renderer) => {
                if (err) {
                    log.error(`Unable to open file ${filepath}`); 
                    reject(err);
                }

                resolve(renderer);
            });
		});
    },

    /**
	 * Get relative path of renderer file for specified project
	 *
	 * @param {String} projectID
	 * @return {string}
	 */
	getRendererpath(projectID) {
		return path.join(config.projectPath, projectID, 'renderer.json');
	},
}