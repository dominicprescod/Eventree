import React from 'react';
import './EventCreatePage.scss';
import {withRouter, Redirect} from 'react-router-dom';
import {connect} from 'react-redux';
import {withSnackbar} from 'notistack';
import PlacesAutocomplete, {
  geocodeByAddress,
  getLatLng,
} from 'react-places-autocomplete';
import SegmentedControl from 'mui-segmented-control';
import {TagInput} from "reactjs-tag-input";
import {WithContext as ReactTags} from 'react-tag-input';
import {
  Button,
  TextField,
  Grid,
  InputAdornment,
  Container,
  Checkbox,
  FormControlLabel,
  CircularProgress,
} from '@material-ui/core';
import ToggleButton from '@material-ui/lab/ToggleButton';
import ToggleButtonGroup from '@material-ui/lab/ToggleButtonGroup';
import MultiToggle from "react-multi-toggle";
import {createEvent as createEventApi, uploadImage as uploadImageApi} from '../../Api';
import {OrganizeProfile} from "../../Components";
import {
  categoryRanges,
  eventFrequency,
  arrWeek,
  arrMonthEvent,
  arrOrganization,
  arrLocationType,
  arrEventType
} from '../../Utils/Constant'

const suggestions = categoryRanges.map(country => {
  return {
    id: country.value,
    text: country.value
  };
});
const KeyCodes = {
  comma: 188,
  enter: 13
};
const delimiters = [KeyCodes.comma, KeyCodes.enter];

const groupOptions = [
  {
    displayName: 'Couple',
    value: 2
  },
  {
    displayName: 'Family',
    value: 4
  },
];

class EventCreatePage extends React.Component {
  
  constructor(props) {
    super(props)
    this.myMapContainer = React.createRef()
  }
  
  defaultState = {
    title: {isValid: false, value: '', errorMsg: 'This field is Required'},
    organizer: {isValid: false, value: '0', errorMsg: 'This field is Required'},
    description: {isValid: false, value: '', errorMsg: 'This field is Required'},
    content: {isValid: false, value: '', errorMsg: 'This field is Required'},
    category: {isValid: true, value: 1, errorMsg: 'This field is Required'},
    // online_event: true,
    location: {isValid: false, value: '', errorMsg: 'This field is Required'},
    location_type: {isValid: true, value: 1, errorMsg: 'This field is Required'},
    start_date: {isValid: false, value: '', errorMsg: 'This field is Required'},
    end_date: {isValid: false, value: '', errorMsg: 'This field is Required'},
    total_ticket: {isValid: false, value: '', errorMsg: 'This field is Required'},
    ticket_limit: {isValid: false, value: '', errorMsg: 'This field is Required'},
    price: {isValid: false, value: '', errorMsg: 'This field is Required'},
    poster: {isValid: false, value: '', errorMsg: 'This field is Required', file: ''},
    event_type: {isValid: false, value: 0, errorMsg: 'This field is Required'},        // Single/Recurring
    period_type: {isValid: false, value: 1, errorMsg: 'This field is Required'},       //  event_type === 0 ? single : others  Single/Daily/Week/Month
    month_frequency: {isValid: false, value: 3, errorMsg: 'This field is Required'},    // '0 - On the 1st, 1 - Biweekly, 2 - Last Day, 3 - other'
    week_frequency: {
      isValid: false,
      value: [false, false, false, false, false, false],
      errorMsg: 'This field is Required'
    },
    lat: 0,
    lng: 0,
    restriction_age: '',
    restriction_dress: '',
    restriction_refund: '',
    restriction_id: false,
    restriction_cash: false,
    free_event: false,
    checkValidation: false,
    loading: false,
    tags: {
      isValid: false,
      value: [{id: 'Thailand', text: 'Thailand'},
        {id: 'India', text: 'India'},
        {id: 'Vietnam', text: 'Vietnam'}],
      errorMsg: 'This field is Required'
    },
    isOpenOrganizeDlg: false,
    isMapUse: false,
    groupSize: 2
  }
  
  state = {
    ...this.defaultState
  }
  onGroupSizeSelect = value => {
    console.log('-----onGroupSizeSelect--', value);
    this.setState({
      location_type: {...this.state.location_type, value: value},
    });
  };
  
  handleSegment = (e) => {
    console.log('----handleSegment---', e);
    this.setState({
      location_type: {...this.state.location_type, value: e},
    });
  }
  
  handleChange = e => {
    this.setState({
      isMapUse: true,
    });
    
    this.setState({
      location: {...this.state.location, value: e}
    });
  };
  
  handleAddition = e => {
    const tempTags = [...this.state.tags.value, e];
    this.setState({
      tags: {...this.state.tags, value: tempTags}
    });
  }
  
  handleDelete = i => {
    const tempTags = this.state.tags.value;
    this.setState({
      tags: {...this.state.tags, value: tempTags.filter((tag, index) => index !== i)}
    });
  };
  
  onTagsChanged = (e) => {
    
    this.setState({
      tags: {...this.state.tags, value: e}
    });
  }
  
  handleSelect = e => {
    let locate;
    this.handleChange(e)
    geocodeByAddress(e)
    .then(results => {
        locate = results[0];
        return getLatLng(results[0]);
      }
    )
    .then(latLng => {
      this.setState({
        lat: latLng.lat,
        lng: latLng.lng
      })
      
      let map = new window.google.maps.Map(this.myMapContainer.current, {
        center: {lat: latLng.lat, lng: latLng.lng},
        scrollwheel: true,
        zoom: 12
      });
      const location = this.state.location.value;
      let marker = new window.google.maps.Marker({
        position: {lat: latLng.lat, lng: latLng.lng},
        map: map,
        title: `This is ${locate.formatted_address} `
      });
    })
    .catch(error => console.error('Error', error));
    this.setState({
      isMapUse: false,
    });
  };
  
  
  handleEventType = e => {
    this.setState({
      event_type: {...this.state.event_type, value: e},
    });
  }
  
  handleWeekType = (position) => {
    console.log('-----handleWeekType---', position);
    const frequencies = this.state.week_frequency;
    console.log('-----val---', frequencies);
    const updateCheckValue = frequencies.value.map((item, index) =>
      index === position ? !item : item
    );
    console.log('------updateCheckValue-----', updateCheckValue);
    this.setState({
      week_frequency: {...this.state.week_frequency, value: updateCheckValue}
    })
  }
  
  handleInput = (e) => {
    const fieldName = e.target.name;
    const value = e.target.value;
    
    if (fieldName === 'poster') return;
    
    let field = this.state[fieldName];
    field.value = value;
    field.isValid = true;
    field.errorMsg = '';
    
    switch (fieldName) {
      case 'title':
      case 'description':
      case 'location':
      case 'start_date':
      case 'end_date':
      case 'total_ticket':
      case 'ticket_limit':
      case 'price':
        if (!value || value.length === 0) {
          field.isValid = false;
          field.errorMsg = 'This field is required';
        }
        break;
      default:
        break;
    }
    
    this.setState({
      [fieldName]: field,
    });
  }
  
  inputEvent = (e) => {
    this.setState({
      [e.target.name]: e.target.value
    })
  }
  
  onChangeVals = (e) => {
    const fieldName = e.target.name;
    const value = e.target.checked;
    this.setState({
      [fieldName]: value,
    });
  }
  
  handleOrganizeDlg = () => {
    this.setState({
      isOpenOrganizeDlg: !this.state.isOpenOrganizeDlg,
    });
  }
  
  onChangeEditor = (e) => {
    let field = this.state.content;
    field.value = e;
    field.isValid = true;
    field.errorMsg = '';
    if (e.toString('html') === '<p><br></p>') {
      field.isValid = false;
      field.errorMsg = 'This field is required';
    }
    this.setState({
      content: field
    })
  }
  
  validateForm = () => {
    this.setState({
      checkValidation: true,
    });
    
    const {
      title,
      description,
      content,
      // online_event,
      location,
      start_date,
      end_date,
      total_ticket,
      ticket_limit,
      price,
      poster,
      free_event,
      location_type
    } = this.state
    let isVaildForm = title.isValid && description.isValid && content.isValid && start_date.isValid && end_date.isValid && total_ticket.isValid && ticket_limit.isValid && poster.isValid;
    // if (!online_event) {
    if (location_type.value === 0) {
      if (location.value.length === 0) {
        this.props.enqueueSnackbar('Please search location.', {variant: 'error'});
        return;
      }
    }
    if (!free_event) {
      isVaildForm = isVaildForm && price.isValid;
    }
    
    return isVaildForm;
  }
  
  create = async () => {
    if (!this.validateForm()) {
      return;
    }
    
    const {
      title,
      description,
      organizer,
      category,
      tags,
      location_type,
      content,
      // online_event,
      location,
      lat,
      lng,
      start_date,
      end_date,
      total_ticket,
      ticket_limit,
      price,
      poster,
      free_event,
      restriction_age,
      restriction_dress,
      restriction_refund,
      restriction_id,
      restriction_cash,
      event_type,
      isOpenOrganizeDlg,
      period_type,
      month_frequency,
      week_frequency
    } = this.state
    
    try {
      this.setState({
        loading: true,
      });
      
      const imageUpload = await uploadImageApi(poster.file);
      let url = imageUpload.data.url;
      const data = {
        title: title.value,
        description: description.value,
        organizer: organizer.value,
        category: category.value,
        tags: tags.value,
        // tags: tags.value,
        location_type: location_type.value,
        content: content.value,
        poster: url,
        start_date: start_date.value,
        end_date: end_date.value,
        period_type: event_type.value == 0 ? 0 : period_type.value,
        month_frequency: month_frequency.value,
        week_frequency: week_frequency.value,
        location: location_type.value == 0 ? location.value : 'Online Event',
        lat, lng,
        free_event: free_event ? 1 : 0,
        price: free_event ? 0 : parseInt(price.value, 10),
        total_ticket: parseInt(total_ticket.value, 10),
        ticket_limit: parseInt(ticket_limit.value, 10),
        restriction_age: restriction_age.length > 0 ? parseInt(restriction_age, 10) : null,
        restriction_dress,
        restriction_refund,
        restriction_id: restriction_id ? 1 : 0,
        restriction_cash: restriction_cash ? 1 : 0
      }
      const result = await createEventApi(data);
      this.setState({
        loading: false,
      });
      console.log('------data--------', data);
      if (!result || result.errors) {
        if (result && result.errors.length > 0 && result.errors[0].message) {
          this.props.enqueueSnackbar(result.errors[0].message, {variant: 'error'})
        } else {
          this.props.enqueueSnackbar('There was a problem creating event, Please try again later.', {variant: 'error'})
        }
      } else {
        this.props.enqueueSnackbar('Congratulations. You succeeded creating an event', {variant: 'success'});
        // this.setState({...this.defaultState})
      }
      // this.setState({                           // todo how to re-initial data
      //   loading: {...this.defaultState},
      // });
      
    } catch (error) {
      this.props.enqueueSnackbar('There was a problem creating event, Please try again later.', {variant: 'error'})
    }
  }
  
  pickFileForPhoto = (e) => {
    e.preventDefault();
    if (!e.target.files[0]) return;
    this.setState({
      poster: {isValid: true, value: e.target.files[0].name, errorMsg: '', file: e.target.files[0]}
    });
  }
  
  render() {
    const {isLoggedin, me} = this.props;
    if (!isLoggedin || !me) {
      return (
        <Redirect
          to={{
            pathname: '/sign-in',
            state: {from: this.props.location}
          }}/>
      )
    }
    const {
      title,
      description,
      content,
      // online_event,
      location,
      start_date,
      end_date,
      total_ticket,
      ticket_limit,
      poster,
      free_event,
      price,
      checkValidation,
      restriction_age,
      restriction_dress,
      restriction_refund,
      restriction_id,
      restriction_cash,
      location_type,
      organizer,
      category,
      tags,
      lat,
      lng,
      period_type,
      month_frequency,
      week_frequency,
      event_type,
      loading,
      isOpenOrganizeDlg,
      isMapUse
    } = this.state;
    console.log('----isMapUse-----', isMapUse);
    return (
      <div className="eventcreate-page v-r">
        <Container maxWidth="lg" className="custom-container v-r v-c">
          <div className="eventcreate-content shadow-object v-r">
            <form autoComplete="off" noValidate className="v-r">
              <Grid container spacing={3}>
                <Grid item xs={12} sm={12} md={12}>
                  <p className="form-title">Title</p>
                  <TextField id="title" name="title" variant="outlined"
                             error={checkValidation && !title.isValid}
                             helperText={checkValidation && !title.isValid ? title.errorMsg : ''}
                             InputProps={{
                               className: 'custom-input',
                               type: 'text',
                               placeholder: 'Please input title',
                               value: title.value,
                               onChange: this.handleInput,
                             }}/>
                </Grid>
                
                <Grid container xs={12} sm={12} md={12} direction="row" style={{paddingLeft: "16px"}}>
                  <Grid item xs={12} sm={12} md={4}>
                    <p className="form-title">Organizer Name</p>
                    <TextField
                      id="organizer"
                      name="organizer"
                      select
                      className="search-input-field"
                      value={organizer.value}
                      onChange={this.handleInput}
                      SelectProps={{
                        native: true,
                        className: 'select-props',
                        MenuProps: {
                          className: 'menu-props',
                        },
                      }}
                    >
                      {arrOrganization.map(option => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </TextField>
                  </Grid>
                  
                  <Grid item xs={12} sm={12} md={1}></Grid>
                  <Grid item xs={12} sm={12} md={4} alignItems="center" alignContent="center" justifyContent="center"
                        justify={true}>
                    <Button className="btn-primary organizer-create-btn btn-round" variant="contained"
                            onClick={this.handleOrganizeDlg}>Create</Button>
                  </Grid>
                </Grid>
                
                
                <Grid item xs={12} sm={12} md={4} style={{marginTop: "16px"}}>
                  <p className="form-title">Event Type</p>
                  <TextField
                    id="category"
                    name="category"
                    select
                    className="search-input-field"
                    value={category.value}
                    onChange={this.handleInput}
                    SelectProps={{
                      native: true,
                      className: 'select-props',
                      MenuProps: {
                        className: 'menu-props',
                      },
                    }}
                  >
                    {categoryRanges.map(option => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </TextField>
                </Grid>
                
                <Grid item xs={12} sm={12} md={12}>
                  <p className="form-title">Tags</p>
                  <div style={{position: "relative"}}>
                    <ReactTags
                      tags={tags.value}
                      suggestions={suggestions}
                      delimiters={delimiters}
                      handleDelete={this.handleDelete}
                      handleAddition={this.handleAddition}
                      // handleDrag={handleDrag}
                      // handleTagClick={handleTagClick}
                      allowDragDrop={false}
                      inputFieldPosition="inline"
                      autocomplete
                      placeholder={'Add new tag'}
                    />
                  
                  </div>
                </Grid>
                
                <Grid item xs={12} sm={12} md={12}>
                  <p className="form-title">Description</p>
                  <TextField id="description" name="description" variant="outlined" multiline rows={6}
                             error={checkValidation && !description.isValid}
                             helperText={checkValidation && !description.isValid ? description.errorMsg : ''}
                             InputProps={{
                               className: 'custom-input textarea-input',
                               type: 'text',
                               placeholder: 'Please input description',
                               value: description.value,
                               onChange: this.handleInput,
                             }}/>
                </Grid>
                <Grid item xs={12} sm={12} md={12}>
                  <p className="form-title">Summary</p>
                  <TextField id="content" name="content" variant="outlined" multiline rows={6}
                             error={checkValidation && !content.isValid}
                             helperText={checkValidation && !content.isValid ? content.errorMsg : ''}
                             InputProps={{
                               className: 'custom-input textarea-input',
                               type: 'text',
                               placeholder: 'Please input content',
                               value: content.value,
                               onChange: this.handleInput,
                             }}/>
                </Grid>
                <Grid container xs={12} sm={12} md={12} spacing={3} className="segment-parent">
                  <Grid item xs={12} sm={12} md={8}>
                    
                    <MultiToggle
                      options={arrLocationType}
                      selectedOption={location_type.value}
                      onSelectOption={this.onGroupSizeSelect}
                    />
                  
                  </Grid>
                  
                  <Grid item xs={12} sm={12} md={4}
                        style={{display: "flex", justifyContent: "center", alignContent: "center"}}>
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={free_event}
                          onChange={this.onChangeVals}
                          name="free_event"
                        />
                      }
                      label="Free Event"
                    />
                  </Grid>
                
                </Grid>
                {/*{!online_event && <Grid item xs={12} sm={12} md={12}>*/}
                {location_type.value === 0 && (<>
                  <Grid item xs={12} sm={12} md={12}>
                    <p className="form-title">Location</p>
                    <PlacesAutocomplete
                      value={location.value}
                      onChange={this.handleChange}
                      onSelect={this.handleSelect}
                    >
                      {({getInputProps, suggestions, getSuggestionItemProps, loading}) => (
                        <div style={{overflow: 'hidden'}}>
                          <input
                            {...getInputProps({
                              placeholder: 'Search Places ...',
                              className: 'location-search-input',
                            })}
                          />
                          <div className="autocomplete-dropdown-container">
                            {loading && <div>Loading...</div>}
                            {suggestions.map((suggestion, index) => {
                              const className = suggestion.active
                                ? 'suggestion-item--active'
                                : 'suggestion-item';
                              // inline style for demonstration purpose
                              const style = suggestion.active
                                ? {backgroundColor: 'white', color: 'black', cursor: 'pointer'}
                                : {backgroundColor: '#23262C', color: 'white', cursor: 'pointer'};
                              return (
                                <div
                                  {...getSuggestionItemProps(suggestion, {
                                    className,
                                    style,
                                  })}
                                  key={`${suggestion.description}-${index}`}
                                >
                                  <span>{suggestion.description}</span>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      )}
                    </PlacesAutocomplete>
                  </Grid>
                  
                  <Grid item xs={12} sm={12} md={12}>
                    <div ref={this.myMapContainer} id="map"></div>
                  </Grid>
                </>)}
                
                
                <Grid container xs={12} sm={12} md={12} spacing={3} className="segment-parent">
                  <Grid item xs={12} sm={12} md={4}>
                    <MultiToggle
                      options={arrEventType}
                      selectedOption={event_type.value}
                      onSelectOption={this.handleEventType}
                    />
                    {/*<SegmentedControl*/}
                    {/*  color="primary"*/}
                    {/*  className={'segment-props'}*/}
                    {/*  options={[*/}
                    {/*    {*/}
                    {/*      label: 'Single Event',*/}
                    {/*      value: 1*/}
                    {/*    },*/}
                    {/*    {*/}
                    {/*      label: 'Recurring Event',*/}
                    {/*      value: 2*/}
                    {/*    },*/}
                    {/*  */}
                    {/*  ]}*/}
                    {/*  value={event_type.value}*/}
                    {/*  onChange={this.handleEventType}*/}
                    {/*/>*/}
                  </Grid>
                </Grid>
                
                {
                  event_type.value === 1 && (
                    <>
                      <Grid container xs={12} sm={12} md={12} spacing={4} className="segment-parent">
                        <Grid item xs={12} sm={12} md={3}>
                          <p className="form-title">Frequency</p>
                          <TextField
                            id="period_type"
                            name="period_type"
                            select
                            className="search-input-field"
                            value={period_type.value}
                            onChange={this.handleInput}
                            SelectProps={{
                              native: true,
                              className: 'select-props',
                              MenuProps: {
                                className: 'menu-props',
                              },
                            }}
                          >
                            {eventFrequency.map(option => (
                              <option key={option.value} value={option.value}>
                                {option.label}
                              </option>
                            ))}
                          </TextField>
                        </Grid>
                        
                        {
                          period_type.value == 3 && (
                            <Grid item xs={12} sm={12} md={3}>
                              <p className="form-title"></p>
                              <TextField
                                id="month_frequency"
                                name="month_frequency"
                                select
                                className="search-input-field mt-22"
                                value={month_frequency.value}
                                onChange={this.handleInput}
                                SelectProps={{
                                  native: true,
                                  className: 'select-props',
                                  MenuProps: {
                                    className: 'menu-props',
                                  },
                                }}
                              >
                                {arrMonthEvent.map(option => (
                                  <option key={option.value} value={option.value}>
                                    {option.label}
                                  </option>
                                ))}
                              </TextField>
                            </Grid>
                          )
                        }
                      </Grid>
                      
                      {
                        period_type.value == 2 && (
                          <Grid item xs={12} sm={12} md={12}>
                            {
                              arrWeek.map((item, index) =>
                                (<FormControlLabel
                                  control={
                                    <Checkbox
                                      checked={week_frequency[index]}
                                      onChange={() => this.handleWeekType(index)}
                                      name="week_frequency"
                                    />
                                  }
                                  label={item.label}
                                />)
                              )
                            }
                          </Grid>
                        )
                      }
                    </>
                  )
                }
                
                <Grid item xs={12} sm={12} md={6}>
                  <p className="form-title">Event Start Date/Time</p>
                  <TextField id="start_date" name="start_date" variant="outlined"
                             error={checkValidation && !start_date.isValid}
                             helperText={checkValidation && !start_date.isValid ? start_date.errorMsg : ''}
                             InputProps={{
                               className: 'custom-input',
                               type: 'datetime-local',
                               placeholder: 'Please select start date/time',
                               value: start_date.value,
                               onChange: this.handleInput,
                               inputProps: {max: end_date.value}
                             }}/>
                </Grid>
                <Grid item xs={12} sm={12} md={6}>
                  <p className="form-title">Event End Date/Time</p>
                  <TextField id="end_date" name="end_date" variant="outlined"
                             error={checkValidation && !end_date.isValid}
                             helperText={checkValidation && !end_date.isValid ? end_date.errorMsg : ''}
                             InputProps={{
                               className: 'custom-input',
                               type: 'datetime-local',
                               placeholder: 'Please select end date/time',
                               value: end_date.value,
                               onChange: this.handleInput,
                               inputProps: {min: start_date.value}
                             }}/>
                </Grid>
                <Grid item xs={12} sm={12} md={6}>
                  <p className="form-title">Total Ticket</p>
                  <TextField id="total_ticket" name="total_ticket" variant="outlined"
                             error={checkValidation && !total_ticket.isValid}
                             helperText={checkValidation && !total_ticket.isValid ? total_ticket.errorMsg : ''}
                             onInput={(e) => {
                               e.target.value = Math.max(0, parseInt(e.target.value)).toString().slice(0, 12)
                             }}
                             InputProps={{
                               className: 'custom-input',
                               type: 'number',
                               placeholder: 'Please input total ticket count',
                               value: total_ticket.value,
                               onChange: this.handleInput,
                             }}/>
                </Grid>
                <Grid item xs={12} sm={12} md={6}>
                  <p className="form-title">Ticket Limit</p>
                  <TextField id="ticket_limit" name="ticket_limit" variant="outlined"
                             error={checkValidation && !ticket_limit.isValid}
                             helperText={checkValidation && !ticket_limit.isValid ? ticket_limit.errorMsg : ''}
                             onInput={(e) => {
                               e.target.value = Math.max(0, parseInt(e.target.value)).toString().slice(0, 12)
                             }}
                             InputProps={{
                               className: 'custom-input',
                               type: 'number',
                               placeholder: 'Please input ticket limit for one person',
                               value: ticket_limit.value,
                               onChange: this.handleInput,
                             }}/>
                </Grid>
                <Grid item xs={12} sm={12} md={6}>
                  <p className="form-title">Upload Flyer</p>
                  <input accept="image/*" className="file_input" id="file_input" multiple type="file"
                         onChange={e => this.pickFileForPhoto(e)}/>
                  <TextField id="poster" name="poster" variant="outlined"
                             error={checkValidation && !poster.isValid}
                             helperText={checkValidation && !poster.isValid ? poster.errorMsg : ''}
                             InputProps={{
                               className: 'custom-input',
                               type: 'text',
                               placeholder: 'No file is selected',
                               value: poster.value,
                               startAdornment: <InputAdornment position="start">
                                 <label htmlFor="file_input"><Button variant="contained" component="span">Choose
                                   File</Button> </label>
                               </InputAdornment>,
                               onChange: this.handleInput,
                             }}/>
                </Grid>
                <Grid item xs={12} sm={12} md={6}/>
                {!free_event && <Grid item xs={12} sm={12} md={6}>
                  <p className="form-title">Ticket Price</p>
                  <TextField id="price" name="price" variant="outlined"
                             error={checkValidation && !price.isValid}
                             helperText={checkValidation && !price.isValid ? price.errorMsg : ''}
                             onInput={(e) => {
                               e.target.value = Math.max(0, parseInt(e.target.value)).toString().slice(0, 12)
                             }}
                             InputProps={{
                               className: 'custom-input',
                               type: 'number',
                               placeholder: 'Please input ticket price',
                               value: price.value,
                               startAdornment: <InputAdornment position="start">$</InputAdornment>,
                               onChange: this.handleInput,
                             }}/>
                </Grid>}
                <Grid item xs={12} sm={12} md={6}/>
                <Grid item xs={12} sm={12} md={4}>
                  <p className="form-title">Age Limit</p>
                  <TextField id="restriction_age" name="restriction_age" variant="outlined"
                             onInput={(e) => {
                               e.target.value = Math.max(0, parseInt(e.target.value)).toString().slice(0, 2)
                             }}
                             InputProps={{
                               className: 'custom-input',
                               type: 'number',
                               placeholder: 'Age Limit',
                               value: restriction_age,
                               onChange: this.inputEvent,
                             }}/>
                </Grid>
                
                <Grid item xs={12} sm={12} md={4}>
                  <p className="form-title">Dress Code</p>
                  <TextField id="restriction_dress" name="restriction_dress" variant="outlined"
                             InputProps={{
                               className: 'custom-input',
                               placeholder: 'Dress Code',
                               value: restriction_dress,
                               onChange: this.inputEvent,
                             }}/>
                </Grid>
                <Grid item xs={12} sm={12} md={4}>
                  <p className="form-title">Refund Policy</p>
                  <TextField id="restriction_refund" name="restriction_refund" variant="outlined"
                             InputProps={{
                               className: 'custom-input',
                               placeholder: 'Refund Policy',
                               value: restriction_refund,
                               onChange: this.inputEvent,
                             }}/>
                </Grid>
                <Grid item xs={12} sm={12} md={12}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={restriction_id}
                        onChange={this.onChangeVals}
                        name="restriction_id"
                      />
                    }
                    label="ID Required"
                  />
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={restriction_cash}
                        onChange={this.onChangeVals}
                        name="restriction_cash"
                      />
                    }
                    label="Cash accepted at door"
                  />
                </Grid>
              
              </Grid>
              <Button className="btn-primary create-btn btn-round" variant="contained" disabled={loading ? true : false}
                      onClick={this.create}>{loading ?
                <CircularProgress color='success' varian="determinate"/> : 'Create'}</Button>
            </form>
          </div>
          <OrganizeProfile isOpenOrganizeDlg={isOpenOrganizeDlg} closeDlg={this.handleOrganizeDlg}/>
        </Container>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    isLoggedin: state.Auth.loggedin,
    me: state.Auth.me,
  }
}

export default withRouter(connect(mapStateToProps, {})(withSnackbar(EventCreatePage)));
