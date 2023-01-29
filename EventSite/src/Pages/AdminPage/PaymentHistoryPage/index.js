import React from 'react';
import './PaymentHistoryPage.scss';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import ReactTable from 'react-table';
import { getPaymentHistory } from '../../../Redux/Actions';
import moment from 'moment';

class PaymentHistoryPage extends React.Component {
	componentDidMount() {
		this.props.getPaymentHistory();
	}

	render() {
		return (
			<div className="paymenthistory-page v-r">
				<h1 className="admin-title">Payment History</h1>
				<div className="sub-block">
					<div className="title-part">
						<p className="block-title">Payment History</p>
					</div>
					<ReactTable
						data={this.props.payment_history}
						className="-striped -highlight"
						defaultPageSize={10}
						minRows={10}
						columns={[
							{
								Header: 'ID',
								id: 'id',
								width: 100,
								accessor: r => `#${r.id}`
							},
							{
								Header: 'Date',
								width: 150,
								accessor: 'createdAt',
								Cell: ({ value }) => (moment(value).format("YYYY-MM-DD HH:mm:ss")),
							},
							{
								Header: 'Amount Paid',
								id: 'amount',
								width: 120,
								accessor: r => `$${r.amount.toFixed(2)}`
							},
							{
								Header: 'In/Out',
								width: 100,
								accessor: 'type',
								Cell: ({ value }) => (value === 0 ? 'In' : 'Out'),
							},
							{
								Header: 'Description',
								accessor: 'description'
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
		payment_history: state.payment.payment_history
	}
}

export default connect(mapStateToProps, { getPaymentHistory })(withRouter(PaymentHistoryPage));