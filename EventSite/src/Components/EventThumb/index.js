import React from 'react';
import './EventThumb.scss';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { Button } from '@material-ui/core';
import PublishIcon from '@material-ui/icons/Publish';
import FavoriteIcon from '@material-ui/icons/Favorite';
import moment from 'moment';

class EventThumb extends React.Component {
    navigateToDetail = (id) => {
        this.props.history.push(`/event/${id}`)
    }

    render() {
      const { info } = this.props;
      return (
        <div className="eventthumb-component shadow-object" onClick={e => this.navigateToDetail(info.id)}>
          <img src={info.poster} alt="cover" />
          <div className="upcoming-content v-r">
            <p className="created_time">{moment(info.start_date).format("ddd, MMMM D, hh:mm A")}</p>
            <h2>{info.title}</h2>
            {info.description && <p className="description">{info.description}</p>}
            <div className="like-btn v-c">
              <p>{info.likes.length} Likes</p>
              <FavoriteIcon fontSize="small" color="secondary"/>
            </div>
          </div>
          <Button className="publish_btn" variant="contained">
            <PublishIcon fontSize="small" color="inherit" />
          </Button>
        </div>
      );
    }
}

function mapStateToProps(state) {
    return {}
}

export default connect(mapStateToProps, {})(withRouter(EventThumb));