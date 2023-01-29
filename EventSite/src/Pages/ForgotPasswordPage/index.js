import React from 'react';
import './ForgotPasswordPage.scss';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { TextField, Button, Container } from '@material-ui/core';
import { withSnackbar } from 'notistack';
import { requestResetPassword as requestResetPasswordApi } from '../../Api';

class ForgotPasswordPage extends React.Component {
	state = {
		email: {
			isValid: false,
			value: '',
			errorMsg: 'Email is Required'
		},
		checkValidation: false,
	}

	handleInput = (e) => {
		const fieldName = e.target.name;
		const value = e.target.value;
		
		let field = this.state[fieldName];
		field.value = value;
		field.isValid = true;
		field.errorMsg = '';

		switch(fieldName) {
		case 'email':
			if (!value || value.length === 0) {
				field.isValid = false;
				field.errorMsg = 'Email is required';
			} else {
				field.isValid = value.toLowerCase().match(/^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i); // eslint-disable-line
				field.errorMsg = field.isValid? '' : 'Incorrect email format';
			}
			break;
		default:
				break;
		}
		
		this.setState({
			[fieldName]: field,
		});
	}

	validateForm = () => {
		this.setState({
			checkValidation: true,
		});

		const { email } = this.state
		const isVaildForm = email.isValid;
		
		return isVaildForm;
	}

	send = async () => {
		if (!this.validateForm()) {
			return;
		}

		const { email } = this.state;
		try {
			const result = await requestResetPasswordApi({email: email.value});

			if (!result || result.errors) {
				if (result && result.errors.length > 0 && result.errors[0].message) {
					this.props.enqueueSnackbar(result.errors[0].message, { variant: 'error' })
				} else {
					this.props.enqueueSnackbar('There was a problem to send email, Please try again later.', { variant: 'error' })
				}
			} else {
				this.props.enqueueSnackbar('We sent reset password link to your email.', { variant: 'success' })
			}
		} catch (error) {
			this.props.enqueueSnackbar('There was a problem to send email, Please try again later.', { variant: 'error' })
		}
	}

	render() {
		const { email, checkValidation } = this.state;
		return (
			<div className="forgotpassword-page v-r v-c">
				<Container maxWidth="lg" className="custom-container v-r v-c">
					<div className="auth-container shadow-object v-r v-c">
						<h1>Forgot your password?</h1>
						<p className="detail">Enter your registered email and we will send recovery link to you.</p>
						<form className="v-r" noValidate autoComplete="off">
							<TextField id="email" name="email" variant="outlined"
								error={checkValidation && !email.isValid}
								helperText={checkValidation && !email.isValid ? email.errorMsg: ''}
								InputProps={{
									className: 'auth-input',
									type: 'text',
									placeholder: 'Email',
									value: email.value,
									onChange: this.handleInput,
							}}/>
						</form>
						<Button variant="contained" fullWidth className="auth-btn btn-primary" onClick={this.send}>Send</Button>
					</div>
				</Container>
			</div>
		);
	}
}

function mapStateToProps(state) {
	return {}
}

export default withRouter(connect(mapStateToProps, {})(withSnackbar(ForgotPasswordPage)));