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
    //Set global header links
    res.locals.links = [
        {name: "Create Post", url: "/post"}, 
        {name: "Manage Posts", url: "/manage"},
        {name: "Test", url: "/test"}
    ];
    // Set user session details
    res.locals.loggedIn = Boolean(req.session?.user);
    if (req.session?.user) {
        res.locals.welcomeMessage = `Hello, ${req.session.user.name}`;
    };
    next();
});

app.get("/", (req, res) => {
    res.render("index.ejs");
});

app.get("/post", (req, res) => {
    res.render("post.ejs");
});

app.post("/login", (req, res) => {
    req.session.user = { name: req.body.username };
    res.redirect("/");
})



app.listen(port, () => {
    console.log(`Running on port ${port}`);
});