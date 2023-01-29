import React from 'react';
import './ResetPasswordPage.scss';
import {withRouter} from 'react-router-dom';
import {connect} from 'react-redux';
import {TextField, Button, Container, CircularProgress} from '@material-ui/core';
import {withSnackbar} from 'notistack';
// import { resetPassword as resetPasswordApi } from '../../Api';
import queryString from 'query-string';
import jwtDecode from 'jwt-decode';
import {resetPassword,setLoggedTrue} from "../../Redux/Actions";

class ResetPasswordPage extends React.Component {
  state = {
    code: {
      isValid: false,
      value: '',
      errorMsg: 'This field is Required'
    },
    password: {
      isValid: false,
      value: '',
      errorMsg: 'This field is Required'
    },
    confirm_password: {
      isValid: false,
      value: '',
      errorMsg: 'This field is Required'
    },
    checkValidation: false,
    email: '',
    text: 'Please enter your new password.',
    show_btn: true,
    loading: false,
  }
  
  componentDidMount() {
    const {location} = this.props;
    if (location && location.search) {
      const query = queryString.parse(location.search);
      if (query.hval) {
        try {
          const decoded = jwtDecode(query.hval);
          const {email} = decoded;
          this.setState({email})
        } catch (err) {
          this.setState({
            text: 'Invalid URL. Please check your email or request again',
            show_btn: false,
          })
        }
      } else {
        this.setState({
          text: 'Invalid URL. Please check your email or request again',
          show_btn: false,
        })
      }
    }
  }
  
  static getDerivedStateFromProps(props, state) {
    console.log('------getDerivedStateFromProps------', props);
    // if (props.isLoggedin) {
    //   // props.history.replace(from);
    //   props.enqueueSnackbar(props.messages, {variant: 'success'})
    // } else {
    //   let errorMsg = (props.messages && props.messages[0]) || '';
    //   if (errorMsg.length > 0) {
    //     props.enqueueSnackbar(errorMsg, {variant: 'error'})
    //   }
    // }
    if (props.isResetPassword) {
      props.enqueueSnackbar(
        props.messages,
        {variant: "success"}
      );
      // props.history.replace("/sign-in");
      props.setLoggedTrue();
    } else {
      if (state.loading && !props.loading) {
        let errorMsg = (props.messages && props.messages[0]) || "";
        if (errorMsg.length > 0) {
          props.enqueueSnackbar(errorMsg, {variant: "error"});
        }
      }
    }
    return {
      loading: props.loading,
    }
  }
  
  // componentDidUpdate(prevProps, prevState, snapshot) {
  //   console.log('-------componentDidUpdate----', prevProps,'----------', snapshot);
  // }
  
  // componentWillUnmount() {
  //   console.log('-------componentWillUnmount------', this.props.isLoggedin);
  //   if (this.props.isLoggedin) {
  //     // props.history.replace(from);
  //     this.props.enqueueSnackbar(this.props.messages, {variant: 'success'})
  //
  //   } else {
  //     let errorMsg = (this.props.messages && this.props.messages[0]) || '';
  //     if (errorMsg.length > 0) {
  //       this.props.enqueueSnackbar(errorMsg, {variant: 'error'})
  //     }
  //   }
  // }
  
  handleInput = (e) => {
    const fieldName = e.target.name;
    const value = e.target.value;
    
    let field = this.state[fieldName];
    field.value = value;
    field.isValid = true;
    field.errorMsg = '';
    
    switch (fieldName) {
      case 'code':
        if (!value || value.length === 0) {
          field.isValid = false;
          field.errorMsg = 'This field is required';
        }
        break;
      case 'password':
        if (!value || value.length === 0) {
          field.isValid = false;
          field.errorMsg = 'This field is required';
        } else if (value.length < 6) {
          field.isValid = false;
          field.errorMsg = 'Needs to be at least 6 characters.';
        }
        break;
      case 'confirm_password':
        if (!value || value.length === 0) {
          field.isValid = false;
          field.errorMsg = 'This field is required';
        } else if (value !== this.state.password.value) {
          field.isValid = false;
          field.errorMsg = 'Wrong value';
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
    
    const {code, password, confirm_password} = this.state
    const isVaildForm = code.isValid && password.isValid && confirm_password.isValid;
    
    return isVaildForm;
  }
  
  reset = async () => {
    if (!this.validateForm()) {
      return;
    }
    
    const {email, code, password} = this.state;
    
    try {
      // const result = await resetPasswordApi({email, password: password.value, code: code.value});
      this.props.resetPassword(
        {email, password: password.value, code: code.value}
      );
      //
      // if (!result || result.errors) {
      //   if (result && result.errors.length > 0 && result.errors[0].message) {
      //     this.props.enqueueSnackbar(result.errors[0].message, {variant: 'error'})
      //   } else {
      //     this.props.enqueueSnackbar('There was a problem to reset your password, Please try again later or request new link.', {variant: 'error'})
      //   }
      // } else {
      //   this.props.enqueueSnackbar('Your password updated successfully.', {variant: 'success'})
      // }
    } catch (error) {
      this.props.enqueueSnackbar('There was a problem to reset your password, Please try again later or request new link.', {variant: 'error'})
    }
  }
  
  render() {
    const {code, password, confirm_password, checkValidation, text, show_btn, loading} = this.state;
    return (
      <div className="resetpassword-page v-r v-c">
        <Container maxWidth="lg" className="custom-container v-r v-c">
          <div className="auth-container shadow-object v-r v-c">
            <h1>Reset Password</h1>
            <p className="detail">{text}</p>
            {show_btn && <form className="v-r" noValidate autoComplete="off">
              <TextField id="code" name="code" variant="outlined"
                         error={checkValidation && !code.isValid}
                         helperText={checkValidation && !code.isValid ? code.errorMsg : ''}
                         InputProps={{
                           className: 'auth-input',
                           placeholder: 'Code',
                           value: code.value,
                           onChange: this.handleInput,
                         }}/>
              <TextField id="password" name="password" variant="outlined"
                         error={checkValidation && !password.isValid}
                         helperText={checkValidation && !password.isValid ? password.errorMsg : ''}
                         InputProps={{
                           className: 'auth-input',
                           type: 'password',
                           placeholder: 'New Password',
                           value: password.value,
                           onChange: this.handleInput,
                         }}/>
              <TextField id="confirm_password" name="confirm_password" variant="outlined"
                         error={checkValidation && !confirm_password.isValid}
                         helperText={checkValidation && !confirm_password.isValid ? confirm_password.errorMsg : ''}
                         InputProps={{
                           className: 'auth-input',
                           type: 'password',
                           placeholder: 'Confirm Password',
                           value: confirm_password.value,
                           onChange: this.handleInput,
                         }}/>
            </form>}
            {show_btn && <Button variant="contained" fullWidth className="auth-btn btn-primary" onClick={this.reset}
                                 disabled={loading ? true : false}>
              {loading ?
                <CircularProgress color='success' varian="determinate"/> : 'Reset password'}</Button>}
          </div>
        </Container>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    me: state.Auth.me,
    messages: state.Auth.messages,
    loading: state.Auth.loading,
    isLoggedin: state.Auth.loggedin,
    isResetPassword: state.Auth.isResetPassword,
  }
}

export default withRouter(connect(mapStateToProps, {resetPassword,setLoggedTrue})(withSnackbar(ResetPasswordPage)));
