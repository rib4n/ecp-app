<template>
  <div class="here-map">
    <div ref="map" id="map"></div>
  </div>
</template>

<script>
/* eslint-disable */
import axios from 'axios'
let markers = {
  parkingSpots: {}
};
try {
  markers.parkingSpots.available = require('../assets/markers/availableParkingSpot.svg')
  markers.parkingSpots.unavailable = require('../assets/markers/unavailableParkingSpot.svg')
} catch (err) {
  console.log(err);
}

// generic get-request to BFF
let getRequest = async (url) => {
  try {
    return await axios.get(url, {headers: {accept: 'application/json'}})
      .then(res => {
        return res;
      })
      .catch(err => {
        throw(err)
      })
  } catch (err) {
    console.log(err)
  }
}
// get parking spots at specific location in radius
let getParkingSpots = async (lat, lng, radius) => {
  let location = lat + ';' + lng
  let res = await getRequest(`https://ecp-bff.cm.tm.kit.edu/parkingSpot?location=${location}&radius=${radius}`)
  if (res.data.content) {
    return res.data.content
  }
}
let createMarker = (availability, lat, lng) => {
  // Create an icon, an object holding the latitude and longitude, and a marker:

  let icon = new H.map.Icon(availability ? markers.parkingSpots.available : markers.parkingSpots.unavailable)
  let coords = {lat, lng}
  let marker = new H.map.Marker(coords, {icon: icon})
  return marker;
}

export default {
  name: "HereMap",
  data() {
    return {
      map: {},
      platform:{},
      router: {},
      geocoder: {},
      directions: [],
      ui: {},
      parkingSpots: []
    };
  },
  props: {
    appId: String,
    appCode: String,
    lat: String,
    lng: String
  },
  created() {
    this.platform = new H.service.Platform({
      app_id: this.appId,
      app_code: this.appCode,
      useCIT: true,
      useHTTPS: true
    });
 
    this.router = this.platform.getRoutingService();
    this.geocoder = this.platform.getGeocodingService();
    // console.log(this.platform)
  },
  async mounted() {
    var pixelRatio = window.devicePixelRatio || 1;
    let defaultLayers = this.platform.createDefaultLayers({
      tileSize: pixelRatio === 1 ? 256 : 512,
      ppi: pixelRatio === 1 ? undefined : 320
    });
    this.map = new H.Map(this.$refs.map, defaultLayers.normal.map, {
      zoom: 17,
      center: { lng: this.lng, lat: this.lat },
      pixelRatio: pixelRatio
    });
    let behavior = new H.mapevents.Behavior(
      new H.mapevents.MapEvents(this.map)
    );
    this.ui = H.ui.UI.createDefault(this.map, defaultLayers);

    // get parking spots
    this.parkingSpots = await getParkingSpots(this.lat, this.lng, 100)
    for (let parkingSpot of this.parkingSpots) {
      this.map.addObject(createMarker(parkingSpot.availability, parkingSpot.location.lat, parkingSpot.location.lon));
    }
  },
  methods: {
    getCoordinates(query) {
      return new Promise((resolve, reject) => {
        this.geocoder.geocode(
          { searchText: query },
          data => {
            if (data.Response.View[0].Result.length > 0) {
              data = data.Response.View[0].Result.map(location => {
                return {
                  lat: location.Location.DisplayPosition.Latitude,
                  lng: location.Location.DisplayPosition.Longitude
                };
              });
              resolve(data);
            } else {
              reject({ message: "No data found" });
            }
          },
          error => {
            reject(error);
          }
        );
      });
    },
    route(start, range) {
      var params = {
        mode: "fastest;car;traffic:enabled",
        range: range,
        rangetype: "time",
        departure: "now"
      };
      this.map.removeObjects(this.map.getObjects());
      this.getCoordinates(start).then(
        geocoderResult => {
          params["start"] = geocoderResult[0].lat + "," + geocoderResult[0].lng;
          this.router.calculateIsoline(
            params,
            data => {
              if (data.response) {
                var center = new H.geo.Point(
                    data.response.center.latitude,
                    data.response.center.longitude
                  ),
                  isolineCoords = data.response.isoline[0].component[0].shape,
                  linestring = new H.geo.LineString(),
                  isolinePolygon,
                  isolineCenter;
                isolineCoords.forEach(coords => {
                  linestring.pushLatLngAlt.apply(linestring, coords.split(","));
                });
                isolinePolygon = new H.map.Polygon(linestring);
                isolineCenter = new H.map.Marker(center);
                this.map.addObjects([isolineCenter, isolinePolygon]);
                this.map.setViewBounds(isolinePolygon.getBounds());
              }
            },
            error => {
              console.error(error);
            }
          );
        },
        error => {
          console.error(error);
        }
      );
    }
  }
};
</script>

<style scoped></style>