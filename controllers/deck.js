const User = require("../models/User");
const Deck = require("../models/Deck");

//Deck
module.exports.index = async function (req, res, next) {
  const decks = await Deck.find({});

  return res.status(200).json({ decks });
};

module.exports.addDeck = async function (req, res, next) {
  const owner = await User.findById(req.value.body.owner);

  const deck = req.value.body;

  //delete id owner in deck because one deck for one user
  //delete deck.owner

  //add id owner for deck
  deck.owner = owner._id;

  const newDeck = new Deck(deck);
  await newDeck.save();

  //update User
  //await owner.save()
  await User.findByIdAndUpdate(newDeck.owner, {
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
  await User.findByIdAndUpdate(ownerId, {
    $pull: { decks: { $in: [deck._id] } },
  });

  //New Owner push id
  await User.findByIdAndUpdate(newDeck.owner, { $push: { decks: deck._id } });

  return res.status(200).json({ success: true });
};

module.exports.updateDeck = async function (req, res, next) {
  const { deckId } = req.value.params;

  const newDeck = req.value.body;

  const deck = await Deck.findByIdAndUpdate(deckId, newDeck);

  const ownerId = deck.owner;

  //Old Owner pull id
  await User.findByIdAndUpdate(ownerId, {
    $pull: { decks: { $in: [deck._id] } },
  });

  //New Owner push id
  await User.findByIdAndUpdate(newDeck.owner, { $push: { decks: deck._id } });

  return res.status(200).json({ success: true });
};

module.exports.deleteDeck = async function (req, res, next) {
  const { deckId } = req.value.params;

  //get deck by id
  const deck = await Deck.findById(deckId);

  const ownerId = deck.owner;
  const owner = await User.findById(ownerId);

  await deck.remove();

  //update decks in user
  //pull replace in array
  await User.findByIdAndUpdate(owner._id, {
    $pull: { decks: { $in: [deck._id] } },
  });

  return res.status(200).json({ success: true });
};
