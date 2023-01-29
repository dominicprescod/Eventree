import {REHYDRATE} from 'redux-persist';
import jwtDecode from 'jwt-decode';
import {
  AUTH_SIGN_IN,
  AUTH_SIGN_IN_SUCCESS,
  AUTH_SIGN_IN_FAIL,
  AUTH_SIGNUP_CLEARED,
  AUTH_UPDATE_TOKEN,
  AUTH_EXPIRED,
  AUTH_LOGOUT,
  AUTH_LOGOUT_SUCCESS,
  AUTH_SIGNUP,
  AUTH_SIGNUP_SUCCESS,
  AUTH_SIGNUP_FAILED,
  AUTH_ACTIVATE,
  AUTH_SOCIAL_SIGN_IN,
  SET_PROFILE_UPDATE,
  SET_PROFILE_UPDATE_SUCCESS,
  SET_PROFILE_UPDATE_FAILED,
  RESET_PASSWORD,
  RESET_PASSWORD_FAIL,
  RESET_PASSWORD_SUCCESS,
  SET_LOGGED_TRUE
} from '../Type';

const INITIAL = {
  loading: false,
  loggedin: false,
  isSignUp: false,
  token: null,
  refresh_token: null,
  me: null,
  messages: null,
  isResetPassword : false,
}

export default (state = INITIAL, action) => {
  switch (action.type) {
    case REHYDRATE: {
      if (!action.payload) return state;
      
      const {Auth} = action.payload;
      let {loggedin, token, refresh_token, me} = Auth;
      if (loggedin && token) {
        const decoded = jwtDecode(token);
        if (decoded.exp < Date.now() / 1000) {
          loggedin = false;
          token = null;
          refresh_token = null;
          me = null;
        }
      }
      return {
        ...Auth,
        loggedin,
        token,
        refresh_token,
        me,
      };
    }
    
    case AUTH_SIGN_IN:
    case AUTH_SOCIAL_SIGN_IN:
    case AUTH_SIGNUP:
    case AUTH_LOGOUT:
    case AUTH_ACTIVATE:
    case RESET_PASSWORD:
    case SET_PROFILE_UPDATE : {
      return {
        ...state, loading: true, messages: null
      }
    }
    case AUTH_SIGNUP_SUCCESS: {
      const {user, token, refresh_token} = action.data;
      console.log('------responsse_e------', action.data);
      let errors;
      if (action.errors === undefined) {
      } else {
        errors = action.errors[0];
      }
      const userActivated = !!token
      console.log('----activated-----', token, '-------', userActivated);
      let messages = [];
      if (errors) {
        messages.push(errors.message);
      }
      return {
        ...state,
        loading: false,
        loggedin: false,
        isSignUp: true,
        token,
        refresh_token,
        me: user,
        messages: messages ? messages : null
      };
    }
    case RESET_PASSWORD_SUCCESS: {
      console.log('----------reset_password_success-----', action.data);
      const {user, token, refresh_token, message} = action.data;
      
      const userActivated = !!token
      
      let messages = [];
      messages.push(message);
      
      return {
        ...state,
        loading: false,
        loggedin: false,
        isResetPassword: true,
        token,
        refresh_token,
        me: user,
        messages: messages ? messages : null
      };
    }
    case AUTH_SIGN_IN_SUCCESS: {
      const {user, token, refresh_token} = action.data;
      let errors;
      if (action.errors === undefined) {
      } else {
        errors = action.errors[0];
      }
      const userActivated = !!token
      
      let messages = [];
      if (errors) {
        messages.push(errors.message);
      }
      return {
        ...state,
        loading: false,
        loggedin: userActivated,
        token,
        refresh_token,
        me: user,
        messages: messages ? messages : null
      };
    }
    case SET_PROFILE_UPDATE_SUCCESS: {
      const {user} = action.data;
      console.log('------responsse_e------', action.data);
      let errors;
      if (action.errors === undefined) {
      } else {
        errors = action.errors[0];
      }
      
      let messages = [];
      if (errors) {
        messages.push(errors.message);
      }
      return {
        ...state,
        loading: false,
        loggedin: true,
        me: user,
        messages: messages ? messages : null
      };
    }
    
    case SET_LOGGED_TRUE : {
      return {
        ...state,
        loggedin: true,
      };
    }
    case RESET_PASSWORD_FAIL:
    case AUTH_SIGNUP_FAILED:
    case AUTH_SIGN_IN_FAIL:
    case SET_PROFILE_UPDATE_FAILED : {
      const {errors} = action;
      let messages = [];
      for (var i = 0; i < errors.length; i++) {
        messages.push(errors[i].message)
      }
      if (messages.length === 0) {
        messages.push('Unknown error')
      }
      
      return {...state, loading: false, messages: messages}
    }
    case AUTH_UPDATE_TOKEN: {
      const {user, token, refresh_token} = action.data;
      return {...state, loggedin: true, token, refresh_token, me: user};
    }
    case AUTH_EXPIRED:
    case AUTH_LOGOUT_SUCCESS: {
      return {
        ...state,
        loading: false,
        loggedin: false,
        token: null,
        isSignUp: false,
        refresh_token: null,
        isResetPassword: false,
        me: null,
        messages: null
      };
    }
    case AUTH_SIGNUP_CLEARED : {
      return {...state, isSignUp: false}
    }
    default:
      return state;
  }
}
