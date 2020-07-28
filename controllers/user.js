const User = require("../models/User");
const Deck = require("../models/Deck");

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

//Deck
//get decks for one User
module.exports.getDeck = async function (req, res, next) {
    const { userId } = req.value.params;

    //get User by Id, populate get all info of deck User
    const user = await User.findById(userId).populate("decks");

    //get decks of User
    return res.status(200).json({ decks: user.decks });
};

module.exports.addDeck = async function (req, res, next) {
    const { userId } = req.value.params;

    //Create a new Deck
    const newDeck = new Deck(req.value.body);

    //get User with Id params
    const user = await User.findById(userId);

    //Update field owner of deck
    newDeck.owner = userId;
    await newDeck.save();

    //Push id of new deck for user
    user.decks.push(newDeck._id);
    await user.save();

    return res.status(201).json({ deck: newDeck });
};

module.exports.signUp = async function (req, res, next) {
    const { firstName, lastName, email, password } = req.value.body;
    const foundEmailUser = await User.findOne({ email });

    if (foundEmailUser) {
        return res.status(403).json({ error: { message: "Email is exists" } });
    } else {
        const newUser = new User({ firstName, lastName, email, password });
        await newUser.save();
        const token = encodedToken(newUser._id);
        res.setHeader("Authentication", token);
        return res.status(201).json({ success: true, token });
    }
};

module.exports.signIn = async function (req, res, next) {};

module.exports.secret = async function (req, res, next) {};
