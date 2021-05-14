
exports.up = knex => {
    return knex.schema.createTable('reps', table => {
        table.increments()
        table.string('first_name').notNullable()
        table.string('last_name').notNullable()
        table.integer('rep_code').notNullable()
        table.specificType('zip_codes', 'integer ARRAY').notNullable()
    })
}

exports.down = knex => {
    return knex.schema.dropTable('reps')
}
