import PersonIcon from '@material-ui/icons/Person';
import VpnKeyIcon from '@material-ui/icons/VpnKey';
import CancelIcon from '@material-ui/icons/Cancel';
import Profile from '../../../Components/Settings/Profile';
import Password from '../../../Components/Settings/Password';
import Suspend from '../../../Components/Settings/Suspend';

export const Menus = [
	{ id: 1, icon: PersonIcon, menu: 'Profile', component: Profile },
	{ id: 2, icon: VpnKeyIcon, menu: 'Password', component: Password },
	{ id: 3, icon: CancelIcon, menu: 'Close Account', component: Suspend },
];