const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const devuser = require("./devusermodel");
const jwt = require("jsonwebtoken");
const middleware = require("./middleware");
const Purchasemodel = require("./purchasemodel")
const consumermodel = require("./consumermodel")

const app = express();

mongoose.connect("mongodb://localhost:27017").then( () => {
    console.log("DB Connected")
})

app.use(express.json());
app.use(cors(
    origin = "*"
))


app.get('/',(req,res) => {
    res.send("Hello, world !!")
})

app.post('/register',async(req,res) => {
    try {
        const {username,email,password,confirmpassword} = req.body;
        const exist = await devuser.findOne({email});
        if(exist){
            res.status(403).send("User Already Existed !!")
        } else if(password !== confirmpassword){
            res.status(403).send("Passwords not Matching !!")
        } else{
            const newUser = await devuser({
                username,email,password,confirmpassword
            })
            newUser.save();
            return res.status(200).send("Registered successfully !!")
        }
    } catch (err) {
        console.log(err);
        res.status(500).send("Server Error !!");
    }
})

app.post('/login',async(req,res) => {
    try {
        const {email,password} = req.body;
        const exist = await devuser.findOne({email});
        if(!exist){
            return res.status(404).send("User not Found !!");
        } else if(exist.password !== password){
            return res.status(403).send("Incorrect Password !!")
        } else {
            const payload = {
                user : {
                    id : exist.id
                }
            }
            jwt.sign(payload,"jwtsecure",{expiresIn:3600000},
                (err,token) => {
                    if (err) throw err;
                    return res.json({token})
                }
            )
        }
    
    } catch (error) {
        console.log(error);
        res.status(500).send("Server Error !!")
    }
})

app.post('/purchase',async(req,res) => {
    try {
        const {email,cart,quantity,address} = req.body;
        const exist = await devuser.findOne({email});
        if(!exist){
            return res.status(404).send("Consumer not Found !!")
        } else {
            const newCart = await Purchasemodel({
                email,cart,quantity,address
            })
            newCart.save();
            return res.status(200).send("Your cart added successfully !!");
        }
    } catch (err) {
        console.log(err);
        return res.status(500).send("Server Error !!")
    }
})

app.post('/orders',async(req,res) => {
    const {email,password} = req.body;
    const exist = await devuser.findOne({email});
    const data = await Purchasemodel.find({email})
    if(!exist){
        return res.status(404).send("Consumer not found !!");
    }else if (password !== exist.password){
        return res.status(403).send("Incorrect password !!");
    } else{
         res.json(data)
    }
})

app.post('/addconsumer',async(req,res) => {
    const {name,address,email,password,vegetables,fruits} = req.body;
    let exist = await devuser.findOne({email});
    let exist1 = await consumermodel.findOne({email})
    if(!exist){
        return res.send("Adding consumer with registered email only !!");
    }else if(exist1){
        return res.send("User can Add cart one time only. if you want you can update.")
    }else if(exist.password !== password){
        return res.status(406).send("Invalid credintials")
    } else{
        newUser = await consumermodel({name,address,email,password,vegetables,fruits})
        newUser.save();
        return res.send("Your cart added successfully")
    }

})

app.get('/home',middleware,async(req,res) => {
    try {
        let exist = await devuser.findById(req.user.id);
        if(!exist){
            return res.status(404).send("token not found!!");
        } else {
            res.json(exist);
        }
    } catch (err) {
        console.log(err);
        return res.status(500).send("Server error !!")
    }
})

app.get('/consumers',async(req,res) => {
    try {
        const exist = await consumermodel.find({});
        if(!exist){
            return res.status(404).send("consumers are not register yet!!")
        }else{
         res.json(exist);
        }
    } catch (err) {
        console.log(err);
        return res.status(500).send("Server Error !!")
    }
})

app.listen(5000, () => {
      console.log("Server running..")
})