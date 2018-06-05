import Router from 'vue-router'
import EventCalendar from '@/components/Calendar/EventCalendar';
import Eventmap from '@/components/Eventmap';
import Login from '@/components/Admin/Login';
import Admin from '@/components/Admin/Admin';
import BugReport from '@/components/BugReport';
import EventsList from '@/components/ContentLists/EventsList';
import EventsArchive from '@/components/ContentLists/EventsArchive';
import LocationsList from '@/components/ContentLists/LocationsList';
import BandsList from '@/components/ContentLists/BandsList';
import EventsSearch from '@/components/ContentLists/EventsSearch';
import EventPage from '@/Components/SingleContentPages/EventPage';
import LocationPage from '@/Components/SingleContentPages/LocationPage';
import BandPage from '@/Components/SingleContentPages/BandPage';

export default new Router({
  routes: [
    {
      	path: '/',
      	component: EventsSearch
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
		path: '/archived-events',
		component: EventsArchive
	},
	{
		path: '/event/:id',
		component: EventPage
	},
	{
		path: '/locations',
		component: LocationsList
	},
	{
		path: '/location/:id',
		component: LocationPage
	},
	{
		path: '/bands',
		component: BandsList
	},
	{
		path: '/band/:id',
		component: BandPage
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
