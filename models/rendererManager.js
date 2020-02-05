/**
 * @file Manager for work with RENDER files
 * @author Ervis Semanaj
 */

import config from '../config';
import timeManager from './timeManager';
import log from './logger';
import fileManager from './fileManager';
import cloudManager from './cloudManager';

const fs = require('fs');
const path = require('path');
const RWlock = require('rwlock');

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
        const filepath = path.join(path.dirname(require.main.filename), config.projectPath, project, 'renderer.json');

        return new Promise((resolve, reject) => {
            fs.writeFile(filepath, JSON.stringify(renderer), (err) => {
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
            fs.readFile(filepath, (err, data) => {
                if (err) {
                    log.error(`Unable to open file ${filepath}`); 
                    reject(err);
                }

                resolve(JSON.parse(data));
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

    /**
     * Generate Thumbnail for video resource and upload to S3
     * 
     * @param {*} projectID 
     * @param {*} resourceID 
     */
    generateThumbnail(projectID, resourceID) {
        return new Promise((resolve, reject) => {
            this.loadRenderer(projectID).then(
                renderer => {
                    if (!renderer.resources[resourceID]) {
                        log.error(`Unable to find resource ${projectID} ${resourceID}`); 
                        reject(`Unable to find resource ${projectID} ${resourceID}`);
                    };
    
                    const resource = renderer.resources[resourceID];
                    fileManager.generateThumbnail(resource.filepath, resource.mimeType, path.join(config.projectPath, projectID, `${path.parse(resource.filepath).name}-thumb-0.jpg`)).then(
                        thumbnail => {
                            if (!thumbnail) {
                                log.error(`Thumbnail is not generated`); 
                                reject(`Thumbnail is not generated`);
                            }
    
                            cloudManager.upload(thumbnail, `upload/${projectID}`,  `${path.parse(resource.filepath).name}-thumb-0.jpg`).then(
                                url => {
                                    resource.thumbpath = path.resolve(path.join(config.projectPath, projectID, `${path.parse(resource.filepath).name}-thumb-0.jpg`));
                                    resource.thumbnail = url;
                                    this.saveRenderer(projectID, renderer).then(() => {
                                        resolve(resource.thumbnail);
                                    });
                                }
                            )
                        }
                    );
                }
            )
        });
    }
}