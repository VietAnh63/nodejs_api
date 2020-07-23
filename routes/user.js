const express = require("express")
//const router = express.Router()

const router = require("express-promise-router")()

const UserController = require("../controllers/user")

const {validateParam, schemas} = require("../helpers")

//User
//return list users and add new user
router.route("/")
     .get(UserController.index)
     .post(UserController.addUser)

//return one user
router.route("/:userId")
     .get(validateParam(schemas.idSchema, 'userId'),UserController.getUser)
     //replace user
     .put(UserController.replaceUser)
     //update user
     .patch(UserController.updateUser)

//Deck
router.route("/:userId/decks")
     .get(UserController.getDeck)
     .post(UserController.addDeck)

module.exports = router