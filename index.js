import express from "express";
import { pipeline } from "@xenova/transformers";
import multer from "multer";
import path from "path";
import fs from "fs";
import { fileURLToPath } from 'url';


const app = express();
const port = 3000;
const pipe = await pipeline("sentiment-analysis", 'Xenova/bert-base-multilingual-uncased-sentiment');


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, uploadDir)
    },
    filename: function (req, file, cb) {
      cb(null, file.originalname)
    }
  })
  
const upload = multer({ storage: storage })

app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(express.static('uploads'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());



let posts = [
    { id: 0 , title: "Example Post", content: "Example Content", coverIMG: ""}
]



app.get("/", async (req,res) =>{
    res.render("index",{ 
        posts: posts
    });
})

app.post("/submit", upload.single('coverimg'), (req,res) =>{
    const newPost = {
        id : posts.length ,title: `Post #${posts.length}`, content: req.body["content"], coverIMG: req.file.filename
    };
    console.log(req.file.filename)
    posts.push(newPost);
    console.log(newPost.id)
    res.render("index", {
        posts : posts
    });
})

app.post("/delete", (req,res) =>{
    const currentId = req.body.id;
    const filePath = path.join(__dirname, 'uploads',posts[currentId].coverIMG);
    fs.unlink(filePath, (err) => {
        if (err) {
          console.error('Error deleting file:', err);
          return;
        }
        console.log('File deleted successfully');
      });
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