<template>

<div id="app">
    
<nav class="navbar navbar-expand-lg navbar-light bg-light">
  <!-- Navbar content -->

  <a class="navbar-brand" href="#"><img src="logo.png" width=120px;></a>
     <!-- mobile view menu button -->

    <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarTogglerDemo02" aria-controls="navbarTogglerDemo02" aria-expanded="false" aria-label="Toggle navigation">
    <span class="navbar-toggler-icon"></span>
  </button>

<div class="collapse navbar-collapse" id="navbarTogglerDemo02">
    <ul class="navbar-nav mr-auto mt-2 mt-lg-0">
      <li class="nav-item active">
<!-- Button trigger modal -->
<button type="button" class="btn btn-primary" data-toggle="modal" data-target="#exampleModal">
  Filter
</button>

      </li>
    </ul>
      <form class="form-inline my-2 my-lg-0">
        <div class="form-group input-group-sm w-50">
          <input
            type="text"
            v-model="query"
            class="form-control w-100"
            id="location"
            placeholder="Starting location..."
          >
        </div>
        <div class="form-group input-group-sm mx-sm-3 w-25">
          <input
            type="text"
            v-model="range"
            class="form-control w-100"
            id="range"
            placeholder="Range"
          >
        </div>

        <button type="button" v-on:click="$refs.map.route(query, range)" class="btn btn-primary">Search</button>

        <!-- Modal -->
<div class="modal fade" id="exampleModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
  <div class="modal-dialog" role="document">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title" id="exampleModalLabel">Filter</h5>
        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
      <div class="modal-body">
        Radius: <label for="customRange1">Hier den Radius einstellen</label>
<input type="range" class="custom-range" id="customRange1">
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
        <button type="button" class="btn btn-primary">Save changes</button>
      </div>
    </div>
  </div>
</div>
      </form>
      </div>
</nav>
  
    <HereMap
      ref="map"
      appId="cdv79LSLiwhEuBmyXWIj"
      appCode="xz4vhAwTlOfZCl_PcMEc4Q"
      lat="49.011588"
      lng="8.411904"
    />
  </div>
</template>

<script>
import HereMap from "@/components/HereMap.vue";

export default {
  name: "app",
  components: {
    HereMap
  },
  data() {
    return {
      query: "",
      range: ""
    };
  },
  methods: {
    route() {
      this.$refs.map.route(this.query, this.range);
    }
  }
};
</script>

<style>
body {
  background-color: #262626;
}

#searchbar {
  position: fixed;
  z-index: 1;
  top: 10px;
  left: 50%;
  transform: translateX(-50%);
  background-color: #262626;
  padding: 15px;
  width: 50%;
  border-radius: 5px;
}

#map {
  position: fixed;
  width: 100%;
  height: 100%;
}

.slider {
  -webkit-appearance: none;
  width: 100%;
  height: 15px;
  border-radius: 5px;  
  background: #d3d3d3;
  outline: none;
  opacity: 0.7;
  -webkit-transition: .2s;
  transition: opacity .2s;
}

.slider::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 25px;
  height: 25px;
  border-radius: 50%; 
  background: #4CAF50;
  cursor: pointer;
}

.slider::-moz-range-thumb {
  width: 25px;
  height: 25px;
  border-radius: 50%;
  background: #4CAF50;
  cursor: pointer;
}
</style>
