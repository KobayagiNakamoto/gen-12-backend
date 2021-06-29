const express = require('express');
const app = express();
const mongoose = require('mongoose');
const authRouter = require('./router');
const jwt = require('express-jwt');
const errorResponse = require('../../lib/responses/errorResponse');

require('dotenv').config();

app.use(express.json());

mongoose.connect("mongodb+srv://petar:petar@cluster0.qznuq.mongodb.net/test123?retryWrites=true&w=majority", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
});


app.use(jwt({
    secret: process.env.AUTH_SECRET_KEY,
    algorithms: ['HS256']
}).unless({
    path: [
        {
            url: '/register', methods: ['POST']
        },
        {
            url: '/login', methods: ['POST']
        }
    ]
}))

app.use((err, req, res, next) => {
    if (err.name === 'UnauthorizedError') {
        errorResponse(res, 401, new Error('You are not logged in'));
    }
})


app.use('/', authRouter)

app.listen(process.env.AUTH_PORT, () => {
    console.log('Auth is started on port 3001');
})