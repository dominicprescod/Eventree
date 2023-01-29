import { getAPI, postAPI } from './base';

export async function getMyRelation(){
  return await getAPI(`relation`);
}

export async function doFollow(user_id){
  return await postAPI(`relation/follow/${user_id}`);
}
