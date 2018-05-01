let restaurant;
var map;

/**
 * Initialize Google map, called from HTML.
 */

const intitalizeMapRestaurant = () => {
window.initMap = () => {
  fetchRestaurantFromURL((error, restaurant) => {
    if (error) { // Got an error!
      console.error(error);
    } else {
      console.log(typeof JSON.parse(restaurant.latlng).lat)
      self.map = new google.maps.Map(document.getElementById('map'), {
        zoom: 16,
        center: JSON.parse(restaurant.latlng),
        scrollwheel: false
      });
      fillBreadcrumb();
      DBHelper.mapMarkerForRestaurant(self.restaurant, self.map);
    }
  });
}
}

/**
 * Get current restaurant from page URL.
 */
fetchRestaurantFromURL = (callback) => {
  if (self.restaurant) { // restaurant already fetched!
    callback(null, self.restaurant)
    return;
  }
  const id = getParameterByName('id');
  if (!id) { // no id found in URL
    error = 'No restaurant id in URL'
    callback(error, null);
  } else {
    DBHelper.fetchRestaurantById(id, (error, restaurant) => {
      self.restaurant = restaurant;
      if (!restaurant) {
        console.error(error);
        return;
      }
      fillRestaurantHTML();
      callback(null, restaurant)
    });
  }
}

/**
 * Create restaurant HTML and add it to the webpage
 */
fillRestaurantHTML = (restaurant = self.restaurant) => {
  const name = document.getElementById('restaurant-name');
  name.setAttribute('tabindex', '0');
  name.innerHTML = restaurant.name;

  const address = document.getElementById('restaurant-address');
  address.setAttribute('tabindex', '0');
  address.innerHTML = restaurant.address;

  const image = document.getElementById('restaurant-img');
  image.className = 'restaurant-img';
  image.alt = 'Image of restaurant ' + restaurant.name;
  image.src = DBHelper.imageUrlForRestaurant(restaurant);

  const cuisine = document.getElementById('restaurant-cuisine');
  cuisine.innerHTML = restaurant.cuisineType;

  // fill operating hours
  if (restaurant.operatingHours) {
    fillRestaurantHoursHTML();
  }
  // fill reviews
  fillReviewsHTML();
}

/**
 * Create restaurant operating hours HTML table and add it to the webpage.
 */
fillRestaurantHoursHTML = (operatingHours = JSON.parse(self.restaurant.operatingHours)) => {
  const hours = document.getElementById('restaurant-hours');
  for (let key in operatingHours) {
    const row = document.createElement('tr');
    row.setAttribute('tabindex', '0');

    const day = document.createElement('td');
    day.innerHTML = key;
    row.appendChild(day);

    const time = document.createElement('td');
    time.innerHTML = operatingHours[key];
    row.appendChild(time);

    hours.appendChild(row);
  }
}

/**
 * Create all reviews HTML and add them to the webpage.
 */
fillReviewsHTML = (reviews = JSON.parse(self.restaurant.reviews)) => {
  const container = document.getElementById('reviews-container');

  const title1 = document.createElement('h2');
  title1.innerHTML = 'Add Reviews';
  container.appendChild(title1);
  container.appendChild(createReviewForm());

  const title2 = document.createElement('h2');
  title2.innerHTML = 'Reviews';
  container.appendChild(title2);

  if (!reviews) {
    const noReviews = document.createElement('p');
    noReviews.innerHTML = 'No reviews yet!';
    container.appendChild(noReviews);
    return;
  }
  const ul = document.getElementById('reviews-list');
  reviews.forEach(review => {
    ul.appendChild(createReviewHTML(review));
  });
  container.appendChild(ul);
}

/**
 * Create review HTML and add it to the webpage.
 */
createReviewHTML = (review) => {
  const li = document.createElement('li');
  li.setAttribute('tabindex', '0');
  const name = document.createElement('p');
  name.innerHTML = review.name;

  li.appendChild(name);

  const date = document.createElement('p');
  date.innerHTML = review.date;
  li.appendChild(date);

  const rating = document.createElement('p');
  rating.innerHTML = `Rating: ${review.rating}`;
  li.appendChild(rating);

  const comments = document.createElement('p');
  comments.innerHTML = review.comments;
  li.appendChild(comments);

  return li;
}

/**
 * Create review form and add it to the webpage.
 */

createReviewForm = () => {
  const form = document.createElement('form');

  form.innerHTML = `  <div>
                        <textarea id="msg" name="user_message"></textarea>
                      </div>

                      <div>
                      <input type="text" id="user_name" name="user_name">
                      <button type="submit">Send your review</button>
                      </div>`

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    addReview();
  })


  return form;

}

/**
 * Add restaurant name to the breadcrumb navigation menu
 */
fillBreadcrumb = (restaurant=self.restaurant) => {
  const breadcrumb = document.getElementById('breadcrumb');
  const li = document.createElement('li');
  li.setAttribute('aria-current', "page");
  li.innerHTML = restaurant.name;
  breadcrumb.appendChild(li);
}

/**
 * Get a parameter by name from page URL.
 */
getParameterByName = (name, url) => {
  if (!url)
    url = window.location.href;
  name = name.replace(/[\[\]]/g, '\\$&');
  const regex = new RegExp(`[?&]${name}(=([^&#]*)|&|#|$)`),
    results = regex.exec(url);
  if (!results)
    return null;
  if (!results[2])
    return '';
  return decodeURIComponent(results[2].replace(/\+/g, ' '));
}

/**
 * Add review
 */

addReview = (id = location.search.replace(/[^0-9]/g, ""), restaurant = self.restaurant) => {

  let reviews = restaurant.reviews ? JSON.parse(restaurant.reviews) : [];
  // console.log(reviews);
  // console.log(id);
  let review = {};
  review.name = document.getElementById('user_name').value;
  review.date = new Date();
  review.rating = 4;
  review.comments = document.getElementById('msg').value;
  console.log(review)
  reviews.push(review);
  let data = JSON.stringify({reviews, id})
  // console.log(reviews)
  // console.log(data)
  fetch('/addReview', {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: data
    })
  .then(res => {
    // console.log(res);
    location.reload()
  })

}


