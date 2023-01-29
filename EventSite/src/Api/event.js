import { getAPI, postAPI } from './base';

export async function createEvent(data) {
  return await postAPI('event', data);
}

export async function getPublicEvents(){
  return await getAPI('event/public');
}

export async function getEvents(){
  return await getAPI('event');
}

export async function getEventDetail(id){
  return await getAPI(`event/detail/${id}`);
}

export async function searchEvents(data) {
  return await postAPI('event/search', data)
}

export async function getMyEvents(){
  return await getAPI('event/mine');
}