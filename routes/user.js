const express = require("express");
//const router = express.Router()

const router = require("express-promise-router")();

const UserController = require("../controllers/user");

const { validateParam, validateBody, schemas } = require("../helpers");

//import passport
const passport = require("passport");
require("../middlewares/passport");

//User
//return list users and add new user
router
    .route("/")
    .get(UserController.index)
    .post(validateBody(schemas.userSchema), UserController.addUser);

//OAuth google
router
    .route("/auth/google")
    .post(
        passport.authenticate("google-plus-token", { session: false }),
        UserController.authGoogle
    );

//OAuth facebook
router
    .route("/auth/facebook")
    .post(
        passport.authenticate("facebook-token", { session: false }),
        UserController.authFacebook
    );

//signup, signin, secret
router
    .route("/signup")
    .post(validateBody(schemas.authSignUpSchema), UserController.signUp);

router
    .route("/signin")
    .post(
        validateBody(schemas.authSignInSchema),
        passport.authenticate("local", { session: false }),
        UserController.signIn
    );

router
    .route("/secret")
    .get(
        passport.authenticate("jwt", { session: false }),
        UserController.secret
    );

//return one user
router
    .route("/:userId")
    .get(validateParam(schemas.idSchema, "userId"), UserController.getUser)
    //replace user
    .put(
        validateParam(schemas.idSchema, "userId"),
        validateBody(schemas.userSchema),
        UserController.replaceUser
    )
    //update user
    .patch(
        validateParam(schemas.idSchema, "userId"),
        validateBody(schemas.userUpadateSchema),
        UserController.updateUser
    );

//Deck
router
    .route("/:userId/decks")
    .get(validateParam(schemas.idSchema, "userId"), UserController.getDeck)
    .post(
        validateParam(schemas.idSchema, "userId"),
        validateBody(schemas.deckSchema),
        UserController.addDeck
    );

module.exports = router;
