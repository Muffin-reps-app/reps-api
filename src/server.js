const express = require('express')
const app = express()
const environment = process.env.NODE_ENV || 'development'
const configuration = require('../knexfile')[environment]
const database = require('knex')(configuration)

const { graphqlHTTP } = require('express-graphql')
const { buildSchema } = require('graphql')

const schema = buildSchema(`
    type Rep {
        id: Int!
        first_name: String!
        last_name: String!
        zip_codes: [Int]
    }
    type Query {
        findRepsByZip(zipcode: Int): [Rep]
    }
`)

const root = {
    findRepsByZip: ({ zipcode }) => {
        return database('reps').select()
    }
}

app.use('/graphql', graphqlHTTP({
    schema: schema,
    rootValue: root,
    graphiql: true,
}))

app.listen(process.env.PORT || 4000)
console.log('Running a GraphQL API server at localhost:4000/graphql')
