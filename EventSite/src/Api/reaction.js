import { postAPI } from './base';

export async function reaction(data){
  return await postAPI(`reaction`, data);
}
