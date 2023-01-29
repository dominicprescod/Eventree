import {
  DO_FOLLOW,
  DO_FOLLOW_FAIL,
  DO_FOLLOW_SUCCESS,
  GET_MY_RELATION,
  GET_MY_RELATION_FAIL,
  GET_MY_RELATION_SUCCESS,
} from '../Type';

const INITIAL = {
  followers: [],
  following: [],

	follow_loading: false,
}

export default (state = INITIAL, action) => {
  switch (action.type) {
    case GET_MY_RELATION:
    case GET_MY_RELATION_FAIL: {
      return { 
        ...state
      };
    }
    case DO_FOLLOW: {
      return {
        ...state, follow_loading: true
      }
    }
    case DO_FOLLOW_FAIL: {
      return {
        ...state, follow_loading: false
      }
    }
    case GET_MY_RELATION_SUCCESS: 
    case DO_FOLLOW_SUCCESS: {
      const { followers, following } = action.data;
      return {
        ...state,
        followers,
        following,
        follow_loading: false
      }
    }
    default:
      return state;
  }
} 
