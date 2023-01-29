import {
	GET_PAYMENT_HISTORY
} from '../Type';
  
export const getPaymentHistory = () => {
  return {
    type: GET_PAYMENT_HISTORY,
    data: {}
  }
}