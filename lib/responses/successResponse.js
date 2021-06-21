module.exports = (res, message, data) => {
    res.send({
        error: false,
        message,
        data
    })
}