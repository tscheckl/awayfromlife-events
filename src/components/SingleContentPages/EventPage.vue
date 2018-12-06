<template>
	<div id="event_page">
		<detail-page
			contentType="event"
			:id="event._id"
			:loading="loading"
			:submitStatus="submitStatus"
			v-on:edit="openDialog('editEventDialog')">
			<md-button slot="additonal-edit-buttons" class="md-icon-button edit-button" v-if="event.canceled != 2" v-on:click="openDialog('cancelDialog')">
				<md-icon>event_busy</md-icon>
				<md-tooltip md-direction="bottom">report event as cancelled</md-tooltip>
			</md-button>

			<div slot="important-information">
				<h1 v-if="event.canceled == 2" class="cancelled-info">
					<md-icon>warning</md-icon>
					<span>THIS EVENT WAS CANCELLED</span>
					<md-icon>warning</md-icon>
				</h1>

				<h3 v-if="event.canceled == 1 && $route.path.indexOf('/event/') != -1" class="unverified-cancelled-info">
					<md-icon>warning</md-icon>
					This event was reported as cancelled but the report is not verified yet! 
				</h3>
			</div>

			
			<h2 slot="title" class="title" v-if="event.name">{{event.name}}</h2>

			<div class="detail-info">
				<div class="category">
					<svg width="40px" height="40px" viewBox="0 0 512 512" enable-background="new 0 0 512 512" xml:space="preserve">
								<path d="M462,31h-44V10.25c0-5.521-4.49-10-10-10s-10,4.479-10,10V31h-81.5V10c0-5.521-4.49-10-10-10s-10,4.479-10,10v21h-81V10     c0-5.521-4.49-10-10-10s-10,4.479-10,10v21h-81.41V10.25c0-5.521-4.49-10-10-10c-5.52,0-10,4.479-10,10V31H50     C22.43,31,0,53.43,0,81v381c0,27.57,22.43,50,50,50h412c27.57,0,50-22.43,50-50V81C512,53.43,489.57,31,462,31z M492,462     c0,16.542-13.458,30-30,30H50c-16.542,0-30-13.458-30-30V202h472V462z M492,182H20v-20h472V182z M492,142H20V81     c0-16.542,13.458-30,30-30h44.09v19.25c0,5.51,4.48,10,10,10c5.51,0,10-4.49,10-10V51h81.41v19c0,5.51,4.49,10,10,10     s10-4.49,10-10V51h81v19c0,5.51,4.49,10,10,10s10-4.49,10-10V51H398v19.25c0,5.51,4.49,10,10,10s10-4.49,10-10V51h44     c16.542,0,30,13.458,30,30V142z" fill="#ff5252"/>
						<path d="M408,100.25c-5.51,0-10,4.49-10,10s4.49,10,10,10s10-4.49,10-10S413.51,100.25,408,100.25z" fill="#ff5252"/>
						<path d="M306.5,100c-5.51,0-10,4.49-10,10s4.49,10,10,10s10-4.49,10-10S312.01,100,306.5,100z" fill="#ff5252"/>
						<path d="M205.5,100c-5.51,0-10,4.49-10,10s4.49,10,10,10s10-4.49,10-10S211.01,100,205.5,100z" fill="#ff5252"/>
						<path d="M104.09,100.25c-5.52,0-10,4.49-10,10s4.48,10,10,10c5.51,0,10-4.49,10-10S109.6,100.25,104.09,100.25z" fill="#ff5252"/>
						<path d="M167.221,418.208c8.971,8.589,22.116,12.88,39.445,12.88c16.405,0,29.706-4.14,39.905-12.42     c12.961-10.522,15.295-27.336,15.295-43.01c0-17.02-7.802-28.596-23.399-34.73c5.726-2.594,10.174-7.291,13.348-14.091     c3.173-6.796,4.762-14.777,4.762-23.941c0-27.542-16.255-41.317-48.76-41.317c-9.2,0-17.25,1.309-24.15,3.924     c-6.9,2.617-12.154,6.006-15.755,10.16c-3.604,4.158-6.25,8.431-7.936,12.814c-1.688,4.389-2.529,8.813-2.529,13.275     c0,5.035,0.956,8.428,2.875,10.182c1.915,1.754,6.095,2.631,12.535,2.631c9.505,0,14.26-3.813,14.26-11.439     c0-10.217,6.82-15.327,20.47-15.327c13.491,0,20.24,6.714,20.24,20.132c0,8.999-1.829,14.982-5.48,17.959     c-3.651,2.975-8.826,4.459-15.518,4.459c-5.938,0-8.902,3.91-8.902,11.73s2.911,11.73,8.74,11.73     c6.718,0,14.248,1.072,19.379,5.822c8.88,8.222,8.528,30.899,0.057,39.372c-3.909,3.91-10.159,5.865-18.744,5.865     c-7.36,0-13.189-1.495-17.48-4.485c-4.295-2.99-6.44-7.09-6.44-12.305c0-3.831-1.074-6.555-3.22-8.165     c-2.148-1.61-6.21-2.415-12.189-2.415c-5.215,0-8.895,0.845-11.04,2.529c-2.149,1.689-3.221,4.756-3.221,9.201     C153.766,399.963,158.251,409.623,167.221,418.208z" fill="#ff5252"/>
						<path d="M293.145,306.889c2.146,0,3.986-0.69,5.521-2.07l7.36-7.36v122.819c0,2.915,1.455,5.215,4.369,6.9     c2.911,1.689,6.44,2.53,10.58,2.53c3.985,0,7.476-0.841,10.465-2.53c2.99-1.686,4.485-3.985,4.485-6.9v-149.5     c0-2.76-1.38-5.06-4.14-6.899s-5.829-2.76-9.2-2.76c-2.3,0-4.37,0.769-6.21,2.3l-27.14,20.7c-3.835,2.454-5.75,6.06-5.75,10.81     c0,3.069,0.92,5.829,2.76,8.28C288.085,305.662,290.385,306.889,293.145,306.889z" fill="#ff5252"/>
					</svg>
					<h4>Date</h4>
				</div>
				<h4 class="date">{{event.formattedDate}}</h4>
			</div>

			<p>
				Lorem, ipsum dolor sit amet consectetur adipisicing elit. Rerum maiores doloremque ad dignissimos est, dolorum cumque iste quidem ab earum perferendis unde sunt nam sequi reiciendis sit deserunt laudantium magni aspernatur id ipsam numquam. Asperiores tempore fugit, quia harum et deleniti porro ea voluptas animi minus atque officia aut? Voluptatibus explicabo nisi non in inventore. Nam voluptatibus cumque inventore dolorum, excepturi libero dolore fugiat provident illum? Consectetur molestiae, doloremque sequi consequuntur recusandae iure. Quos adipisci itaque earum repellat libero. Iusto sequi libero praesentium sed id odit repellat enim, quos sint labore ad rem nihil consectetur possimus quaerat quam neque? Eaque necessitatibus iure praesentium neque, velit dolor sit aliquid laborum. Ipsam, illum soluta? Quidem, odio ipsa! Quidem ea deleniti ad eligendi magni? Quidem omnis corporis molestiae non ipsum unde accusamus tenetur. Voluptas et voluptate iusto beatae enim accusantium quos, saepe neque blanditiis a est doloribus asperiores odit ab deserunt vel assumenda, sed earum. Expedita laboriosam, asperiores velit rerum cupiditate delectus tempore illum fugiat at odit! In perspiciatis provident porro dolor voluptatum cum inventore reiciendis velit repellat. Quam recusandae nemo quibusdam quis eius ipsam unde amet natus commodi corporis, dolore facere fugiat, tempora molestias temporibus eos odit voluptate omnis. Perspiciatis ullam alias sit repudiandae consequatur labore, assumenda, libero non iusto ratione ea atque, laborum provident fugit cumque molestias id quae fuga quibusdam culpa voluptatem tempore harum! Minima mollitia, est placeat dolore vitae adipisci earum ad alias magnam voluptas delectus, repudiandae iste. Deleniti exercitationem tempore, sint ad quae ipsum aliquid beatae. Labore culpa soluta beatae modi necessitatibus, voluptatem laboriosam alias magnam tempora numquam deleniti veniam amet expedita perspiciatis quam nobis et nesciunt dolore vitae voluptate, esse quas impedit. Quaerat reiciendis ipsum laborum recusandae esse impedit autem eveniet, praesentium quo repellat eaque dolor deleniti iure placeat odit ea quidem quam iste dignissimos? Dolorum molestiae corrupti a distinctio doloremque corporis perferendis explicabo temporibus fugiat ex, aut, eligendi eaque reiciendis at. Vel possimus nostrum consectetur dolore cupiditate beatae quis sit quisquam nam, facilis veniam, mollitia optio nobis adipisci a quo qui ut voluptatibus, animi dolor expedita neque in. Aperiam molestiae dolore itaque in illo tenetur vitae sapiente nobis odit quas totam ab perferendis, corporis rem aliquam deserunt nisi. Consectetur deserunt nobis expedita aliquam a labore accusamus, veniam omnis, optio, minima voluptatibus nam libero veritatis sunt harum illum voluptatem praesentium dicta iure voluptates odio perferendis eius? Atque voluptas velit sapiente incidunt explicabo nam, laudantium at magnam quam et est ipsam tenetur excepturi saepe mollitia provident ad! Saepe voluptas expedita natus nisi consequatur quae debitis est dolor mollitia at laboriosam quam voluptatem fugit accusamus tempore qui, tenetur magni! Quod nemo tempora veritatis impedit. Odit at necessitatibus sapiente modi culpa quod provident dolorem, laboriosam reiciendis natus repellendus harum, voluptate quo omnis consequuntur id tempore qui voluptates quas, repellat recusandae! Consectetur illum hic minus magni ducimus alias dolorem aliquid sequi! Officia esse rerum, illo nam veritatis magni maxime voluptas aliquam beatae eligendi facilis libero quasi enim quae eum ipsa quam dignissimos sint ab exercitationem? Sapiente labore asperiores suscipit voluptatibus! Cupiditate deserunt sed aliquid doloribus architecto est earum incidunt, pariatur quia. Nam ducimus tempore magnam in perspiciatis quaerat molestias aliquid laudantium? Vero non minima aspernatur optio quas sapiente tenetur mollitia hic? Debitis et dolore odit quibusdam. Ullam ipsam, tempore natus ipsa libero qui porro doloremque officia assumenda, at sint eum. Nostrum excepturi, praesentium placeat itaque natus facere corrupti quibusdam accusantium repudiandae soluta autem cumque, distinctio dolore architecto sequi repellendus! Asperiores veritatis nemo, cum tenetur labore natus provident, nesciunt fuga doloribus fugit perferendis voluptate atque unde odit consequuntur nisi aperiam non reiciendis harum! Nisi delectus ullam, odio asperiores consectetur quos officiis enim pariatur soluta vero, excepturi placeat? Nisi, sequi? Incidunt cupiditate, velit impedit molestiae distinctio quae sint beatae ab numquam deserunt? Voluptate expedita ad exercitationem fugit libero, non fuga saepe possimus omnis distinctio laudantium, rerum numquam ut veritatis. Voluptatibus fuga perspiciatis nihil vitae veniam sequi dignissimos quasi. Dolorum, provident veritatis? Consectetur sunt assumenda, neque non voluptates maxime dolor suscipit. Alias id, reprehenderit ullam accusamus soluta accusantium dolores quam tempora sunt sequi esse aut nihil eius aspernatur molestias excepturi? Voluptates ullam voluptatem molestias, quo amet commodi illo. Quis tempore magni voluptates soluta porro sequi beatae, nemo vel recusandae molestiae esse quidem repellendus libero doloremque provident labore. Ipsa atque adipisci, omnis optio quam nostrum excepturi cupiditate modi. Architecto optio ipsam sit aspernatur! Facere earum, animi eum maxime, beatae quos minima accusamus provident unde aut tenetur ex, at minus. Officiis dignissimos neque provident a nesciunt repudiandae corrupti asperiores architecto magni beatae. Provident dolor ab eos officiis est cupiditate dicta, necessitatibus nemo fugiat! Culpa, non nisi nemo numquam eius nulla facilis blanditiis incidunt libero. Dignissimos, obcaecati facere molestiae veniam expedita odio ex facilis fugit omnis provident nihil inventore ipsam excepturi ipsum beatae natus exercitationem aliquam optio? Repellendus cumque fugit doloremque quisquam eaque eveniet, provident tenetur nulla itaque debitis veritatis impedit sequi repudiandae, ipsum voluptates obcaecati veniam! Velit sint molestias rem tempore veniam debitis, dolore nemo dolorum dolores blanditiis fuga vel reiciendis, reprehenderit laudantium temporibus, qui quaerat est quae. Doloribus animi fugit ex modi eaque dolorum harum facilis. Iste esse cum mollitia autem? In vel commodi alias suscipit facilis beatae quaerat nulla reiciendis ex iusto quia dolorum doloribus rem, molestias vitae ut tempora fugiat dolor. Vero, quia quis voluptas nisi labore, cum sapiente enim eligendi nesciunt quos accusamus, pariatur molestiae quasi voluptate mollitia tempora! Architecto voluptatibus vel quo deserunt blanditiis neque numquam eos delectus, non illum nemo unde at dignissimos voluptate, distinctio consequuntur quam culpa corrupti amet fuga voluptatem repudiandae? Doloremque labore similique sunt ducimus voluptatem, ratione tempore dolores qui explicabo molestias porro quas veniam vitae sint delectus. Voluptas sed ipsum repudiandae rem saepe sint quod tempora explicabo sunt. Fuga labore nobis aliquid, modi eos veritatis omnis delectus quibusdam voluptates similique quo illo reiciendis eius iure eligendi, distinctio placeat soluta. Dolorem distinctio quidem in aut voluptatibus, a veniam ab accusantium molestias beatae inventore sapiente nostrum laboriosam commodi cumque nemo fugit veritatis, dolores voluptatem, aliquid non eligendi harum at ratione? Alias saepe assumenda earum sed harum, rem vero!
			</p>
			<!-- <div v-if="event._id">
				<div v-if="event.location.address" class="event-location">
					<router-link :to="`/location/${event.location.url}`">
						<h3><md-icon>location_on</md-icon><span>Location</span></h3>
						<p><b>{{event.location.name}}</b></p>
						<p>{{event.location.address.street}}</p>
						<p>{{event.location.address.postcode}} {{event.location.address.city}}</p>
						<p v-if="event.location.address.county">{{event.location.address.county}}</p>
						<p>{{event.location.address.country}}</p>
					</router-link>
				</div>

				<hr>

				<h3><md-icon>queue_music</md-icon><span>Lineup</span></h3>
				<ul>
					<li v-for="band of event.bands" :key="band._id"><router-link :to="`/band/${band.url}`"><span>{{band.name}}</span></router-link></li>
				</ul>
				
				<hr>

				<div v-if="event.ticketLink" class="ticket-link">
					<h3><md-icon>receipt</md-icon>Ticket Link</h3>
					<a :href="'//' + event.ticketLink" target="_blank">{{event.ticketLink}}</a>
					<hr>
				</div>

				<div v-if="event.description">
					<h3><md-icon>format_quote</md-icon><span>Description</span></h3>
					<p>{{event.description}}</p>
				</div>
			</div> -->
			
			<div slot="edit-dialogs">
				<md-dialog ref="editEventDialog">
					<event-form :event="JSON.parse(JSON.stringify(event))" edit canSubmit v-on:submit="updateEvent" v-on:close="$refs.editEventDialog.close()">
						<h1 slot="headline">Edit Event</h1>
					</event-form>
				</md-dialog>

				<md-dialog ref="cancelDialog">
					<div class="cancel-dialog">
						<h2>Do you really want to report this event as cancelled?</h2>
						<md-icon class="yes-icon">check</md-icon>
						<md-icon class="no-icon">clear</md-icon>
						<md-button class="yes" v-on:click="reportCancel(true)">Yes</md-button>
						<md-button class="no" v-on:click="reportCancel(false)">No</md-button>
					</div>
				</md-dialog>
			</div>
		</detail-page>
	</div>
</template>

<script>
import { removeEmptyObjectFields, addBandLabels } from '@/helpers/array-object-helpers.js';

import EventForm from '@/components/ContentForms/EventForm';
import DetailPage from '@/components/SingleContentPages/DetailPage';

import {frontEndSecret, backendUrl } from '@/secrets.js';
import moment from 'moment';

export default {
	name: 'event-page-new',
	components: {
		EventForm,
		DetailPage
	},
	watch: {
		$route() {
			if(this.$route.params.url != this.event.url)
				this.getEventByUrl();
		}
	},
	computed: {
		event() {
			return JSON.parse(JSON.stringify(this.$store.getters.currentEvent));
		}
	},
	data() {
		return {
			submitStatus: '',
			isAuthenticated: false,
			backendEndpoint: 'events',
			loading: false
		}
	},
	methods: {
		openDialog(ref) {
			this.$refs[ref].open();
		},
		updateEvent(data) {
			this.$refs.editEventDialog.close();
		
			this.loading = true;

			removeEmptyObjectFields(data);
			data.date = moment(data.date).format('YYYY-MM-DD');

			this.$http.put(backendUrl + `/api/events/${data._id}`, data)
				.then(response => {
					this.getCurrentEvent('Event successfully updated!');
				})
				.catch(err =>  {
					this.submitStatus = err.body.message;
					this.$children[0].$refs.snackbar.open();
				});
		},
		getCurrentEvent(message = '') {
			this.loading = true;

			this.$http.get(backendUrl + `/api/events/byid/` + this.event._id)
				.then(response => {
					this.loading = false;
					if(response.body.data) {
						if(message != '') {
							this.submitStatus = message;
							this.$children[0].$refs.snackbar.open();
						}

						this.$store.commit('setCurrentEvent', response.body.data);
						addBandLabels(this.event);
						this.$router.push({path: `/event/${response.body.data.url}`});
						document.title = `${this.event.name}, ${moment(this.event.date).format('DD.MM.YYYY')}, ${this.event.location.name} | AWAY FROM LIFE STREETS`;
					}
				})
				.catch(err => {
					this.loading = false;
					this.submitStatus = err.body.message;
					this.$children[0].$refs.snackbar.open();
				});
		},
		reportCancel(accept) {
			document.getElementsByClassName(accept ?'yes' :'no')[0].classList.add('selected');
			document.getElementsByClassName(accept ?'yes-icon' :'no-icon')[0].classList.add('selected');
			setTimeout(() => {
				if(accept) {
					this.$http.put(backendUrl + `/api/${this.backendEndpoint}/cancel/${this.event._id}`)
					.then(response => {
						this.$refs.cancelDialog.close();
						this.submitStatus = 'Thanks for your report, we will verify it before it is visible for everyone!';
						this.$children[0].$refs.snackbar.open();
					})
					.catch(err => {
						this.$refs.cancelDialog.close();
						this.submitStatus = err.body.message;
						this.$children[0].$refs.snackbar.open();
					})
				}

				this.similarEventFound = false;
				setTimeout(() => {
					this.$refs.cancelDialog.close();
					setTimeout(() => {
						document.getElementsByClassName(accept ?'yes' :'no')[0].classList.remove('selected');
						document.getElementsByClassName(accept ?'yes-icon' :'no-icon')[0].classList.remove('selected');
					}, 200);
				},200);
			}, 500);
		},
		getEventByUrl() {
			this.loading = true;

			this.$http.get(backendUrl + `/api/${this.backendEndpoint}/byurl/` + this.$route.params.url)
			.then(response => {
				if(response.body.data) {					
					this.loading = false;
					this.$store.commit('setCurrentEvent', response.body.data);
					document.title = `${this.event.name}, ${moment(this.event.date).format('DD.MM.YYYY')}, ${this.event.location.name} | AWAY FROM LIFE STREETS`;
				}
			})
			.catch(err => this.$router.push('/not-found'));
		}
	},
	mounted() {
		if(this.$route.path.indexOf('event') != -1)
			document.getElementById('topbar').classList.add('single-page');

		let urlDate = moment(this.$route.path.split('--')[1], 'DD-MM-YYYY', true);
		
		if(urlDate.isValid() && Date.now() > moment(urlDate).format('x'))
			this.backendEndpoint = 'archived-events';
		
		
		this.$http.get(backendUrl + '/api/users/auth')
			.then(response => {
				this.isAuthenticated = true;
			})
			.catch(err => console.log(err));
			
		if(this.$store.getters.currentEvent.name == '' || (this.$store.getters.currentEvent.url != this.$route.params.url && this.$route.path == '/event'))
			this.getEventByUrl();
		else
			document.title = `${this.event.name}, ${moment(this.event.date).format('DD.MM.YYYY')}, ${this.event.location.name} | AWAY FROM LIFE STREETS`;
	}
}
</script>

<style lang="scss">
	@import "src/scss/SingleContentPages/_eventPage.scss";
</style>