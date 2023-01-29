import {
  GET_EVENTS, GET_EVENTS_SUCCESS, GET_MY_EVENTS, GET_MY_EVENTS_SUCCESS,
} from '../Type';
import { takeLatest, put, select } from 'redux-saga/effects';

import {
	getPublicEvents as getPublicEventsApi,
	getEvents as getEventsApi,
  getMyEvents as getMyEventsApi,
} from '../../Api';

const getAuth = (state) => state.Auth;

function* getEvents(payload){
  try {
    const auth = yield select(getAuth)
    const result = auth.loggedin ? yield getEventsApi() : yield getPublicEventsApi();
    if (result && result.data) {
      yield put({ type: GET_EVENTS_SUCCESS, data: result.data })
    }
  } catch (err) {
    console.log("Error Getting Events: ", err);
  }
}

export function* watchGetEvents(){
  yield takeLatest(GET_EVENTS, getEvents)
}

function* getMyEvents(payload){
  try {
    const result = yield getMyEventsApi();
    if (result && result.data) {
      yield put({ type: GET_MY_EVENTS_SUCCESS, data: result.data })
    }
  } catch (err) {
    console.log("Error Getting My Events: ", err);
  }
}

export function* watchGetMyEvents(){
  yield takeLatest(GET_MY_EVENTS, getMyEvents)
}