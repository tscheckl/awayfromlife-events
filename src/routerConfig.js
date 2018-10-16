import Router from 'vue-router'
import EventCalendar from '@/components/Calendar/EventCalendar';
import Eventmap from '@/components/Eventmap';
import Login from '@/components/Admin/Login';
import Admin from '@/components/Admin/Admin';
import BugReport from '@/components/BugReport';
import EventsList from '@/components/ContentLists/EventsList';
import EventsArchive from '@/components/ContentLists/EventsArchive';
import LocationsList from '@/components/ContentLists/LocationsList';
import FestivalsList from '@/components/ContentLists/FestivalsList';
import BandsList from '@/components/ContentLists/BandsList';
import EventsSearch from '@/components/ContentLists/EventsSearch';
import EventPage from '@/components/SingleContentPages/EventPage';
import FestivalPage from '@/components/SingleContentPages/FestivalPage';
import LocationPage from '@/components/SingleContentPages/LocationPage';
import BandPage from '@/components/SingleContentPages/BandPage';
import NotFound from '@/components/NotFound';

export default new Router({
	mode: 'history',
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
		path: '/event/:url',
		component: EventPage
	},
	{
		path: '/archived-event/:url',
		component: EventPage
	},
	{
		path: '/festivals',
		component: FestivalsList
	},
	{
		path: '/festival/:url',
		component: FestivalPage
	},
	{
		path: '/locations',
		component: LocationsList
	},
	{
		path: '/location/:url',
		component: LocationPage
	},
	{
		path: '/bands',
		component: BandsList
	},
	{
		path: '/band/:url',
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
  },
  {
	  path: '/not-found',
	  component: NotFound
  }
  ]
})
