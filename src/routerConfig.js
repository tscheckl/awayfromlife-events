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
import EventsSearch from '@/components/Search/EventsSearch';
import EventPage from '@/components/SingleContentPages/EventPage';
import FestivalPage from '@/components/SingleContentPages/FestivalPage';
import LocationPage from '@/components/SingleContentPages/LocationPage';
import BandPage from '@/components/SingleContentPages/BandPage';
import FormWrapper from '@/components/NewContent/FormWrapper';
import NotFound from '@/components/NotFound';

export default new Router({
	mode: 'history',
	routes: [
		{
			path: '/',
			component: EventsSearch,
			meta: {
				title: 'Home'
			}
		},
		{
			path: '/search',
			component: EventsSearch,
			meta: {
				title: 'Search'
			}
		},
		{
			path: '/events',
			component: EventsList,
			meta: {
				title: 'Events'
			}
		},
		{
			path: '/archived-events',
			component: EventsArchive,
			meta: {
				title: 'Events Archive'
			}
		},
		{
			path: '/event/:url',
			component: EventPage,
			meta: {
				title: 'Event Detail Page',
				category: 'Event'
			}
		},
		{
			path: '/festivals',
			component: FestivalsList,
			meta: {
				title: 'Festivals'
			}
		},
		{
			path: '/festival/:url',
			component: FestivalPage,
			meta: {
				title: 'Festival Detail Page',
				category: 'Festival'
			}
		},
		{
			path: '/locations',
			component: LocationsList,
			meta: {
				title: 'Locations'
			}
		},
		{
			path: '/location/:url',
			component: LocationPage,
			meta: {
				title: 'Location Detail Page',
				category: 'Location'
			}
		},
		{
			path: '/bands',
			component: BandsList,
			meta: {
				title: 'Bands'
			}
		},
		{
			path: '/band/:url',
			component: BandPage,
			meta: {
				title: 'Band Detail Page',
				category: 'Band'
			}
		},
		{
			path: '/new-event',
			component: FormWrapper,
			props: {
				formType: 'new-event'
			},
			meta: {
				title: 'New Event',
			}
		},
		{
			path: '/calendar',
			component: EventCalendar,
			meta: {
				title: 'Event Calendar'
			}
		},
		{
			path: '/event-map',
			component: Eventmap,
			meta: {
				title: 'Event Map'
			}
		},
		{
			path: '/login',
			component: Login,
			meta: {
				title: 'Login'
			}
		},
		{
			path: '/admin',
			component: Admin,
			meta: {
				title: 'Admin Area'
			}
		},
		{
			path: '/bug-report',
			component: BugReport,
			meta: {
				title: 'Report A Bug'
			}
		},
		{
			path: '/not-found',
			component: NotFound,
			meta: {
				title: '404 Page Not Found'
			}
		}
	]
})
