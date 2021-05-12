const { inspect } = require('util')

const prettyPrint = (value) => {
    console.log(inspect(value, false, null, true))
}

module.exports = { prettyPrint }
