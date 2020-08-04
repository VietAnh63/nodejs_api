const express = require("express");
//const router = express.Router()
const path = require("path");
const router = require("express-promise-router")();

const UserController = require("../controllers/user");

const { validateParam, validateBody, schemas } = require("../helpers");

//Using multer
var multer = require("multer");
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.resolve("public", "upload"));
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + "-" + file.originalname);
    },
});
var upload = multer({
    storage: storage,
    fileFilter: function (req, file, cb) {
        console.log(file);
        if (
            file.mimetype == "image/bmp" ||
            file.mimetype == "image/jpg" ||
            file.mimetype == "image/jpeg" ||
            file.mimetype == "image/png"
        ) {
            cb(null, true);
        } else {
            return cb(new Error("Only image are allow"));
        }
    },
});

//import passport
const passport = require("passport");
require("../middlewares/passport");

//User
//return list users and add new user
router
    .route("/")
    .get(UserController.index)
    .post(
        upload.single("prd_image"),
        validateBody(schemas.userSchema),
        UserController.addUser
    );

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
    .post(
        upload.single("prd_image"),
        validateBody(schemas.authSignUpSchema),
        UserController.signUp
    );

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

// //return one user
// router
//     .route("/:userId")
//     .get(validateParam(schemas.idSchema, "userId"), UserController.getUser)
//     //replace user
//     .put(
//         validateParam(schemas.idSchema, "userId"),
//         validateBody(schemas.userSchema),
//         UserController.replaceUser
//     )
//     //update user
//     .patch(
//         validateParam(schemas.idSchema, "userId"),
//         validateBody(schemas.userUpadateSchema),
//         UserController.updateUser
//     );

module.exports = router;
