import {
  SET_SEARCH_DATA,
  CLEAR_SEARCH_DATA
} from '../Type';

export const setSearchData = (data) => {
  return {
    type: SET_SEARCH_DATA,
    data: data
  }
}

export const clearSearchData = () => {
  return {
    type: CLEAR_SEARCH_DATA,
    data: {}
  }
}
