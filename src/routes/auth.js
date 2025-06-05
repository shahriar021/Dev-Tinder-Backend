const express = require("express");
const User = require("../model/User");
const bcrypt = require("bcrypt");
const { validateData } = require("../utils/validate");
const salt = 10;
const dotenv = require("dotenv");
dotenv.config();
const authCheck = require("../middlewares/auth");

const JWT = require("jsonwebtoken");

const authRouter = express.Router();

authRouter.post("/signUp", async (req, res) => {
  try {
    validateData(req);
    const { name, cell, password } = req.body;
    const hasP =await bcrypt.hash(password, 10);
    console.log(hasP)
    const user = new User({ name, cell, password: hasP });
    await user.save();
    res.send("user added.",user);
  } catch (err) {
    console.log("some error.", err);
    res.send("some error.");
  }
});

authRouter.post("/login", async (req, res) => {
  const { cell, password } = req.body;

  try {
    const user = await User.findOne({ cell: cell });

    if (!user) {
      return res.status(404).send("User not found.");
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).send("Invalid password.");
    }
    if (isPasswordValid) {
      const token = JWT.sign({ id: user._id }, process.env.JWT_SECRET);

      res.cookie("token", token);

      return res.status(200).json({ message: "Login successful.", token });
    }
  } catch (err) {
    console.error("Login error:", err);
    return res.status(500).send("Internal server error.");
  }
});

authRouter.post("/logout",async(req,res)=>{
    try{
      res.cookie("token",null,{expires:
        new Date(Date.now())
        
      })
      res.send("logout successfull")

    }catch(err){
       res.send("something went wrong!")
    }
})

module.exports = authRouter;
