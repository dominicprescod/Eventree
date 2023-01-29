import { getAPI } from './base';

export async function getPaymentHistory(){
  return await getAPI(`payment/history`);
}