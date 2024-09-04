"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express = require("express");
var v1_1 = require("./router/v1");
var cors = require("cors");
var passport_1 = require("./passport");
var auth_1 = require("./router/auth");
var dotenv = require("dotenv");
var session = require("express-session");
var passport = require("passport");
var cookieParser = require("cookie-parser");
var consts_1 = require("./consts");
var app = express();
dotenv.config();
app.use(express.json());
app.use(cookieParser());
app.use(session({
    secret: process.env.COOKIE_SECRET || 'keyboard cat',
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false, maxAge: consts_1.COOKIE_MAX_AGE },
}));
(0, passport_1.initPassport)();
app.use(passport.initialize());
app.use(passport.authenticate('session'));
var allowedHosts = process.env.ALLOWED_HOSTS
    ? process.env.ALLOWED_HOSTS.split(',')
    : [];
app.use(cors({
    origin: allowedHosts,
    methods: 'GET,POST,PUT,DELETE',
    credentials: true,
}));
app.use('/auth', auth_1.default);
app.use('/v1', v1_1.default);
var PORT = process.env.PORT || 3000;
app.listen(PORT, function () {
    console.log("Server is running on port ".concat(PORT));
});
