import {
  GET_PAYMENT_HISTORY,
  GET_PAYMENT_HISTORY_SUCCESS,
} from '../Type';

const INITIAL = {
	payment_history:[],
}

export default (state = INITIAL, action) => {
  switch (action.type) {
    case GET_PAYMENT_HISTORY: {
      return { 
        ...state
      };
    }
		case GET_PAYMENT_HISTORY_SUCCESS: {
			return {
				...state,
				payment_history: action.data,
			}
		}
    default:
      return state;
  }
} 
