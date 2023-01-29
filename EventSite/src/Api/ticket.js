import { getAPI, postAPI } from './base';

export async function getMyTickets(){
  return await getAPI('ticket');
}

export async function checkTicketLimit(data) {
  return await postAPI('ticket/checkTicketLimit', data)
}

export async function buyOnEvent(data) {
  return await postAPI('ticket/buyOnEvent', data)
}

export async function sendToFriend(data){
  return await postAPI('ticket/sendToFriend', data);
}

export async function buyOnMarket(data){
  return await postAPI('ticket/buyOnMarket', data);
}

export async function deleteTicket(ticket_id){
  return await postAPI(`ticket/delete/${ticket_id}`);
}