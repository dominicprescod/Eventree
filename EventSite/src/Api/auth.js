import { postAPI } from './base';

export async function signin(data){
  return await postAPI('auth/login', {...data, login_type: 0});
}

export async function updateToken(data){
  return await postAPI('auth/token', data);
}

export async function logout(data){
  return await postAPI('auth/logout', data);
}

export async function signup(data){
  return await postAPI('auth/signup', {...data, login_type: 0});
}

export async function activate(data){
  return await postAPI('auth/activate', {...data, login_type: 0});
}

export async function requestActivation(data){
  return await postAPI(`auth/request_activation`, data);
}

export async function requestResetPassword(data){
  return await postAPI(`auth/request_reset_password`, data);
}

export async function resetPassword(data){
  return await postAPI('auth/reset_password', data);
}

export async function socialLogin(data) {
  return await postAPI('auth/social', { ...data, login_type: 0} );
}