import React from 'react';
import './Header.scss';
import {withRouter, NavLink} from 'react-router-dom';
import {connect} from 'react-redux';
import {Button, IconButton} from '@material-ui/core';
import MenuIcon from '@material-ui/icons/Menu';
import Container from '@material-ui/core/Container';
import logo from '../../Assets/Images/logo.png';
import {toggleSidemenu, logOut, getMyRelation, clearSearchData} from '../../Redux/Actions';
import {HeaderLinks} from '../../Routes';
import {DefaultAvatar} from '../../Constant';

class Header extends React.Component {
  state = {
    transform: false,
    showAccountMenu: false,
    blured: false,
  }
  
  componentDidMount() {
    window.addEventListener('scroll', this.handleScroll);
    if (this.props.isLoggedin) {
      this.props.getMyRelation();
    }
  }
  
  componentWillUnmount() {
    window.removeEventListener('scroll', this.handleScroll);
  }
  
  componentDidUpdate(prevProps) {
    if (this.refs.accountMenu) this.refs.accountMenu.focus();
    if (!prevProps.isLoggedin && this.props.isLoggedin) {
      this.props.getMyRelation();
    }
  }
  
  handleScroll = (event) => {
    this.setState({
      transform: window.scrollY > 0 ? true : false
    });
  }
  
  toggleMenu = () => {
    this.props.toggleSidemenu(true)
  }
  
  toggleAccountMenu = () => {
    if (this.state.blured) {
      this.setState({blured: false});
      return;
    }
    this.setState({showAccountMenu: true});
  }
  
  blurMenu = () => {
    this.setState({showAccountMenu: false, blured: true});
    setTimeout(() => {
      this.setState({blured: false})
    }, 300);
  }
  
  doLogOut = () => {
    this.props.logOut();
  }
  
  clearSearchData = async () => {
    this.props.clearSearchData();
  }
  
  render() {
    const {isLoggedin, me} = this.props;
    const {showAccountMenu} = this.state;
    const pathName = this.props.location.pathname;
    return (
      <div className="header-component shadow-object"
           style={{display: pathName.indexOf('/admin') > -1 ? 'none' : 'initial'}}>
        <Container maxWidth="lg" className="custom-container v-c">
          <NavLink to="/" className="logo v-c h-c"> <img src={logo} alt="logo"/> </NavLink>
          <div className="header-menus show-web-flex v-c">
            {HeaderLinks.map((item, index) => <NavLink to={item.url} className="header-link"
                                                       onClick={item.url === '/search' && this.clearSearchData}
                                                       key={index}>{item.name}</NavLink>)}
            {(!isLoggedin || !me)
              ? <Button variant="contained" className="signin-btn" onClick={e => this.props.history.push('/sign-in')}>Sign
                In</Button>
              : <div className="avatar-area" onClick={e => this.toggleAccountMenu()}>
                <img src={me.photo || DefaultAvatar} className="avatar" alt="user"/>
                {showAccountMenu && <div className="account-menu shadow-object v-r" tabIndex="0" ref="accountMenu"
                                         onBlur={e => this.blurMenu()}>
                  <p>Hi, {me.first_name} {me.last_name}!</p>
                  <p onClick={e => this.props.history.push('/admin')}>Go to Dashboard</p>
                  <p onClick={this.doLogOut}>Sign Out</p>
                </div>}
              </div>}
          </div>
          <IconButton className="menu-btn show-mobile" onClick={this.toggleMenu}>
            <MenuIcon fontSize="large"/>
          </IconButton>
        </Container>
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

export default connect(mapStateToProps, {toggleSidemenu, logOut, getMyRelation, clearSearchData})(withRouter(Header));
