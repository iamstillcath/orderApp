const express = require("express");
const router= express.Router();
const mongoose =require("mongoose")

router.get("/", (req,res)=>{
    res.send("this is the product")
});

module.exports=router