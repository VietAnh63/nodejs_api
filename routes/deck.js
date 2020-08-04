const express = require("express");
//const router = express.Router()

//replace try catch
const router = require("express-promise-router")();

const DeckController = require("../controllers/deck");

const { validateParam, validateBody, schemas } = require("../helpers");

//User
//return list users and add new user
router
    .route("/")
    .get(DeckController.index)
    .post(validateBody(schemas.newDeckSchema), DeckController.addDeck);
router.route("/:page").get(DeckController.paginateDeck);
router
    .route("/:deckId")
    .get(validateParam(schemas.idSchema, "deckId"), DeckController.getDeck)
    .put(
        validateParam(schemas.idSchema, "deckId"),
        validateBody(schemas.newDeckSchema),
        DeckController.replaceDeck
    )
    .patch(
        validateParam(schemas.idSchema, "deckId"),
        validateBody(schemas.deckUpdateSchema),
        DeckController.updateDeck
    )
    .delete(
        validateParam(schemas.idSchema, "deckId"),
        DeckController.deleteDeck
    );

module.exports = router;
