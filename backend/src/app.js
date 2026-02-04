const path = require('path');
const express = require('express');
const cookieParser = require('cookie-parser');

const { checkAuthentication, checkAuthorization } = require('./middleware/auth.middleware.js');
const authRoutes = require('./routes/auth.routes.js');
const userRoutes = require('./routes/user.routes.js');

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(checkAuthentication);

app.use('/api/auth', authRoutes);
app.use('/api/user', checkAuthorization, userRoutes);

if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, '../frontend/dist')));

    app.get('*', (req, res) => {
        res.sendFile(path.join(__dirname, '../frontend/dist/index.html'));
    })
}

module.exports = app;