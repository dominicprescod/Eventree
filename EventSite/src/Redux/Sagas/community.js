import {
  GET_COMMUNITIES,
  GET_COMMUNITIES_SUCCESS,
} from '../Type';
import { takeLatest, put } from 'redux-saga/effects';

import {
	getCommunities as getCommunitiesApi,
} from '../../Api';

function* getCommunities(payload){
  try {
    const result = yield getCommunitiesApi()
    if (result && result.data) {
      yield put({ type: GET_COMMUNITIES_SUCCESS, data: result.data })
    }
  } catch (err) {
    console.log("Error Getting Communities: ", err);
  }
}

export function* watchGetCommunities(){
  yield takeLatest(GET_COMMUNITIES, getCommunities)
}