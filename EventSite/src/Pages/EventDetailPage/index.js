import React from 'react';
import './EventDetailPage.scss';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { Container, Button, IconButton } from '@material-ui/core';
import SendIcon from '@material-ui/icons/Send';
import ThumbUpIcon from '@material-ui/icons/ThumbUp';
import ThumbDownIcon from '@material-ui/icons/ThumbDown';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, ElementsConsumer, CardElement } from '@stripe/react-stripe-js';
import { 
  getEventDetail as getEventDetailApi,
  createComment as createCommentApi,
  reaction as reactionApi,
  buyOnEvent as buyOnEventApi, 
  checkTicketLimit as checkTicketLimitApi
} from '../../Api';
import { doFollow } from '../../Redux/Actions';
import moment from 'moment';
import { withSnackbar } from 'notistack';
import { FacebookShareButton, FacebookIcon, LinkedinShareButton, LinkedinIcon, TwitterShareButton, TwitterIcon } from "react-share";

const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_KEY);

class EventDetailPage extends React.Component {
  state = {
    info: {
      id: 0
    },
    comment: '',
    content: 0,
    ticket_count: 1,
    total_count: 0,
    card_error: ''
  }

  constructor(props) {
    super(props);
    this.payBtn = React.createRef();
  }

  async componentDidMount() {
    if (this.props.match.params.id) {
      const response = await getEventDetailApi(this.props.match.params.id);
      if (response.data) {
        this.setState({
          info: response.data
        })
      }
    }
  }

  sendComment = async () => {
    let { comment, info } = this.state;
    if (comment.length === 0) {
      alert("Please input comment!");
      return;
    }
		try {
			const response = await createCommentApi(0, { relation_id: info.id, type: 0, text: comment });
			if (response.data) {
        info.comments.push(response.data.comment);
				this.setState({comment: '', info})
			} else {
        this.props.enqueueSnackbar('An error occured. Please try again later!', { variant: 'error' })
			}
		} catch (err) {
			this.props.enqueueSnackbar('An error occured. Please try again later!', { variant: 'error' })
		}
  }

  checkReaction = (value) => {
    if (!this.props.loggedin) return false;
		const { info } = this.state;
		let checkArray = value === 1 ? info.likes : info.dislikes;
		let index = checkArray.findIndex(temp => temp.user_id === this.props.me.id);
		return index === -1 ? false : true;
	}

	doReaction = async (value) => {
    if (!this.props.loggedin) return;
    let { info } = this.state;
    try {
			const response = await reactionApi({
        type: 0,
        user_id: this.props.me.id,
        relation_id: this.state.info.id,
        value,
      })
			if (response.data) {
        info.likes = response.data.likes;
        info.dislikes = response.data.dislikes;
        this.setState({ info });
			} else {
        this.props.enqueueSnackbar('An error occured. Please try again later!', { variant: 'error' })
			}
		} catch (err) {
			this.props.enqueueSnackbar('An error occured. Please try again later!', { variant: 'error' })
		}
	}

  checkFollowing = (user_id) => {
		let index = this.props.following.findIndex(temp => temp.user_info.id === user_id);
		return index > -1 ? true : false;
	}

	followUser = (user_id) => {
		this.props.doFollow(user_id);
	}

  moveNext = () => {
    this.setState({ content: this.state.content + 1 });
  }

  handleInput = (e) => {
    const fieldName = e.target.name;
    const value = e.target.value;

    this.setState({
      [fieldName]: value,
    });
  }

  handleSubmit = async (event, stripe, elements) => {
    event.preventDefault();
    const result = await stripe.createToken(elements.getElement(CardElement));
    if (!result || (result.error && result.error.message.length > 0)) return;
    this.buyEvent(result.token.id);
  };

  handleChange = (event) => {
    this.setState({
      card_error: event.error ? event.error.message : ''
    })
  }

  generateOptions = () => {
    const { info } = this.state;
    let temp = [];
    for (let i = 1; i <= info.ticket_limit; i++) {
      temp.push(<option key={i} value={i}>{i}</option>)
    }
    return temp;
  }

  gotoBuy = async () => {
		const { ticket_count, info } = this.state;
		const res = await checkTicketLimitApi({
			event_id: info.id,
			amount: parseInt(ticket_count, 10)
		})
		if (res && res.errors) {
			let errors = res.errors || [];
			let messages = [];
			for (var i=0; i< errors.length; i++) {
				messages.push(errors[i].message)
			}
      this.props.enqueueSnackbar(messages.length === 0 ? 'Unknown error' : messages[0], { variant: 'error' });
			return;
		}

    if (info.free_event) {
      this.buyEvent('free-event')
    } else {
      if (this.payBtn.current) {
        this.payBtn.current.click();
      }
    }
	}

  buyEvent = async (token) => {
		const { ticket_count, info } = this.state;
		const response = await buyOnEventApi({ 
			token: token, 
			event_id: info.id,
			amount: parseInt(ticket_count, 10)
		});
		if (response && response.data) {
			this.props.enqueueSnackbar('Success', { variant: 'success' });
		} else {
			let errors = response.errors || [];
			let messages = [];
			for (var i=0; i< errors.length; i++) {
				messages.push(errors[i].message)
			}
			if (messages.length === 0) {
				messages.push('Unknown error')
			}
			this.props.enqueueSnackbar(messages[0], { variant: 'error' });
		}
	}

  renderDetail = () => {
    const { ticket_count, info } = this.state;
    let price = info.price ? info.price : 0;
    const fee = price * 5 / 100;
    return (
      <React.Fragment>
        <img src={info.poster} alt="bg" />
          <div className="order-details">
            <h1>Order Summary</h1>
            <div className="v-c order-group">
              <p>Subtotal</p>
              <p>${(price * parseInt(ticket_count, 10)).toFixed(2)}</p>
            </div>
            <div className="v-c order-group">
              <p>Service fee</p>
              <p>${(fee * parseInt(ticket_count, 10)).toFixed(2)}</p>
            </div>
          </div>
          <div className="total-calc">
            <p>Total</p>
            <p>
              ${((price + fee) * parseInt(ticket_count, 10)).toFixed(2)} 
              <br />
              {/* <span>Price includes tax</span> */}
            </p>
          </div>
      </React.Fragment>
    );
  }

  render() {
    const { info, comment, content, ticket_count, card_error } = this.state;
    const ShareURL = `http://54.176.220.139/event/${info.id}`;
    let price = info.price ? info.price : 0;
    const fee = price * 5 / 100;
    return (
      <div className="eventdetail-page v-r">
        <div className="start-area">
          <Container maxWidth="lg" className="custom-container v-r h-c">
            {info.id > 0 && <div className="writings v-r">
              <h1>{info.title}</h1>
              <p>{info.description}</p>
            </div>}
          </Container>
        </div>
        {info.id > 0 && <div className="content-area v-r h-c">
          {content === 0 && <Container maxWidth="lg" className="custom-container section-1 h-c">
            <div className="main-content shadow-object v-r">
              <img src={info.poster} alt="bg" />
              <div className="main-description v-r">
                <div className="show-mobile-flex detail-part">
                  <div className="title-area v-r">
                    <h1 className="sub-part">{info.title}</h1>
                    <h3 className="sub-part">by {info.creator.first_name} {info.creator.last_name}</h3>
                    <h1 className="sub-part">{info.free_event === 1 ? 'Free Event' : `$${info.price}`}</h1>
                    <h4>Date And Time</h4>
                    <p className="small-margin">{moment(info.start_date).format("ddd, MMMM D, hh:mm A")} –<br />{moment(info.end_date).format("ddd, MMMM D, hh:mm A")}</p>
                    <h4>Location</h4>
                    <p className="small-margin">{info.location}</p>
                    {info.restriction_refund.length > 0 && <h4>Refund Policy</h4>}
                    {info.restriction_refund.length > 0 && <p className="small-margin">{info.restriction_refund}</p>}
                  </div>
                  <div className="action-part v-r">
                    <div className="btn-part v-c">
                      <div className="v-r v-c h-c sub-btn" onClick={e => this.doReaction(1)}>
                        <ThumbUpIcon fontSize="small" className={this.checkReaction(1) ? 'activated' : ''}/>
                        <p>{info.likes.length}</p>
                      </div>
                      <div className="v-r v-c h-c sub-btn" onClick={e => this.doReaction(2)}>
                        <ThumbDownIcon fontSize="small" className={this.checkReaction(2) ? 'activated' : ''} />
                        <p>{info.dislikes.length}</p>
                      </div>
                    </div>
                    {(this.props.loggedin && this.props.me.id !== info.creator.id) && <Button variant="contained" className="follow-btn btn-primary" onClick={() => this.followUser(info.creator.id)}>
                      {this.checkFollowing(info.creator.id) ? 'Unfollow' : 'Follow'}
                    </Button>}
                    {this.props.loggedin && <Button variant="contained" className="buy-btn" onClick={e => this.moveNext()}>Buy Ticket</Button>}
                  </div>
                </div>
                <h3 className="sub-part">{info.content}</h3>
                <div className="sub-group v-r">
                  <h1 className="sub-header">Share With Friends</h1>
                  <div className="v-c">
                    <FacebookShareButton url={ShareURL} className="share-btn"><FacebookIcon size={32} round={true} /></FacebookShareButton>
                    <LinkedinShareButton url={ShareURL} className="share-btn"><LinkedinIcon size={32} round={true} /></LinkedinShareButton>
                    <TwitterShareButton url={ShareURL} className="share-btn"><TwitterIcon size={32} round={true} /></TwitterShareButton>
                  </div>
                </div>
                <div className="feedback-area v-r">
                  <div className="comment-count v-c">
                    <p>{info.comments.length} Feedbacks</p>
                  </div>
                  {info.comments.map((item, index) => <div className="comment v-r" key={index}>
                    <div className="personal-info v-c">
                      <img src={item.user.photo} alt="comment-person" />
                      <div className="info v-r">
                        <h4>{item.user.first_name} {item.user.last_name}</h4>
                        <div className="comment-time">{moment(item.createdAt).format("MMMM D, hh:mm A")}</div>
                      </div>
                    </div>
                    <div className="comment-content">{item.text}</div>
                  </div>)}
                  {this.props.loggedin &&<div className="feedback-input v-c">
                    <input type="text" placeholder="Write your feedback" value={comment} onChange={e => this.setState({comment: e.target.value})} />
                    <IconButton aria-label="delete" onClick={e => this.sendComment()}>
                      <SendIcon />
                    </IconButton>
                  </div>}
                </div>
              </div>
            </div>
            <div className="event-detail show-web-flex shadow-object v-r">
              <div className="title-area v-c">
                <p className="detail-title">Event Details</p>
                <div className="btn-area v-c">
                  <IconButton className="like-btn" onClick={e => this.doReaction(1)}>
                    <ThumbUpIcon fontSize="small" className={this.checkReaction(1) ? 'activated' : ''}/>
                  </IconButton>
                  <p>{info.likes.length}</p>
                  <IconButton className="like-btn" onClick={e => this.doReaction(2)}>
                    <ThumbDownIcon fontSize="small" className={this.checkReaction(2) ? 'activated' : ''} />
                  </IconButton>
                  <p>{info.dislikes.length}</p>
                </div>
              </div>
              <div className="action-area v-r">
                <h1>{info.title}</h1>
                <h2>by {info.creator.first_name} {info.creator.last_name}</h2>
                {(this.props.loggedin && this.props.me.id !== info.creator.id) && <Button variant="contained" className="follow-btn btn-primary" onClick={() => this.followUser(info.creator.id)}>
                  {this.checkFollowing(info.creator.id) ? 'Unfollow' : 'Follow'}
                </Button>}
                <h1>{info.free_event === 1 ? 'Free Event' : `$${info.price}`}</h1>
                {this.props.loggedin && <Button variant="contained" className="buy-btn" onClick={e => this.moveNext()}>Buy Ticket</Button>}
              </div>
              <div className="detail-area v-r">
                <h2>Date And Time</h2>
                <p>{moment(info.start_date).format("ddd, MMMM D, hh:mm A")} –<br />{moment(info.end_date).format("ddd, MMMM D, hh:mm A")}</p>
                <h1>Location</h1>
                <p>{info.location}</p>
                {info.restriction_refund.length > 0 && <h1>Refund Policy</h1> }
                {info.restriction_refund.length > 0 && <p>{info.restriction_refund}</p> }
              </div>
            </div>
          </Container>}
          {content === 1 && <Container maxWidth="lg" className="custom-container section-2 h-c">
            <div className="main-content shadow-object v-r">
              <h1>Tickets</h1>
              <div className="v-c">
                <h2>Ticket + Fee</h2>
                <select value={ticket_count} name="ticket_count" onChange={e => this.handleInput(e)} className="ticket-select">
                  {this.generateOptions()}
                </select>
              </div>
              <h3>${price.toFixed(2)} <span>+${fee.toFixed(2)} Fee</span></h3>
              <div className="v-r description">
                {(stripePromise && !info.free_event) && <Elements stripe={stripePromise}>
                  <ElementsConsumer>
                    {({stripe, elements}) => (
                      <form onSubmit={e => this.handleSubmit(e, stripe, elements)} style={{textAlign: 'center'}}>
                        <div className="checkout-form v-r">
                          <CardElement 
                            options={{ style: { base: { fontSize: '16px', color: 'white', '::placeholder': { color: '#7882A2' }, } } }}
                            onChange={e => this.handleChange(e)}
                          />
                          {card_error.length > 0 && <div className="check-error">{card_error}</div>}
                        </div>
                        <Button variant="contained" className="pay-btn btn-primary" type="submit" style={{display: 'none'}} ref={this.payBtn}>Pay Now</Button>
                      </form>
                    )}
                  </ElementsConsumer>
                </Elements>}
              </div>
              <div className="btn-area v-c">
                <Button variant="contained" className="check-btn btn-primary" onClick={e => this.gotoBuy()}>Buy Ticket</Button>
                <Button variant="contained" className="cart-btn btn-primary" onClick={e => this.setState({total_count: this.state.total_count + parseInt(this.state.ticket_count, 10)})}>Add to Cart</Button>
              </div>
            </div>
            <div className="event-detail shadow-object v-r">
              {this.renderDetail()}
            </div>
          </Container>}
        </div>}
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    loggedin: state.Auth.loggedin,
    me: state.Auth.me,
    following: state.relation.following
  }
}

export default withRouter(connect(mapStateToProps, { doFollow })(withSnackbar(EventDetailPage)));