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
    },

    getRestaurant() {
        console.log('get restaurants from db');
        return knex.select('*').from('restaurants').debug()
    }
};