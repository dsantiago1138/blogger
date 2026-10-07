import express from "express";
import bodyParser from "body-parser";
import session from "express-session";

const app = express();
const port = 3000;
const secretKey = "fishbulb1138";

const posts = [];

app.use(bodyParser.urlencoded( { extended: true} ));

// 2. Configure session middleware before routes/custom middleware
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
    res.locals.posts = posts;
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

app.get("/manage", (req, res) => {
    res.render("manage.ejs");
});

app.post("/login", (req, res) => {
    req.session.user = { name: req.body.username };
    res.redirect("/");
})

app.post("/createPost", (req, res) => {
    const newPost = {
        title: req.body["title"],
        content: req.body["content"],
    };
    posts.push(newPost);
    res.redirect("/");
});

app.post("/deletePost", (req, res) => {
    const postTitle = req.body.title;
    const index = posts.findIndex(post => post.title === postTitle );

    if (index !== -1) {
        posts.splice(index, 1);
    }
    res.redirect("/manage");
});


app.listen(port, () => {
    console.log(`Running on port ${port}`);
});