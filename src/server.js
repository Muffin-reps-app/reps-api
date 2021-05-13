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
    input CreateRepInput {
        first_name: String!
        last_name: String!
        zip_codes: [Int]!
    }
    type Query {
        findRepsByZip(zipcode: Int): [Rep]
        getAllReps: [Rep]
    }
    type Mutation {
        createNewRep(input: CreateRepInput!): Rep
        deleteRep(id: Int!): Rep
    }
`)

const root = {
    findRepsByZip: ({ zipcode }) => {
        return database('reps').select().whereRaw('? = any (zip_codes)', [zipcode])
    },
    getAllReps: () => {
        return database('reps').select()
    },
    createNewRep: async ({ input }) => {
        const result = await database('reps').insert(input).returning(['id', 'first_name', 'last_name', 'zip_codes'])
        return result[0]
    },
    deleteRep: async ({ id }) => {
        const result = await database('reps').where('id', '=', id).del(['id', 'first_name', 'last_name', 'zip_codes'])
        return result[0]
    }
}

app.use('/graphql', graphqlHTTP({
    schema: schema,
    rootValue: root,
    graphiql: true,
}))

app.listen(process.env.PORT || 4000)
console.log('Running a GraphQL API server at localhost:4000/graphql')
