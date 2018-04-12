
exports.up = function(knex, Promise) {
    return knex.schema.createTable('restaurants', function(t) {
        t.increments('id').unsigned().primary();

        t.string('name').notNull();
        t.string('neighborhood').notNull();
        t.string('photography').notNull();
        t.string('address').notNull();
        t.string('latlng').notNull();
        t.string('cuisineType').notNull();
        t.text('operatingHours').notNull();
        t.text('reviews').nullable();

            });
};

exports.down = function(knex, Promise) {
    return knex.schema.dropTable('restaurants');
};
