const express = require("express");
const app = express();
const mongoose = require('mongoose');
const path = require("path");
const Chat = require("./models/chat.js");
const methodOverride = require("method-override");

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({extended: true}));
app.use(methodOverride("_method"));

main()
    .then(() => console.log("connection"))
    .catch((err) => console.log(err));

async function main() {
    await mongoose.connect('mongodb://127.0.0.1:27017/Whatsapp');
}

//index route
app.get("/chats" , async(req , res) =>{
    let chats = await Chat.find();
    // console.log(chats);
    res.render("index.ejs" , {chats});
});

//new route
app.get("/chats/new",(req , res)=> {
       res.render("new.ejs");
})

//Create Route
app.post("/chats" , (req , res) => {
    let{from , to , msg} = req.body;
    let newChat = new Chat({
        from : from,
        to : to,
        msg : msg,
        created_at : new Date()
    });
    newChat
    .save()
    .then((res) => {
        console.log("chat was saved");
    })
    .catch((err) =>{
        console.log(err);
    })
    res.redirect("/chats");
});


// Edit Route
app.get("/chats/:id/edit", async (req, res) => {
    let { id } = req.params;
    id = id.trim(); // Remove extra spaces
    
    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).send('Invalid ObjectId');
    }

    let chat = await Chat.findById(id);
    if (!chat) {
        return res.status(404).send('Chat not found');
    }

    console.log(chat);
    res.render("edit.ejs", { chat });
});

//update route
app.put("/chats/:id", async (req, res) => {
    let { id } = req.params;
    let { msg: newMsg } = req.body;

    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).send("Invalid ObjectId");
    }

    try {
        let updatedChat = await Chat.findByIdAndUpdate(
            id,
            { msg: newMsg },
            { runValidators: true, new: true } // Enable validation and return updated document
        );

        if (!updatedChat) {
            return res.status(404).send("Chat not found");
        }

        console.log(updatedChat);
        res.redirect("/chats");
    } catch (error) {
        console.error(error);
        res.status(500).send("Error updating the chat");
    }
});

//Destroy Route
app.delete("/chats/:id", async (req, res) => {
    let { id } = req.params;
    let deletedchat = await Chat.findByIdAndDelete(id);
    console.log(deletedchat);
    res.redirect("/chats");
});




// Creating a new chat document
// let chat1 = new Chat({
//     from: "neha",
//     to: "priya",
//     msg: "send me exam notes", 
//     created_at: new Date()   
// });

// Save the chat document
// chat1.save()
//     .then((res) => console.log(res))

app.get("/", (req, res) => {
    res.send("root is working");
});

app.listen(8080, () => {
    console.log("server is listening");
});
