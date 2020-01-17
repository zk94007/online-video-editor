/**
 * @file Express routing service
 * @author Ervis Semanaj
 */

const server = require('express');
const router = server.Router();

// Require controller modules.
const apiController = require('./controllers/apiController');
const errorController = require('./controllers/errorController');

// Vis timeline resources
router.get('/vis.css', (req, res) => res.sendFile(__dirname + '/react/_lib/vis-timeline/vis.css'));
router.get('/vis.js', (req, res) => res.sendFile(__dirname + '/react/_lib/vis-timeline/vis.js'));

// API route
router.all('/api', apiController.default);

// Project
router.get('/api/project/:projectID', apiController.projectGET);
router.post('/api/project', apiController.projectPOST);

// Update Project
router.post('/api/project/:projectID/projectName', apiController.projectNamePOST);
router.post('/api/project/:projectID/projectTimeline', apiController.projectTimelinePOST);

// Resources API
router.post('/api/project/:projectID/import', apiController.projectImportPOST);
router.post('/api/project/:projectID/file', apiController.projectFilePOST);
router.delete('/api/project/:projectID/file/:fileID', apiController.projectFileDELETE);
router.post('/api/project/:projectID/logo', apiController.projectLogoPOST);
router.delete('/api/project/:projectID/logo/:fileID', apiController.projectLogoDELETE);

// Render
router.put('/api/project/:projectID', apiController.projectPUT);

// Error handling
router.use(errorController.default);

module.exports = router;