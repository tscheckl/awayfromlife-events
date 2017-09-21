import Router from 'vue-router'
import NewEvent from '@/components/NewEvent'
import NewLocation from '@/components/NewLocation'

export default new Router({
  routes: [
    {
      	path: '/',
      	component: NewEvent
	},
	{
		path: '/locations',
		component: NewLocation
	}
  ]
})
