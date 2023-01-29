import React from 'react';
import './AdminPage.scss';
import { withRouter, NavLink, Route, Switch, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import logo from '../../Assets/Images/logo.png';
import { IconButton } from '@material-ui/core';
import MenuIcon from '@material-ui/icons/Menu';
import { HeaderLinks, AdminRoutes } from '../../Routes';
import { toggleSidemenu, logOut } from '../../Redux/Actions';

class AdminPage extends React.Component {
	state = {
		isOpen: true,
		isPrevOpen: true,
		showAccountMenu: false,
		blured: false,
	}

	toggleMenu = () => {
		this.setState({
			isPrevOpen: this.state.isOpen,
			isOpen: !this.state.isOpen
		})
	}

	toggleSide = () => {
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

	componentDidUpdate() {
		if (this.refs.accountMenu) this.refs.accountMenu.focus();
	}

	doLogOut = () => {
		this.props.logOut();
		this.props.history.push('/');
	}

	render() {
		const { isLoggedin, me } = this.props;
		const { isOpen, isPrevOpen, showAccountMenu } = this.state;
		if (!isLoggedin || !me) {
      return (
        <Redirect
          to={{
            pathname: '/sign-in',
            state: { from: this.props.location }
          }} />
      )
    }
		return (
			<div className="admin v-r">
				<div className="admin-header v-c shadow-object">
					<div className="logo-part v-c">
						<NavLink to="/"><img src={logo} alt="black-logo" /></NavLink>
					</div>
					<div className="menu-area v-c">
						<IconButton onClick={this.toggleMenu} className="show-web side-btn"> <MenuIcon fontSize="large"/> </IconButton>
						<div className="header-menus v-c show-web-flex">
							{ HeaderLinks.map((item, index) => <NavLink to={item.url} className="header-link" key={index}>{item.name}</NavLink>) }
							<div className="avatar-area" onClick={e => this.toggleAccountMenu()}>
								<img src={me.photo} className="avatar" alt="user"/>
								{showAccountMenu && <div className="account-menu shadow-object v-r" tabIndex="0" ref="accountMenu" onBlur={e => this.blurMenu()}>
									<p>Hi, {me.first_name} {me.last_name}!</p>
									<p onClick={this.doLogOut}>Sign Out</p>
								</div>}
							</div>
						</div>
					</div>
					<IconButton onClick={this.toggleSide} className="show-mobile side-btn"> <MenuIcon fontSize="large"/> </IconButton>
				</div>
				<div className="admin-content">
					<div className={`sidebar show-web-flex v-r ${isOpen ? isPrevOpen ? '' : 'open' : 'closed'}`}>
						{AdminRoutes.map((item, index) => <NavLink exact to={item.url} className="menu-item v-c" key={index}>
							<item.icon /> <p>{item.menu}</p>
						</NavLink>)}
					</div>
					<div className="main-content">
						<Switch>
							{AdminRoutes.map((item, index) => <Route key={index} exact path={item.url} component={item.page} />)}
							<Redirect from="/admin" to="/admin/dashboard" />
						</Switch>
					</div>
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

export default connect(mapStateToProps, { toggleSidemenu, logOut })(withRouter(AdminPage));