"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var v1Router = (0, express_1.Router)();
v1Router.get('/', function (req, res) {
    res.send('Hello, World!');
});
exports.default = v1Router;
