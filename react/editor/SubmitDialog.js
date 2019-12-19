/**
 * @file SubmitDialog.js
 * @author Ervis Semanaj
 */

import React, { Component } from 'react';
import Modal from 'react-modal';
import {server} from '../../config';
import PropTypes from 'prop-types';

Modal.setAppElement(document.body);

export default class SubmitDialog extends Component {

	constructor(props) {
		super(props);

		this.state = {
			email: '',
		};

		this.handleCloseDialog = this.handleCloseDialog.bind(this);
		this.handleSumbitDialog = this.handleSumbitDialog.bind(this);
		this.handleEmailChanged = this.handleEmailChanged.bind(this);
	}

	render() {
		return (
			<div>
				<Modal
					isOpen={true}
					contentLabel="Project completion"
					className={'modal'}
					overlayClassName={'overlay'}
					onRequestClose={this.handleCloseDialog}
				>

					<h2>Project completion</h2>
					<div>
						<form onSubmit={this.handleSumbitDialog}>
							<label htmlFor={'email'}>Email address: </label>
							<input type={'email'} name={'email'} required={true} size={30} value={this.state.email} onChange={this.handleEmailChanged}/>
							<br/>
							The duration of the project depends on its length. <br/>
                            Enter your email and we will send you a link to the resulting video as soon as it is processed.
							<br/>
							<input type={'submit'} className={'success'} value={'Zahájit'}/>
							<button onClick={this.handleCloseDialog}>Storno</button>
						</form>
					</div>
				</Modal>
			</div>
		);
	}

	handleCloseDialog() {
		this.setState({
			email: ''
		});
		this.props.onClose();
	}

	handleSumbitDialog(event) {
		event.preventDefault();

		const url = `${server.apiUrl}/project/${this.props.project}`;
		const params = {
			method: 'PUT',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				email: this.state.email,
			}),
		};

		fetch(url, params)
			.then(response => response.json())
			.then(data => {
				if (typeof data.err === 'undefined') {
					window.location = `${server.serverUrl}/project/${this.props.project}/finished`;
				}
				else {
					alert(`${data.err}\n\n${data.msg}`);
				}
			})
			.catch(error => this.props.fetchError(error.message))
		;
	}

	handleEmailChanged(event) {
		this.setState({
			email: event.target.value,
		});
	}

}

SubmitDialog.propTypes = {
	project: PropTypes.string.isRequired,
	onClose: PropTypes.func.isRequired,
	fetchError: PropTypes.func.isRequired,
};
