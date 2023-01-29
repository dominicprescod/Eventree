import React from 'react';
import './SettingsPage.scss';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { Grid, IconButton } from '@material-ui/core';
import { Menus } from './Assets';
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos';

class SettingsPage extends React.Component {
	state = {
		selectedMenu: { id: 0 }
	}

	handleInput = (e) => {
		const fieldName = e.target.name;
		const value = e.target.value;
        
		this.setState({
			[fieldName]: value,
		});
	}

	goBack = () => {
		this.setState({ selectedMenu: { id: 0 } })
	}

	render() {
		const { selectedMenu } = this.state;
		return (
			<div className="settings-page v-r">
				<Grid container spacing={3}>
					<Grid item md={3} sm={12} xs={12} className={`${selectedMenu.id > 0 ? 'show-web' : ''}`}>
						<div className="sub-block menus-area">
							<div className="title-part">
								<p className="block-title">Settings</p>
							</div>
							<div className="menus v-r">
								{Menus.map((item, index) => <div className={`menu-item v-c ${selectedMenu.id === item.id ? 'selected' : ''}`} key={index} onClick={e => this.setState({selectedMenu: item})}>
									<item.icon /> <p>{item.menu}</p>
								</div>)}
							</div>
						</div>
					</Grid>
					<Grid item md={9} sm={12} xs={12} className={`${selectedMenu.id === 0 ? 'show-web' : ''}`}>
						{selectedMenu.id > 0 && <div className="sub-block setting-area">
							<div className="title-part">
								<p className="block-title v-c">
									<IconButton className="show-mobile back-btn" onClick={this.goBack}><ArrowBackIosIcon /></IconButton>
									{selectedMenu.menu}
								</p>
							</div>
							<div className="main-area v-r">
								<selectedMenu.component />
							</div>
						</div>}
					</Grid>
				</Grid>
			</div>
		);
	}
}

function mapStateToProps(state) {
    return {}
}

export default connect(mapStateToProps, {})(withRouter(SettingsPage));