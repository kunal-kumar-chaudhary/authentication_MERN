const express = require("express");
const app = express();
const cors = require("cors");
const mongoose = require("mongoose");
const User = require("./models/user.model");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
//connect to db
mongoose.connect("mongodb://localhost:27017/registration");

//middlewares
app.use(cors());
app.use(express.json()); // parse anything that comes as request into json

//routes

app.get("/api/quote", async (req, res) => {
    const token = req.headers["x-access-token"];
    // here we are trying to verify the token and take out email from it
    try{
    const decoded = jwt.verify(token, "secret");
    const email = decoded.email;
    const  user = await User.findOne({email: email});
    return res.json({status: "ok", quote: user.quote});
    }
    catch(err){
        return res.json({status: "error", error: "invalid token, please login"});
    }
});

// steps:-
// 1. get the token from the header
// 2. verify the token
// 3. get the email from the token
// 4. find the user with the email
// 5. update the quote of the user
// 6. return the response
  
app.post("/api/quote", async (req, res) => {
    const token = req.headers["x-access-token"];
    // here we are trying to verify the token and take out email from it
    try{
    const decoded = jwt.verify(token, "secret");
    const email = decoded.email;
    await User.updateOne({email: email}, {$set: {quote: req.body.quote}});
    return res.json({status: "ok"});
    }
    catch(err){
        return res.json({status: "error", error: "invalid token"});
    }
});
  


app.post("/api/register", async (req, res) => {
  const { name, email, password } = req.body;
  const newPassword = await bcrypt.hash(password, 10);
  try {
    const user = await User.create({
      name,
      email,
      password: newPassword,
    });
    res.json({status: "ok"});
  } catch (err) {
    res.json({status: "error"});
  }
});

app.post("/api/login", async (req, res) => {
      const user = await User.findOne({ email: req.body.email})
      const isPasswordValid = await bcrypt.compare(req.body.password, user.password);

      if(!user){
        return res.json({status: "error", error: "Invalid login credentials"});
      }

        if (isPasswordValid){
            const token = jwt.sign({
                name: user.name,
                email: user.email,
            }, "secret", {expiresIn: "1h"});
            return res.json({status: "ok", user:token}); 
        }
        else{
            return res.json({status: "error", user:false});
        }
  });


app.listen(3000, (req, res) => {
  console.log(`app listening on port ${3000}`);
});
