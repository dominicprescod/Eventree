import {
  GET_CHATS
} from '../Type';
  
export const getChats = (data) => {
  return {
    type: GET_CHATS,
    data: data
  }
}
