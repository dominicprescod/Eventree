import React from 'react';
import './SearchEventThumb.scss';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import PublishIcon from '@material-ui/icons/Publish';
import FavoriteIcon from '@material-ui/icons/Favorite';
import moment from 'moment';
import { Button } from '@material-ui/core';

class SearchEventThumb extends React.Component {
  navigateToDetail = (id) => {
    this.props.history.push(`/event/${id}`)
  }

  render() {
    const { info, className } = this.props;
    return (
      <div className={`searcheventthumb-component shadow-object ${className || ''}`} onClick={e => this.navigateToDetail(info.id)}>
        <img src={info.poster} alt="cover" />
        <div className="item-content v-r">
          <div className="section">
            <h2 className="left-part">{info.title}</h2>
          </div>
          <div className="section">
            <p className="left-part description">{info.description}</p>
          </div>
          <div className="section">
            <p className="left-part created-time">{moment(info.start_date).format("ddd, MMMM D, hh:mm A")}</p>
            <div className="like-btn v-c">
              <p>{info.likes.length} Likes</p>
              <FavoriteIcon fontSize="small" color="secondary"/>
            </div>
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

export default connect(mapStateToProps, {})(withRouter(SearchEventThumb));