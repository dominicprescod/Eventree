import {
  DO_FOLLOW,
	GET_MY_RELATION
} from '../Type';
  
export const getMyRelation = () => {
  return {
    type: GET_MY_RELATION,
    data: {}
  }
}

export const doFollow = (user_id) => {
  return {
    type: DO_FOLLOW,
    data: { user_id }
  }
}
