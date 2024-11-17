const mongoose = require('mongoose');
const Chat = require("./models/chat.js");


main()
    .then(() => console.log("connection"))
    .catch((err) => console.log(err));

async function main() {
    await mongoose.connect('mongodb://127.0.0.1:27017/Whatsapp');
}

let allchats= [
     {
        from: "neha",
        to: "priya",
        msg: "send me exam notes", 
        created_at: new Date(),
        } ,
        {
            from: "priti",
            to: "neha",
            msg: "send me sst notes", 
            created_at: new Date(),
            } ,
            {
                from: "mayu",
                to: "priya",
                msg: "send me maths notes", 
                created_at: new Date(),
                } ,
]


Chat.insertMany(allchats);