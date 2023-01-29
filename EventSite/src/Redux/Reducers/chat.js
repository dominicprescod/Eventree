import {
  GET_CHATS,
} from '../Type';

const INITIAL = {
	chats:[],
}

export default (state = INITIAL, action) => {
  switch (action.type) {
    case GET_CHATS: {
      return { 
        ...state, chats: action.data
      };
    }
    default:
      return state;
  }
} 
