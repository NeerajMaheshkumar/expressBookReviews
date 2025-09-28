const express = require('express');
const jwt = require('jsonwebtoken');
const session = require('express-session');
const customer_routes = require('./router/auth_users.js').authenticated;
const genl_routes = require('./router/general.js').general; // your existing general routes
const auth_users = require('./router/auth_users.js');

const app = express();
app.use(express.json());

// Session middleware
app.use("/customer", session({ secret: "fingerprint_customer", resave: true, saveUninitialized: true }));

// Helper functions
let users = auth_users.users;

const doesExist = (username) => {
    return users.some(user => user.username === username);
}

// Login middleware for protected routes
app.use("/customer/auth/*", (req,res,next) => {
    if (req.session.authorization) {
        let token = req.session.authorization['accessToken'];
        jwt.verify(token, "access", (err, user) => {
            if (!err) {
                req.user = user;
                next();
            } else {
                return res.status(403).json({ message: "User not authenticated" });
            }
        });
    } else {
        return res.status(403).json({ message: "User not logged in" });
    }
});

// Use routers
app.use("/customer", customer_routes);
app.use("/", genl_routes);
const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
