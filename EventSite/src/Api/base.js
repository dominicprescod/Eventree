import axios from 'axios';

import config from '../Config';

let store;

function getHeader() {
  let state = store.getState()
  const { token } = state.Auth;
  return {
    headers: {
      'Content-Type': 'application/json',
      'Authorization' : `Bearer ${token}`,
    }
  };
}

export function setStore(appStore) {
  store = appStore;
}

export async function getAPI(url) {
  try {
    let result = await axios.get(`${config.server_root_url}/${url}`, getHeader());
    result = result && result.data
    
    return result;
  } catch (error) {
    if (error.response) {
      return error.response.data;
    }
    console.log(error);
    throw error;
  }
}

export async function postAPI(url, data) {
  try {
    let result = await axios.post(`${config.server_root_url}/${url}`, data, getHeader());
    result = result && result.data
    
    return result;
  } catch (error) {
    if (error.response) {
      return error.response.data;
    }
    console.log(error);
    throw error;
  }
}

export async function formPostAPI(url, data) {
  const header = getHeader()
  header.headers['Content-Type'] = 'multipart/form-data';

  try {
    let result = await axios.post(`${config.server_root_url}/${url}`, data, header);
    result = result && result.data
    console.log('---------formPostApi------', result);
    return result;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function uploadAPI(url, file) {
  const header = getHeader()
  header.headers['Content-Type'] = 'multipart/form-data';
  
  const formData = new FormData();
  formData.append('file', file)
  try {
    let result = await axios.post(`${config.server_root_url}/${url}`, formData, header);
    result = result && result.data
    
    return result;
  } catch (error) {
    console.log(error);
    throw error;
  }
}
