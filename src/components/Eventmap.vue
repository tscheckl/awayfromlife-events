<template>
  <div class="map-container">
    <v-map :zoom="zoom" :center="center">
      <v-tilelayer :url="url" :attribution="attribution" ></v-tilelayer>
      <v-marker v-for="marker in markers" :lat-lng="marker.coords" :icon="icon"></v-marker>
      <v-circle :radius="500" :lat-lng="center" v-on:l-click="showInfo" :icon="this.icon">
        <v-popup content="Circle"></v-popup>
      </v-circle>
    </v-map>
  </div>
</template>

<script type="text/javascript">
  import Vue2Leaflet from 'vue2-leaflet'
  import iconpng from './favicons.png'

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
      'v-popup': Vue2Leaflet.Popup
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
      }
    }
  }
</script>

<style>
@import "~leaflet/dist/leaflet.css";

.map-container {
  height: 500px;
}
</style>
