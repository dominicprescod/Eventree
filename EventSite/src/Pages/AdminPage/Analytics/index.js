import React from 'react';
import './Analytics.scss';
import {withRouter} from 'react-router-dom';
import {connect} from 'react-redux';
import ReactTable from 'react-table';
import {getMyEvents} from '../../../Redux/Actions';
import moment from 'moment';

class AnalyticsPage extends React.Component {
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
        <h1 className="admin-title">Analytics</h1>
      
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    my_events: state.event.my_events
  }
}

export default connect(mapStateToProps, {getMyEvents})(withRouter(AnalyticsPage));
