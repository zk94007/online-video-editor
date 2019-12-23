/**
 * @file LoadingDialog.js
 * @author Ervis Semanaj
 */

import React, { Component } from 'react';
import Modal from 'react-modal';

Modal.setAppElement(document.body);

export default class LoadingDialog extends Component {

	render() {
		return (
			<div>
				<Modal
					isOpen={true}
					contentLabel="Loading"
					className={'modal'}
					overlayClassName={'overlay'}
				>

					<h2>Loading video editor</h2>
					<div>
						<div className="loader"/>
					</div>
				</Modal>
			</div>
		);
	}
}
