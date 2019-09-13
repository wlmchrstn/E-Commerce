module.exports = {
    success(data) {
        return data[0].status(data[1]).json({
            success: true,
            message: data[3],
            result: data[2]
        })
    },
    
    error(data) {
        return data[0].status(data[1]).json({
            success: true,
            message: data[2]
        })
    }
}