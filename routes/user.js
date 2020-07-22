const express = require("express")
//const router = express.Router()

const router = require("express-promise-router")()

const UserController = require("../controllers/user")

//return list users and add new user
router.route("/")
     .get(UserController.index)
     .post(UserController.addUser)

//return one user
router.route("/:userId")
     .get(UserController.getUser)
     //replace user
     .put(UserController.replaceUser)
     //update user
     .patch(UserController.updateUser)



module.exports = router