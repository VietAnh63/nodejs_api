const express = require("express");

//Su dung logger de client request len cai gi
const logger = require("morgan");

//Config body-parser
const bodyParser = require("body-parser");

//Config config lib
const config = require("config");

//Config helmet to protect API
const secureApp = require("helmet");

//db Mongoose
const mongoClient = require("mongoose");

// connect mongodb by mongoose

// const uris = process.env.MONGODB_URI;
// mongoClient
//   .connect(uris, {
//     useCreateIndex: true,
//     useNewUrlParser: true,
//     useUnifiedTopology: true,
//   })
//   .then(() => {
//     console.log("connect successfully…");
//   })
//   .catch((error) => {
//     console.error(`connect failed with error : ${error}`);
//   });

mongoClient
    .connect("mongodb://localhost/nodejsapi", {
        useCreateIndex: true,
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then(() => {
        console.log("✅ connect successfully…");
    })
    .catch((error) => {
        console.error(`❌ connect failed with error : ${error}`);
    });

const app = express();
//use helmet
app.use(secureApp());

const routerUser = require("./routes/user");
const routerDeck = require("./routes/deck");
//Middlewares
app.use(logger("dev"));
app.use(bodyParser.json());

//Routes
app.use("/user", routerUser);
app.use("/deck", routerDeck);

app.get("/", (req, res, next) => {
    return res.status(200).json({ message: "Server is update OK" });
});

//Cath 404 errors
app.use((req, res, next) => {
    const err = new Error("Not found");
    err.status = 404;
    next(err);
});

//Function for handle error
app.use((err, req, res, next) => {
    console.log(err);
    //get error
    const error = app.get("env") === "♿ development" ? err : {};

    //get status of error
    const status = err.status || 500;

    //response to client
    return res.status(status).json({
        error: {
            message: error.message,
        },
    });
});

//const port = app.get("port") || 3000 || process.env.PORT;
const port = config.get("app.PORT");
app.listen(port, () => {
    console.log(`⛎ Server is listening on port ${port}`);
});
