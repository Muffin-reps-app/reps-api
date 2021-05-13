const { inspect } = require('util')

const prettyPrint = (value) => {
    console.log(inspect(value, false, null, true))
}

const firstResult = async (databasePromise) => {
    const result = await databasePromise
    return result[0]
}


module.exports = { prettyPrint, firstResult }
