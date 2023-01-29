import React from 'react';
import './CommunityDetailPage.scss';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { Container, Button } from '@material-ui/core';
import moment from 'moment';
import avatar1 from '../../Assets/Images/avatar-2.png';
import avatar2 from '../../Assets/Images/avatar-3.png';
import { 
  getCommunityDetail as getCommunityDetailApi,
  createComment as createCommentApi
} from '../../Api';
import { FacebookShareButton, FacebookIcon, LinkedinShareButton, LinkedinIcon, TwitterShareButton, TwitterIcon } from "react-share";

class CommunityDetailPage extends React.Component {
  state = {
    info: {
      id: 0
    },

    Comments: [
      { avatar: avatar1, user_name: 'Bruna Hirano', created_time: 'Just Now', text: 'It’s no secret that the digital industry is booming. From exciting startups to global brands, companies are reaching out to digital agencies, responding to the new possibilities available. Howeve.' },
      { avatar: avatar2, user_name: 'Boris Danilchuk', created_time: 'Just Now', text: 'It’s no secret that the digital industry is booming.' },
    ],
    comment: ''
  }

  async componentDidMount() {
    if (this.props.match.params.id) {
      const response = await getCommunityDetailApi(this.props.match.params.id);
      if (response.data) {
        this.setState({
          info: response.data
        })
      }
    }
  }

  handleInput = (e) => {
    const fieldName = e.target.name;
    const value = e.target.value;

    this.setState({
      [fieldName]: value,
    });
  }

  postComment = async () => {
    let { comment, info } = this.state;
    if (comment.length === 0) {
      alert("Please input comment!");
      return;
    }
		try {
			const response = await createCommentApi(0, { relation_id: info.id, type: 1, text: comment });
			if (response.data) {
        info.comments.push(response.data.comment);
				this.setState({comment: '', info})
			} else {
        this.props.enqueueSnackbar('An error occured. Please try again later!', { variant: 'error' })
			}
		} catch (err) {
			this.props.enqueueSnackbar('An error occured. Please try again later!', { variant: 'error' })
		}
  }

  render() {
    const { comment, info } = this.state;
    const ShareURL = `http://54.176.220.139/community/${info.id}`;
    return (
      <div className="communitydetail-page v-r">
        <div className="start-area">
          <Container maxWidth="lg" className="custom-container v-r h-c">
            <div className="writings v-r v-c">
              <h1>Our Community</h1>
              <p>Lorem Ipsum is simply dummy text of the printing and typesetting industry.<br />Lorem Ipsum has been the industry's standard dummyum.</p>
            </div>
          </Container>
        </div>
        {info.id > 0 && <div className="community-content">
          <Container maxWidth="lg" className="custom-container v-r v-c">
            <div className="community-container shadow-object v-r">
              <img src={info.poster} alt="community-pic" />
              <div className="community-detail v-r">
                <div className="title-part">
                  <h2>{info.title}</h2>
                </div>
                <p className="created_time">{moment(info.createdAt).format("MMMM D, YYYY")}</p>
                <p className="description">{info.content}</p>
                <div className="sub-group v-r">
                  <h1>Share With Friends</h1>
                  <div className="v-c">
                    <FacebookShareButton url={ShareURL} className="share-btn"><FacebookIcon size={32} round={true} /></FacebookShareButton>
                    <LinkedinShareButton url={ShareURL} className="share-btn"><LinkedinIcon size={32} round={true} /></LinkedinShareButton>
                    <TwitterShareButton url={ShareURL} className="share-btn"><TwitterIcon size={32} round={true} /></TwitterShareButton>
                  </div>
                </div>
              </div>
              <div className="comment-compose-area sub-container v-r">
                <h2>{info.comments.length} comments</h2>
                {this.props.loggedin && <div className="compose-part">
                  <img src={this.props.me.photo} alt="me" />
                  <div className="v-r sub-part">
                    <textarea value={comment} onChange={this.handleInput} name="comment" placeholder="What are your thoughts on this topic" />
                    <Button variant="outlined" className="post-btn" onClick={e => this.postComment()}>Post Comment</Button>
                  </div>
                </div>}
              </div>
              <div className="comments-area sub-container v-r">
                {info.comments.map((item, index) => <div className="comment-container" key={index}>
                  <img src={item.user.photo} alt="composer" />
                  <div className="comment-content v-r">
                    <h3 className="v-c">{item.user.first_name} {item.user.last_name} <span>{moment(item.createdAt).format("MMMM D, YYYY")}</span></h3>
                    <p>{item.text}</p>
                  </div>
                </div>)}
              </div>
            </div>
          </Container>
        </div>}
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    loggedin: state.Auth.loggedin,
    me: state.Auth.me,
  }
}

export default connect(mapStateToProps, {})(withRouter(CommunityDetailPage));