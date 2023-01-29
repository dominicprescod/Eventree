import {
  AUTH_SIGN_IN,
  AUTH_SIGN_IN_SUCCESS,
  AUTH_SIGN_IN_FAIL,
  AUTH_EXPIRED,
  AUTH_LOGOUT_SUCCESS,
  AUTH_LOGOUT,
  AUTH_SIGNUP,
  AUTH_SIGNUP_SUCCESS,
  AUTH_SIGNUP_FAILED,
  AUTH_ACTIVATE,
  AUTH_SOCIAL_SIGN_IN, SET_PROFILE_UPDATE_SUCCESS, SET_PROFILE_UPDATE_FAILED, SET_PROFILE_UPDATE,
  RESET_PASSWORD, RESET_PASSWORD_SUCCESS, RESET_PASSWORD_FAIL
} from '../Type';
import {takeLatest, put, select} from 'redux-saga/effects';

import {
  signin as signinApi,
  signup as signupApi,
  logout as logoutApi,
  activate as activateApi,
  socialLogin as socialLoginApi,
  updateProfile as updateProfileApi,
  resetPassword as resetPasswordApi
} from '../../Api';

const getAuth = (state) => state.Auth;

function* signin(payload) {
  try {
    const result = yield signinApi(payload.data)
    if (result && result.data) {
      if (result.data.user) {
        yield put({type: AUTH_SIGN_IN_SUCCESS, data: result.data, errors: result.errors})
      } else {
        yield put({type: AUTH_SIGN_IN_FAIL, errors: []})
      }
    } else {
      if (result && result.errors) {
        yield put({type: AUTH_SIGN_IN_FAIL, errors: result.errors})
      } else {
        yield put({type: AUTH_SIGN_IN_FAIL, errors: []})
      }
    }
  } catch (err) {
    yield put({type: AUTH_SIGN_IN_FAIL, errors: [err]})
  }
}

export function* watchSignin() {
  yield takeLatest(AUTH_SIGN_IN, signin)
}

function* signup(payload) {
  try {
    const result = yield signupApi(payload.data)
    if (result && result.data) {
      if (result.data.user) {
        yield put({type: AUTH_SIGNUP_SUCCESS, data: result.data})
      } else {
        yield put({type: AUTH_SIGNUP_FAILED, errors: []})
      }
    } else {
      if (result && result.errors) {
        yield put({type: AUTH_SIGNUP_FAILED, errors: result.errors})
      } else {
        yield put({type: AUTH_SIGNUP_FAILED, errors: []})
      }
    }
  } catch (err) {
    yield put({type: AUTH_SIGNUP_FAILED, errors: [err]})
  }
}

export function* watchSignup() {
  yield takeLatest(AUTH_SIGNUP, signup)
}

function* logout(payload) {
  try {
    const auth = yield select(getAuth)
    
    const result = yield logoutApi({refresh_token: auth.refresh_token})
    if (result && result.data) {
      yield put({type: AUTH_LOGOUT_SUCCESS})
    } else {
      if (result && result.errors) {
        yield put({type: AUTH_EXPIRED, errors: result.errors})
      } else {
        yield put({type: AUTH_EXPIRED, errors: []})
      }
    }
  } catch (err) {
    yield put({type: AUTH_EXPIRED, errors: [err]})
  }
}

export function* watchSignout() {
  yield takeLatest(AUTH_LOGOUT, logout)
}

function* activate(payload) {
  try {
    const result = yield activateApi(payload.data)
    if (result && result.data) {
      if (result.data.user && result.data.token) {
        yield put({type: AUTH_SIGN_IN_SUCCESS, data: result.data})
      } else {
        yield put({type: AUTH_SIGN_IN_FAIL, errors: []})
      }
    } else {
      if (result && result.errors) {
        yield put({type: AUTH_SIGN_IN_FAIL, errors: result.errors})
      } else {
        yield put({type: AUTH_SIGN_IN_FAIL, errors: []})
      }
    }
  } catch (err) {
    yield put({type: AUTH_SIGN_IN_FAIL, errors: [err]})
  }
}

export function* watchActivate() {
  yield takeLatest(AUTH_ACTIVATE, activate)
}

function* socialLogin(payload) {
  try {
    const result = yield socialLoginApi(payload.data)
    if (result && result.data) {
      if (result.data.user) {
        yield put({type: AUTH_SIGN_IN_SUCCESS, data: result.data})
      } else {
        yield put({type: AUTH_SIGN_IN_FAIL, errors: []})
      }
    } else {
      if (result && result.errors) {
        yield put({type: AUTH_SIGN_IN_FAIL, errors: result.errors})
      } else {
        yield put({type: AUTH_SIGN_IN_FAIL, errors: []})
      }
    }
  } catch (err) {
    yield put({type: AUTH_SIGN_IN_FAIL, errors: [err]})
  }
}

export function* watchSocialSignin() {
  yield takeLatest(AUTH_SOCIAL_SIGN_IN, socialLogin)
}


function* updateProfile(payload) {
  try {
    const result = yield updateProfileApi(payload.data)
    if (result && result.data) {
      if (result.data.user) {
        yield put({type: SET_PROFILE_UPDATE_SUCCESS, data: result.data, errors: result.errors})
      } else {
        yield put({type: SET_PROFILE_UPDATE_FAILED, errors: []})
      }
    } else {
      if (result && result.errors) {
        yield put({type: SET_PROFILE_UPDATE_FAILED, errors: result.errors})
      } else {
        yield put({type: SET_PROFILE_UPDATE_FAILED, errors: []})
      }
    }
  } catch (err) {
    yield put({type: SET_PROFILE_UPDATE_FAILED, errors: [err]})
  }
}

export function* watchUpdateProfile() {
  yield takeLatest(SET_PROFILE_UPDATE, updateProfile)
}

function* resetPassword(payload) {
  try {
    console.log('-----resetPassword-1---');
    const result = yield resetPasswordApi(payload.data)
    console.log('-----resetPassword----', result);
    if (result && result.data) {
      if (result.data.user) {
        yield put({type: RESET_PASSWORD_SUCCESS, data: result.data, errors: result.errors})
      } else {
        yield put({type: RESET_PASSWORD_FAIL, errors: []})
      }
    } else {
      if (result && result.errors) {
        yield put({type: RESET_PASSWORD_FAIL, errors: result.errors})
      } else {
        yield put({type: RESET_PASSWORD_FAIL, errors: []})
      }
    }
  } catch (err) {
    yield put({type: RESET_PASSWORD_FAIL, errors: [err]})
  }
}

export function* watchResetPassword() {
  yield takeLatest(RESET_PASSWORD, resetPassword)
}
