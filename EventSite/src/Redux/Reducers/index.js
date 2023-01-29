import { combineReducers } from 'redux';

import Auth from './Auth';
import Sidemenu from './Sidemenu';
import event from './event';
import search from './search';
import relation from './relation';
import community from './community';
import payment from './payment';
import ticket from './ticket';
import chat from './chat';
// import profile from './profile';

export default combineReducers ({
  Auth,
  Sidemenu,
  event,
  search,
  relation,
  community,
  payment,
  ticket,
  chat,
  // profile
})
