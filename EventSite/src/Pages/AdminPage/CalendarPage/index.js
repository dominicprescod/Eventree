import React from 'react';
import './CalendarPage.scss';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { Grid, Button } from '@material-ui/core';
import { ScheduleCalendar } from '../../../Components';
import { getMyTickets } from '../../../Redux/Actions';
import moment from 'moment';

class CalendarPage extends React.Component {
	componentDidMount() {
		this.props.getMyTickets();
	}

	navigateToCreate = () => {
		this.props.history.push('/create-event');
	}

	getSchedule = () => {
		let Schedule = [];
		for (let item of this.props.my_tickets) {
			Schedule.push({
				title: item.eventinfo.title, date: moment(item.eventinfo.start_date).format("YYYY-MM-DD"),
			})
		}
		return Schedule;
	}

	render() {
		return (
			<div className="calendar-page v-r">
				<h1 className="admin-title">Calendar</h1>
				<Grid container spacing={3}>
					<Grid item md={3} sm={12} xs={12}>
						<div className="sub-block">
							<div className="title-part">
								<p className="block-title">Calendar</p>
							</div>
							<Button variant="contained" className="btn-primary create-btn" onClick={e => this.navigateToCreate()}>Create New</Button>
						</div>
					</Grid>
					<Grid item md={9} sm={12} xs={12}>
						<div className="sub-block schedule-area">
							<ScheduleCalendar events={this.getSchedule()} />
						</div>
					</Grid>
				</Grid>
			</div>
		);
	}
}

function mapStateToProps(state) {
	return {
		my_tickets: state.ticket.my_tickets
	}
}

export default connect(mapStateToProps, { getMyTickets })(withRouter(CalendarPage));