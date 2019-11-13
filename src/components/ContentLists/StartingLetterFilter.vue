<template>
	<div id="starting_letter_filter">
		<ul class="starting-letter-filter">
			<li v-for="i in 26" 
				:key="i" 
				:class="getLetterStateCssClass(getLetter(i))" 
				v-on:click="letterAvailable(getLetter(i)) ?filterByStartingLetter(getLetter(i)) :''">
				<span>
					{{getLetter(i)}}
				</span>
				<div :style="hideIfInactive(getLetter(i))">
					<md-icon>clear</md-icon>
				</div>
			</li>
			<li :class="getLetterStateCssClass('#')" v-on:click="letterAvailable('#') ?filterByStartingLetter('#') :''">
				<span>
					#
				</span>
				<div :style="hideIfInactive('#')">
					<md-icon >clear</md-icon>
				</div>
			</li>
		</ul>
	</div>
</template>

<script>
export default {
	name: 'starting-letter-filter',
	props: {
		contentType: {
			type: String,
			default: ''
		},
		availableLetters: {
			type: Array,
			default: () => []
		}
	},
	computed: {
		routeStartWithFilter() {
			return this.$route.query.startWith;
		}
	},
	methods: {
		getLetter(index) {
			return (index+9).toString(36).toUpperCase();
		},
		letterAvailable(letter) {
			return this.availableLetters.indexOf(letter) != -1;
		},
		getLetterStateCssClass(letter) {
			return 'start-letter-' + letter 
					+ (this.letterAvailable(letter) ?' available' :' ') //Check if there are events starting with that letter and add respective class.
					+ (this.routeStartWithFilter == letter ?' active-start-letter' :''); //Check if the letter is currently selected and add respective class.
		},
		filterByStartingLetter(letter) {
			if(this.routeStartWithFilter == letter) {
				this.clearStartLetter();
				return;
			}
			
			if(this.routeStartWithFilter)
				document.getElementsByClassName('start-letter-' + this.routeStartWithFilter)[0].classList.remove('active-start-letter');

			document.getElementsByClassName('start-letter-' + letter)[0].classList.add('active-start-letter');
			this.$emit('letter-selected', letter);
		},
		//Function for clearing one or all filters.
		clearStartLetter() {
			document.getElementsByClassName('start-letter-' + this.routeStartWithFilter)[0].classList.remove('active-start-letter');
			this.$emit('letter-selected', '');
		},
		hideIfInactive(letter) {
			return this.routeStartWithFilter == letter ? 'opacity:1;' :'opacity:0;'
		}
	}
}
</script>

<style>

</style>
