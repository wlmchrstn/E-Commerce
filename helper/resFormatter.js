var success = (results, message) => {
    return {
        success: true,
        message: message,
        result: results
    }
}

var error = (err, message) => {
    return{
        success: false,
        message: message,
        err: err
    }
}

module.exports = { success, error }
