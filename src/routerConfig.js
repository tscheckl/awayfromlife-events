import Router from 'vue-router'
import NewEvent from '@/components/NewEvent'
import NewLocation from '@/components/NewLocation'
import EventCalendarOld from '@/components/EventCalendarOld'
import EventCalendar from '@/components/EventCalendar'
import Eventmap from '@/components/Eventmap'

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
		path: '/calendar-old',
		component: EventCalendarOld
	},
	{
		path: '/calendar',
		component: EventCalendar
	},
	{
		path: '/event-map',
		component: Eventmap
	}
  ]
})
