import { SIDEMENU_TOGGLE } from '../Type';

export const toggleSidemenu = (isOpen) => {
  return {
    type: SIDEMENU_TOGGLE,
    data: { isOpen }
  }
}