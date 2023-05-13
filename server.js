require('dotenv').config();
const express = require('express');
const app = express();
const PORT = process.env.PORT || 5000;
const path = require('path');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const { corsOptions } = require('./config/corsOptions');
const connectDB = require('./config/dbConn');
const mongoose = require('mongoose');

connectDB();

app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());

app.use('/', express.static(path.join(__dirname, '/public')));

app.use('/', require('./routes/root'))
app.use('/auth', require('./routes/authRoutes'))
app.use('/users', require('./routes/userRoutes'))
app.use('/notes', require('./routes/noteRoutes'))

app.all('*', (req, res) => {
    res.status(404)
    if (req.accepts('html')) {
        res.sendFile(path.join(__dirname, 'views', '404.html'))
    }
    else if (req.accepts('json')) {
        res.json({ error: 'Not found' })
    }
    else {
        res.type('txt').send('Not found')
    }
});

mongoose.connection.once('open', () => {
    console.log('Mongoose connected to db');
    app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
});

mongoose.connection.on('error', err => {
    console.log(err);
})


