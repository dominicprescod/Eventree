import { GET_COMMUNITIES, GET_COMMUNITIES_SUCCESS } from '../Type';

const INITIAL = {
	communities: []
}

export default (state = INITIAL, action) => {
	switch (action.type) {
		case GET_COMMUNITIES: {
			return {
				...state,
			}
		}
		case GET_COMMUNITIES_SUCCESS: {
      return { 
        ...state, 
        communities: action.data
      };
		}
		default:
			return state;
	}
}