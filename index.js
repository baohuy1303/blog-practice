import express from "express";
import { pipeline } from "@xenova/transformers";

const app = express();
const port = 3000;
const pipe = await pipeline("sentiment-analysis");

app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());



let posts = [
    { id: 0 , title: "Example Post", content: "Example Content"}
]



app.get("/", async (req,res) =>{
    res.render("index",{ 
        posts: posts
    });
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

app.post('/update', (req, res) => {
    const { id, title, content } = req.body;

    const itemIndex = posts.findIndex(item => item.id === Number(id));

    if (itemIndex !== -1) {
        posts[itemIndex].content = content;
        console.log('Updated Array:', posts);

        res.json(posts);
    } else {
        res.status(404).json({ message: 'Item not found' }); 
    }
});

app.post("/analyze", async (req,res)=>{
    const { id, title, content } = req.body;
    const result = await pipe(content);
    console.log(result[0].label);
    res.json({
        analysis: result[0].label
    })
})



app.listen(port, () => {
    console.log("Server up")
})