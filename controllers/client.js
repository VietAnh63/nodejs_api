const User = require("../models/User");
const Deck = require("../models/Deck");
const Client = require("../models/Client");

const fs = require("fs");
const path = require("path");

//import config lib
const config = require("config");

//Client
module.exports.index = async function (req, res, next) {
    const clients = await Client.find({})
        .sort({ lastName: "ascending" })
        .exec();
    //throw new Error('Test Error with express-promise-router')
    return res.status(200).json({ clients });
};

//Client
module.exports.paginateClient = async function (req, res, next) {
    const page = req.params.page;
    const limit = 3;
    const skip = (page - 1) * limit;
    const clients = await Client.find({})
        .sort({ lastName: "ascending" })
        .skip(skip)
        .limit(limit)
        .exec();
    //throw new Error('Test Error with express-promise-router')
    return res.status(200).json({ clients });
};

module.exports.addClient = async function (req, res, next) {
    const { firstName, lastName, email_client } = req.value.body;
    const foundEmailClient = await Client.findOne({ email_client });

    if (foundEmailClient) {
        fs.unlinkSync(req.file.path);
        return res.status(403).json({ error: { message: "Email is exists" } });
    } else {
        if (req.file) {
            var image_client = req.file.filename;
        } else {
            var image_client = "";
        }
        const newClient = new Client({
            firstName,
            lastName,
            email_client,
            image_client,
        });
        await newClient.save();
        return res.status(201).json({ success: true });
    }
};

module.exports.getClient = async function (req, res, next) {
    const { clientId } = req.value.params;

    const client = await Client.findById(clientId);
    return res.status(200).json({ client });
};

module.exports.replaceClient = async function (req, res, next) {
    const { clientId } = req.value.params;
    const { firstName, lastName, email_client } = req.value.body;
    const file = req.file;
    const client = await Client.findById(clientId);
    const path_file = path.resolve("public", "upload");
    const path_file_remove = path_file + "/" + client.image_client;
    const newClient = {
        firstName,
        lastName,
        email_client,
        image_client: client.image_client,
    };
    if (file) {
        fs.unlinkSync(path_file_remove);
        newClient["image_client"] = file.filename;
    }
    const result = await Client.findByIdAndUpdate(clientId, newClient);
    return res.status(200).json({ success: true });
};

module.exports.updateClient = async function (req, res, next) {
    const { clientId } = req.value.params;
    const { firstName, lastName, email_client } = req.value.body;
    const file = req.file;
    const client = await Client.findById(clientId);
    const path_file = path.resolve("public", "upload");
    const path_file_remove = path_file + "/" + client.image_client;
    const newClient = {
        firstName,
        lastName,
        email_client,
        image_client: client.image_client,
    };
    if (file) {
        fs.unlinkSync(path_file_remove);
        newClient["image_client"] = file.filename;
    }
    const result = await Client.findByIdAndUpdate(clientId, newClient);
    return res.status(200).json({ success: true });
};

//Deck
//get decks for one User
module.exports.getDeck = async function (req, res, next) {
    const { clientId } = req.value.params;

    //get User by Id, populate get all info of deck User
    const client = await Client.findById(clientId).populate("decks");

    //get decks of User
    return res.status(200).json({ decks: client.decks });
};

module.exports.addDeck = async function (req, res, next) {
    const { clientId } = req.value.params;

    //Create a new Deck
    const newDeck = new Deck(req.value.body);

    //get User with Id params
    const client = await Client.findById(clientId);

    //Update field owner of deck
    newDeck.owner = clientId;
    await newDeck.save();

    //Push id of new deck for user
    client.decks.push(newDeck._id);
    await client.save();

    return res.status(201).json({ deck: newDeck });
};
