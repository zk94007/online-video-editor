/**
 * @file FetchErrorDialog.js
 * @author Ervis Semanaj
 */

import React, { Component } from "react";
import Modal from "react-modal";
import PropTypes from "prop-types";

Modal.setAppElement(document.body);

export default class AlertErrorDialog extends Component {
  render() {
    return (
      <div>
        <Modal
          isOpen={true}
          contentLabel="Server communication error"
          className={"modal"}
          overlayClassName={"overlay"}
        >
          <h2 className={"error"}>
            <img src={"/icons/error.svg"} alt={"error"} />
            Alert
          </h2>
          <div>
            <p>{this.props.msg}</p>
            <button onClick={() => this.props.onClose()}>Close</button>
          </div>
        </Modal>
      </div>
    );
  }
}

AlertErrorDialog.propTypes = {
  msg: PropTypes.string,
  onClose: PropTypes.func.isRequired
};
