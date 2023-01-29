import {
  SET_SEARCH_DATA,
  CLEAR_SEARCH_DATA
} from '../Type';

const INITIAL = {
  data: []
}

export default (state = INITIAL, action) => {
  switch (action.type) {
    case SET_SEARCH_DATA: {
      return {
        ...state, data: action.data
      };
    }
    case CLEAR_SEARCH_DATA: {
      return {
        ...state, data: []
      }
    }
    default:
      return state;
  }
} 
