const repSeedData = require('../repSeedData.js')

exports.seed = function(knex) {
    return knex('reps').del()
        .then(() => {
            return knex('reps').insert(repSeedData)
        })
}
