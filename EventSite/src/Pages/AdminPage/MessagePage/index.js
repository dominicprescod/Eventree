import React from 'react';
import './MessagePage.scss';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { Grid, Button, TextField, InputAdornment, IconButton } from '@material-ui/core';
import SearchIcon from '@material-ui/icons/Search';
import SendIcon from '@material-ui/icons/Send';
import moment from 'moment';
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos';
import { db, sendMessage as sendMessageFunc } from '../../../Utils/firebase';
import { getChats } from '../../../Redux/Actions';

let unsubscriber = null;

class MessagePage extends React.Component {
	state = {
		searchText: '',
		message: '',
		selectedChat: { id: '' }
	}

	componentDidMount() {
		if (unsubscriber) unsubscriber();
		unsubscriber = db.collection("rooms")
			// .where('user_ids', 'array-contains', parseInt(this.props.me.id, 10))
			// .where('user_ids', 'array-contains-any', [this.props.me.id])
			.orderBy('createdAt', 'desc')
			.onSnapshot((data) => {
				if (data.docs) {
					let updates = [];
					for (let item of data.docs) {
						let temp = item.data();
						if (temp.user_ids.indexOf(this.props.me.id) > -1) {
							updates.push({
								id: item.id,
								...item.data()
							})
						}
					}
					this.props.getChats(updates);
			}});
	}

	componentWillUnmount() {
		if (unsubscriber) unsubscriber();
	}

	getContacts = (search_string) => {
		const { chats } = this.props;
		let filtered = chats.filter(item => {
			let userName = this.getUserData(item).name;
			return userName.toLowerCase().indexOf(search_string.toLowerCase()) > -1;
		})
		return filtered;
	}

	getUserData = (item) => {
		const { me } = this.props;
		let myIndex = item.user_ids.indexOf(me.id);
		let userIndex = myIndex === 0 ? 1 : 0;
		let userInfo = {
			id: item.user_ids[userIndex],
			name: item.user_names[userIndex],
			photo: item.user_photos[userIndex],
			messages: item.messages
		}
		return userInfo;
	}

	handleInput = (e) => {
		const fieldName = e.target.name;
		const value = e.target.value;
        
		this.setState({
			[fieldName]: value,
		});
	}

	sendMessage = () => {
		let { message, selectedChat } = this.state;
		const { me } = this.props;
		if (message.length === 0) { return; }
		sendMessageFunc(selectedChat.id, me.id, message);
		this.setState({
			message: ''
		})
	}
	
	getMessages = () => {
		const { selectedChat } = this.state;
		const { chats } = this.props;
		let index = chats.findIndex(temp => temp.id === selectedChat.id);
		return index > -1 ? chats[index].messages : [];
	}

	goBack = () => {
		this.setState({ selectedChat: { id: '' } })
	}

	render() {
		const { searchText, selectedChat, message } = this.state;
		const { me } = this.props;
		const Filtered = this.getContacts(searchText);
		return (
			<div className="message-page v-r">
				<Grid container spacing={3}>
					<Grid item md={3} sm={12} xs={12} className={`${selectedChat.id.length > 0 ? 'show-web' : ''}`}>
						<div className="sub-block contact-area">
							<TextField id="searchText" name="searchText" variant="outlined" 
								InputProps={{
									className: 'custom-input search-input',
									type: 'text',
									placeholder: 'Search...',
									value: searchText,
									startAdornment: <InputAdornment position="start">
										<SearchIcon className="input-icon"/>
									</InputAdornment>,
									onChange: this.handleInput,
							}}/>
							<div className="contacts v-r">
								{Filtered.map((item, index) => <div className={`contact-item v-c ${item.id === selectedChat.id ? 'selected' : ''}`} key={index} onClick={e => this.setState({selectedChat: item})}>
									<img src={this.getUserData(item).photo} alt="client" />
									<div className="contact-info v-r h-c">
										<p className="name">{this.getUserData(item).name}</p>
										{item.messages.length > 0 && <p className="last-message">{item.messages[0].message}</p>}
									</div>
								</div>)}
							</div>
						</div>
					</Grid>
					<Grid item md={9} sm={12} xs={12} className={`${selectedChat.id.length === 0 ? 'show-web' : ''}`}>
						{selectedChat.id.length > 0 && <div className="sub-block chat-area">
							<div className="title-part">
								<p className="block-title v-c">
									<IconButton className="show-mobile back-btn" onClick={this.goBack}><ArrowBackIosIcon /></IconButton>
									{this.getUserData(selectedChat).name}
								</p>
							</div>
							<div className="conversation-area v-r">
								<div className="message-area">
									{this.getMessages().map((item, index) => <div className={`message-item v-r ${item.user_id === me.id  ? 'mine' : ''}`} key={index}>
										<p>{item.message}</p>
										<p>{moment(item.createdAt.nanoSeconds).format('h:mm A')}</p>
									</div>)}
								</div>
								<div className="send-area">
									<TextField id="message" name="message" variant="outlined" multiline
										InputProps={{
											className: 'custom-input message-input',
											type: 'text',
											placeholder: 'Enter Message...',
											value: message,
											onChange: this.handleInput,
									}}/>
									<Button variant="contained" className="send-btn" onClick={this.sendMessage}><SendIcon /></Button>
								</div>
							</div>
						</div>}
					</Grid>
				</Grid>
			</div>
		);
	}
}

function mapStateToProps(state) {
	return {
		me: state.Auth.me,
		chats: state.chat.chats
	}
}

export default connect(mapStateToProps, { getChats })(withRouter(MessagePage));