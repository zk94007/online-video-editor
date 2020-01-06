/**
 * @file Controller for REST API
 * @author Ervis Semanaj
 */

import config from '../config';
import mltxmlManager from '../models/mltxmlManager';
import fileManager from '../models/fileManager';
import cloudManager from  '../models/cloudManager';
import timeManager from '../models/timeManager';
import rendererManager from '../models/rendererManager';
import log from '../models/logger';

const fs = require('fs');
const path = require('path');
const generate = require('nanoid/generate');
const { exec } = require('child_process');

exports.default = (req, res) => {
	res.json({
		msg: 'For API documentation see https://github.com/',
	});
};


exports.projectPOST = (req, res, next) => {
    const renderer = {
		projectID: generate('ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz1234567890', 32),
		projectName: '',
		logos: {},
		resources: {},
		timeline: [
			{
				id: 'texttrack0',
				items: []
			},
			{
				id: 'audiotrack0',
				items: []
			},
			{
				id: 'videotrack0',
				items: [],
				transitions: []
			}
		]
	};

	fs.mkdir(path.join(config.projectPath, renderer.projectID), { recursive: true }, (err) => {
		if (err) return next(err);
    });

	rendererManager.saveRenderer(renderer.projectID, renderer).then(
		() => {
			res.json({
				project: renderer.projectID,
			});
		},
		err => next(err)
	);
};


exports.projectGET = (req, res) => {
	rendererManager.loadRenderer(req.params.projectID).then(
		(renderer) => {
			res.json({
				project: req.params.projectID,
				projectName: renderer.projectName,
				logos: renderer.logos,
				resources: renderer.resources,
				timeline: renderer.timeline,
			});
		},
		err => fileErr(err, res)
	);
};

exports.projectImportPOST = (req, res, next) => {
	// Required parameters: track, item, time
	if (!isset(req.body.url)) {
		res.status(400);
		res.json({
			err: 'Missing parameters.',
			msg: 'Missing required parameters: url.',
		});
		return;
	}

	cloudManager.download(req.body.url, path.join(config.projectPath, req.params.projectID)).then(
		(filename) => {
			const fileID = generate('ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz1234567890', 16);
			let filepath = path.join(config.projectPath, req.params.projectID, filename);

			fileManager.getDuration(filepath, mimeType).then(
				length => {
					if (length !== null) length += '0';
					rendererManager.loadRenderer(req.params.projectID).then(
						(renderer) => {
							renderer.resources[fileID] = {
								id: fileID,
								name: filename,
								filepath: path.resolve(filepath),
								mimeType,
								length,
								url: req.body.url
							};

							rendererManager.saveRenderer(req.params.projectID, renderer).then(
								() => {
									res.json({
										msg: `Import of "${filename}" OK`,
										resource_id: fileID,
										resource_mime: mimeType,
										length: length,
										url: req.body.url
									});
								},
								err => next(err)
							);
						},
						err => fileErr(err, res)
					);
				}
			);
		}
	);
};

exports.projectFilePOST = (req, res, next) => {
	if (!isset(req.busboy)) {
		res.status(400);
		res.json({
			err: 'File is missing.',
			msg: 'The request body must contain a file to upload.',
		});
		return;
	}

	req.busboy.on('file', (fieldname, file, filename, transferEncoding, mimeType) => {
		const fileID = generate('ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz1234567890', 16);
		const extension = path.extname(filename);
		let nfilename = fileID;
		if (extension.length > 1) nfilename += extension;
		let filepath = path.join(config.projectPath, req.params.projectID, nfilename);

		// Create a write stream of the new file
		const fstream = fs.createWriteStream(filepath);

		log.info(`Upload of "${filename}" started`);

		// Pipe it trough
		file.pipe(fstream);

		// On finish of the upload
		fstream.on('close', () => {
			log.info(`Upload of "${filename}" finished`);

			cloudManager.upload(filepath, `upload/${req.params.projectID}`, nfilename).then(
				(url) => {
					fileManager.getDuration(filepath, mimeType).then(
						length => {
							if (length !== null) length += '0';
							rendererManager.loadRenderer(req.params.projectID).then(
								(renderer) => {
									renderer.resources[fileID] = {
										id: fileID,
										name: filename,
										filepath: path.resolve(filepath),
										mimeType,
										length,
										url
									};
		
									rendererManager.saveRenderer(req.params.projectID, renderer).then(
										() => {
											res.json({
												msg: `Upload of "${filename}" OK`,
												resource_id: fileID,
												resource_mime: mimeType,
												length: length,
												url
											});
										},
										err => next(err)
									);
								},
								err => fileErr(err, res)
							);
						}
					);
				},
				err => next(err)
			);			
		});
	});

	req.pipe(req.busboy); // Pipe it trough busboy
};


exports.projectFileDELETE = (req, res, next) => {
	rendererManager.loadRenderer(req.params.projectID).then(
		(renderer) => {
			const track = renderer.timeline.find(track => track.items.find(item => item.id === req.params.fildID));
			if (track) {
				res.status(403);
				res.json({
					err: 'Source in use.',
					msg: 'The resource is being used in the project. Remove it from the timeline before deleting it from the project.',
				});
				return;
			}

			const resource = renderer.resources[req.params.fileID];
			if (!resource) {
				res.status(404);
				res.json({
					err: 'Source not found.',
					msg: 'The resource is not in the project.'
				});
				return;
			}

			const filepath = resource.filepath;
			if (filepath === null) {
				return next(`Project "${req.params.projectID}", resource ${req.params.fileID} misses filepath`);
			}

			// Try to remove file, log failure
			fs.unlink(filepath, (err) => {
				if (err) log.error(err);
			});
			
			delete renderer.resources[req.params.fileID];

			rendererManager.saveRenderer(req.params.projectID, renderer).then(
				() => {
					res.json({
						msg: 'Feed removed successfully',
					});
				},
				err => next(err)
			);
		},
		err => fileErr(err, res)
	);
};

exports.projectLogoPOST = (req, res, next) => {

	if (!isset(req.busboy)) {
		res.status(400);
		res.json({
			err: 'File is missing.',
			msg: 'The request body must contain a file to upload.',
		});
		return;
	}

	req.busboy.on('file', (fieldname, file, filename, transferEncoding, mimeType) => {
		const fileID = generate('ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz1234567890', 16);
		const extension = path.extname(filename);
		let nfilename = fileID;
		if (extension.length > 1) nfilename += extension;
		let filepath = path.join(config.projectPath, req.params.projectID, nfilename);

		// Create a write stream of the new file
		const fstream = fs.createWriteStream(filepath);

		log.info(`Upload of "${filename}" started`);

		// Pipe it trough
		file.pipe(fstream);

		// On finish of the upload
		fstream.on('close', () => {
			log.info(`Upload of "${filename}" finished`);

			cloudManager.upload(filepath, `upload/${req.params.projectID}`, nfilename).then(
				(url) => {
					rendererManager.loadRenderer(req.params.projectID).then(
						(renderer) => {
							renderer.logos[fileID] = {
								id: fileID,
								name: filename,
								filepath: path.resolve(filepath),
								url
							};

							rendererManager.saveRenderer(req.params.projectID, renderer).then(
								() => {
									res.json({
										msg: `Upload of "${filename}" OK`,
										logo_id: fileID,
										url
									});
								},
								err => next(err)
							);
						},
						err => fileErr(err, res)
					);
				},
				err => next(err)
			);
			
		});
	});

	req.pipe(req.busboy); // Pipe it trough busboy
};


exports.projectLogoDELETE = (req, res, next) => {
	rendererManager.loadRenderer(req.params.projectID).then(
		(renderer) => {
			const track = renderer.timeline.find(track => track.items.find(item => item.id === req.params.fildID));
			if (track) {
				res.status(403);
				res.json({
					err: 'Source in use.',
					msg: 'The logo is being used in the project. Remove it from the timeline before deleting it from the project.',
				});
				return;
			}

			const logo = renderer.logos[req.params.fileID];
			if (!logo) {
				res.status(404);
				res.json({
					err: 'Source not found.',
					msg: 'The logo is not in the project.'
				});
				return;
			}

			const filepath = logo.filepath;
			if (filepath === null) {
				return next(`Project "${req.params.projectID}", resource ${req.params.fileID} misses filepath`);
			}

			// Try to remove file, log failure
			fs.unlink(filepath, (err) => {
				if (err) log.error(err);
			});
			
			delete renderer.logos[req.params.fileID];

			rendererManager.saveRenderer(req.params.projectID, renderer).then(
				() => {
					res.json({
						msg: 'Feed removed successfully',
					});
				},
				err => next(err)
			);
		},
		err => fileErr(err, res)
	);
};


exports.projectFilePUT = (req, res, next) => {

	// Required parameters: track
	if (!isset(req.body.track) || !isset(req.body.support) || !isset(req.body.in) || !isset(req.body.out)) {
		res.status(400);
		res.json({
			err: 'Missing parameters.',
			msg: 'Missing required parameters; ( track | support | in | out )',
		});
		return;
	}

	if (!req.body.track.includes(req.body.support)) {
		res.status(400);
		res.json({
			err: 'Unsupported file type.',
			msg: 'Please import exact type of resource into the track.',
		});
		return;
	}

	if (!timeManager.isValidDuration(req.body.in) || !timeManager.isValidDuration(req.body.out)) {
		res.status(400);
		res.json({
			err: 'Invalid time format.',
			msg: 'To insert on the timeline, you must specify a duration of 00:00:00,000.',
		});
		return;
	}

	rendererManager.loadRenderer(req.params.projectID).then(
		(renderer) => {
			const resource = renderer.resources[req.params.fileID];
			if (!resource) {
				res.status(404);
				res.json({
					err: 'Source not found.',
					msg: 'The resource is not in the project.'
				});
				return;
			}

			const track = renderer.timeline.find(t => t.id === req.body.track);
			if (track === null) {
				res.status(404);
				res.json({
					err: 'Track not found.',
					msg: `The specified track "${req.body.track}" is not in the project.`,
				});
				return;
			}

			track.items.push({
				id: req.params.fileID,
				in: req.body.in,
				out: req.body.out,
				clip: {
					left: '00:00:00,000',
					right: timeManager.subDuration(req.body.out, req.body.in)
				}
			});

			rendererManager.saveRenderer(req.params.projectID, renderer).then(
				() => {
					res.json({
						msg: 'Item added to timeline',
						timeline: req.body.track,
					});
				},
				err => next(err)
			);
		},
		err => fileErr(err, res)
	);

};

exports.projectTextAnimationPOST = (req, res, next) => {
	if (!isset(req.body.track, req.body.textAnimation, req.body.in, req.body.out)) {
		res.status(400);
		res.json({
			err: 'Missing parameters.',
			msg: 'Missing required parameters: track, textAnimation, in, out.',
		});
		return;
	}

	if (!timeManager.isValidDuration(req.body.in) || !timeManager.isValidDuration(req.body.out)) {
		res.status(400);
		res.json({
			err: 'Incorrect parameters.',
			msg: 'In/Out must be nonzero, in the format 00:00:00,000.',
		});
		return;
	}

	if (!req.body.track.includes('texttrack')) {
		res.status(400);
		res.json({
			err: 'Incorrect action.',
			msg: 'Text animation should be inserted on texttracks.',
		});
		return;
	}

	rendererManager.loadRenderer(req.body.projectID).then(
		(renderer) => {
			const track = renderer.timeline.find(t => t.id == req.body.track);
			if (track === null) {
				res.status(404);
				res.json({
					err: 'Track not found.',
					msg: `The specified track "${req.body.track}" is not in the project.`,
				});
				return;
			}

			track.items.push({
				id: generate('ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz1234567890', 16),
				textAnimation: req.body.textAnimation,
				in: req.body.in,
				out: req.body.out,
				clip: {
					left: '00:00:00,000',
					right: timeManager.subDuration(req.body.out, req.body.in)
				}
			});

			rendererManager.saveRenderer(req.params.projectID, renderer).then(
				() => {
					res.json({
						msg: 'Item added to timeline',
						timeline: req.body.track,
					});
				},
				err => next(err)
			);
		},
		err => fileErr(err, res)
	);
};

exports.projectTransitionPOST = (req, res, next) => {

	// Required parameters: track, itemA, itemB, transition, duration
	if (!isset(req.body.track, req.body.itemA, req.body.itemB, req.body.transition, req.body.duration)) {
		res.status(400);
		res.json({
			err: 'Missing parameters.',
			msg: 'Missing required parameters: track, itemA, itemB, transition, duration.',
		});
		return;
	}

	if (!timeManager.isValidDuration(req.body.duration)) {
		res.status(400);
		res.json({
			err: 'Incorrect parameters.',
			msg: 'Duration must be nonzero, in the format 00:00:00,000.',
		});
		return;
	}

	rendererManager.loadRenderer(req.body.projectID).then(
		(renderer) => {
			const track = renderer.timeline.find(t => t.id == req.body.track);
			if (track === null) {
				res.status(404);
				res.json({
					err: 'Track not found.',
					msg: `The specified track "${req.body.track}" is not in the project.`,
				});
				return;
			}

			const itemA = track.items.find(item => item.id == req.body.itemA);
			const itemB = track.items.find(item => item.id == req.body.itemB);

			if (!itemA || !itemB) {
				res.status(404);
				res.json({
					err: 'Item not found.',
					msg: `${req.body.itemA} or ${req.body.itemA} is not on track "${req.body.track}".`,
				});
				return;
			}

			if (itemA.out !== itemB.in) {
				res.status(400);
				res.json({
					err: 'Incorrect parameters.',
					msg: 'itemA must directly follow itemB.',
				});
				return;
			}

			const durationA = timeManager.subDuration(itemA.out, itemA.in);
			const durationB = timeManager.subDuration(itemB.out, itemB.in);

			if (req.body.duration > durationA || req.body.duration > durationB) {
				res.status(400);
				res.json({
					err: 'Transition time too long.',
					msg: 'The transition is longer than one of the transition items.',
				});
				return;
			}

			track.transitions.push({
				id: generate('ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz1234567890', 16),
				itemA: req.body.itemA,
				itemB: req.body.itemB,
				transition: req.body.transition,
				duration: req.body.duration
			});


			rendererManager.saveRenderer(req.params.projectID, renderer).then(
				() => {
					res.json({
						msg: 'Item added to timeline',
						timeline: req.body.track,
					});
				},
				err => next(err)
			);
		},
		err => fileErr(err, res)
	);
};

exports.projectItemDELETE = (req, res, next) => {
	// Required parameters: track, item
	if (!isset(req.body.track, req.body.item)) {
		res.status(400);
		res.json({
			err: 'Missing parameters.',
			msg: 'Missing required parameters: track, item.',
		});
		return;
	}

	rendererManager.loadRenderer(req.params.projectID).then(
		(renderer) => {
			const track = renderer.timeline.find(t => t.id == req.body.track);
			if (track === null) {
				res.status(404);
				res.json({
					err: 'Track not found.',
					msg: `The specified track "${req.body.track}" is not in the project.`,
				});
				return;
			}
			
			const item = track.items.find(item => item.id == req.body.item);
			if (item === null) {
				res.status(404);
				res.json({
					err: 'Item not found.',
					msg: `${req.body.item} is not on track "${req.body.track}".`,
				});
				return;
			}

			track.items.splice(track.items.findIndex(item => item.id == req.body.item), 1);

			if (track.id.includes('videotrack')) {
				track.transitions.splice(track.transitions.findIndex(transition => transition.itemA == req.body.item || transition.itemB == req.body.item), 1);
			}

			rendererManager.saveRenderer(req.params.projectID, renderer).then(
				() => {
					res.json({msg: 'Item removed'});
				},
				err => next(err)
			);
		},
		err => fileErr(err, res)
	);
};

exports.projectItemPUTmove = (req, res, next) => {

	// Required parameters: track, trackTarget, item, time
	if (!isset(req.body.track, req.body.trackTarget, req.body.item, req.body.time)) {
		res.status(400);
		res.json({
			err: 'Missing parameters.',
			msg: 'Missing required parameters: track, trackTarget, item, time.',
		});
		return;
	}

	if (req.body.time !== '00:00:00,000' && !timeManager.isValidDuration(req.body.time)) {
		res.status(400);
		res.json({
			err: 'Wrong parameter.',
			msg: 'The time parameter must be in the format 00:00:00,000.',
		});
		return;
	}

	if (!(req.body.trackTarget.includes('videotrack') && req.body.track.includes('videotrack'))) {
		if (!(req.body.trackTarget.includes('audiotrack') && req.body.track.includes('audiotrack'))) {
			res.status(400);
			res.json({
				err: 'Incompatible tracks.',
				msg: 'You cannot move items between video and audio tracks.',
			});
			return;
		}
	}

	rendererManager.loadRenderer(req.params,projectID).then(
		(renderer) => {
			const track = renderer.timeline.find(t => t.id == req.body.track);
			const trackTarget = renderer.timeline.find(t => t.id == req.body.trackTarget);

			if (track === null || trackTarget === null) {
				res.status(404);
				res.json({
					err: 'Track not found.',
					msg: `The specified track "${req.body.track}" or "${trackTarget}" is not in the project.`,
				});
				return;
			}

			const item = track.items.find(item => item.id == req.body.item);
			if (item === null) {
				res.status(404);
				res.json({
					err: 'Item not found.',
					msg: `${req.body.item} is not on track "${req.body.track}".`,
				});
				return;
			}

			track.items.splice(track.items.findIndex(item => item.id == req.body.item), 1);
			if (track.id.includes('videotrack')) {
				track.transitions.splice(track.transitions.findIndex(transition => transition.itemA == req.body.item || transition.itemB == req.body.item), 1);
			}

			trackTarget.items.push(item);

			rendererManager.saveRenderer(req.params.projectID, renderer).then(
				() => {
					res.json({msg: 'Item removed'});
				},
				err => next(err)
			);
		},
		err => fileErr(err, res)
	);
};

exports.projectItemPUTsplit = (req, res, next) => {
	// Required parameters: track, item, time
	if (!isset(req.body.track, req.body.item, req.body.time)) {
		res.status(400);
		res.json({
			err: 'Missing parameters.',
			msg: 'Missing required parameters: track, item, time.',
		});
		return;
	}

	if (!timeManager.isValidDuration(req.body.time)) {
		res.status(400);
		res.json({
			err: 'Wrong parameter.',
			msg: 'The time parameter must be positive, in the format 00:00:00,000.',
		});
		return;
	}

	rendererManager.loadRenderer(req.params.projectID).then(
		(renderer) => {
			const track = renderer.timeline.find(t => t.id == req.body.track);
			if (track === null) {
				res.status(404);
				res.json({
					err: 'Track not found.',
					msg: `The specified track "${req.body.track}" is not in the project.`,
				});
				return;
			}

			const item = track.items.find(item => item.id == req.body.item);
			if (item === null) {
				res.status(404);
				res.json({
					err: 'Item not found.',
					msg: `Item ${req.body.item} is not on "${req.body.track}".`,
				});
				return;
			}

			if (req.body.time < item.in || req.body.time > item.out) {
				res.status(400);
				res.json({
					err: 'Parameter out of range.',
					msg: `The time parameter must be between ${item.in} and a ${item.out}`,
				});
				return;
			}

			const leftDuration = timeManager.subDuration(req.body.time, item.in);
			const rightDuration = timeManager.subDuration(time.out, req.body.time);

			const itemLeft = JSON.parse(JSON.stringify(item));
			const itemRight = JSON.parse(JSON.stringify(item));

			itemLeft.out = req.body.time;
			itemRight.in = req.body.time;

			itemLeft.clip.right = timeManager.subDuration(itemLeft.clip.right, rightDuration);
			itemRight.clip.left = timeManager.addDuration(itemRight.clip.left, leftDuration);

			track.items.splice(track.items.findIndex(item => item.id == req.body.item), 1);
			track.items.push(itemLeft);
			track.items.push(itemRight);
			
			rendererManager.saveRenderer(req.params.projectID, renderer).then(
				() => {
					res.json({msg: 'Item removed'});
				},
				err => next(err)
			);
		},
		err => fileErr(err, res)
	);
};

exports.projectItemPUTcrop = (req, res, next) => {
	// Required parameters: track, item, time
	if (!isset(req.body.track, req.body.item, req.body.time, req.body.direction)) {
		res.status(400);
		res.json({
			err: 'Missing parameters.',
			msg: 'Missing required parameters: track, item, time, direction.',
		});
		return;
	}

	if (!timeManager.isValidDuration(req.body.time)) {
		res.status(400);
		res.json({
			err: 'Wrong parameter.',
			msg: 'The time parameter must be positive, in the format 00:00:00,000.',
		});
		return;
	}

	rendererManager.loadRenderer(req.params.projectID).then(
		(renderer) => {
			const track = renderer.timeline.find(t => t.id == req.body.track);
			if (track === null) {
				res.status(404);
				res.json({
					err: 'Track not found.',
					msg: `The specified track "${req.body.track}" is not in the project.`,
				});
				return;
			}

			const item = track.items.find(item => item.id == req.body.item);
			if (item === null) {
				res.status(404);
				res.json({
					err: 'Item not found.',
					msg: `Item ${req.body.item} is not on "${req.body.track}".`,
				});
				return;
			}

			if (direction == 'front') {
				if (req.body.time > item.in) {
					const duration = timeManager.subDuration(req.body.time, item.in);
					item.in = req.body.time;
					item.clip.left = timeManager.addDuration(item.clip.left, duration);
				}
				if (req.body.time < item.in) {
					const duration = timeManager.subDuration(item.in, req.body.time);
					item.in = req.body.time;
					item.clip.left = timeManager.subDuration(item.clip.left, duration);
				}
			} else if (direction == 'back') {
				if (req.body.time < item.out) {
					const duration = timeManager.subDuration(item.out, req.body.time);
					item.out = req.body.time;
					item.clip.right = timeManager.subDuration(item.clip.right, duration);
				}
				if (req.body.time > item.out) {
					const duration = timeManager.subDuration(req.body.time, item.out);
					item.out = req.body.time;
					item.clip.right = timeManager.addDuration(item.clip.right, duration);
				}
			}
			
			rendererManager.saveRenderer(req.params.projectID, renderer).then(
				() => {
					res.json({msg: 'Item removed'});
				},
				err => next(err)
			);
		},
		err => fileErr(err, res)
	);
}

exports.projectFilterPOST = (req, res, next) => {

	// Required parameters: track, item, filter
	if (!isset(req.body.track, req.body.item, req.body.filter)) {
		res.status(400);
		res.json({
			err: 'Missing parameters.',
			msg: 'Missing required parameters: "track", "item", "filter".',
		});
		return;
	}

	mltxmlManager.loadMLT(req.params.projectID, 'w').then(
		([dom, , release]) => {
			const document = dom.window.document;
			const root = document.getElementsByTagName('mlt').item(0);

			const track = document.getElementById(req.body.track);
			if (track === null) {
				release();
				res.status(404);
				res.json({
					err: 'Track not found.',
					msg: `The specified track "${req.body.track}" is not in the project.`,
				});
				return;
			}

			const item = mltxmlManager.getItem(document, track, req.body.item);
			if (item === null) {
				release();
				res.status(404);
				res.json({
					err: 'Item not found.',
					msg: `Položka "${req.body.item}" se na stopě "${req.body.track}" nenachází.`,
				});
				return;
			}

			let trackIndex;
			let newTractor;

			if (mltxmlManager.isSimpleNode(item)) {
				// Create playlist after last producer
				const newPlaylist = mltxmlManager.entryToPlaylist(item, document);

				// Create tractor before videotrack0
				newTractor = mltxmlManager.createTractor(document);
				newTractor.innerHTML = `<multitrack><track producer="${newPlaylist.id}"/></multitrack>`;

				trackIndex = 0;

				// Update track playlist
				item.removeAttribute('in');
				item.removeAttribute('out');
				item.setAttribute('producer', newTractor.id);
			}
			else {
				trackIndex = mltxmlManager.getTrackIndex(item);

				// Check if filter is already applied
				const filters = item.parentElement.parentElement.getElementsByTagName('filter');
				for (let filter of filters) {
					let filterName;
					if (filter.getAttribute('musecut:filter') !== null) filterName = filter.getAttribute('musecut:filter');
					else filterName = filter.getAttribute('mlt_service');
					if (filterName === req.body.filter && filter.getAttribute('track') === trackIndex.toString()) {
						release();
						res.status(403);
						res.json({
							err: 'Filtr je již aplikován.',
							msg: `Položka "${req.body.item}" na stopě "${req.body.track}" má již filtr "${req.body.filter}" aplikován.`,
						});
						return;
					}
				}

				newTractor = item.parentElement.parentElement;
			}

			// Add new filter
			const newFilter = document.createElement('filter');
			let filterName = req.body.filter;
			if (isset(config.mapFilterNames[req.body.filter])) {
				filterName = config.mapFilterNames[req.body.filter];
				const newPropery = document.createElement('property');
				newPropery.setAttribute('name', 'musecut:filter');
				newPropery.innerHTML = req.body.filter;
				newFilter.appendChild(newPropery);
			}
			newFilter.setAttribute('mlt_service', filterName);
			newFilter.setAttribute('track', trackIndex.toString());
			newTractor.appendChild(newFilter);

			if (isset(req.body.params)) {
				for (let param in req.body.params) {
					const newPropery = document.createElement('property');
					newPropery.setAttribute('name', param);
					if (typeof req.body.params[param]  === 'number') {
						const value = req.body.params[param].toString();
						newPropery.innerHTML = value.replace(/\./, ',');
					}
					else {
						newPropery.innerHTML = req.body.params[param];
					}
					newFilter.appendChild(newPropery);
				}
			}

			mltxmlManager.saveMLT(req.params.projectID, root.outerHTML, release).then(
				() => {
					res.json({msg: 'Filtr přidán'});
				},
				err => next(err)
			);
		},
		err => fileErr(err, res)
	);

};

exports.projectFilterDELETE = (req, res, next) => {

	// Required parameters: track, item, filter
	if (!isset(req.body.track, req.body.item, req.body.filter)) {
		res.status(400);
		res.json({
			err: 'Missing parameters.',
			msg: 'Missing required parameters: "track", "item", "filter".',
		});
		return;
	}

	mltxmlManager.loadMLT(req.params.projectID, 'w').then(
		([dom, , release]) => {
			const document = dom.window.document;
			const root = document.getElementsByTagName('mlt').item(0);

			const track = document.getElementById(req.body.track);
			if (track === null) {
				release();
				res.status(404);
				res.json({
					err: 'Track not found.',
					msg: `The specified track "${req.body.track}" is not in the project.`,
				});
				return;
			}

			const item = mltxmlManager.getItem(document, track, req.body.item);
			if (item === null) {
				release();
				res.status(404);
				res.json({
					err: 'Item not found.',
					msg: `Položka "${req.body.item}" se na stopě "${req.body.track}" nenachází.`,
				});
				return;
			}

			let filterName = req.body.filter;
			if (isset(config.mapFilterNames[req.body.filter])) {
				filterName = config.mapFilterNames[req.body.filter];
			}

			const tractor = item.parentElement.parentElement;
			const trackIndex = mltxmlManager.getTrackIndex(item);
			const filters = tractor.getElementsByTagName('filter');
			let filter;
			for (let entry of filters) {
				if (entry.getAttribute('mlt_service') === filterName && entry.getAttribute('track') === trackIndex.toString()) {
					if (filterName === req.body.filter) {
						filter = entry;
						break;
					}
					// filterName is alias
					const alias = mltxmlManager.getProperty(entry.getElementsByTagName('property'), 'musecut:filter');
					if (alias === req.body.filter) {
						filter = entry;
						break;
					}
				}
			}

			// Check if filter exists
			if (mltxmlManager.isSimpleNode(item) || filter === undefined) {
				release();
				res.status(404);
				res.json({
					err: 'Filtr nenalezen.',
					msg: `Filtr "${req.body.filter}" se na ${req.body.item}. položce stopy "${req.body.track}" nenachází.`,
				});
				return;
			}

			filter.remove();

			// Tractor without filters, with one track
			if (!mltxmlManager.isUsedInTractor(item) && tractor.getElementsByTagName('multitrack').item(0).childElementCount === 1) {
				const playlist = document.getElementById(item.getAttribute('producer'));
				const entry = playlist.getElementsByTagName('entry').item(0);
				const tractorUsage = document.querySelector(`mlt>playlist>entry[producer="${tractor.id}"]`);
				tractorUsage.parentElement.insertBefore(entry, tractorUsage);

				tractorUsage.remove();
				tractor.remove();
				playlist.remove();
			}

			mltxmlManager.saveMLT(req.params.projectID, root.outerHTML, release).then(
				() => {
					res.json({msg: 'Filtr odebrán'});
				},
				err => next(err)
			);
		},
		err => fileErr(err, res)
	);

};

exports.projectPUT = (req, res, next) => {

	const projectPath = mltxmlManager.getWorkerDir(req.params.projectID);

	fs.open(path.join(projectPath, 'processing'), 'wx', (err, file) => {
		if (err) {
			switch (err.code) {
				case 'EEXIST':
					res.status(403);
					res.json({
						err: 'Processing in progress.',
						msg: 'The project is already being processed, please wait for it to finish.',
					});
					return;
				case 'ENOENT':
					fileErr(err, res);
					return;
				default:
					return next(err);
			}
		}
		fs.close(file, (err) => {
			if (err) log.error(err.stack);
		});

		exec(`cd ${projectPath} && melt project.mlt -consumer avformat:output.mp4 acodec=aac vcodec=libx264 > stdout.log 2> stderr.log`, (err) => {
			if (err) log.error(`exec error: ${err}`);

			fs.unlink(path.join(projectPath, 'processing'), (err) => {
				if (err) log.error(err.stack);
			});

			if (isset(req.body.email)) {
				emailManager.sendProjectFinished(req.body.email, req.params.projectID, !(err));
			}
		});
		res.json({
			msg: 'Processing started'
		});
	});

};

exports.projectTrackPOST = (req, res, next) => {
	// Required parameters: type
	if (!isset(req.body.type) || (req.body.type !== 'video' && req.body.type !== 'audio')) {
		res.status(400);
		res.json({
			err: 'Wrong parameter.',
			msg: 'The type parameter is missing or has a value other than "video" or "audio".',
		});
		return;
	}

	mltxmlManager.loadMLT(req.params.projectID, 'w').then(
		([dom, , release]) => {
			const document = dom.window.document;
			const root = document.getElementsByTagName('mlt').item(0);
			const mainTractor = document.querySelector('mlt>tractor[id="main"]');

			const tracks = document.querySelectorAll(`mlt>playlist[id^="${req.body.type}track"]`);
			const lastTrack = tracks.item(tracks.length - 1).id;
			const lastID = lastTrack.match(/^(.+)track(\d+)/);

			const newTractor = document.createElement('playlist');
			newTractor.id = lastID[1] + 'track' + (Number(lastID[2]) + 1);
			root.insertBefore(newTractor, mainTractor);

			const newTrack = document.createElement('track');
			newTrack.setAttribute('producer', newTractor.id);
			mainTractor.getElementsByTagName('multitrack').item(0).appendChild(newTrack);

			mltxmlManager.saveMLT(req.params.projectID, root.outerHTML, release).then(
				() => {
					res.json({
						msg: 'Stopa přidána',
						track: newTractor.id,
					});
				},
				err => next(err)
			);
		},
		err => fileErr(err, res)
	);
};


exports.projectTrackDELETE = (req, res, next) => {

	// Required parameters: track, item, time
	if (!isset(req.body.track)) {
		res.status(400);
		res.json({
			err: 'Missing parameters.',
			msg: 'Missing required parameters: track.',
		});
		return;
	}

	mltxmlManager.loadMLT(req.params.projectID, 'w').then(
		([dom, , release]) => {
			const document = dom.window.document;
			const root = document.getElementsByTagName('mlt').item(0);
			let trackID = req.body.track;

			const track = document.getElementById(req.body.track);
			if (track === null) {
				release();
				res.status(404);
				res.json({
					err: 'Track not found.',
					msg: `The specified track "${req.body.track}" is not in the project.`,
				});
				return;
			}

			// Removing default track
			if (req.body.track === 'videotrack0' || req.body.track === 'audiotrack0') {
				const type  = (req.body.track.includes('video')) ? 'videotrack' : 'audiotrack';
				let nextTrack = null;
				let nextElement = track.nextElementSibling;
				while (nextElement !== null) {
					if (nextElement.id.includes(type)) {
						nextTrack = nextElement;
						break;
					}
					nextElement = nextElement.nextElementSibling;
				}

				if (nextTrack === null) {
					release();
					res.status(403);
					res.json({
						err: 'The track cannot be deleted.',
						msg: 'The default tracks "videotrack0" and "audiotrack0" cannot be deleted.',
					});
					return;
				}

				trackID = nextElement.id;
				nextElement.id = type + '0'; // Rename next element to videotrack0/audiotrack0
			}

			const trackRef = document.querySelector(`mlt>tractor>multitrack>track[producer="${trackID}"]`);
			trackRef.remove();
			track.remove();

			mltxmlManager.saveMLT(req.params.projectID, root.outerHTML, release).then(
				() => {
					res.json({
						msg: 'Track deleted',
					});
				},
				err => next(err)
			);
		},
		err => fileErr(err, res)
	);
};


/**
 * Handle error while opening project directory.
 *
 * @param err
 * @param res
 */
function fileErr(err, res) {
	if (err.code === 'ENOENT') {
		res.status(404).json({
			err: 'The project does not exist',
			msg: 'The specified project does not exist.',
		});
	}
	else {
		log.error(err.stack);
		res.status(500).json({
			err: 'Unable to open project',
			msg: 'An error occurred while loading the project.',
		});
	}
}


/**
 * Check if numbers are positive integers
 *
 * @param numbers
 * @return {boolean} Return TRUE only if all of the parameters fits
 */
function isNaturalNumber(...numbers) {
	for (let number of numbers) {
		if (typeof number !== 'number' || !Number.isInteger(number) || number < 0) return false;
	}
	return true;
}


/**
 * Determine if variables are declared
 *
 * @param variables Rest parameters
 * @return {boolean} Return TRUE only if all of the parameters are set
 */
function isset(...variables) {
	for (let variable of variables) {
		if (typeof variable === 'undefined') return false;
	}
	return true;
}
