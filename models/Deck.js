const mongoose = require("mongoose");

const DeckSchema = new mongoose.Schema({
  name: {
    type: String,
  },
  description: {
    type: String,
  },
  total: {
    type: Number,
    default: 0,
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
});

const Deck = mongoose.model("Deck", DeckSchema);

module.exports = Deck;
