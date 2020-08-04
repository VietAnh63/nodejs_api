const express = require("express");
//const router = express.Router()
const path = require("path");
const router = require("express-promise-router")();

const ClientController = require("../controllers/client");

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

//Client
//return list clients and add new client
router
    .route("/")
    .get(ClientController.index)
    .post(
        upload.single("prd_image"),
        validateBody(schemas.clientSchema),
        ClientController.addClient
    );
router.route("/:page").get(ClientController.paginateClient);
//return one client
router
    .route("/:clientId")
    .get(
        validateParam(schemas.idSchema, "clientId"),
        ClientController.getClient
    )
    //replace client
    .put(
        upload.single("prd_image"),
        validateParam(schemas.idSchema, "clientId"),
        validateBody(schemas.clientSchema),
        ClientController.replaceClient
    )
    //update client
    .patch(
        upload.single("prd_image"),
        validateParam(schemas.idSchema, "clientId"),
        validateBody(schemas.clientUpadateSchema),
        ClientController.updateClient
    );

//Deck
router
    .route("/:clientId/decks")
    .get(validateParam(schemas.idSchema, "clientId"), ClientController.getDeck)
    .post(
        validateParam(schemas.idSchema, "clientId"),
        validateBody(schemas.deckSchema),
        ClientController.addDeck
    );

module.exports = router;
