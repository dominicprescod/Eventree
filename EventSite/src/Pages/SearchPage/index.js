import React from 'react';
import './SearchPage.scss';
import {withRouter} from 'react-router-dom';
import {withSnackbar} from 'notistack';
import {connect} from 'react-redux';
import {Container, Button, TextField, Grid} from '@material-ui/core';
import {SearchEventThumb} from '../../Components';
import {setSearchData,clearSearchData} from '../../Redux/Actions';
import {searchEvents as searchEventsApi} from '../../Api';

const categoryRanges = [
  {
    value: '0',
    label: 'All',
  },
  {
    value: '1',
    label: 'Sport',
  },
  {
    value: '2',
    label: 'Theatre',
  },
  {
    value: '3',
    label: 'dance',
  },
];
const filterRanges = [
  {
    value: '0',
    label: 'All',
  },
  {
    value: '1',
    label: 'Title',
  },
  {
    value: '2',
    label: 'Promoters',
  },
  {
    value: '3',
    label: 'Patrons',
  },
  {
    value: '4',
    label: 'Venues',
  },
  {
    value: '5',
    label: 'Event Description',
  },

];

class SearchPage extends React.Component {
  state = {
    title: '',
    from: '',
    to: '',
    category: '0',
    filter: '0',
  }
  
  
  componentDidMount() {
    this.props.clearSearchData();
    if (!this.props.isLoggedin) {
      this.props.enqueueSnackbar('You are not sign in.Please sign in.', {variant: 'warning'})
    }
  }
  
  handleInput = (e) => {
    const fieldName = e.target.name;
    const value = e.target.value;
    
    this.setState({
      [fieldName]: value,
    });
  }
  
  navigateToDetail = (id) => {
    this.props.history.push(`/event/${id}`)
  }
  
  doSearch = async () => {
    if (!this.props.isLoggedin) {
      this.props.enqueueSnackbar('You are not sign in.Please sign in.', {variant: 'warning'});
      return;
    }
    const {title, from, to, category, filter} = this.state;
    const response = await searchEventsApi({search_string: title, from, to, category: Number(category), filter});
    console.log('-------search--------', response);
    if (response.data) {
      this.props.setSearchData(response.data);
    }
  }
  
  render() {
    const {title, from, to, category, filter} = this.state;
    return (
      <div className="search-page v-r mui-fixed">
        <div className="start-area">
          <Container maxWidth="lg" className="custom-container v-r h-c">
            <div className="writings v-r v-c">
              <h1>Lorem Ipsum</h1>
              <h1>Neque porro quisquam est</h1>
              <p className="show-web">It is a long established fact that a reader will be<br/>distracted by the readable
                content.</p>
            </div>
            <div className="search-area v-c h-c">
              <form autoComplete="off">
                <Grid container spacing={1}>
                  <Grid item md={3} xs={8}>
                    <TextField id="title" name="title" label="Search" value={title} onChange={this.handleInput}
                               className="search-input-field"/>
                  </Grid>
                  <Grid item md={1} xs={4}>
                    <TextField
                      id="filter"
                      name="filter"
                      select
                      label="Filter"
                      className="search-input-field"
                      value={filter}
                      onChange={this.handleInput}
                      SelectProps={{
                        native: true,
                        className: 'select-props',
                        MenuProps: {
                          className: 'menu-props',
                        },
                      }}
                    >
                      {filterRanges.map(option => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </TextField>
                  
                  </Grid>
                  <Grid item md={2} xs={6}>
                    <TextField id="date" label="From" name="from" type="date" value={from}
                               className="search-input-field" onChange={this.handleInput}
                               InputLabelProps={{shrink: true}} InputProps={{inputProps: {max: to}}}/>
                  </Grid>
                  <Grid item md={2} xs={6}>
                    <TextField id="date" label="To" name="to" type="date" value={to} className="search-input-field"
                               onChange={this.handleInput} InputLabelProps={{shrink: true}}
                               InputProps={{inputProps: {min: from}}}/>
                  </Grid>
                  
                  <Grid item md={2} xs={6}>
                    <TextField
                      id="category"
                      name="category"
                      select
                      label="category"
                      className="search-input-field"
                      value={category}
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
                  <Grid item md={2} xs={6}>
                    <Button variant="contained" className="btn-primary search-element search-btn"
                            onClick={e => this.doSearch()}>Search</Button>
                  </Grid>
                </Grid>
              </form>
            </div>
          </Container>
        </div>
        <div className="search-result">
          <Container maxWidth="lg" className="custom-container v-r v-c">
            {/* {show_none ? <div className="no-result v-c h-c">Oops! We have no event to show you.</div> : */}
            {this.props.data.length > 0 && <div className="show-result v-r v-c h-c">
              <h1>Search Result</h1>
              {this.props.data.map((item, index) => <SearchEventThumb key={index} info={item}
                                                                      className="search-item"/>)}
              {/* <Button variant="contained" className="view-btn btn-primary">Show More</Button> */}
            </div>}
          </Container>
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    data: state.search.data,
    isLoggedin: state.Auth.loggedin,
  }
}

export default withRouter(connect(mapStateToProps, {setSearchData,clearSearchData})(withSnackbar(SearchPage)));
