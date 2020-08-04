const User = require("../models/User");
const Deck = require("../models/Deck");

const fs = require("fs");
const path = require("path");

//import config lib
const config = require("config");

//import JWT
const JWT = require("jsonwebtoken");

//config JWT for signUp
const encodedToken = function (userId) {
    const secret = config.get("jsonwebtoken.JWT_SECRET");
    const token = JWT.sign(
        {
            //Nguoi phat hanh
            issuser: "Pham Viet Anh",
            //Dinh danh cho user, phai la duy nhat
            subject: userId,
            //Ngay phat hanh : iat
            iat: new Date().getTime(),
            //Ngay het han
            exp: new Date().setDate(new Date().getDate() + 3),
        },
        secret
    );
    return token;
};

//User
module.exports.index = async function (req, res, next) {
    const users = await User.find({});
    //throw new Error('Test Error with express-promise-router')
    return res.status(200).json({ users });
};

module.exports.addUser = async function (req, res, next) {
    //console.log("req.value", req.value);
    const newUser = new User(req.value.body);
    await newUser.save();
    return res.status(201).json({ user: newUser });
};

module.exports.getUser = async function (req, res, next) {
    const { userId } = req.value.params;

    const user = await User.findById(userId);
    return res.status(200).json({ user });
};

module.exports.replaceUser = async function (req, res, next) {
    const { userId } = req.value.params;

    const newUser = req.value.body;

    const result = await User.findByIdAndUpdate(userId, newUser);
    return res.status(200).json({ success: true });
};

module.exports.updateUser = async function (req, res, next) {
    const { userId } = req.value.params;

    const newUser = req.value.body;

    const result = await User.findByIdAndUpdate(userId, newUser);
    return res.status(200).json({ success: true });
};

module.exports.signUp = async function (req, res, next) {
    //const file = req.file

    const { firstName, lastName, email, password } = req.value.body;

    const foundEmailUser = await User.findOne({ email });

    if (foundEmailUser) {
        //fs.unlinkSync(req.file.path);
        return res.status(403).json({ error: { message: "Email is exists" } });
    } else {
        if (req.file) {
            var image = req.file.filename;
        } else {
            var image = "";
        }
        const newUser = new User({
            firstName,
            lastName,
            email,
            password,
            image,
        });
        await newUser.save();
        const token = encodedToken(newUser._id);
        res.setHeader("Authentication", token);
        return res.status(201).json({ success: true });
    }
};

module.exports.signIn = async function (req, res, next) {
    const userFromReq = req.user;
    if (!userFromReq) {
        return res.json({ message: "Password is incorrect" });
    } else {
        //Call user from request that pushed from pasport-local
        const token = encodedToken(userFromReq._id);
        res.setHeader("Auhentication", token);

        return res.status(200).json({ success: true });
    }
};

module.exports.secret = async function (req, res, next) {
    return res.status(200).json({ resource: true });
};

module.exports.authGoogle = async function (req, res, next) {
    const userFromReq = req.user;
    if (!userFromReq) {
        return res.json({ message: "Password is incorrect" });
    } else {
        //Call user from request that pushed from pasport-local
        const token = encodedToken(userFromReq._id);
        res.setHeader("Auhentication", token);

        return res.status(200).json({ success: true });
    }
};

module.exports.authFacebook = async function (req, res, next) {
    const userFromReq = req.user;
    if (!userFromReq) {
        return res.json({ message: "Password is incorrect" });
    } else {
        //Call user from request that pushed from pasport-local
        const token = encodedToken(userFromReq._id);
        res.setHeader("Auhentication", token);

        return res.status(200).json({ success: true });
    }
};
