import React from 'react';
import './CalendarEventDialog.scss';
import {withRouter, NavLink} from 'react-router-dom';
import {connect} from 'react-redux';
import {
  Dialog,
  DialogContent,
  IconButton,
  Button,
  TextField,
  Grid,
  CircularProgress, Container, FormControlLabel, Checkbox, InputAdornment, Slide
} from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import {WithContext as ReactTags} from "react-tag-input";
import MultiToggle from "react-multi-toggle";
import PlacesAutocomplete, {geocodeByAddress, getLatLng} from "react-places-autocomplete";
import moment from 'moment';
import {withSnackbar} from "notistack";
import {
  arrLocationType,
} from "../../Utils/Constant";
import {OrganizeProfile} from "../index";


const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

class EventDialog extends React.Component {
  
  constructor(props) {
    super(props)
    this.myMapContainer = React.createRef()
  }
  
  state = {
    event_detail: null,
    lat: 0,
    lng: 0
  }
  
  componentWillMount() {
    this.props.getAllOrganizers();
  }
  
  
  handleShowMap = ({lat, lng, address}) => {
    let map = new window.google.maps.Map(this.myMapContainer.current, {
      center: {lat: lat, lng: lng},
      scrollwheel: true,
      zoom: 12
    });
    const location = this.state.location.value;
    let marker = new window.google.maps.Marker({
      position: {lat: lat, lng: lng},
      map: map,
      title: `This is ${address} `
    });
  }
  
  static getDerivedStateFromProps(props, state) {
    if (props.isOpenEventDlg) {
      console.log('----EventDialog_getDerivedStateFromProps_2---', props);
      const eventDetail = props.all_events.find(item => item.id == props.eventId);
      
      if (eventDetail && eventDetail.location_type === 0) {
        
        return {
          event_detail: eventDetail,
          lat: eventDetail.lat,
          lng: eventDetail.lng
        }
      }
      return {
        event_detail: eventDetail,
      }
    }
  }
  
  
  handleChange = e => {
    this.setState({
      isMapUse: true,
    });
    
    this.setState({
      location: {...this.state.location, value: e}
    });
  };
  
  
  handleOrganizeDlg = () => {
    this.setState({
      isOpenOrganizeDlg: !this.state.isOpenOrganizeDlg,
    });
  }
  
  
  handleClose = () => {
    this.props.closeDlg();
  }
  
  render() {
    const {
      isOpenOrganizeDlg,
      event_detail
    } = this.state;
    const {all_organizers} = this.props;
    console.log('-----calendar_detail------', event_detail);
    return (
      <div>
        <Dialog open={this.props.isOpenEventDlg} maxWidth="sm" fullWidth={true} fullScreen
                className="calendar-event-container" style={{background: "#262C34"}} scroll="body"
                TransitionComponent={Transition}>
          <div className="title-container">
            <h4>Event Details</h4>
            <IconButton className="close-btn" onClick={this.handleClose}> <CloseIcon fontSize="medium" color="white"/>
            </IconButton>
          </div>
          
          <DialogContent dividers={true} className="body-container">
            <div className="eventcreate-page v-r">
              <Container maxWidth="lg" className="custom-container v-r v-c">
                <div className="eventcreate-content shadow-object v-r">
                  <form autoComplete="off" noValidate className="v-r">
                    <Grid container spacing={3}>
                      <Grid item xs={12} sm={12} md={12}>
                        <p className="form-title">Title</p>
                        <TextField id="title" name="title" variant="outlined"
                                   disabled
                                   InputProps={{
                                     className: 'custom-input',
                                     type: 'text',
                                     placeholder: 'Please input title',
                                     value: event_detail ? event_detail.title : '',
                                     onChange: this.handleInput,
                                   }}/>
                      </Grid>
                      
                      <Grid container xs={12} sm={12} md={12} direction="row" style={{paddingLeft: "16px"}}>
                        <Grid item xs={12} sm={12} md={4}>
                          <p className="form-title">Organizer Name</p>
                          <TextField id="title" name="title" variant="outlined"
                                     disabled
                                     InputProps={{
                                       className: 'custom-input',
                                       type: 'text',
                                       placeholder: 'Please input title',
                                       value: event_detail ? event_detail.orgainfo.name : '',
                                       onChange: this.handleInput,
                                     }}/>
                        </Grid>
                        <Grid item xs={12} sm={12} md={1}></Grid>
                        <Grid item xs={12} sm={12} md={4} alignItems="center" alignContent="center"
                              justifyContent="center"
                              justify={true}>
                        
                        </Grid>
                      </Grid>
                      
                      
                      <Grid item xs={12} sm={12} md={12}>
                        <p className="form-title">Tags</p>
                        <div style={{position: "relative"}}>
                          <TextField id="title" name="title" variant="outlined"
                                     disabled
                                     InputProps={{
                                       className: 'custom-input',
                                       type: 'text',
                                       placeholder: 'Please input title',
                                       value: event_detail ? event_detail.tags : '',
                                       onChange: this.handleInput,
                                     }}/>
                        
                        </div>
                      </Grid>
                      
                      <Grid item xs={12} sm={12} md={12}>
                        <p className="form-title">Description</p>
                        <TextField id="description" name="description" variant="outlined"
                                   disabled
                                   multiline rows={6}
                                   InputProps={{
                                     className: 'custom-input textarea-input',
                                     type: 'text',
                                     placeholder: 'Please input description',
                                     value: event_detail ? event_detail.description : '',
                                     onChange: this.handleInput,
                                   }}/>
                      </Grid>
                      <Grid item xs={12} sm={12} md={12}>
                        <p className="form-title">Summary</p>
                        <TextField id="content" name="content" variant="outlined"
                                   disabled
                                   multiline rows={6}
                                   InputProps={{
                                     className: 'custom-input textarea-input',
                                     type: 'text',
                                     placeholder: 'Please input content',
                                     value: event_detail ? event_detail.content : '',
                                     onChange: this.handleInput,
                                   }}/>
                      </Grid>
                      <Grid container xs={12} sm={12} md={12} spacing={3} className="segment-parent">
                        <Grid item xs={12} sm={12} md={8}>
                          
                          <MultiToggle
                            options={arrLocationType}
                            selectedOption={event_detail ? event_detail.location_type : 0}
                            // onSelectOption={this.onGroupSizeSelect}
                            onSelectOption={null}
                          />
                        </Grid>
                      
                      </Grid>
                      
                      <Grid item xs={12} sm={12} md={12}>
                        <div ref={this.myMapContainer} id="map"></div>    {/* todo not works now.*/}
                      </Grid>
                      
                      
                      <Grid item xs={12} sm={12} md={6}>
                        <p className="form-title">Event Start Date/Time</p>
                        
                        <TextField id="title" name="title" variant="outlined"
                                   disabled
                                   InputProps={{
                                     className: 'custom-input',
                                     type: 'text',
                                     placeholder: 'Please input title',
                                     value: event_detail ? moment(event_detail.start_date).format("ddd, MMMM D, hh:mm A") : '',
                                     onChange: this.handleInput,
                                   }}/>
                      
                      </Grid>
                      <Grid item xs={12} sm={12} md={6}>
                        <p className="form-title">Event End Date/Time</p>
                        <TextField id="title" name="title" variant="outlined"
                                   disabled
                                   InputProps={{
                                     className: 'custom-input',
                                     type: 'text',
                                     placeholder: 'Please input title',
                                     value: event_detail ? moment(event_detail.end_date).format("ddd, MMMM D, hh:mm A") : '',
                                     onChange: this.handleInput,
                                   }}/>
                      </Grid>
                      <Grid item xs={12} sm={12} md={6}>
                        <p className="form-title">Total Ticket</p>
                        
                        <TextField id="title" name="title" variant="outlined"
                                   disabled
                                   InputProps={{
                                     className: 'custom-input',
                                     type: 'text',
                                     placeholder: 'Please input title',
                                     value: event_detail ? event_detail.total_ticket : '',
                                     onChange: this.handleInput,
                                   }}/>
                      </Grid>
                      <Grid item xs={12} sm={12} md={6}>
                        <p className="form-title">Ticket Limit</p>
                        <TextField id="title" name="title" variant="outlined"
                                   disabled
                                   InputProps={{
                                     className: 'custom-input',
                                     type: 'text',
                                     placeholder: 'Please input title',
                                     value: event_detail ? event_detail.ticket_limit : '',
                                     onChange: this.handleInput,
                                   }}/>
                      </Grid>
                      
                      
                      {event_detail && event_detail.price !== 0 && <Grid item xs={12} sm={12} md={6}>
                        <p className="form-title">Ticket Price</p>
                        <TextField id="price" name="price"
                                   disabled
                                   variant="outlined"
                                   onInput={(e) => {
                                     e.target.value = Math.max(0, parseInt(e.target.value)).toString().slice(0, 12)
                                   }}
                                   InputProps={{
                                     className: 'custom-input',
                                     type: 'number',
                                     placeholder: 'Please input ticket price',
                                     value: event_detail ? event_detail.price : '',
                                     startAdornment: <InputAdornment position="start">$</InputAdornment>,
                                     onChange: this.handleInput,
                                   }}/>
                      </Grid>}
                      
                      <Grid item xs={12} sm={12} md={6}>
                        <p className="form-title">Age Limit</p>
                        <TextField id="restriction_age" name="restriction_age"
                                   disabled
                                   variant="outlined"
                                   onInput={(e) => {
                                     e.target.value = Math.max(0, parseInt(e.target.value)).toString().slice(0, 2)
                                   }}
                                   InputProps={{
                                     className: 'custom-input',
                                     type: 'number',
                                     placeholder: 'Age Limit',
                                     value: event_detail ? event_detail.restriction_age : '',
                                     onChange: this.inputEvent,
                                   }}/>
                      </Grid>
                      
                      <Grid item xs={12} sm={12} md={4}>
                        <p className="form-title">Dress Code</p>
                        <TextField id="restriction_dress" name="restriction_dress"
                                   disabled
                                   variant="outlined"
                                   InputProps={{
                                     className: 'custom-input',
                                     placeholder: 'Dress Code',
                                     value: event_detail ? event_detail.restriction_dress : '',
                                     onChange: this.inputEvent,
                                   }}/>
                      </Grid>
                      <Grid item xs={12} sm={12} md={4}>
                        <p className="form-title">Refund Policy</p>
                        <TextField id="restriction_refund" name="restriction_refund"
                                   disabled
                                   variant="outlined"
                                   InputProps={{
                                     className: 'custom-input',
                                     placeholder: 'Refund Policy',
                                     value: event_detail ? event_detail.restriction_refund : '',
                                     onChange: this.inputEvent,
                                   }}/>
                      </Grid>
                    
                    </Grid>
                  
                  </form>
                </div>
                <OrganizeProfile isOpenOrganizeDlg={isOpenOrganizeDlg} closeDlg={this.handleOrganizeDlg}/>
              </Container>
            </div>
          </DialogContent>
        
        </Dialog>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    all_events: state.event.all_events
  }
}

export default withRouter(connect(mapStateToProps, {})(withSnackbar(EventDialog)));
