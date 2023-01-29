import React from "react";
import { withRouter, NavLink } from "react-router-dom";
import { withSnackbar } from "notistack";
import GoogleLogin from "react-google-login";
// import FacebookLogin from 'react-facebook-login';
import FacebookLogin from "react-facebook-login/dist/facebook-login-render-props";
import { connect } from "react-redux";
import {
  TextField,
  Button,
  Container,
  Grid,
  Radio,
  RadioGroup,
  FormLabel,
  FormControlLabel,
  Typography,
  MenuItem,
  CircularProgress,
  InputAdornment,
  IconButton
} from "@material-ui/core";
import Visibility from '@material-ui/icons/Visibility';
import VisibilityOff from '@material-ui/icons/VisibilityOff';

import "./SignupPage.scss";
import facebook from "../../Assets/Images/facebook.png";
import gplus from "../../Assets/Images/gplus.png";
import { signUp, socialSignIn } from "../../Redux/Actions";
import {categoryRanges} from "../../Utils/Constant";

const ageRanges = [
  {
    value: "0",
    label: "10 to 20",
  },
  {
    value: "1",
    label: "20 to 30",
  },
  {
    value: "2",
    label: "30 to 40",
  },
  {
    value: "3",
    label: "above",
  },
];

class SignupPage extends React.Component {
  state = {
    email: {
      isValid: false,
      value: "",
      errorMsg: "Email is Required",
    },
    first_name: {
      isValid: false,
      value: "",
      errorMsg: "First name is Required",
    },
    last_name: {
      isValid: false,
      value: "",
      errorMsg: "Last name is Required",
    },
    user_name: {
      isValid: false,
      value: "",
      errorMsg: "Username is Required",
    },
    age_range: {
      isValid: false,
      value: "",
      errorMsg: "Age range is Required",
    },
    gender: {
      isValid: false,
      value: "",
      errorMsg: "Gender range is Required",
    },
    interests: {
      isValid: false,
      value: "",
      errorMsg: "Interests is Required",
    },
    password: {
      isValid: false,
      value: "",
      errorMsg: "Password is Required",
    },
    confirm_password: {
      isValid: false,
      value: "",
      errorMsg: "Confirm Password is Required",
    },
    checkValidation: false,
    isLoggedin: false,
    loading: false,
    showPassword: false,
    showConfirmPassword: false,
  };

  static getDerivedStateFromProps(props, state) {
    if (props.isSignUp ) {
      props.enqueueSnackbar(
        "We have sent verification email. Please check your email inbox.",
        { variant: "success" }
      );
      props.history.replace("/sign-in");
    } else {
      if (state.loading && !props.loading) {
        let errorMsg = (props.messages && props.messages[0]) || "";
        if (errorMsg.length > 0) {
          props.enqueueSnackbar(errorMsg, { variant: "error" });
        }
      }
    }

    return {
      isLoggedin: props.isLoggedin,
      loading: props.loading,
    };
  }

  handleInput = (e) => {
    const fieldName = e.target.name;
    const value = e.target.value;

    let field = this.state[fieldName];
    field.value = value;
    field.isValid = true;
    field.errorMsg = "";

    switch (fieldName) {
      case "email":
        if (!value || value.length === 0) {
          field.isValid = false;
          field.errorMsg = "Email is required";
        } else {
          field.isValid = value
            .toLowerCase()
            .match(
              /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i
            ); // eslint-disable-line
          field.errorMsg = field.isValid ? "" : "Incorrect email format";
        }
        break;
      case "first_name":
        if (!value || value.length === 0) {
          field.isValid = false;
          field.errorMsg = "First name is required";
        }
        break;
      case "last_name":
        if (!value || value.length === 0) {
          field.isValid = false;
          field.errorMsg = "Last name is required";
        }
        break;
      case "user_name":
        if (!value || value.length === 0) {
          field.isValid = false;
          field.errorMsg = "Username name is required";
        }
        break;
      case "gender":
        if (!value || value.length === 0) {
          field.isValid = false;
          field.errorMsg = "Gender name is required";
        }
        break;
      case "age_range":
        if (!value || value.length === 0) {
          field.isValid = false;
          field.errorMsg = "Age range name is required";
        }
        break;
      case "interests":
        if (!value || value.length === 0) {
          field.isValid = false;
          field.errorMsg = "Interests name is required";
        }
        break;
      case "password":
        if (!value || value.length === 0) {
          field.isValid = false;
          field.errorMsg = "Password is required";
        } else if (value.length < 6) {
          field.isValid = false;
          field.errorMsg = "Needs to be at least 6 characters.";
        }
        break;
      case "confirm_password":
        if (!value || value.length === 0) {
          field.isValid = false;
          field.errorMsg = "Confirm Password is required";
        } else if (value !== this.state.password.value) {
          field.isValid = false;
          field.errorMsg = "Incorrect Password";
        }
        break;
      default:
        break;
    }

    this.setState({
      [fieldName]: field,
    });
  };

  validateForm = () => {
    this.setState({
      checkValidation: true,
    });

    const {
      first_name,
      last_name,
      email,
      user_name,
      gender,
      age_range,
      interests,
      password,
      confirm_password,
    } = this.state;
    const isValidForm =
      first_name.isValid &&
      last_name.isValid &&
      email.isValid &&
      user_name.isValid &&
      gender.isValid &&
      age_range.isValid &&
      interests.isValid &&
      password.isValid &&
      confirm_password.isValid;
  
    if (!gender.isValid) {
        this.props.enqueueSnackbar('Please select gender.', {variant: 'error'});
        return;
    }

    return isValidForm;
  };

  signUp = () => {
    if (!this.validateForm()) {
      return;
    }
    const {
      first_name,
      last_name,
      email,
      user_name,
      gender,
      age_range,
      interests,
      password,
    } = this.state;
    this.props.signUp({
      first_name: first_name.value,
      last_name: last_name.value,
      email: email.value,
      user_name: user_name.value,
      gender: Number(gender.value),
      age_range: Number(age_range.value),
      interests: interests.value,
      password: password.value,
    });
  };

  responseGoogle = async (response) => {
    if (response && response.accessToken) {
      this.props.socialSignIn({
        type: 0,
        social_id: response.googleId,
        email: response.profileObj.email,
        first_name: response.profileObj.givenName,
        last_name: response.profileObj.familyName,
        photo: response.profileObj.imageUrl,
      });
    }
  };

  responseFacebook = async (response) => {
    console.log("------facebook---------", response);
  };
  
  handleClickShowPassword = (isConfirmPass) => {
    const fieldName = isConfirmPass ? 'showConfirmPassword' : 'showPassword';
    this.setState( {[fieldName]: !this.state[fieldName]});
  };
  

  render() {
    const {
      first_name,
      last_name,
      email,
      user_name,
      gender,
      age_range,
      interests,
      password,
      confirm_password,
      checkValidation,
      loading,
      showPassword,
      showConfirmPassword
    } = this.state;
    return (
      <div className="signup-page v-r v-c">
        <Container maxWidth="lg" className="custom-container v-r v-c">
          <div className="auth-container shadow-object v-r v-c">
            <h1>Sign up to Eventree</h1>
            <p className="detail">Please enter your details</p>
            <form className="v-r" noValidate autoComplete="off">
              <TextField
                id="email"
                name="email"
                variant="outlined"
                error={checkValidation && !email.isValid}
                helperText={
                  checkValidation && !email.isValid ? email.errorMsg : ""
                }
                InputProps={{
                  className: "auth-input",
                  type: "text",
                  placeholder: "Email",
                  value: email.value,
                  onChange: this.handleInput,
                }}
              />
              <Grid container spacing={3}>
                <Grid item xs={12} sm={12} md={6}>
                  <TextField
                    id="first_name"
                    name="first_name"
                    variant="outlined"
                    error={checkValidation && !first_name.isValid}
                    helperText={
                      checkValidation && !first_name.isValid
                        ? first_name.errorMsg
                        : ""
                    }
                    InputProps={{
                      className: "auth-input",
                      type: "text",
                      placeholder: "First Name",
                      value: first_name.value,
                      onChange: this.handleInput,
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={12} md={6}>
                  <TextField
                    id="last_name"
                    name="last_name"
                    variant="outlined"
                    error={checkValidation && !last_name.isValid}
                    helperText={
                      checkValidation && !last_name.isValid
                        ? last_name.errorMsg
                        : ""
                    }
                    InputProps={{
                      className: "auth-input",
                      type: "text",
                      placeholder: "Last Name",
                      value: last_name.value,
                      onChange: this.handleInput,
                    }}
                  />
                </Grid>
              </Grid>

              <TextField
                id="user_name"
                name="user_name"
                variant="outlined"
                error={checkValidation && !user_name.isValid}
                helperText={
                  checkValidation && !user_name.isValid
                    ? user_name.errorMsg
                    : ""
                }
                InputProps={{
                  className: "auth-input",
                  type: "text",
                  placeholder: "UserName",
                  value: user_name.value,
                  onChange: this.handleInput,
                }}
              />

              <FormLabel className="gender-title">Gender</FormLabel>
              <RadioGroup
                row
                name="gender"
                className="radio-group"
                value={gender.value}
                onChange={this.handleInput}
              >
                <FormControlLabel
                  value="0"
                  control={
                    <Radio
                      classes={{
                        root: "radio",
                        checked: "radio",
                      }}
                      size={"small"}
                    />
                  }
                  label={<Typography classes="label">Male</Typography>}
                />
                <FormControlLabel
                  value="1"
                  control={
                    <Radio
                      classes={{
                        root: "radio",
                        checked: "radio",
                      }}
                      size={"small"}
                    />
                  }
                  label={<Typography classes="label">Female</Typography>}
                />
                <FormControlLabel
                  value="2"
                  control={
                    <Radio
                      classes={{
                        root: "radio",
                        checked: "radio",
                      }}
                      size={"small"}
                    />
                  }
                  label={<Typography classes="label">Others</Typography>}
                />
              </RadioGroup>
  
              <p className="age-title">Age Range</p>
              <TextField
                id="age_range"
                name="age_range"
                select
                error={checkValidation && !age_range.isValid}
                helperText={checkValidation && !age_range.isValid ? age_range.errorMsg : ''}
                className="search-input-field"
                variant="outlined"
                value={age_range.value}
                onChange={this.handleInput}
                SelectProps={{
                  native: true,
                  className: 'custom-input',
                  MenuProps: {
                    // className: 'menu-props',
                  },
                }}
              >
                {ageRanges.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </TextField>

              <TextField
                id="interests"
                name="interests"
                variant="outlined"
                error={checkValidation && !interests.isValid}
                helperText={
                  checkValidation && !interests.isValid
                    ? interests.errorMsg
                    : ""
                }
                InputProps={{
                  className: "auth-input",
                  type: "text",
                  placeholder: "Interests",
                  value: interests.value,
                  onChange: this.handleInput,
                }}
              />

              <TextField
                id="password"
                name="password"
                variant="outlined"
                error={checkValidation && !password.isValid}
                helperText={
                  checkValidation && !password.isValid ? password.errorMsg : ""
                }
                InputProps={{
                  className: "auth-input",
                  type: showPassword ? 'text' : 'password',
                  placeholder: "Password",
                  value: password.value,
                  onChange: this.handleInput,
                  endAdornment:
                    <InputAdornment position="end" style={{paddingRight: "12px"}}>
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={() => this.handleClickShowPassword(false)}
                        edge="end"
                      >
                        {showPassword ? <Visibility/> : <VisibilityOff/> }
                      </IconButton>
                    </InputAdornment>
                }}
              />
              <TextField
                id="confirm_password"
                name="confirm_password"
                variant="outlined"
                error={checkValidation && !confirm_password.isValid}
                helperText={
                  checkValidation && !confirm_password.isValid
                    ? confirm_password.errorMsg
                    : ""
                }
                InputProps={{
                  className: "auth-input",
                  type: showConfirmPassword ? 'text' : 'password',
                  placeholder: "Confirm Password",
                  value: confirm_password.value,
                  onChange: this.handleInput,
                  endAdornment:
                    <InputAdornment position="end" style={{paddingRight: "12px"}}>
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={() => this.handleClickShowPassword(true)}
                        edge="end"
                      >
                        {showConfirmPassword ? <Visibility/> : <VisibilityOff/> }
                      </IconButton>
                    </InputAdornment>
                }}
              />
            </form>
            <div className="v-c h-c custom-writings">
              <p>
                Already have an account?{" "}
                <NavLink to="/sign-in">Sign in</NavLink>
              </p>
            </div>
            <Button
              variant="contained"
              fullWidth
              className="auth-btn btn-primary"
              onClick={this.signUp}
              disabled={loading ? true : false}
            >
              {loading ?
                <CircularProgress color='success' varian="determinate"/> : ' Sign Up'}
            </Button>
            <p className="or">OR</p>

            <FacebookLogin
              appId="1050470132235306"
              fields="name,email,picture"
              scope="public_profile,user_friends,user_actions.books"
              render={(renderProps) => (
                <Button
                  variant="contained"
                  fullWidth
                  className="auth-btn facebook"
                  onClick={renderProps.onClick}
                >
                  <img src={facebook} alt="facebook" /> Sign Up with Facebook
                </Button>
              )}
              onClick={this.responseFacebook}
              callback={this.responseFacebook}
            />

            <GoogleLogin
              clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID}
              render={(renderProps) => (
                <Button
                  variant="contained"
                  fullWidth
                  className="auth-btn gplus"
                  onClick={renderProps.onClick}
                  disabled={renderProps.disabled}
                >
                  <img src={gplus} alt="facebook" /> Sign Up with Google Account
                </Button>
              )}
              onSuccess={this.responseGoogle}
              onFailure={this.responseGoogle}
              cookiePolicy={"single_host_origin"}
            />
          </div>
        </Container>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    isLoggedin: state.Auth.loggedin,
    isSignUp: state.Auth.isSignUp,
    loading: state.Auth.loading,
    me: state.Auth.me,
    messages: state.Auth.messages,
  };
}

export default withRouter(
  connect(mapStateToProps, { signUp, socialSignIn })(withSnackbar(SignupPage))
);
