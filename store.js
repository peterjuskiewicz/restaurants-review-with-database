const knex = require('knex')(require('./knexfile'));

module.exports = {
    createRestaurant({name, neighborhood, photography, address, latlng, cuisineType, operatingHours}) {
        console.log(`Add restaurant ${name}`);
        return knex('restaurants').insert({
            name,
            neighborhood,
            photography,
            address,
            latlng,
            cuisineType,
            operatingHours

        }).debug()
    }
};