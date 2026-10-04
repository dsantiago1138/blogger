import express from "express";
import bodyParser from "body-parser";
import session from "express-session";

const app = express();
const port = 3000;
const secretKey = "fishbulb1138";

app.use(bodyParser.urlencoded( { extended: true} ));

// 2. Configure session middleware before your routes/custom middleware
app.use(
    session({
        secret: secretKey,
        resave: false,
        saveUninitialized: false,
    })
);

app.use((req, res, next) => {
    // Access the loggedIn status from req.session
    res.locals.loggedIn = Boolean(req.session?.user);
    if (req.session?.user) {
        res.locals.welcomeMessage = `Hello, ${req.session.user.name}`;
    };
    next();
});

app.get("/", (req, res) => {
    res.render("index.ejs", {
        loggedIn: res.locals.loggedIn,
        links: [
            {name: "Create Post", url: "/post"}, 
            {name: "Home", url: "/home"}
        ]
    });
});

app.post("/login", (req, res) => {
    req.session.user = { name: req.body.username };
    res.redirect("/");
})



app.listen(port, () => {
    console.log(`Running on port ${port}`);
});