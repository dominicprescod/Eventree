import React from "react";
import "./CapNumber.scss";
import {withRouter} from "react-router-dom";
import {connect} from "react-redux";
import ReactTable from "react-table";
import CloseIcon from '@material-ui/icons/Close';
import {FaFacebook, FaLinkedin, FaTwitter, FaInstagram} from "react-icons/fa";
import {getMyEvents, getMyOrganizers, signUp, socialSignIn} from "../../../Redux/Actions";
import moment from "moment";
import {
  Select,
  FormControl,
  MenuItem,
  TextField,
  InputAdornment,
  Button,
  IconButton,
  Grid,
  Container
} from '@material-ui/core';
import SearchIcon from '@material-ui/icons/Search';
import {withStyles} from "@material-ui/core/styles";
import {withSnackbar} from "notistack";


class CapNumber extends React.Component {
  
  state = {}
  
  render() {
    
    return (
      <div className="eventmanage-page v-r">
        sssss
      </div>
    );
  }
  
}

function mapStateToProps(state) {
  return {
    my_events: state.event.my_events,
    my_organizers: state.Organizer.my_organizers,
    selected_my_organizer: state.Organizer.selected_my_organizer,
  };
}

// export default connect(mapStateToProps,
//   {getMyEvents, getMyOrganizers})(withRouter(withStyles( {withTheme: true})(CapNumber)));
export default withRouter(
  connect(mapStateToProps, {})(withSnackbar(CapNumber))
);
