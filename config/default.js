module.exports = {
    jsonwebtoken: {
        JWT_SECRET: process.env.JWT_SECRET,
    },
    app: {
        PORT: process.env.PORT || 3000,
    },
    auth: {
        google: {
            CLIENTID:
                "275064651484-dbh21k37393gotnq1sujjbqiib8k6t26.apps.googleusercontent.com",
            CLIENTSECRET: "SqpKF46-YB8QjXXxheobSeJp",
        },
        facebook: {
            CLIENTID: "774990373269672",
            CLIENTSECRET: "3df433546150ec72d34fd2ed68249f8d",
        },
    },
};
