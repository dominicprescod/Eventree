import React from 'react';
import './CommunityPage.scss';
import {withRouter} from 'react-router-dom';
import {connect} from 'react-redux';
import {withSnackbar} from 'notistack';
import {Container, Button, TextField, InputAdornment} from '@material-ui/core';
import SearchIcon from '@material-ui/icons/Search';
import {CommunityThumb} from '../../Components';
import {getCommunities} from '../../Redux/Actions';

class CommunityPage extends React.Component {
  state = {
    search_text: '',
  }
  
  componentDidMount() {
    this.props.getCommunities();
    if (!this.props.loggedin) {
      this.props.enqueueSnackbar('You are not sign in.Please sign in.', {variant: 'warning'})
    }
  }
  
  
  handleInput = (e) => {
    const fieldName = e.target.name;
    const value = e.target.value;
    
    this.setState({
      [fieldName]: value,
    });
  }
  
  navigateToCreate = () => {
    this.props.history.push('/create-community')
  }
  
  render() {
    const {search_text} = this.state;
    let filtered = this.props.communities.filter(item => item.title.toLowerCase().indexOf(search_text.toLowerCase()) > -1);
    return (
      <div className="community-page v-r">
        <div className="start-area">
          <Container maxWidth="lg" className="custom-container v-r h-c">
            <div className="writings v-r v-c">
              <h1>Our Community</h1>
              <p>Lorem Ipsum is simply dummy text of the printing and typesetting industry.<br/>Lorem Ipsum has been the
                industry's standard dummyum.</p>
            </div>
            <div className="search-area v-c">
              <div className="v-c tags">
                <Button variant="contained" className="btn-primary create-btn" onClick={e => this.navigateToCreate()}>Create
                  Community</Button>
              </div>
              <TextField id="search_text" name="search_text" variant="outlined"
                         InputProps={{
                           className: 'search-text custom-input',
                           startAdornment: <InputAdornment position="start"><SearchIcon style={{fontSize: '20px'}}/>
                           </InputAdornment>,
                           type: 'text',
                           placeholder: 'Search Community',
                           value: search_text,
                           onChange: this.handleInput,
                         }}/>
            </div>
          </Container>
        </div>
        <div className="search-result">
          <Container maxWidth="lg" className="custom-container v-r v-c">
            {filtered.map((item, index) => <CommunityThumb key={index} info={item} className="community-thumb"/>)}
          </Container>
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    loggedin: state.Auth.loggedin,
    communities: state.community.communities
  }
}

export default withRouter(connect(mapStateToProps, {getCommunities})(withSnackbar(CommunityPage)));
