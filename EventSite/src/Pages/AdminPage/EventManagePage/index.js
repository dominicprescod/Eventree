import React from 'react';
import './EventManagePage.scss';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import ReactTable from 'react-table';
import { getMyEvents } from '../../../Redux/Actions';
import moment from 'moment';

class EventManagePage extends React.Component {
	componentDidMount() {
		this.props.getMyEvents();
	}

	download = (r) => {
		if (!r.qrcode || r.qrcode.length === 0) return;
		window.open(r.qrcode);
	}

	render() {
		console.log("ASDF", this.props.my_events);
		return (
			<div className="eventmanage-page v-r">
				<h1 className="admin-title">My Events</h1>
				<div className="sub-block">
					<div className="title-part">
						<p className="block-title">My Events</p>
					</div>
					<ReactTable
						data={this.props.my_events}
						className="-striped -highlight"
						defaultPageSize={10}
						columns={[
							{
								Header: 'Event Name',
								accessor: 'title',
								width: 200,
							},
							{
								Header: 'Location',
								accessor: 'location'
							},
							{
								Header: 'Date',
								accessor: 'start_date',
								width: 150,
								Cell: ({ value }) => (moment(value).format("YYYY-MM-DD HH:mm:ss")),
							},
							{
								Header: 'Actions',
								width: 120,
								className: 'v-c',
								id: 'actions',
								accessor: r => (<p style={{color: '#FF3366', cursor: 'pointer'}} onClick={e => this.download(r)}>Download QR</p>)
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
		my_events: state.event.my_events
	}
}

export default connect(mapStateToProps, { getMyEvents })(withRouter(EventManagePage));