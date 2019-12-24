/**
 * @file React binding to HTML file
 * @author Ervis Semanaj
 */

import React from "react";
import ReactDOM from "react-dom";
import "../views/style.scss";
import "../views/scrollbar.css";
import Route from "./utils/route";

ReactDOM.render(<Route />, document.getElementById("app"));