<template>
  <div class="map-container">
	<top-bar>
		<md-button id="newLocation" class="md-flat new-location-btn" v-on:click="openDialog('newLocationDialog')"> <i class="material-icons ">add</i> Create new Location</md-button>
	</top-bar>

    <v-map :zoom="zoom" :center="center">
      <v-tilelayer :url="url" :attribution="attribution" ></v-tilelayer>
      <v-marker v-for="marker in markers" :lat-lng="marker.coords" :icon="icon" :key="marker.coords"></v-marker>
      <v-circle :radius="500" :lat-lng="center" v-on:l-click="showInfo" :icon="this.icon">
        <v-popup content="Circle"></v-popup>
      </v-circle>
    </v-map>

	<md-dialog ref="newLocationDialog"  md-open-from="#newLocation" md-close-to="#newLocation">
			<new-location></new-location>
		</md-dialog>
  </div>
</template>

<script type="text/javascript">
  import Vue2Leaflet from 'vue2-leaflet'
  import iconpng from './favicons.png'
  import TopBar from './TopBar'
  import NewLocation from './NewLocation'

  export default {
    title: 'eventmap',
    components: {
      'v-map': Vue2Leaflet.Map,
      'v-tilelayer' :Vue2Leaflet.TileLayer,
      'v-circle': Vue2Leaflet.LCircle,
      'v-marker': Vue2Leaflet.Marker,
      'v-poly': Vue2Leaflet.Polyline,
      'v-group': Vue2Leaflet.LayerGroup,
      'v-tooltip': Vue2Leaflet.Tooltip,
	  'v-popup': Vue2Leaflet.Popup,
	  TopBar,
	  NewLocation
    },
    data() {
      return {
        zoom: 13,
        center: [49.8987300, 10.9006700],
        url: 'http://{s}.tile.osm.org/{z}/{x}/{y}.png',
        attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors',
        markers: [
          {
            coords: L.latLng(49.9, 10.950000),
            data: {
              address: {
                streetname : 'Koburger Straße 5',
                city: '04275 Leipzig',
              },
              name : 'Conne Island'
            }
          }, 
          {
            coords: L.latLng(49.8, 10.950000)
          },
          {
            coords: L.latLng(49.8, 11.0000)
          }
        ],
        icon: L.icon({
                iconUrl: iconpng,
                shadowUrl: ''
              })
      }
    },
    methods: {
		showInfo(event) {
			console.log("test");
			alert(event.latLng);
			console.log(this.icon);
		},
		openDialog(ref) {
			this.$refs[ref].open();
		},
		closeDialog(ref) {
			this.$refs[ref].close();
		},
	}
  }
</script>

<style>
@import "~leaflet/dist/leaflet.css";

.map-container {
  height: 500px;
}

.leaflet-container {
	z-index: 0;
}

.new-location-btn {
	font-weight: bold;
}
</style>
