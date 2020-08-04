const mongoose = require("mongoose");

const ClientSchema = new mongoose.Schema({
    firstName: {
        type: String,
    },
    lastName: {
        type: String,
    },
    image_client: {
        type: String,
    },
    email_client: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
    },
    decks: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Deck",
        },
    ],
});

const Client = mongoose.model("Client", ClientSchema);

module.exports = Client;
