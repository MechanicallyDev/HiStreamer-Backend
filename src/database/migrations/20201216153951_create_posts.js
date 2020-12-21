exports.up = function (knex) {
  return knex.schema.createTable('posts', function (table) {
    table.increments();
    table.string('title').notNullable();
    table.string('description').notNullable();
    table.string('image').notNullable();
    table.string('author').notNullable();
    table.string('slug').notNullable();
    table.timestamps(true, true);
    table.foreign('author').references('id').inTable('users');
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable('posts');
};
