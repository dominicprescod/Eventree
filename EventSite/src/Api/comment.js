import { postAPI } from './base';

export async function createComment(comment_id, data){
  return await postAPI(`comment/${comment_id}`, data);
}
