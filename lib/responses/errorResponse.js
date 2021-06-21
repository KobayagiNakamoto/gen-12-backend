module.exports = (res, status, error) => {
    res.status(status).send({
        error: true,
        message: error.message
    })
}