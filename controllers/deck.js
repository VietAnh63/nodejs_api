const Client = require("../models/Client");
const Deck = require("../models/Deck");

//Deck
module.exports.index = async function (req, res, next) {
    const decks = await Deck.find({}).sort({ name: "ascending" }).exec();

    return res.status(200).json({ decks });
};

module.exports.paginateDeck = async function (req, res, next) {
    const page = req.params.page;
    const limit = 2;
    const skip = (page - 1) * limit;
    const decks = await Deck.find({})
        .sort({ name: "ascending" })
        .skip(skip)
        .limit(limit)
        .exec();
    //throw new Error('Test Error with express-promise-router')
    return res.status(200).json({ decks });
};

module.exports.addDeck = async function (req, res, next) {
    const owner = await Client.findById(req.value.body.owner);

    const deck = req.value.body;

    //delete id owner in deck because one deck for one user
    //delete deck.owner

    //add id owner for deck
    deck.owner = owner._id;

    const newDeck = new Deck(deck);
    await newDeck.save();

    //update User
    //await owner.save()
    await Client.findByIdAndUpdate(newDeck.owner, {
        $push: { decks: newDeck._id },
    });

    //return client
    return res.status(201).json({ newDeck });
};

module.exports.getDeck = async function (req, res, next) {
    const deck = await Deck.findById(req.value.params.deckId);

    return res.status(200).json({ deck });
};

module.exports.replaceDeck = async function (req, res, next) {
    const { deckId } = req.value.params;

    const newDeck = req.value.body;

    const deck = await Deck.findByIdAndUpdate(deckId, newDeck);

    const ownerId = deck.owner;

    //Old Owner pull id
    await Client.findByIdAndUpdate(ownerId, {
        $pull: { decks: { $in: [deck._id] } },
    });

    //New Owner push id
    await Client.findByIdAndUpdate(newDeck.owner, {
        $push: { decks: deck._id },
    });

    return res.status(200).json({ success: true });
};

module.exports.updateDeck = async function (req, res, next) {
    const { deckId } = req.value.params;

    const newDeck = req.value.body;

    const deck = await Deck.findByIdAndUpdate(deckId, newDeck);

    const ownerId = deck.owner;

    //Old Owner pull id
    await Client.findByIdAndUpdate(ownerId, {
        $pull: { decks: { $in: [deck._id] } },
    });

    //New Owner push id
    await Client.findByIdAndUpdate(newDeck.owner, {
        $push: { decks: deck._id },
    });

    return res.status(200).json({ success: true });
};

module.exports.deleteDeck = async function (req, res, next) {
    const { deckId } = req.value.params;

    //get deck by id
    const deck = await Deck.findById(deckId);

    const ownerId = deck.owner;
    const owner = await Client.findById(ownerId);

    await deck.remove();

    //update decks in user
    //pull replace in array
    await Client.findByIdAndUpdate(owner._id, {
        $pull: { decks: { $in: [deck._id] } },
    });

    return res.status(200).json({ success: true });
};
