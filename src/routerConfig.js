import Router from 'vue-router'
import EventCalendar from '@/components/Calendar/EventCalendar'
import Eventmap from '@/components/Eventmap'
import Login from '@/components/Admin/Login'
import Admin from '@/components/Admin/Admin'
import BugReport from '@/components/BugReport'
import EventsList from '@/components/ContentLists/EventsList'

export default new Router({
  routes: [
    {
      	path: '/',
      	component: EventCalendar
	},
	{
		path: '/events',
		component: EventsList
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
