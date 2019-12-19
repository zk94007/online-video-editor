/**
 * @file FetchErrorDialog.js
 * @author Ervis Semanaj
 */

import React, { Component } from 'react';
import Modal from 'react-modal';
import PropTypes from 'prop-types';

Modal.setAppElement(document.body);

export default class FetchErrorDialog extends Component {

	render() {
		return (
			<div>
				<Modal
					isOpen={true}
					contentLabel="Server communication error"
					className={'modal'}
					overlayClassName={'overlay'}
				>

					<h2 className={'error'}><img src={'/icons/error.svg'} alt={'error'}/>Server communication error</h2>
					<div>
						<i>{this.props.msg}</i>
						<p>Please try again or refresh the page in your browser.</p>
						<button onClick={() => this.props.onClose()}>Close</button>
					</div>
				</Modal>
			</div>
		);
	}
}

FetchErrorDialog.propTypes = {
	msg: PropTypes.string,
	onClose: PropTypes.func.isRequired,
};
