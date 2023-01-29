import React from 'react';
import './TicketManagePage.scss';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import ReactTable from 'react-table';
import { getMyTickets } from '../../../Redux/Actions';
import moment from 'moment';

class TicketManagePage extends React.Component {
	componentDidMount() {
		this.props.getMyTickets();
	}

	render() {
		return (
			<div className="ticketmanage-page v-r">
				<h1 className="admin-title">My Tickets</h1>
				<div className="sub-block">
					<div className="title-part">
						<p className="block-title">My Tickets</p>
					</div>
					<ReactTable
						data={this.props.my_tickets}
						className="-striped -highlight"
						defaultPageSize={10}
						minRows={10}
						columns={[
							{
								Header: 'ID',
								id: 'id',
								width: 80,
								accessor: r => `#${r.id}`
							},
							{
								Header: 'Start Date',
								width: 180,
								accessor: 'eventinfo.start_date',
								Cell: ({ value }) => (moment(value).format("YYYY-MM-DD HH:mm:ss")),
							},
							{
								Header: 'Amount',
								width: 80,
								accessor: 'amount'
							},
							{
								Header: 'Event Name',
								accessor: 'eventinfo.title',
							},
							{
								Header: 'Creator',
								width: 120,
								id: 'name',
								accessor: r => `${r.eventinfo.creator.first_name} ${r.eventinfo.creator.last_name}`
							},
						]}
						/>
				</div>
			</div>
		);
	}
}

function mapStateToProps(state) {
	return {
		my_tickets: state.ticket.my_tickets
	}
}

export default connect(mapStateToProps, { getMyTickets })(withRouter(TicketManagePage));