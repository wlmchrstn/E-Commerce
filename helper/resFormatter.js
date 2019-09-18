var success = (result, message) => {
    return{
        success: true,
        message: message,
        result: result
    }
}

var error = (message) => {
    return{
        success: false,
        message: message
    }
}

module.exports = {error, success}
