import React from 'react';
import './CommunityThumb.scss';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { Button } from '@material-ui/core';
import moment from 'moment';

class CommunityThumb extends React.Component {
  navigateToDetail = (id) => {
    this.props.history.push(`/community/${id}`)
  }

  render() {
    const { info, className } = this.props;
    return (
      <div className={`communitythumb-component shadow-object ${className || ''}`}>
        <img src={info.poster} alt="cover" />
        <div className="community-content v-r">
          <div className="title-part">
            <h2>{info.title}</h2>
          </div>
          <p className="created_time">{moment(info.createdAt).format("MMMM D, YYYY")}</p>
          <p className="description">{info.content}</p>
          <Button variant="outlined" className="read-btn" onClick={e => this.navigateToDetail(info.id)}>Continue Reading</Button>
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
    return {}
}

export default connect(mapStateToProps, {})(withRouter(CommunityThumb));