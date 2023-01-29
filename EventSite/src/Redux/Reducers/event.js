import { GET_EVENTS, GET_EVENTS_SUCCESS, GET_MY_EVENTS, GET_MY_EVENTS_SUCCESS } from '../Type';

const INITIAL = {
	events: [],
	my_events: []
}

export default (state = INITIAL, action) => {
	switch (action.type) {
		case GET_EVENTS: 
		case GET_MY_EVENTS: {
			return {
				...state,
			}
		}
		case GET_EVENTS_SUCCESS: {
      return { 
        ...state, 
        events: action.data
      };
		}
		case GET_MY_EVENTS_SUCCESS: {
      return { 
        ...state, 
        my_events: action.data
      };
		}
		default:
			return state;
	}
}