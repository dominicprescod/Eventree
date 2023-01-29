import React from 'react';
import './Profile.scss';
import {withRouter} from 'react-router-dom';
import {connect} from 'react-redux';
import {
  Button,
  FormGroup,
  TextField,
  Grid,
  Radio,
  RadioGroup,
  FormLabel,
  FormControlLabel, Typography, MenuItem,
  CircularProgress
} from '@material-ui/core';
import ImageOutlinedIcon from '@material-ui/icons/ImageOutlined';
import {withSnackbar} from "notistack";
import {uploadImage as uploadImageApi} from "../../../Api";
import {updateProfile} from "../../../Redux/Actions";
import {categoryRanges} from "../../../Utils/Constant";

const ageRanges = [
  {
    value: '0',
    label: '10 to 20',
  },
  {
    value: '1',
    label: '20 to 30',
  },
  {
    value: '2',
    label: '30 to 40',
  },
  {
    value: '3',
    label: 'above',
  },
];

class ProfileComponent extends React.Component {
  state = {
    old_email: {
      value: this.props.me.email,
      isValid: this.props.me.email ? true : false,
      errorMsg: 'Email is Required'
    },
    email: {
      value: this.props.me.email,
      isValid: this.props.me.email ? true : false,
      errorMsg: 'Email is Required'
    },
    user_name: {
      isValid: this.props.me.user_name ? true : false,
      value: this.props.me.user_name,
      errorMsg: 'UserName is Required'
    },
    first_name: {
      isValid: this.props.me.first_name ? true : false,
      value: this.props.me.first_name,
      errorMsg: 'First Name is Required'
    },
    last_name: {
      isValid: this.props.me.last_name ? true : false,
      value: this.props.me.last_name,
      errorMsg: 'Last Name is Required'
    },
    age_range: {
      isValid: this.props.me.age_range ? true : false,
      value: this.props.me.age_range,
      errorMsg: 'Age range is Required'
    },
    gender: {
      isValid: this.props.me.gender ? true : false,
      value: (this.props.me.gender).toString(),
      errorMsg: 'Gender is Required'
    },
    phonenumber: {
      isValid: this.props.me.phonenumber ? true : false,
      value: this.props.me.phonenumber,
      errorMsg: 'Phone Number is Required'
    },
    address: {
      isValid: this.props.me.address ? true : false,
      value: this.props.me.address,
      errorMsg: 'Location is Required'
    },
    preferences: {
      isValid: this.props.me.preferences ? true : false,
      value: this.props.me.preferences,
      errorMsg: 'Preference is Required'
    },
    checkValidation: false,
    
    photo: '',
    loading: false
  }
  
  handleFile = (e) => {
    this.setState({
      photo: e.target.files[0]
    });
  }
  
  
  handleInput = (e) => {
    const fieldName = e.target.name;
    const value = e.target.value;
    let field = this.state[fieldName];
    field.isValid = true;
    field.errorMsg = '';
    field.value = value;
    switch (fieldName) {
      case 'email':
        if (!value || value.length === 0) {
          field.isValid = false;
          field.errorMsg = 'Email is required';
        } else {
          field.isValid = value.toLowerCase().match(/^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i); // eslint-disable-line
          field.errorMsg = field.isValid ? '' : 'Incorrect email format';
        }
        break;
      case 'first_name':
        if (!value || value.length === 0) {
          field.isValid = false;
          field.errorMsg = 'First name is required';
        }
        break;
      case 'last_name':
        if (!value || value.length === 0) {
          field.isValid = false;
          field.errorMsg = 'Last name is required';
        }
        break;
      case 'user_name':
        if (!value || value.length === 0) {
          field.isValid = false;
          field.errorMsg = 'Username name is required';
        }
        break;
      case 'gender':
        if (!value || value.length === 0) {
          field.isValid = false;
          field.errorMsg = 'Gender name is required';
        }
        break;
      case 'age_range':
        if (!value || value.length === 0) {
          field.isValid = false;
          field.errorMsg = 'Age range name is required';
        }
        break;
      case 'phonenumber':
        if (!value || value.length === 0) {
          field.isValid = false;
          field.errorMsg = 'Phone Number is required';
        } else {
          field.isValid = value
          .toLowerCase()
          .match(
            /^(\+0?1\s)?\(?\d{3}\)?[\s.-]\d{3}[\s.-]\d{4}$/
          ); // eslint-disable-line
          field.errorMsg = field.isValid ? "" : "Incorrect email format (xxx-xxx-xxxx)";
        }
        break;
      case 'address':
        if (!value || value.length === 0) {
          field.isValid = false;
          field.errorMsg = 'Location is required';
        }
        break;
      // case 'preferences':
      //   if (!value || value.length === 0) {
      //     field.isValid = false;
      //     field.errorMsg = 'Preference is required';
      //   }
      //   break;
      case 'photo':
        if (!value || value.length === 0) {
          field.isValid = false;
          field.errorMsg = 'Preference is required';
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
    
    const {
      first_name,
      last_name,
      email,
      user_name,
      gender,
      age_range,
      phonenumber,
      address,
      preferences,
    } = this.state
    const isValidForm = first_name.isValid && last_name.isValid && email.isValid && user_name.isValid && gender.isValid && age_range.isValid && phonenumber.isValid && address.isValid && preferences.isValid;
    
    return isValidForm;
  }
  
  updateProfile = async (e) => {
    if (!this.validateForm()) {
      return;
    }
    e.preventDefault();
    //
    const {
      old_email,
      first_name,
      last_name,
      email,
      user_name,
      gender,
      age_range,
      phonenumber,
      address,
      preferences,
      photo
    } = this.state;
    this.setState({
      loading: true
    });
    try {
      const imageUpload = await uploadImageApi(photo);
      let url = imageUpload.data.url;
      this.props.updateProfile({
        old_email: this.props.me.email,
        first_name: first_name.value,
        last_name: last_name.value,
        user_name: user_name.value,
        email: email.value,
        gender: Number(gender.value),
        age_range: Number(age_range.value),
        phonenumber: phonenumber.value,
        address: address.value,
        preferences: preferences.value,
        photo: url
      });
      this.setState({
        loading: false
      });
    } catch (e) {
      console.log('-----updatedUser_err------', e);
      this.setState({
        loading: false
      });
    }
  }
  
  pickFileForPhoto = (e) => {
    e.preventDefault();
    if (!e.target.files[0]) return;
    this.setState({
      photo: URL.createObjectURL(e.target.files[0])
    });
  }
  
  render() {
    const {
      old_email,
      email,
      user_name,
      first_name,
      last_name,
      age_range,
      gender,
      phonenumber,
      address,
      preferences,
      checkValidation,
      photo,
      loading
    } = this.state;
    const {me} = this.props;
    console.log("ME", me)
    return (
      <div className="profile-component v-r">
        <form action="/uploadmultiple" method="POST" autoComplete="off" noValidate className="v-r"
              encType="multipart/form-data">
          <FormGroup>
            <p className="form-title">Photo</p>
            {/*<input accept="image/*" className="file_input" id="file_input" multiple type="file"*/}
            {/*       onChange={e => this.pickFileForPhoto(e)}/>*/}
            
            <div className="photo-area v-c h-c">
              {me.photo ? <img src={me.photo} alt="profile"/> :
                <label htmlFor="file_input">
                  <div className="v-r v-c">
                    <ImageOutlinedIcon fontSize="large"/>
                    <p>Please select an image</p>
                  </div>
                </label>}
            </div>
            {/*{photo && <label htmlFor="file_input">*/}
            {/*  <div className="change-btn second v-c h-c">Change</div>*/}
            {/*</label>}*/}
            <input
              type="file"
              name="uploadedFile"
              // value={photo}
              onChange={this.handleFile}
              required
            />
          </FormGroup>
          
          <Grid container spacing={3}>
            <Grid item xs={12} sm={12} md={6}>
              <FormGroup>
                <p className="form-title">UserName</p>
                <TextField id="user_name" name="user_name" variant="outlined"
                           error={checkValidation && !user_name.isValid}
                           disabled
                           helperText={checkValidation && !user_name.isValid ? user_name.errorMsg : ''}
                           InputProps={{
                             className: 'custom-input',
                             type: 'text',
                             placeholder: 'Please input user name',
                             value: user_name.value,
                             onChange: this.handleInput,
                           }}/>
              </FormGroup>
            </Grid>
            <Grid item xs={12} sm={12} md={6}>
              <FormGroup>
                <p className="form-title">Email</p>
                <TextField id="email" name="email" variant="outlined"
                           error={checkValidation && !email.isValid}
                           helperText={checkValidation && !email.isValid ? email.errorMsg : ''}
                           InputProps={{
                             className: 'custom-input',
                             type: 'text',
                             placeholder: 'Please input email',
                             value: email.value,
                             onChange: this.handleInput,
                           }}/>
              </FormGroup>
            </Grid>
          </Grid>
          
          <Grid container spacing={3}>
            <Grid item xs={12} sm={12} md={6}>
              <FormGroup>
                <p className="form-title">First Name</p>
                <TextField id="first_name" name="first_name" variant="outlined"
                           error={checkValidation && !first_name.isValid}
                           helperText={checkValidation && !first_name.isValid ? first_name.errorMsg : ''}
                           InputProps={{
                             className: 'custom-input',
                             type: 'text',
                             placeholder: 'Please input first name',
                             value: first_name.value,
                             onChange: this.handleInput,
                           }}/>
              </FormGroup>
            </Grid>
            <Grid item xs={12} sm={12} md={6}>
              <FormGroup>
                <p className="form-title">Last Name</p>
                <TextField id="last_name" name="last_name" variant="outlined"
                           error={checkValidation && !last_name.isValid}
                           helperText={checkValidation && !last_name.isValid ? last_name.errorMsg : ''}
                           InputProps={{
                             className: 'custom-input',
                             type: 'text',
                             placeholder: 'Please input last name',
                             value: last_name.value,
                             onChange: this.handleInput,
                           }}/>
              </FormGroup>
            </Grid>
          </Grid>
          
          <Grid container spacing={3}>
            <Grid item xs={12} sm={12} md={6}>
              <FormGroup>
                <p className="form-title">Phone Number</p>
                <TextField id="phonenumber" name="phonenumber" variant="outlined"
                           error={checkValidation && !phonenumber.isValid}
                           helperText={checkValidation && !phonenumber.isValid ? phonenumber.errorMsg : ''}
                           InputProps={{
                             className: 'custom-input',
                             type: 'text',
                             placeholder: 'Please input phone number',
                             value: phonenumber.value,
                             onChange: this.handleInput,
                           }}/>
              </FormGroup>
            </Grid>
            <Grid item xs={12} sm={12} md={6}>
              <FormGroup>
                <p className="form-title">Location</p>
                <TextField id="address" name="address" variant="outlined"
                           error={checkValidation && !address.isValid}
                           helperText={checkValidation && !address.isValid ? address.errorMsg : ''}
                           InputProps={{
                             className: 'custom-input',
                             type: 'text',
                             placeholder: 'Please input location',
                             value: address.value,
                             onChange: this.handleInput,
                           }}/>
              </FormGroup>
            </Grid>
          </Grid>
          
          <Grid container spacing={3}>
            <Grid item xs={12} sm={12} md={6}>
              <FormGroup>
                <p className="form-title">Preference</p>
                
                <TextField
                  id="preferences"
                  name="preferences"
                  select
                  error={checkValidation && !preferences.isValid}
                  helperText={checkValidation && !preferences.isValid ? preferences.errorMsg : ''}
                  className="search-input-field"
                  variant="outlined"
                  value={preferences.value}
                  onChange={this.handleInput}
                  SelectProps={{
                    native: true,
                    className: 'custom-input',
                    MenuProps: {
                      // className: 'menu-props',
                    },
                  }}
                >
                  {categoryRanges.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </TextField>
              
              </FormGroup>
            </Grid>
            
            <Grid item xs={12} sm={12} md={6}>
              <FormGroup>
                <p className="form-title" style={{marginTop: 4}}>Gender</p>
                <RadioGroup
                  row
                  name="gender"
                  className="radio-group"
                  placeholder={'dfdfd'}
                  value={gender.value}
                  onChange={this.handleInput}
                >
                  <FormControlLabel
                    value="0"
                    control={<Radio
                      classes={{
                        root: 'radio',
                        checked: 'radio',
                      }}
                      size={"small"}
                    />}
                    label={<Typography classes="label" style={{paddingLeft: "4px"}}>Male</Typography>}/>
                  <FormControlLabel
                    value="1"
                    control={<Radio
                      classes={{
                        root: 'radio',
                        checked: 'radio',
                      }}
                      size={"small"}
                    />}
                    label={<Typography classes="label" style={{paddingLeft: "4px"}}>Female</Typography>}/>
                  <FormControlLabel
                    value="2"
                    control={<Radio
                      classes={{
                        root: 'radio',
                        checked: 'radio',
                      }}
                      size={"small"}
                    />}
                    label={<Typography classes="label" style={{paddingLeft: "4px"}}>Others</Typography>}/>
                </RadioGroup>
              </FormGroup>
            </Grid>
          </Grid>
          
          <Grid container spacing={3}>
            
            <Grid item xs={12} sm={12} md={6}>
              <FormGroup>
                <p className="form-title">Age Range</p>
                <TextField
                  id="age_range"
                  name="age_range"
                  select
                  className="search-input-field"
                  error={checkValidation && !age_range.isValid}
                  helperText={checkValidation && !age_range.isValid ? age_range.errorMsg : ''}
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
              
              </FormGroup>
            </Grid>
          </Grid>
          <Button className="btn-primary save-btn btn-round" size="medium" variant="contained"
                  onClick={this.updateProfile} disabled={ loading ? true : false}>{loading ?
            <CircularProgress color='success' varian="determinate"/> : 'Save'}</Button>
        </form>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    me: state.Auth.me,
    loading: state.Auth.loading,
  }
}

export default withRouter(connect(mapStateToProps, {updateProfile})(withSnackbar(ProfileComponent)));

