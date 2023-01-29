import { uploadAPI } from './base';

export async function uploadImage(file){
  return await uploadAPI('media/upload', file);
}