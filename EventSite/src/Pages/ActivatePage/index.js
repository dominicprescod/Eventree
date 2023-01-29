import React from 'react';
import './ActivatePage.scss';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { Button, Container, TextField } from '@material-ui/core';
import { activate } from '../../Redux/Actions';
import { withSnackbar } from 'notistack';
import queryString from 'query-string';
import jwtDecode from 'jwt-decode';
import { requestActivation as requestActivationApi } from '../../Api';

class ActivatePage extends React.Component {
	state = {
		isLoggedin: false,
		loading: false,
		text: 'Please send us activation code you received.',
		show_btn: false,
		email: '',
		activation_code: {
			isValid: false,
			value: '',
			errorMsg: 'This field is Required'
		},
		checkValidation: false,
	}

	componentDidMount() {
		const { location } = this.props;
		if (location && location.search) {
			const query = queryString.parse(location.search);
			if (query.hval) {
				try {
					const decoded = jwtDecode(query.hval);
					const { email } = decoded;
					this.setState({ email })
				} catch (err) {
					console.log('incorrect hash key', err);
					this.setState({
						text: 'Invalid URL. Please check your email or request activation again',
						show_btn: true,
					})
				}
			} else {
				this.setState({
					text: 'Invalid URL. Please check your email or request activation again',
					show_btn: true,
				})
			}
		}
	}

	static getDerivedStateFromProps(props, state) {
		if (state.loading && !props.loading) {
			let errorMsg = (props.messages && props.messages[0]) || '';
			if (errorMsg.length > 0) {
				props.enqueueSnackbar(errorMsg, { variant: 'error' })
				return {
					loading: props.loading,
					show_btn: errorMsg === 'Your account is already activated.' ? false : true,
				}
			} else {
				props.enqueueSnackbar('Congratulations! Your email is verified successfully', { variant: 'success' })
				props.history.replace('/');
				return {
					loading: props.loading
				}
			}
		}
		return {
			loading: props.loading
		}
	}

	requestActivation = async () => {
		const { email } = this.state;
		try {
			const result = await requestActivationApi({email});

			if (!result || result.errors) {
				if (result && result.errors.length > 0 && result.errors[0].message) {
					this.props.enqueueSnackbar(result.errors[0].message, { variant: 'error' })
				} else {
					this.props.enqueueSnackbar('There was a problem to send activation email, Please try again later.', { variant: 'error' })
				}
			} else {
				this.props.enqueueSnackbar('We sent an activation code to your email.', { variant: 'success' })
				this.setState({
					show_btn: false
				})
			}
		} catch (error) {
			this.props.enqueueSnackbar('There was a problem to send activation email, Please try again later.', { variant: 'error' })
		}
	}

	handleInput = (e) => {
		const fieldName = e.target.name;
		const value = e.target.value;
		
		let field = this.state[fieldName];
		field.value = value;
		field.isValid = true;
		field.errorMsg = '';

		switch(fieldName) {
		case 'activation_code':
			if (!value || value.length === 0) {
				field.isValid = false;
				field.errorMsg = 'This field is required';
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
		return this.state.activation_code.isValid;
	}

	doActivate = () => {
		if (!this.validateForm()) {
			return;
		}

		const { email, activation_code } = this.state;
		this.props.activate({email, code: activation_code.value})
	}

	render() {
		const { text, show_btn, activation_code, checkValidation } = this.state;
		return (
			<div className="activate-page v-r v-c">
				<Container maxWidth="lg" className="custom-container v-r v-c">
					<div className="auth-container shadow-object v-r v-c">
						<h1>Activation</h1>
						<p className="detail">{text}</p>
						<form className="v-r" noValidate autoComplete="off">
							<TextField id="activation_code" name="activation_code" variant="outlined"
								error={checkValidation && !activation_code.isValid}
								helperText={checkValidation && !activation_code.isValid ? activation_code.errorMsg: ''}
								InputProps={{
									className: 'auth-input',
									placeholder: 'Activation Code',
									value: activation_code.value,
									onChange: this.handleInput,
							}}/>
						</form>
						<Button variant="contained" fullWidth className="auth-btn btn-primary" onClick={this.doActivate}>Activate</Button>
						{show_btn && <Button variant="contained" fullWidth className="auth-btn  btn-primary request-btn" onClick={this.requestActivation}>Request Activation Again</Button>}
					</div>
				</Container>
			</div>
		);
	}
}

function mapStateToProps(state) {
	return {
		isLoggedin: state.Auth.loggedin,
		loading: state.Auth.loading,
		me: state.Auth.me,
		messages: state.Auth.messages,
	}
}

export default withRouter(connect(mapStateToProps, { activate })(withSnackbar(ActivatePage)));
