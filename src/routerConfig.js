import Router from 'vue-router'
import NewEvent from '@/components/NewEvent'
import NewLocation from '@/components/NewLocation'
import EventCalendar from '@/components/EventCalendar'
import Eventmap from '@/components/Eventmap'
import LoginTest from '@/components/LoginTest'
import Login from '@/components/Login'
import Admin from '@/components/Admin'
import BugReport from '@/components/BugReport'

export default new Router({
  routes: [
    {
      	path: '/',
      	component: EventCalendar
	},
	{
		path: '/locations',
		component: NewLocation
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
		path: '/login-test',
		component: LoginTest
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
