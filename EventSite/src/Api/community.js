import { getAPI, postAPI } from './base';

export async function createCommunity(data) {
  return await postAPI('community', data);
}

export async function getCommunities(){
  return await getAPI('community');
}

export async function getCommunityDetail(id){
  return await getAPI(`community/${id}`);
}
