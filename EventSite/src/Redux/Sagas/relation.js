import { DO_FOLLOW, DO_FOLLOW_FAIL, DO_FOLLOW_SUCCESS, GET_MY_RELATION, GET_MY_RELATION_FAIL, GET_MY_RELATION_SUCCESS } from '../Type';
import { takeLatest, put, select } from 'redux-saga/effects';
import {
  getMyRelation as getMyRelationApi,
  doFollow as doFollowApi,
} from '../../Api';

const getAuth = (state) => state.Auth;

function* getMyRelation(payload){
	try {
		const result = yield getMyRelationApi()
		if (result && result.data) {
			yield put({ type: GET_MY_RELATION_SUCCESS, data: result.data })
		} else {
			if (result && result.errors) {
				yield put({ type: GET_MY_RELATION_FAIL, errors: [] })
			} else {
				yield put({ type: GET_MY_RELATION_FAIL, errors: [] })
			}
		}
	} catch (err) {
		yield put({ type: GET_MY_RELATION_FAIL, errors: [err] })
	}
}

export function* watchGetMyRelation(){
	yield takeLatest(GET_MY_RELATION, getMyRelation)
}

function* doFollow(payload){
	try {
		const result = yield doFollowApi(payload.data.user_id)
		const auth = yield select(getAuth)
		if (result && result.data) {
			yield put({ type: DO_FOLLOW_SUCCESS, data: { ...result.data, follow_user_id: payload.data.user_id, my_id: auth.me.id } })
		} else {
			if (result && result.errors) {
				yield put({ type: DO_FOLLOW_FAIL, errors: [] })
			} else {
				yield put({ type: DO_FOLLOW_FAIL, errors: [] })
			}
		}
	} catch (err) {
		yield put({ type: DO_FOLLOW_FAIL, errors: [err] })
	}
}

export function* watchDoFollow(){
	yield takeLatest(DO_FOLLOW, doFollow)
}