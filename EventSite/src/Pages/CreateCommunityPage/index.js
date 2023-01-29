import React, {Suspense} from 'react';
import './CreateCommunityPage.scss';
import {Redirect, withRouter} from 'react-router-dom';
import {connect} from 'react-redux';
import {Container, Button, TextField, InputAdornment, CircularProgress} from '@material-ui/core';
import {withSnackbar} from 'notistack';
import {
  uploadImage as uploadImageApi,
  createCommunity as createCommunityApi,
} from '../../Api';

class CreateCommunityPage extends React.Component {
  state = {
    title: '',
    content: '',
    poster: '',
    loading: false,
  }
  
  handleInput = (e) => {
    const fieldName = e.target.name;
    const value = e.target.value;
    
    this.setState({
      [fieldName]: value,
    });
  }
  
  pickFileForPhoto = (e) => {
    e.preventDefault();
    if (!e.target.files[0]) return;
    this.setState({
      poster: e.target.files[0]
    });
  }
  
  createCommunity = async () => {
    const {title, content, poster} = this.state;
    if (title.length === 0 || content.length === 0 || !poster) {
      this.props.enqueueSnackbar('Please fill in all fields.', {variant: 'error'});
      return;
    }
    try {
      this.setState({
        loading: true,
      });
      const imageUpload = await uploadImageApi(poster);
      let url = imageUpload.data.url;
      const result = await createCommunityApi({
        title, content, poster: url
      });
      this.setState({
        loading: false,
      });
      if (!result || result.errors) {
        if (result && result.errors.length > 0 && result.errors[0].message) {
          this.props.enqueueSnackbar(result.errors[0].message, {variant: 'error'})
        } else {
          this.props.enqueueSnackbar('There was a problem creating community, Please try again later.', {variant: 'error'})
        }
      } else {
        this.props.enqueueSnackbar('Congratulations. You succeeded creating an community', {variant: 'success'});
      }
    } catch (error) {
      this.props.enqueueSnackbar('There was a problem creating community, Please try again later.', {variant: 'error'})
    }
  }
  
  render() {
    const {title, content, poster, loading} = this.state;
    const {isLoggedin, me} = this.props;
    if (!isLoggedin || !me) {
      return (
        <Redirect
          to={{
            pathname: '/sign-in',
            state: {from: this.props.location}
          }}/>
      )
    }
    return (
      <div className="createcommunity-page v-r">
        <div className="start-area">
          <Container maxWidth="lg" className="custom-container v-r h-c">
            <div className="writings v-r v-c">
              <h1>Our Community</h1>
              <p>Lorem Ipsum is simply dummy text of the printing and typesetting industry.<br/>Lorem Ipsum has been the
                industry's standard dummyum.</p>
            </div>
          </Container>
        </div>
        <div className="create-content">
          <Container maxWidth="lg" className="custom-container v-r v-c">
            <div className="create-panel shadow-object v-r">
              <h1>Create Community</h1>
              <h2>Title</h2>
              <textarea className="title" placeholder="What are your thoughts on this topic" name="title" value={title}
                        onChange={this.handleInput}/>
              <h2>What are your thoughts on this topic</h2>
              <textarea className="post-content" placeholder="What are your thoughts on this topic" name="content"
                        value={content} onChange={this.handleInput}/>
              <h2>Upload Flyer</h2>
              <input accept="image/*" className="file_input" id="file_input" multiple type="file"
                     style={{display: 'none'}} onChange={e => this.pickFileForPhoto(e)}/>
              <TextField id="poster" name="poster" variant="outlined" disabled
                         InputProps={{
                           className: 'custom-input',
                           type: 'text',
                           placeholder: 'No file is selected',
                           value: poster.name ? poster.name : '',
                           startAdornment: <InputAdornment position="start">
                             <label htmlFor="file_input"><Button variant="contained" component="span">Choose
                               File</Button> </label>
                           </InputAdornment>,
                           onChange: this.handleInput,
                         }}/>
              <Button variant="contained" className="btn-primary create-btn" onClick={this.createCommunity}>{loading ?
                <CircularProgress color='success' varian="determinate"/> : 'Post'}</Button>
              
            </div>
          </Container>
        </div>
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

export default withRouter(connect(mapStateToProps, {})(withSnackbar(CreateCommunityPage)));
