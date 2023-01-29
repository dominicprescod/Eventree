import React from "react";
import "./Member.scss";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import ReactTable from "react-table";
import { getUserList, setUserList, removeUser } from "../../../Redux/Actions";
import moment from "moment";
import MenuItem from "@material-ui/core/MenuItem";
import Select from "@material-ui/core/Select";
import styled from "styled-components";
import { withStyles } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import Autocomplete from '@material-ui/lab/Autocomplete';
import InputBase from '@material-ui/core/InputBase';

const styles = (theme) => ({
  menuItem: {
    color: "white",
  },
  searchField: {
    color: "white",
  },
  autocompleteList: {
    color: 'white',
    flex: 1,
    borderColor: 'white'
  },
  select: {
    flex: 1,
    margin: '10px',
    height: '30px'
  },
  button: {
    color: 'white',
    backgroundColor: '#242A32',
    width: '200px',
    flex: 1,
    padding: '10px'
  },
  icon: {
    fill: 'white'
  }
});

const ComponentGroupDiv = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
`;

const EventButton = withStyles({
  root: {
    color: 'white',
    border: '1px solid white'
  }
})(Button);

const EmailSearchBox = withStyles({
  root: {
    '& #email-search-box': {
      color: 'white',
    },
    borderColor: 'white'
  },
})(TextField);

const BootstrapInput = withStyles((theme) => ({
  root: {
    'label + &': {
      marginTop: theme.spacing(3),
    },
  },
  input: {
    borderRadius: 4,
    position: 'relative',
    color: 'white',
    border: '1px solid #ced4da',
    fontSize: 16,
    marginTop: '5px',
    padding: '16px 26px 19px 12px',
    transition: theme.transitions.create(['border-color', 'box-shadow']),
    // Use the system font instead of the default Roboto font.
    fontFamily: [
      '-apple-system',
      'BlinkMacSystemFont',
      '"Segoe UI"',
      'Roboto',
      '"Helvetica Neue"',
      'Arial',
      'sans-serif',
      '"Apple Color Emoji"',
      '"Segoe UI Emoji"',
      '"Segoe UI Symbol"',
    ].join(','),
    '&:focus': {
      borderRadius: 4,
      borderColor: '#80bdff',
      boxShadow: '0 0 0 0.2rem rgba(0,123,255,.25)',
    },
  },
}))(InputBase);

const ActionComponent = (r) => {
  console.log('ActionComponent.r', r);
  if (r.isRoleEditing) {
    return (
      <Select
        className={"styled-select"}
      >
        <MenuItem
          className={styles.menuItem}
          value={"Cancel"}
          onClick={() => {r.cancel(r.r)}}
        >
          Cancel
        </MenuItem>
        <MenuItem
          className={styles.menuItem}
          value={"Confirm"}
          onClick={() => {r.confirm(r.r)}}
        >
          Confirm
        </MenuItem>
      </Select>
    );
  } else {
    return (
      <Select
        className={"styled-select"}
      >
        <MenuItem
          className={styles.menuItem}
          value={"Remove"}
          onClick={() => {r.remove(r.r)}}
        >
          Remove
        </MenuItem>
        <MenuItem
          className={styles.menuItem}
          value={"Edit details"}
          onClick={() => {r.edit(r.r)}}
        >
          Edit details
        </MenuItem>
      </Select>
    );
  }
}

const RoleComponent = (param) => {
  console.log('param.isRoleEditing', param.isRoleEditing, param.index);
  if (param.isRoleEditing === false) {
    if (param.param.role === 0) {
      return <p>Creator</p>
    } else if (param.param.role === 1) {
      return <p>Admin</p>
    }
    return <p>Approver</p>
  } else {
    return (
      <Select
        className={"styled-select"}
        onChange={(event) => {param.change(event, param.param)}}
      >
        <MenuItem
          className={styles.menuItem}
          value={0}
        >
          Creator
        </MenuItem>
        <MenuItem
          className={styles.menuItem}
          value={1}
        >
          Admin
        </MenuItem>
        <MenuItem
          className={styles.menuItem}
          value={2}
        >
          Approver
        </MenuItem>
      </Select>
    )
  }
}

class MembersPage extends React.Component {

  state = {
    role: '0',
    userList: [],
    currentEmail: "",
    listMembers: [],
    organizer_id: 0,
    isRoleEditing: [],
  }

  componentDidMount() {
    this.props.getUserList({organizer_id: this.state.organizer_id, level:2});
    this.setState({
      isRoleEditing: Array(this.state.listMembers.length).fill(false)
    });
  }

  static getDerivedStateFromProps(props, state) {
    return {
      userList: props.userList,
      listMembers: props.committee,
      organizer_id: props.selected_organizer
    }
  }

  cancelEdit = (index) => {
    alert(index);
  }

  remove = async (r) => {
    let index = this.state.listMembers.findIndex(user => user.email === r.email);
    if (index !== -1) {
      console.log('this.state.listMembers[index]', this.state.listMembers[index]);
      await this.props.removeUser({
        userid: this.state.listMembers[index].user_id
      });
      await this.props.getUserList({organizer_id: this.state.organizer_id, level:2})
    }
  };

  editRole = async (r) => {
    this.setState(state => {
      const index = state.listMembers.indexOf(r);
      state.isRoleEditing[index] = true;
      return state.isRoleEditing
    });
  }

  cancelEditRole = async (r) => {
    this.setState(state => {
      const index = state.listMembers.indexOf(r);
      state.isRoleEditing[index] = false;
      return state.isRoleEditing;
    });
  }

  confirmEditRole = async (r) => {
    this.setState(state => {
      const index = state.listMembers.indexOf(r);
      state.isRoleEditing[index] = false;
      return state.isRoleEditing;
    });
  }

  roleChangeHandle = (event, r) => {
    const index = this.state.listMembers.indexOf(r);
    this.setState(state => {
      state.listMembers[index].role = event.target.value;
      state.isRoleEditing[index] = false;
      return state.listMembers;
    });
  }

  handleChange = (event) => {
    this.setState({
      role: event.target.value
    });
  };

  onSearchEmail = (event, value) => {
    this.setState({
      currentEmail: value
    });
  };

  onAddMember = async (event) => {
    let index = this.state.userList.findIndex(user => user.email === this.state.currentEmail);
    if (index !== -1) {
      if (this.state.listMembers.findIndex(member => member.email === this.state.currentEmail) === -1) {
        await this.props.setUserList({
          userlist: {
            userdata: this.state.userList[index],
            organizer_id: this.state.organizer_id,
            level: this.state.role
          }
        });
        await this.props.getUserList({organizer_id: this.state.organizer_id, level:2})
      }
    }
  }

  render() {
    const { classes } = this.props;
    const { userList, role } = this.state;

    return (
      <div className="sub-block">
        <div className="title-part">
          <p className="block-title">Organization Members</p>
        </div>
        <ComponentGroupDiv>
          <Autocomplete
            id="email-search-box"
            options={userList}
            getOptionLabel={(option) => option.email}
            style={{ width: 300 }}
            onInputChange={this.onSearchEmail}
            ListboxProps={{ className: styles.autocompleteList }}
            renderInput={(params) => (
              <EmailSearchBox 
                {...params}
                label="Search"
                variant="outlined" />
            )}
            InputProps={{
              classes: {
                root: classes.searchField
              }
            }}
            MenuProps={
              {
                PaperProps: {
                  style: {
                    color: "white",
                    paddingLeft: "8px",
                    borderColor: 'white'
                  }
                }
              }
            }
          />
          <Select
            value={role}
            className={classes.select}
            onChange={this.handleChange}
            input={<BootstrapInput/>}
            MenuProps={
              {
                PaperProps: {
                  style: {
                    color: "white",
                    paddingLeft: "8px",
                  }
                }
              }
            }
            inputProps={{
              classes: {
                icon: classes.icon,
              }
            }}
          >
            <MenuItem className={classes.menuItem} value={'1'}>Admin</MenuItem>
            <MenuItem className={classes.menuItem} value={'2'}>Approver</MenuItem>
          </Select>
          <EventButton className={classes.button} onClick={this.onAddMember}>Add</EventButton>
          <br />
        </ComponentGroupDiv>
        <ReactTable
          data={this.state.listMembers}
          className="-striped -highlight"
          defaultPageSize={10}
          columns={[
            {
              Header: "First Name",
              accessor: "first_name",
              width: 100,
            },
            {
              Header: "Last Name",
              accessor: "last_name",
              width: 100,
            },
            {
              Header: "Email",
              accessor: "email",
            },
            {
              Header: "Phone Number",
              accessor: "phonenumber",
              width: 150,
            },
            {
              Header: "Role",
              className: "v-c",
              id: "role",
              width: 100,
              accessor: (r) => (
                <RoleComponent 
                  param={r}
                  isRoleEditing={this.state.isRoleEditing[this.state.listMembers.indexOf(r)]}
                  index={this.state.listMembers.indexOf(r)}
                  change={this.roleChangeHandle}
                ></RoleComponent>
              )
            },
            {
              Header: "Actions",
              width: 200,
              className: "v-c",
              id: "actions",
              accessor: (r) => (
                <ActionComponent 
                  r={r} 
                  isRoleEditing={this.state.isRoleEditing[this.state.listMembers.indexOf(r)]}
                  index={this.state.listMembers.indexOf(r)}
                  remove={this.remove}
                  edit={this.editRole}
                  cancel={this.cancelEditRole}
                  confirm={this.confirmEditRole}
                />
              ),
            },
          ]}
        />
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    userList: state.member.userList,
    committee: state.member.committee,
    selected_organizer: state.Organizer.selected_my_organizer
  };
}

export default connect(mapStateToProps, { getUserList, setUserList, removeUser })(
  withRouter(withStyles(styles, { withTheme: true })(MembersPage))
);
