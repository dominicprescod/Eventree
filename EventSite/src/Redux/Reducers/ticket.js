import { GET_MY_TICKETS, GET_MY_TICKETS_SUCCESS } from '../Type';

const INITIAL = {
	my_tickets: []
}

export default (state = INITIAL, action) => {
	switch (action.type) {
		case GET_MY_TICKETS: {
			return {
				...state,
			}
		}
		case GET_MY_TICKETS_SUCCESS: {
      return { 
        ...state, 
        my_tickets: action.data
      };
		}
		default:
			return state;
	}
}