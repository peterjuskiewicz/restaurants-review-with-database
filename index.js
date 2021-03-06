const express = require("express");
const bodyParser = require("body-parser");
const store = require("./store");
const app = express();

app.use(express.static("public"));
app.use(bodyParser.json());
app.post('/createRestaurant', (req, res) => {
  store
    .createRestaurant({
        name: req.body.name,
        neighborhood: req.body.neighborhood,
        photography: req.body.photography,
        address: req.body.address,
        latlng: req.body.latlng,
        cuisineType: req.body.cuisineType,
        operatingHours: req.body.operatingHours
    })
    .then(() => res.sendStatus(200));
});

app.get('/getRestaurant', (req, res) => {
    store.getRestaurant()
        .then((response) => {
            console.log(response);
            res.send(response);
            res.end()});
});


app.post('/addReview', (req, res) => {
  store
    .addRestaurant({
        restaurantId: req.body.id,
        review: req.body.reviews
    })
    .then(() => res.sendStatus(200));
});


app.listen(7555, () => {
  console.log("Server running on http://localhost:7555");
});
