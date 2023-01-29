// import SecurityIcon from '@material-ui/icons/Security';
import AttachMoneyIcon from '@material-ui/icons/AttachMoney';
import BookIcon from '@material-ui/icons/Book';
import EventIcon from '@material-ui/icons/Event';
import CalendarTodayIcon from '@material-ui/icons/CalendarToday';
import PaymentIcon from '@material-ui/icons/Payment';
import SettingsIcon from '@material-ui/icons/Settings';
import ForumIcon from '@material-ui/icons/Forum';

// import DashboardPage from './Pages/AdminPage/DashboardPage';
import DailyIncomePage from './Pages/AdminPage/DailyIncomePage';
import EventManagePage from './Pages/AdminPage/EventManagePage';
import TicketManagePage from './Pages/AdminPage/TicketManagePage';
import CalendarPage from './Pages/AdminPage/CalendarPage';
import PaymentHistoryPage from './Pages/AdminPage/PaymentHistoryPage';
import SettingsPage from './Pages/AdminPage/SettingsPage';
import MessagePage from './Pages/AdminPage/MessagePage';

export const HeaderLinks = [
  {url: '/search', name: 'Search'},
  {url: '/create-event', name: 'Create Event'},
  {url: '/community', name: 'Community'},
];

export const AdminRoutes = [
  // { url: '/admin/dashboard', icon: SecurityIcon, menu: 'Dashboard', page: DashboardPage },
  {url: '/admin/daily-income', icon: AttachMoneyIcon, menu: 'Daily Income', page: DailyIncomePage},
  {url: '/admin/event', icon: EventIcon, menu: 'Event', page: EventManagePage},
  {url: '/admin/tickets', icon: BookIcon, menu: 'Tickets', page: TicketManagePage},
  {url: '/admin/calendar', icon: CalendarTodayIcon, menu: 'Calendar', page: CalendarPage},
  {url: '/admin/payment-history', icon: PaymentIcon, menu: 'Payment History', page: PaymentHistoryPage},
  {url: '/admin/message', icon: ForumIcon, menu: 'Message', page: MessagePage},
  {url: '/admin/settings', icon: SettingsIcon, menu: 'Settings', page: SettingsPage},
];
