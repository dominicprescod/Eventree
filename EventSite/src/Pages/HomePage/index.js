import React from 'react';
import './HomePage.scss';
import Media from 'react-media';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { Container, Button } from '@material-ui/core';
import ItemsCarousel from 'react-items-carousel';
import { TrendingEvent, EventThumb } from '../../Components';
import { KeyboardArrowLeft, KeyboardArrowRight } from '@material-ui/icons';
import { getEvents } from '../../Redux/Actions';
import moment from 'moment';

class HomePage extends React.Component {
	state = {
		activeTrendIndex: 0,
		activeUpcomingIndex: 0,
		activeHotIndex: 0,
	}

	componentDidMount() {
		this.props.getEvents();
	}

	getMyFavorite = () => {
		return this.props.events.filter(item => {
			let index = item.likes.findIndex(temp => temp.user_id === this.props.me.id)
			return index > -1;
		})
	}

	render() {
		const { activeTrendIndex, activeUpcomingIndex, activeHotIndex } = this.state;
		const today = new Date();
		const ThisWeeks = this.props.events.filter(item => moment(item.start_date).isSame(today, 'week') || moment(item.end_date).isSame(today, 'week'));
		return (
			<div className="home-page v-r">
				<div className="start-area">
					<Container maxWidth="lg" className="custom-container v-r h-c">
						<div className="writings v-r">
							<h1>Lorem Ipsum</h1>
							<h1>Neque porro quisquam est</h1>
							<p>It is a long established fact that a reader will be<br />distracted by the readable content.</p>
							{!this.props.loggedin && <div className="mail-box v-c">
								<input className="mail-input" placeholder="Enter your mail" />
								<Button variant="contained" className="start-btn btn-primary" onClick={e => this.props.history.push('/sign-up')}>Get Started</Button>
							</div>}
						</div>
					</Container>
				</div>
				<div className="slider-area trending">
					<Container maxWidth="lg" className="custom-container v-r">
						<h1>Most Popular</h1>
						<Media queries={{
							ex: "(min-width: 1200px)",
							lg: "(min-width: 992px)",
							md: "(min-width: 768px)",
							sm: "(min-width: 600px)",
							}}>
							{matches => (
								<ItemsCarousel
									classes={{itemsWrapper: 'items-wrapper', itemsInnerWrapper: 'inner-wrapper'}}
									infiniteLoop={true}
									gutter={32}
									numberOfCards={matches.lg ? 3 : matches.md ? 2 : 1}
									slidesToScroll={1}
									alwaysShowChevrons={true}
									showSlither={false}
									firstAndLastGutter={false}
									activePosition={'center'}
									leftChevron={<div className="carousel-btn left-btn v-c h-c"><KeyboardArrowLeft /></div>}
									rightChevron={<div className="carousel-btn right-btn v-c h-c"><KeyboardArrowRight /></div>}
									activeItemIndex={activeTrendIndex}
									requestToChangeActive={value => this.setState({ activeTrendIndex: value })}
								>
									{this.props.events.map((item, index) => <TrendingEvent info={item} key={index}/>)}
								</ItemsCarousel>
							)}
						</Media>
						<Button variant="contained" className="view-btn btn-primary" onClick={e => this.props.history.push('/search')}>View All</Button>
					</Container>
				</div>
				<div className="slider-area upcoming">
					<Container maxWidth="lg" className="custom-container v-r">
						<h1>In this week</h1>
						<Media queries={{
							ex: "(min-width: 1200px)",
							lg: "(min-width: 992px)",
							md: "(min-width: 768px)",
							sm: "(min-width: 600px)",
							}}>
							{matches => (
								ThisWeeks.length > 0 ? <ItemsCarousel
									classes={{itemsWrapper: 'items-wrapper', itemsInnerWrapper: 'inner-wrapper'}}
									infiniteLoop={true}
									gutter={29}
									numberOfCards={matches.ex ? 4 : matches.lg ? 3 : matches.md ? 2 : 1}
									slidesToScroll={1}
									alwaysShowChevrons={true}
									showSlither={false}
									firstAndLastGutter={false}
									activePosition={'center'}
									leftChevron={<div className="carousel-btn left-btn v-c h-c"><KeyboardArrowLeft /></div>}
									rightChevron={<div className="carousel-btn right-btn v-c h-c"><KeyboardArrowRight /></div>}
									activeItemIndex={activeUpcomingIndex}
									requestToChangeActive={value => this.setState({ activeUpcomingIndex: value })}
								>
									{ThisWeeks.map((item, index) => <EventThumb info={item} key={index}/>)}
								</ItemsCarousel> : <p style={{textAlign: 'center'}}>No events this week</p>
							)}
						</Media>
					</Container>
				</div>
				{this.props.loggedin && <div className="slider-area trending">
					<Container maxWidth="lg" className="custom-container v-r">
						<h1>Your Picks</h1>
						<Media queries={{
							ex: "(min-width: 1200px)",
							lg: "(min-width: 992px)",
							md: "(min-width: 768px)",
							sm: "(min-width: 600px)",
							}}>
							{matches => (
								this.getMyFavorite().length > 0 ? <ItemsCarousel
									classes={{itemsWrapper: 'items-wrapper', itemsInnerWrapper: 'inner-wrapper'}}
									infiniteLoop={true}
									gutter={29}
									numberOfCards={matches.ex ? 4 : matches.lg ? 3 : matches.md ? 2 : 1}
									slidesToScroll={1}
									alwaysShowChevrons={true}
									showSlither={false}
									firstAndLastGutter={false}
									activePosition={'center'}
									leftChevron={<div className="carousel-btn left-btn v-c h-c"><KeyboardArrowLeft /></div>}
									rightChevron={<div className="carousel-btn right-btn v-c h-c"><KeyboardArrowRight /></div>}
									activeItemIndex={activeHotIndex}
									requestToChangeActive={value => this.setState({ activeHotIndex: value })}
								>
									{this.getMyFavorite().map((item, index) => <EventThumb info={item} key={index}/>)}
								</ItemsCarousel> : <p style={{textAlign: 'center'}}>You have no favorite one</p>
							)}
						</Media>
					</Container>
				</div>}
			</div>
		);
	}
}

function mapStateToProps(state) {
	return {
		events: state.event.events,
		loggedin: state.Auth.loggedin,
		me: state.Auth.me
	}
}

export default connect(mapStateToProps, { getEvents })(withRouter(HomePage));