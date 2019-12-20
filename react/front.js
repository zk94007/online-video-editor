/**
 * @file React binding to HTML file
 * @author Ervis Semanaj
 */

import React from 'react';
import ReactDOM from 'react-dom';
import NewProjectDialog from './newProject/NewProjectDialog';
import Editor from './editor/Editor';
import "../views/style.scss";
import '../views/scrollbar.css';

if (document.getElementById('newProjectDialog') !== null) {
	// Landing page
	ReactDOM.render(<NewProjectDialog />, document.getElementById('newProjectDialog'));
}
else {
	// Project page
	ReactDOM.render(<Editor />, document.getElementById('app'));
}
