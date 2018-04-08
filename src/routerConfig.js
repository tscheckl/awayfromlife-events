import Router from 'vue-router'
import EventCalendar from '@/components/Calendar/EventCalendar';
import Eventmap from '@/components/Eventmap';
import Login from '@/components/Admin/Login';
import Admin from '@/components/Admin/Admin';
import BugReport from '@/components/BugReport';
import EventsList from '@/components/ContentLists/EventsList';
import LocationsList from '@/components/ContentLists/LocationsList';
import BandsList from '@/components/ContentLists/BandsList';
import EventsSearch from '@/components/ContentLists/EventsSearch';

export default new Router({
  routes: [
    {
      	path: '/',
      	component: EventsList
	},
	{
		path: '/search',
		component: EventsSearch
	},
	{
		path: '/events',
		component: EventsList
	},
	{
		path: '/locations',
		component: LocationsList
	},
	{
		path: '/bands',
		component: BandsList
	},
	{
		path: '/calendar',
		component: EventCalendar
	},
	{
		path: '/event-map',
		component: Eventmap
	},
	{
		path: '/login',
		component: Login
	},
	{
		path: '/admin',
		component: Admin,
  },
  {
    path: '/bug-report',
    component: BugReport
  }
  ]
})
