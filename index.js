import express from "express";

const app = express();
const port = 3000;

app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));

let posts = [
    { id: 1 , title: "Example Post", content: "Example Content"}
]


app.get("/", (req,res) =>{
    res.render("index",{ posts: posts });
})

app.post("/submit", (req,res) =>{
    const newPost = {
        id : posts.length ,title: `Post #${posts.length}`, content: req.body["content"]
    };
    posts.push(newPost);
    console.log(newPost.id)
    res.render("index", {
        posts : posts
    });
})

app.post("/delete", (req,res) =>{

    const currentId = req.body.id;
    console.log(currentId)
    posts.splice(currentId, 1)
    res.render("index", {
        posts : posts
    });
})

app.listen(port, () => {
    console.log("Server up")
})