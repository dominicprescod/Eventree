import React from 'react';
import './Password.scss';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { Button, FormGroup, TextField, Grid } from '@material-ui/core';

class PasswordComponent extends React.Component {
    state = {
		new_password: '',
		confirm_password: ''
	}
	
	handleInput = (e) => {
        const fieldName = e.target.name;
		const value = e.target.value;
        
        this.setState({
            [fieldName]: value,
        });
	}

	save = () => {
		const { new_password, confirm_password } = this.state;
		if (new_password !== confirm_password || new_password.length === 0) {
			return alert("Please input valid passwords")
		}
		alert("Success!")
	}

    render() {
		const { new_password, confirm_password } = this.state;
        return (
            <div className="password-component v-r">
				<form autoComplete="off" noValidate className="v-r">
					<Grid container spacing={3}>
						<Grid item xs={12} sm={12} md={6}>
							<FormGroup>
								<p className="form-title">New Password</p>
								<TextField id="new_password" name="new_password" variant="outlined"
									InputProps={{
										className: 'custom-input',
										type: 'password',
										placeholder: 'Please input new password',
										value: new_password,
										onChange: this.handleInput,
								}}/>
							</FormGroup>
						</Grid>
					</Grid>
					<Grid container spacing={3}>
						<Grid item xs={12} sm={12} md={6}>
							<FormGroup>
								<p className="form-title">Confirm Password</p>
								<TextField id="confirm_password" name="confirm_password" variant="outlined"
									InputProps={{
										className: 'custom-input',
										type: 'password',
										placeholder: 'Please input confirm password',
										value: confirm_password,
										onChange: this.handleInput,
								}}/>
							</FormGroup>
						</Grid>
					</Grid>
					<Button className="btn-primary save-btn btn-round" variant="contained" onClick={this.save}>Save</Button>
				</form>
            </div>
        );
    }
}

function mapStateToProps(state) {
    return {}
}

export default connect(mapStateToProps, {})(withRouter(PasswordComponent));