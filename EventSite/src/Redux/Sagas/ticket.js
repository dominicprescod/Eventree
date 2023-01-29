import {
  GET_MY_TICKETS, GET_MY_TICKETS_SUCCESS,
} from '../Type';
import { takeLatest, put } from 'redux-saga/effects';

import {
  getMyTickets as getMyTicketsApi,
} from '../../Api';

function* getMyTickets(payload){
  try {
    const result = yield getMyTicketsApi();
    if (result && result.data) {
      yield put({ type: GET_MY_TICKETS_SUCCESS, data: result.data })
    }
  } catch (err) {
    console.log("Error Getting My Events: ", err);
  }
}

export function* watchGetMyTickets(){
  yield takeLatest(GET_MY_TICKETS, getMyTickets)
}