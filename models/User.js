const mongoose = require("mongoose");

const bcrypt = require("bcryptjs");

const UserSchema = new mongoose.Schema({
    firstName: {
        type: String,
    },
    lastName: {
        type: String,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
    },
    password: {
        type: String,
        required: true,
    },
    decks: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Deck",
        },
    ],
});

// preprocess then save
UserSchema.pre("save", async function (next) {
    try {
        // Generate random to combine with your password, call salt
        const salt = await bcrypt.genSalt(5);

        // Generate a password is hashed with salt
        const passwordHashed = await bcrypt.hash(this.password, salt);

        // Assign password to DB
        this.password = passwordHashed;

        next();
    } catch (error) {
        next(error);
    }
});

//method of Schema
UserSchema.methods.isValidPassword = async function (newPassword) {
    try {
        return await bcrypt.compare(newPassword, this.password);
    } catch (error) {
        throw new Error(error);
    }
};

const User = mongoose.model("User", UserSchema);

module.exports = User;
