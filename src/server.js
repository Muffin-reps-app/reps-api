const express = require('express')
const app = express()
const environment = process.env.NODE_ENV || 'development'
const configuration = require('../knexfile')[environment]
const database = require('knex')(configuration)

const { firstResult } = require('./sugar')

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
    input UpdateRepInput {
        id: Int!
        first_name: String
        last_name: String
        zip_codes: [Int]
    }
    type Query {
        findRepsByZip(zipcode: Int): [Rep]
        getAllReps: [Rep]
    }
    type Mutation {
        createNewRep(input: CreateRepInput!): Rep
        updateRep(input: UpdateRepInput): Rep
        addZipcode(id: Int!, zipcode: Int!): Rep
        removeZipcode(id: Int!, zipcode: Int!): Rep
        deleteRep(id: Int!): Rep
    }
`)

const REP_MODEL = ['id', 'first_name', 'last_name', 'zip_codes']

const root = {
    findRepsByZip: ({ zipcode }) => {
        return database('reps').select().whereRaw('? = any (zip_codes)', [zipcode])
    },
    getAllReps: () => {
        return database('reps').select()
    },
    createNewRep: ({ input }) => {
        return firstResult(database('reps').insert(input).returning(REP_MODEL)
    },
    updateRep: ({ input }) => {
        const { id } = input
        const changes = {}
        let changeCount = 0

        for (const key in input) {
            if (Object.hasOwnProperty.call(input, key) && key !== 'id') {
                changes[key] = input[key]
                changeCount++
            }
        }

        if (changeCount === 0) {
            throw new Error('Nothing to change')
        }

        return firstResult(database('reps').where({ id }).update(changes, REP_MODEL))
    },
    addZipcode: ({ id, zipcode }) => {
        return firstResult(database('reps').where({ id }).whereRaw('not (? = any (zip_codes))', [zipcode]).update({ zip_codes: database.raw('array_append(zip_codes, ?)', [zipcode]) }, REP_MODEL))
    },
    removeZipcode: ({ id, zipcode }) => {
        return firstResult(database('reps').where({ id }).update({ zip_codes: database.raw('array_remove(zip_codes, ?)', [zipcode]) }, REP_MODEL))
    },
    deleteRep: ({ id }) => {
        return firstResult(database('reps').where({ id }).del(REP_MODEL))
    }
}

app.use('/graphql', graphqlHTTP({
    schema: schema,
    rootValue: root,
    graphiql: true,
}))

app.listen(process.env.PORT || 4000)
console.log('Running a GraphQL API server at localhost:4000/graphql')
