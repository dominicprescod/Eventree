import { GET_PAYMENT_HISTORY, GET_PAYMENT_HISTORY_SUCCESS } from '../Type';
import { takeLatest, put } from 'redux-saga/effects';
import {
  getPaymentHistory as getPaymentHistoryApi,
} from '../../Api';

function* getPaymentHistory(payload){
	try {
		const result = yield getPaymentHistoryApi()
		if (result && result.data) {
			yield put({ type: GET_PAYMENT_HISTORY_SUCCESS, data: result.data })
		} 
	} catch (err) {
		console.log("GET PAYMENT HISTORY ERR: ", err);
	}
}

export function* watchGetPaymentHistory(){
	yield takeLatest(GET_PAYMENT_HISTORY, getPaymentHistory)
}