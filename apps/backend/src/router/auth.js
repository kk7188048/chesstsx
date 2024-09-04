"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var passport = require("passport");
var jwt = require("jsonwebtoken");
var db_1 = require("../db");
var uuid_1 = require("uuid");
var consts_1 = require("../consts");
var router = (0, express_1.Router)();
var CLIENT_URL = (_a = process.env.AUTH_REDIRECT_URL) !== null && _a !== void 0 ? _a : 'http://localhost:5173/game/random';
var JWT_SECRET = process.env.JWT_SECRET || 'your_secret_key';
// this route is to be hit when the user wants to login as a guest
router.post('/guest', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var bodyData, guestUUID, user, token, UserDetails;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                bodyData = req.body;
                guestUUID = 'guest-' + (0, uuid_1.v4)();
                return [4 /*yield*/, db_1.db.user.create({
                        data: {
                            username: guestUUID,
                            email: guestUUID + '@chess100x.com',
                            name: bodyData.name || guestUUID,
                            provider: 'GUEST',
                        },
                    })];
            case 1:
                user = _a.sent();
                token = jwt.sign({ userId: user.id, name: user.name, isGuest: true }, JWT_SECRET);
                UserDetails = {
                    id: user.id,
                    name: user.name,
                    token: token,
                    isGuest: true,
                };
                res.cookie('guest', token, { maxAge: consts_1.COOKIE_MAX_AGE });
                res.json(UserDetails);
                return [2 /*return*/];
        }
    });
}); });
router.get('/refresh', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var user, userDb, token, decoded, token, User;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                if (!req.user) return [3 /*break*/, 2];
                user = req.user;
                return [4 /*yield*/, db_1.db.user.findFirst({
                        where: {
                            id: user.id,
                        },
                    })];
            case 1:
                userDb = _a.sent();
                token = jwt.sign({ userId: user.id, name: userDb === null || userDb === void 0 ? void 0 : userDb.name }, JWT_SECRET);
                res.json({
                    token: token,
                    id: user.id,
                    name: userDb === null || userDb === void 0 ? void 0 : userDb.name,
                });
                return [3 /*break*/, 3];
            case 2:
                if (req.cookies && req.cookies.guest) {
                    decoded = jwt.verify(req.cookies.guest, JWT_SECRET);
                    token = jwt.sign({ userId: decoded.userId, name: decoded.name, isGuest: true }, JWT_SECRET);
                    User = {
                        id: decoded.userId,
                        name: decoded.name,
                        token: token,
                        isGuest: true,
                    };
                    res.cookie('guest', token, { maxAge: consts_1.COOKIE_MAX_AGE });
                    res.json(User);
                }
                else {
                    res.status(401).json({ success: false, message: 'Unauthorized' });
                }
                _a.label = 3;
            case 3: return [2 /*return*/];
        }
    });
}); });
router.get('/login/failed', function (req, res) {
    res.status(401).json({ success: false, message: 'failure' });
});
router.get('/logout', function (req, res) {
    res.clearCookie('guest');
    req.logout(function (err) {
        if (err) {
            console.error('Error logging out:', err);
            res.status(500).json({ error: 'Failed to log out' });
        }
        else {
            res.clearCookie('jwt');
            res.redirect('http://localhost:5173/');
        }
    });
});
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));
router.get('/google/callback', passport.authenticate('google', {
    successRedirect: CLIENT_URL,
    failureRedirect: '/login/failed',
}));
router.get('/github', passport.authenticate('github', { scope: ['read:user', 'user:email'] }));
router.get('/github/callback', passport.authenticate('github', {
    successRedirect: CLIENT_URL,
    failureRedirect: '/login/failed',
}));
exports.default = router;
