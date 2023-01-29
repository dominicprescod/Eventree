import React from 'react';
import './DashboardPage.scss';
import { withRouter, NavLink } from 'react-router-dom';
import { connect } from 'react-redux';
import { Grid, LinearProgress } from '@material-ui/core';
import { Line } from 'react-chartjs-2';
import { SoldTickets, HighSoldTickets, Schedule } from './Assets';
import Media from 'react-media';
import { ScheduleCalendar } from '../../../Components';
import { getPaymentHistory } from '../../../Redux/Actions';
import moment from 'moment';

class DashboardPage extends React.Component {

	componentDidMount() {
		this.props.getPaymentHistory();
	}

	handleInput = (e) => {
		const fieldName = e.target.name;
		const value = e.target.value;
	
		this.setState({
		  	[fieldName]: value,
		});
	}

	getGraphData = () => {
		const { payment_history } = this.props;
		let labels = [];
		let incomes = [];
		let outcomes = [];
		for (let i = -29; i <= 0; i++) {
			let checkDate = moment().add(i, 'days');
			labels.push(checkDate.format("MM-DD"))

			let filtered = payment_history.filter(item => moment(item.createdAt).format("YYYY-MM-DD") === checkDate.format("YYYY-MM-DD"))
			let inSum =  0;
			let outSum = 0;

			for (let a of filtered) {
				a.type === 0 ? inSum += a.amount : outSum += a.amount;
			}
			incomes.push(inSum);
			outcomes.push(outSum);
		}
		return {
			labels, incomes, outcomes
		}
	}

	render() {
		const { labels, incomes, outcomes } = this.getGraphData();
		return (
			<div className="dashboard-page v-r">
				<h1 className="admin-title">Dashboard</h1>
				<div className="sub-block chart-area">
					<div className="title-part">
						<p className="block-title">Daily income/outcome (Last 30 days)</p>
					</div>
					<div className="block-content">
						<Media queries={{
							lg: "(min-width: 992px)",
						}}>
						{matches => (
							<Line 
								width={2000}
								height={300}
								// redraw={true}
								options={{ 
									maintainAspectRatio: false, 
									responsive: matches.lg ? true : false,
									legend: {
										labels: {
											boxWidth: 1,
											fontColor: 'white',
											fontSize: matches.lg ? 15 : 13,
										}
									},
								}}
								data={{
									labels: labels,
									datasets: [{
										label: 'Income',
										backgroundColor: '#FF3366',
										borderColor: '#FF3366',
										data: incomes,
										fill: false,
									}, {
										label: 'Outcome',
										backgroundColor: '#97DC21',
										borderColor: '#97DC21',
										data: outcomes,
										fill: false,
									}]
								}}/>
						)}
						</Media>
					</div>
				</div>
			<div className="sub-block v-r v-c h-c">
				<ScheduleCalendar className="schedule-area" events={Schedule}/>
			</div>
			<Grid container spacing={3}>
				<Grid item md={6} sm={12} xs={12}>
					<div className="sub-block ticket-block">
						<div className="title-part action-title">
							<p className="block-title">Total Ticket/Sold Ticket</p>
							<NavLink to="/admin/tickets">View All</NavLink>
						</div>
						<div className="v-r">
							{SoldTickets.map((item, index) => <div className="ticket-group v-r" key={index}>
								<div className="ticket-title v-c">
									<p>{item.name}</p>
									<p>{item.total}/{item.sold}</p>
								</div>
								<LinearProgress variant="determinate" className="progress-bar" value={item.sold / item.total * 100}/>
							</div>)}
						</div>
					</div>
				</Grid>
				<Grid item md={6} sm={12} xs={12}>
					<div className="sub-block ticket-block">
						<div className="title-part action-title">
							<p className="block-title">Highly Sold Tickets</p>
							<NavLink to="/admin/tickets">View All</NavLink>
						</div>
						<div className="v-r">
							{HighSoldTickets.map((item, index) => <div className="ticket-item v-c" key={index}>
								<p>{item.name}</p>
								<p>${item.price}</p>
							</div>)}
						</div>
					</div>
				</Grid>
			</Grid>
					</div>
			);
	}
}

function mapStateToProps(state) {
	return {
		payment_history: state.payment.payment_history
	}
}

export default connect(mapStateToProps, { getPaymentHistory })(withRouter(DashboardPage));