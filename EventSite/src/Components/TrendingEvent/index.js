import React from 'react';
import './TrendingEvent.scss';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';

class TrendingEvent extends React.Component {
    navigateToDetail = (id) => {
        this.props.history.push(`/event/${id}`)
    }

    render() {
        const { info } = this.props;
        return (
            <div className="trendingevent-component shadow-object" onClick={e => this.navigateToDetail(info.id)}>
                <img src={info.poster} alt="cover" />
                <div className="trending-description">{info.title}</div>
            </div>
        );
    }
}

function mapStateToProps(state) {
    return {}
}

export default connect(mapStateToProps, {})(withRouter(TrendingEvent));