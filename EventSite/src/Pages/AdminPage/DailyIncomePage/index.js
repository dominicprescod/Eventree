import React from 'react';
import './DailyIncomePage.scss';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { Line } from 'react-chartjs-2';
import Media from 'react-media';
import { getPaymentHistory } from '../../../Redux/Actions';
import moment from 'moment';

class DailyIncomePage extends React.Component {
	componentDidMount() {
		this.props.getPaymentHistory();
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
			<div className="dailyincome-page v-r">
				<h1 className="admin-title">Daily Income</h1>
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
			</div>
		);
	}
}

function mapStateToProps(state) {
	return {
		payment_history: state.payment.payment_history
	}
}

export default connect(mapStateToProps, { getPaymentHistory })(withRouter(DailyIncomePage));