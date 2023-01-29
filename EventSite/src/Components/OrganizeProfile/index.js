import React from 'react';
import './OrganizeProfile.scss';
import {withRouter, NavLink} from 'react-router-dom';
import {connect} from 'react-redux';
import {
  Dialog,
  DialogContent,
  IconButton,
  Button,
  TextField,
  Grid,
  
} from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import SaveIcon from '@material-ui/icons/Save';
import {FaFacebook, FaLinkedin, FaTwitter, FaInstagram} from "react-icons/fa";
import {toggleSidemenu, logOut, getMyRelation, clearSearchData} from '../../Redux/Actions';

class OrganizeProfile extends React.Component {
  
  state = {
    name: {isValid: false, value: '', errorMsg: 'This field is Required'},
    website: {isValid: false, value: '', errorMsg: 'This field is Required'},
    email: {isValid: false, value: '', errorMsg: 'This field is Required'},
    description: {isValid: false, value: '', errorMsg: 'This field is Required'},
    facebook: {isValid: false, value: '', errorMsg: 'This field is Required'},
    linkedin: {isValid: false, value: '', errorMsg: 'This field is Required'},
    twitter: {isValid: false, value: '', errorMsg: 'This field is Required'},
    instagram: {isValid: false, value: '', errorMsg: 'This field is Required'},
    checkValidation: false,
  }
  
  handleInput = (e) => {
    const fieldName = e.target.name;
    const value = e.target.value;
    
    if (fieldName === 'poster') return;
    
    let field = this.state[fieldName];
    field.value = value;
    field.isValid = true;
    field.errorMsg = '';
    
    switch (fieldName) {
      case 'name':
      case 'website':
      case 'email':
      case 'description':
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
  
  clickSocialBtn = (e) => {
    console.log('--clickSocialBtn--', e);
    const fieldName = e;
    
    let field = this.state[fieldName];
    field.isValid = true;
    field.errorMsg = '';
    field.value='';
    
    this.setState({
      [fieldName]: field,
    });
  }
  
  validateForm = () => {
    this.setState({
      checkValidation: true,
    });
    
    const {
      name,
      website,
      email,
      description,
    } = this.state
    let isVaildForm = name.isValid && website.isValid && email.isValid && description.isValid;
    return isVaildForm;
  }
  
  handleClose = () => {
    this.props.closeDlg();
  }
  
  render() {
    const {name, website, email, description,facebook,linkedin,twitter, instagram,checkValidation} = this.state;
    return (
      <div>
        <Dialog open={this.props.isOpenOrganizeDlg} maxWidth="sm" fullWidth={true} className="organizer" scroll="body">
          <div className="title-container">
            <h4>Create Organization</h4>
            <IconButton className="close-btn" onClick={this.handleClose}> <CloseIcon fontSize="medium" color="white"/>
            </IconButton>
          </div>
          
          <DialogContent dividers={true}>
            <div className="main-container">
              <Grid container xs={12} sm={12} md={12} spacing={3}>
                <Grid item xs={12} sm={12} md={8} direction="column">
                  <TextField id="name" name="name" variant="outlined" fullWidth={true}
                             error={checkValidation && !name.isValid}
                             helperText={checkValidation && !name.isValid ? name.errorMsg : ''}
                             InputProps={{
                               className: 'custom-input',
                               type: 'text',
                               placeholder: 'Please input title',
                               value: name.value,
                               onChange: this.handleInput,
                             }}/>
                  <TextField id="website" name="website" variant="outlined" fullWidth={true}
                             error={checkValidation && !website.isValid}
                             helperText={checkValidation && !website.isValid ? website.errorMsg : ''}
                             InputProps={{
                               className: 'custom-input',
                               type: 'text',
                               placeholder: 'Please input title',
                               value: website.value,
                               onChange: this.handleInput,
                             }}/>
                  <TextField id="email" name="email" variant="outlined" fullWidth={true}
                             error={checkValidation && !email.isValid}
                             helperText={checkValidation && !email.isValid ? email.errorMsg : ''}
                             InputProps={{
                               className: 'custom-input',
                               type: 'text',
                               placeholder: 'Please input title',
                               value: email.value,
                               onChange: this.handleInput,
                             }}/>
                </Grid>
                
                <Grid container xs={12} sm={12} md={4} justifyContent={'center'} alignContent={'center'}>
                  <img src={'https://s3.amazonaws.com/37assets/svn/765-default-avatar.png'} className="avatar-img"
                       alt="profile"/>
                  {/*<input*/}
                  {/*  type="file"*/}
                  {/*  name="uploadedFile"*/}
                  {/*  // value={photo}*/}
                  {/*  onChange={this.handleFile}*/}
                  {/*  required*/}
                  {/*/>*/}
                </Grid>
              </Grid>
              
              <Grid item xs={12} sm={12} md={12}>
                <p className="description-title">Description</p>
                <TextField id="description" name="description" variant="outlined" fullWidth={true} multiline rows={6}
                           error={checkValidation && !description.isValid}
                           helperText={checkValidation && !description.isValid ? description.errorMsg : ''}
                           InputProps={{
                             className: 'custom-input textarea-input',
                             type: 'text',
                             placeholder: 'Please input description',
                             value: description.value,
                             onChange: this.handleInput,
                           }}/>
              </Grid>
              
              <Grid container item xs={12} sm={12} md={6} justifyContent="space-around" style={{marginTop: '16px'}}>
                <IconButton className="close-btn" onClick={() => this.clickSocialBtn('facebook')} >
                  <FaFacebook color={ facebook.isValid ?"#4C599B" : "#3C599BAA"} size={24}/>
                </IconButton>
                <IconButton className="close-btn" onClick={() => this.clickSocialBtn('linkedin')} >
                  <FaLinkedin color={linkedin.isValid ?"#4C599B" : "#3C599BAA"} size={24}/>
                </IconButton>
                <IconButton className="close-btn" onClick={() => this.clickSocialBtn('twitter')} >
                  <FaTwitter color={twitter.isValid ?"#4C599B" : "#3C599BAA"} size={24}/>
                </IconButton>
                <IconButton className="close-btn" onClick={() => this.clickSocialBtn('instagram')} >
                  <FaInstagram color={instagram.isValid ?"#4C599B" : "#3C599BAA"} size={24}/>
                </IconButton>
              </Grid>
              
              <Grid container xs={12} sm={12} md={10} spacing={3} alignContent={'center'}>
                <Grid item xs={12} sm={12} md={8}>
                  <TextField id="description" name="description" variant="outlined" fullWidth={true}
                    // error={checkValidation && !description.isValid}
                    // helperText={checkValidation && !description.isValid ? description.errorMsg : ''}
                             InputProps={{
                               className: 'custom-input',
                               type: 'text',
                               placeholder: 'Please input description',
                               value: 'description.value',
                               // onChange: this.handleInput,
                             }}/>
                </Grid>
                
                <Grid item xs={12} sm={12} md={4} alignContent={'center'}>
                  <IconButton className="close-btn" style={{marginTop: '14px'}}>
                    <SaveIcon fontSize="medium" color="white"/>
                    Save
                  </IconButton>
                </Grid>
              
              </Grid>
            </div>
          </DialogContent>
          
          <div className="footer-container">
            
            <Grid container xs={12} sm={12} md={12} spacing={1} alignItem={'center'} alignContent={'center'}
                  direction="row-reverse">
              
              <Grid item xs={12} sm={12} md={4}>
                <Button className="btn-primary save-btn" variant="contained"
                        onClick={this.create}>Save changes</Button>
              </Grid>
              
              <Grid item xs={12} sm={12} md={2}>
                <Button className="close-btn" variant="contained" onClick={this.handleClose}>Close</Button>
              </Grid>
            
            </Grid>
          </div>
        </Dialog>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    isLoggedin: state.Auth.loggedin,
    me: state.Auth.me,
  }
}

export default connect(mapStateToProps, {
  toggleSidemenu,
  logOut,
  getMyRelation,
  clearSearchData
})(withRouter(OrganizeProfile));
