let restaurants,
  neighborhoods,
  cuisines
var map
var markers = []

// the function that will change the body depending on the pathname

if(window.location.search == ''){
  document.body.innerHTML = `<header>
    <nav>
      <h1><a href="/">Restaurant Reviews</a></h1>
    </nav>
  </header>

  <main id="maincontent">
    <section id="map-container">
      <div aria-label="Map" id="map"></div>
    </section>
    <section>
      <div class="filter-options">
        <h2>Filter Results</h2>
        <select id="neighborhoods-select" name="neighborhoods" onchange="updateRestaurants()">
          <option value="all">All Neighborhoods</option>
        </select>
        <select id="cuisines-select" name="cuisines" onchange="updateRestaurants()">
          <option value="all">All Cuisines</option>
        </select>
      </div>
      <ul id="restaurants-list"></ul>
    </section>
  </main>
  <script type="application/javascript" charset="utf-8" src="js/db_helper.js"></script>
  <script type="application/javascript" charset="utf-8" src="js/main.js"></script>
  <script async defer src="https://maps.googleapis.com/maps/api/js?key=AIzaSyB4qBTSKTKc20_SypgjCZsQ8E5d16CsIWM&libraries=places&callback=initMap"></script>


  <footer id="footer">
    Copyright (c) 2017 <a href="/"><strong>Restaurant Reviews</strong></a> All Rights Reserved.
  </footer>`

  /**
  * Fetch neighborhoods and cuisines as soon as the page is loaded.
  */

  document.addEventListener('DOMContentLoaded', (event) => {
    fetchNeighborhoods();
    fetchCuisines();
    initializeMap();
  });

}

else {
  document.body.classList.add('inside');
  document.getElementById('content').innerHTML =   `<!-- Beginning header -->
  <header>
    <!-- Beginning nav -->
    <nav aria-label="Breadcrumb">
      <h1><a href="/">Restaurant Reviews</a></h1>
          <!-- Beginning breadcrumb -->
      <ol id="breadcrumb" >
      <li><a href="/">Home</a></li>
    </ol>
    <!-- End breadcrumb -->
    </nav>

    <!-- End nav -->
  </header>
  <!-- End header -->

  <!-- Beginning main -->
  <main id="maincontent">
    <!-- Beginning map -->
    <div class="flex-container">
      <section id="map-container">
        <div aria-label="Map" id="map"></div>
      </section>
      <!-- End map -->
      <!-- Beginning restaurant -->
      <section id="restaurant-container">
        <h2 id="restaurant-name"></h2>
        <img id="restaurant-img">
        <p id="restaurant-cuisine"></p>
        <p id="restaurant-address"></p>
        <table id="restaurant-hours"></table>
      </section>
    </div>
    <!-- end restaurant -->
    <!-- Beginning reviews -->
    <section id="reviews-container">
      <ul id="reviews-list"></ul>
    </section>
    <!-- End reviews -->
  </main>
  <!-- End main -->

  <!-- Beginning footer -->
  <footer id="footer">
    Copyright (c) 2017 <a href="/"><strong>Restaurant Reviews</strong></a> All Rights Reserved.
  </footer>
  <!-- End footer -->`

  document.addEventListener('DOMContentLoaded', (event) => {
    intitalizeMapRestaurant();
  });


}




registerServiceWorker = () => {

  if (!navigator.serviceWorker) return;

  navigator.serviceWorker.register('/sw.js')
  .then(function(reg) {
  console.log('service worker registered ' + reg)
    })
  .catch(function(e) {
  console.log('registration unsuccesful ' + e)
  });
}


/**
 * Fetch all neighborhoods and set their HTML.
 */
fetchNeighborhoods = () => {
  DBHelper.fetchNeighborhoods((error, neighborhoods) => {
    if (error) { // Got an error
      console.error(error);
    } else {
      self.neighborhoods = neighborhoods;
      fillNeighborhoodsHTML();
    }
  });
}

/**
 * Set neighborhoods HTML.
 */
fillNeighborhoodsHTML = (neighborhoods = self.neighborhoods) => {
  const select = document.getElementById('neighborhoods-select');
  neighborhoods.forEach(neighborhood => {
    const option = document.createElement('option');
    option.innerHTML = neighborhood;
    option.value = neighborhood;
    select.append(option);
  });
}

/**
 * Fetch all cuisines and set their HTML.
 */
fetchCuisines = () => {
  DBHelper.fetchCuisines((error, cuisines) => {
    if (error) { // Got an error!
      console.error(error);
    } else {
      self.cuisines = cuisines;
      fillCuisinesHTML();
    }
  });
}

/**
 * Set cuisines HTML.
 */
fillCuisinesHTML = (cuisines = self.cuisines) => {
  const select = document.getElementById('cuisines-select');

  cuisines.forEach(cuisine => {
    const option = document.createElement('option');
    option.innerHTML = cuisine;
    option.value = cuisine;
    select.append(option);
  });
}


const initializeMap = () => {

/**
 * Initialize Google map, called from HTML.
 */
window.initMap = () => {
  let loc = {
    lat: 40.722216,
    lng: -73.987501
  };
  self.map = new google.maps.Map(document.getElementById('map'), {
    zoom: 12,
    center: loc,
    scrollwheel: false
  });
  updateRestaurants();
}

/**
 * Update page and map for current restaurants.
 */
updateRestaurants = () => {
  const cSelect = document.getElementById('cuisines-select');
  const nSelect = document.getElementById('neighborhoods-select');

  const cIndex = cSelect.selectedIndex;
  const nIndex = nSelect.selectedIndex;

  const cuisine = cSelect[cIndex].value;
  const neighborhood = nSelect[nIndex].value;

  DBHelper.fetchRestaurantByCuisineAndNeighborhood(cuisine, neighborhood, (error, restaurants) => {
    if (error) { // Got an error!
      console.error(error);
    } else {
      resetRestaurants(restaurants);
      fillRestaurantsHTML();
    }
  })
}

/**
 * Clear current restaurants, their HTML and remove their map markers.
 */
resetRestaurants = (restaurants) => {
  // Remove all restaurants
  self.restaurants = [];
  const ul = document.getElementById('restaurants-list');
  ul.innerHTML = '';

  // Remove all map markers
  self.markers.forEach(m => m.setMap(null));
  self.markers = [];
  self.restaurants = restaurants;
}

/**
 * Create all restaurants HTML and add them to the webpage.
 */
fillRestaurantsHTML = (restaurants = self.restaurants) => {
  const ul = document.getElementById('restaurants-list');
  restaurants.forEach(restaurant => {
    ul.append(createRestaurantHTML(restaurant));
  });
  addMarkersToMap();
}

/**
 * Create restaurant HTML.
 */
createRestaurantHTML = (restaurant) => {
  const li = document.createElement('li');

  const image = document.createElement('img');
  image.className = 'restaurant-img';
  image.alt = restaurant.name + " restaurant image";
  image.src = DBHelper.imageUrlForRestaurant(restaurant);
  li.append(image);

  const name = document.createElement('h2');
  name.setAttribute('tabindex', '0');
  name.innerHTML = restaurant.name;
  li.append(name);

  const neighborhood = document.createElement('p');
  neighborhood.innerHTML = restaurant.neighborhood;
  li.append(neighborhood);

  const address = document.createElement('p');
  address.innerHTML = restaurant.address;
  li.append(address);

  const more = document.createElement('a');
  more.innerHTML = 'View Details';
  more.href = DBHelper.urlForRestaurant(restaurant);
  li.append(more)

  return li
}

/**
 * Add markers for current restaurants to the map.
 */
addMarkersToMap = (restaurants = self.restaurants) => {
  restaurants.forEach(restaurant => {
    // Add marker to the map
    const marker = DBHelper.mapMarkerForRestaurant(restaurant, self.map);
    google.maps.event.addListener(marker, 'click', () => {
      window.location.href = marker.url
    });
    self.markers.push(marker);
  });
}

}
