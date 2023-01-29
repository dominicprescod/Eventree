import React from 'react';
import './SideMenu.scss';
import { NavLink, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { toggleSidemenu } from '../../Redux/Actions';
import logo from '../../Assets/Images/logo.png';
import { IconButton, Button } from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import { HeaderLinks, AdminRoutes } from '../../Routes';
import { DefaultAvatar } from '../../Constant';
import { logOut } from '../../Redux/Actions';

class SideMenu extends React.Component {
  state = {
    isOpen: false,
    isPrevOpen: false,
  }

  static getDerivedStateFromProps(props, state) {
    return {
      isOpen: props.isOpen,
      isPrevOpen: state.isOpen,
    }
  }

  closeSidemenu = (url = '') => {
    if (url.length > 0) {
      this.props.history.push(url);
    }
    this.props.toggleSidemenu(false);
  }
	
	doLogout = () => {
		this.props.logOut();
		this.props.toggleSidemenu(false);
		if (this.props.location.pathname.indexOf('/admin') > -1) this.props.history.push('/');
	}

  render() {
		const { isOpen, isPrevOpen } = this.state;
		const { isLoggedin, me } = this.props;
    return (
      <div className={`sidemenu-component show-mobile-flex ${isOpen ? 'active' : isPrevOpen ? 'inactive' : ''}`}>
        <div className="sidemenu-wrapper">
          <div className="sidemenu-content v-r">
            <div className="logo-area v-c">
              <NavLink to="/" onClick={this.closeSidemenu}><img src={logo} alt="logo" /></NavLink>
              <IconButton className="close-btn" onClick={this.closeSidemenu}> <CloseIcon fontSize="large" /> </IconButton>
            </div>
						<div className="sidemenu-data v-r">
							{(!isLoggedin || !me) ? <div className="btn-area v-r v-c">
								<Button variant="contained" className="auth-btn signin-btn" onClick={e => this.closeSidemenu('/sign-in')}>Sign In</Button>
								<Button variant="outlined" className="auth-btn signup-btn" onClick={e => this.closeSidemenu('/sign-up')}>Sign Up</Button>
							</div> : <div className="avatar-area v-r v-c">
								<img src={me.photo || DefaultAvatar} className="avatar" alt="user"/>
								<p>Hi, {me.first_name} {me.last_name}!</p>
							</div>}
							<div className="menu v-r v-c">
								{HeaderLinks.map((item, index) => <NavLink className="menu-item" exact to={item.url} key={index} onClick={this.closeSidemenu}>{item.name}</NavLink>)}
							</div>
							{(isLoggedin && me) && <div className="menu v-r v-c">
								{AdminRoutes.map((item, index) => <NavLink className="menu-item" exact to={item.url} key={index} onClick={this.closeSidemenu}>{item.menu}</NavLink>)}
							</div>}
							{(isLoggedin && me) && <div className="menu btn-area v-r v-c">
								<Button variant="contained" className="auth-btn signin-btn" onClick={e => this.doLogout()}>Sign Out</Button>
							</div>}
						</div>
          </div>
          <div className="sidemenu-block" onClick={ () => this.closeSidemenu() }></div>
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
		isOpen: state.Sidemenu.isOpen,
		isLoggedin: state.Auth.loggedin,
    me: state.Auth.me,
  }
}

export default connect(mapStateToProps, { toggleSidemenu, logOut })(withRouter(SideMenu));