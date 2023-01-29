import {postAPI, formPostAPI} from './base';

export async function updateProfile(data) {
  return await postAPI('profile/update', data);
}

