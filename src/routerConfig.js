import Router from 'vue-router'
import NewEvent from '@/components/NewEvent'
import NewLocation from '@/components/NewLocation'
import EventCalendarOld from '@/components/EventCalendarOld'
import EventCalendar from '@/components/EventCalendar'
import EventMap from '@/components/EventMap'

export default new Router({
  routes: [
    {
      	path: '/',
      	component: NewEvent
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
		component: EventMap
	}
  ]
})
