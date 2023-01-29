import { all, fork } from 'redux-saga/effects';
import {
	watchSignin,
	watchSignout,
	watchSignup,
	watchActivate,
	watchSocialSignin,
	watchUpdateProfile,
	watchResetPassword,
} from './Auth';
import { watchGetCommunities } from './community';
import { watchGetEvents, watchGetMyEvents } from './event';
import { watchGetPaymentHistory } from './payment';
import { watchDoFollow, watchGetMyRelation } from './relation';
import { watchGetMyTickets } from './ticket';
// import {watchUpdateProfile} from "./profile";

export default function* rootSaga() {
	yield all([
		// Auth
		fork(watchSignin),
		fork(watchSignup),
		fork(watchSignout),
		fork(watchSocialSignin),
		fork(watchActivate),
		fork(watchResetPassword),

		// Event
		fork(watchGetEvents),
		fork(watchGetMyEvents),

		//relation
		fork(watchDoFollow),
		fork(watchGetMyRelation),

		//community
		fork(watchGetCommunities),

		//payment
		fork(watchGetPaymentHistory),

		//ticket
		fork(watchGetMyTickets),
		
		//profile
		fork(watchUpdateProfile)
	]);
}
