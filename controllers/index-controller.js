const userModel = require("../models/user-models");
const hisaabModel = require("../models/hisaab-model");
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken");

module.exports.landingpageController = (req, res)=>{
    res.render("index", {loggedIn:false});
}

module.exports.registerPageController = (req, res)=>{
    res.render("register");
}

module.exports.registerController = async (req, res)=>{
    try{
        let{email, password, username, name} = req.body;
        let user = await userModel.findOne({email});
     
        if(user)return res.render("you already have an account,  please login");
     
        let salt = await bcrypt.genSalt(10);
        let hashed = await bcrypt.hash(password, salt);
     
        user = await userModel.create({
         email, 
         name, 
         username,
         password:hashed,
     });
     let token = jwt.sign({id: user._id, email: user.email}, process.env.JWT_KEY);

     res.cookie("token", token);
     res.render("index");

    }
    catch(err){
        res.send(err.message);
    }
  
};

module.exports.loginController = async (req, res)=>{
   let{email, password} = req.body;

   let user = await userModel.findOne({email}).select("+password");
   if(!user) return res.send("you dont have account plz create");

   let result = await bcrypt.compare(password, user.password);
   if(result){
    let token = jwt.sign({id: user._id, email: user.email}, process.env.JWT_KEY);

    res.cookie("token", token);
    res.redirect("/profile");

   }else{
    res.send("you details are incorrect ")
   }
  
}

module.exports.logoutController = async(req, res)=>{
   res.cookie("token", "");
    return res.redirect("/");
}

module.exports.profileController =  async function(req, res){
    let byDate = Number (req.query.byDate);
    let {startDate, endDate} = req.query;

    byDate = byDate ? byDate : -1;
    startDate = startDate ? startDate : new Date ("1970-02-02");
    endDate = endDate ? endDate : new Date();


    let user = await userModel.findOne({email: req.user.email}).populate({
        path : "hisaab",
        match : {createAt :{ $gte: startDate, $lte: endDate}},
        options : {sort : {createAt : byDate}}
    })
    res.render("profile", {user});
}


