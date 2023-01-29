import React from 'react';
import './SigninPage.scss';
import {withRouter, NavLink} from 'react-router-dom';
import {connect} from 'react-redux';
import {TextField, Button, Container, InputAdornment, IconButton} from '@material-ui/core';
import Visibility from '@material-ui/icons/Visibility';
import VisibilityOff from '@material-ui/icons/VisibilityOff';
import facebook from '../../Assets/Images/facebook.png';
import gplus from '../../Assets/Images/gplus.png';
import {signIn, socialSignIn,signUpClearFlag} from '../../Redux/Actions';
import {withSnackbar} from 'notistack';
import GoogleLogin from 'react-google-login';

class SigninPage extends React.Component {
  state = {
    email: {
      isValid: false,
      value: '',
      errorMsg: 'Email is Required'
    },
    password: {
      isValid: false,
      value: '',
      errorMsg: 'Password is Required'
    },
    checkValidation: false,
    isLoggedin: false,
    loading: false,
    showPassword: false,
  }
  
  static getDerivedStateFromProps(props, state) {
    props.signUpClearFlag();
    let {from} = props.location.state || {from: {pathname: '/'}};
    if (props.isLoggedin) {
      props.history.replace(from);
    } else {
      if (state.loading && !props.loading) {
        let errorMsg = (props.messages && props.messages[0]) || '';
        if (errorMsg.length > 0) {
          props.enqueueSnackbar(errorMsg, {variant: 'error'})
        }
      }
    }
    
    return {
      isLoggedin: props.isLoggedin,
      loading: props.loading,
    }
  }
  
  handleInput = (e) => {
    const fieldName = e.target.name;
    const value = e.target.value;
    
    let field = this.state[fieldName];
    field.value = value;
    field.isValid = true;
    field.errorMsg = '';
    
    switch (fieldName) {
      case 'email':
        if (!value || value.length === 0) {
          field.isValid = false;
          field.errorMsg = 'Email is required';
        }
        // else {
        // 	field.isValid = value.toLowerCase().match(/^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i); // eslint-disable-line
        // 	field.errorMsg = field.isValid? '' : 'Incorrect email format';
        // }
        break;
      case 'password':
        if (!value || value.length === 0) {
          field.isValid = false;
          field.errorMsg = 'Password is required';
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
    
    const {email, password} = this.state
    const isVaildForm = email.isValid && password.isValid;
    
    return isVaildForm;
  }
  
  login = () => {
    if (!this.validateForm()) {
      return;
    }
    
    const {email, password} = this.state;
    this.props.signIn({email: email.value, password: password.value});
  }
  
  responseGoogle = async (response) => {
    if (response && response.accessToken) {
      this.props.socialSignIn({
        type: 0,
        social_id: response.googleId,
        email: response.profileObj.email,
        first_name: response.profileObj.givenName,
        last_name: response.profileObj.familyName,
        photo: response.profileObj.imageUrl,
      })
    }
  }
  
  handleClickShowPassword = () => {
    this.setState( {showPassword: !this.state.showPassword});
  };
  
  
  render() {
    const {email, password, checkValidation,showPassword} = this.state;
    return (
      <div className="signin-page v-r v-c">
        <Container maxWidth="lg" className="custom-container v-r v-c">
          <div className="auth-container shadow-object v-r v-c">
            <h1>Sign in to Eventree</h1>
            <form className="v-r" noValidate autoComplete="off">
              <TextField id="email" name="email" variant="outlined"
                         error={checkValidation && !email.isValid}
                         helperText={checkValidation && !email.isValid ? email.errorMsg : ''}
                         InputProps={{
                           className: 'auth-input',
                           type: 'text',
                           placeholder: 'Email',
                           value: email.value,
                           onChange: this.handleInput,
                         }}/>
              <TextField id="password" name="password" variant="outlined"
                         error={checkValidation && !password.isValid}
                         helperText={checkValidation && !password.isValid ? password.errorMsg : ''}
                         InputProps={{
                           className: 'auth-input',
                           type: showPassword ? 'text' : 'password',
                           placeholder: 'Password',
                           value: password.value,
                           onChange: this.handleInput,
                           endAdornment:
                             <InputAdornment position="end" style={{paddingRight: "12px"}}>
                               <IconButton
                                 aria-label="toggle password visibility"
                                 onClick={this.handleClickShowPassword}
                                 edge="end"
                               >
                                 {showPassword ? <Visibility/> : <VisibilityOff/> }
                               </IconButton>
                             </InputAdornment>
                
                         }}/>
            </form>
            <div className="v-c custom-writings">
              <NavLink to="/forgot-password">Forgot your password?</NavLink>
              <p className="show-web">You don't have an account? <NavLink to="/sign-up">Sign up</NavLink></p>
            </div>
            <Button variant="contained" fullWidth className="auth-btn btn-primary" onClick={this.login}>Sign In</Button>
            <p className="or">OR</p>
            <Button variant="contained" fullWidth className="auth-btn facebook">
              <img src={facebook} alt="facebook"/> Sign In with Facebook
            </Button>
            <GoogleLogin
              clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID}
              render={renderProps => (
                <Button variant="contained" fullWidth className="auth-btn gplus" onClick={renderProps.onClick}
                        disabled={renderProps.disabled}>
                  <img src={gplus} alt="facebook"/> Sign In with Google Account
                </Button>
              )}
              onSuccess={this.responseGoogle}
              onFailure={this.responseGoogle}
              cookiePolicy={'single_host_origin'}
            />
            <div className="v-c custom-writings">
              <p className="show-mobile">You don't have an account? <NavLink to="/sign-up">Sign up</NavLink></p>
            </div>
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

export default withRouter(connect(mapStateToProps, {signIn, socialSignIn,signUpClearFlag})(withSnackbar(SigninPage)));
