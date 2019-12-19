/**
 * @file Controller for front GUI
 * @author Ervis Semanaj
 */

import config from '../config';
const fs = require('fs');
const path = require('path');

exports.main = (req, res) => res.render('main', {});
exports.project = (req, res) => res.render('project', {});