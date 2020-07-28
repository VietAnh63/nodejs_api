const express = require("express")
//const router = express.Router()

const router = require("express-promise-router")()

const UserController = require("../controllers/user")

const {validateParam, validateBody , schemas} = require("../helpers")

//User
//return list users and add new user
router.route("/")
     .get(UserController.index)
     .post(validateBody(schemas.userSchema), UserController.addUser)

//return one user
router.route("/:userId")
     .get(validateParam(schemas.idSchema, "userId"), UserController.getUser)
     //replace user
     .put(validateParam(schemas.idSchema, "userId"), validateBody(schemas.userSchema), UserController.replaceUser)
     //update user
     .patch(validateParam(schemas.idSchema, "userId"), validateBody(schemas.userUpadateSchema), UserController.updateUser)

//Deck
router.route("/:userId/decks")
     .get(validateParam(schemas.idSchema, "userId"), UserController.getDeck)
     .post(validateParam(schemas.idSchema, "userId"), validateBody(schemas.deckSchema), UserController.addDeck)

module.exports = router