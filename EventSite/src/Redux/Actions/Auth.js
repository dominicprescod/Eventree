import {
  AUTH_SIGN_IN,
  AUTH_SCHEDULE_UPDATE_TOKEN,
  AUTH_LOGOUT,
  AUTH_SIGNUP,
  AUTH_ACTIVATE,
  AUTH_SOCIAL_SIGN_IN,
  SET_PROFILE_UPDATE,
  AUTH_SIGNUP_CLEARED,
  RESET_PASSWORD,
  SET_LOGGED_TRUE
} from "../Type"

export const signIn = (data) => {
  return {
    type: AUTH_SIGN_IN,
    data: data
  }
}

export const updateToken = () => {
  return {
    type: AUTH_SCHEDULE_UPDATE_TOKEN,
    data: {}
  }
}

export const logOut = () => {
  return {
    type: AUTH_LOGOUT,
    data: {}
  }
}

export const signUp = (data) => {
  return {
    type: AUTH_SIGNUP,
    data: data
  }
}

export const signUpClearFlag = () => {
  return {
    type: AUTH_SIGNUP_CLEARED,
    data: {}
  }
}

export const activate = (data) => {
  return {
    type: AUTH_ACTIVATE,
    data: data
  }
}

export const socialSignIn = (data) => {
  return {
    type: AUTH_SOCIAL_SIGN_IN,
    data: data
  }
}

export const updateProfile = (data) => {
  return {
    type: SET_PROFILE_UPDATE,
    data: data
  }
}

export const resetPassword = (data) => {
  return {
    type: RESET_PASSWORD,
    data: data
  }
}

export const setLoggedTrue = () => {
  return {
    type: SET_LOGGED_TRUE,
    data: {}
  }
}
