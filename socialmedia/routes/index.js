const e = require('express');
const express=require('express');
const router=express.Router();
const {ensureAuth,ensureGuest}=require('../middleware/auth');
const Story=require('../models/story');

// @desc   Login/landing page
//@routes  GET /
router.get('/',ensureGuest,async(req,res)=>{
    res.render('login',{
        layout:'login'
    });
})

// @desc   dashboard/login page
//@routes  GET /dashboard
router.get('/dashboard',ensureAuth,async(req,res)=>{
    console.log(req.user);
    try {
        const stories=await Story.find({user:req.user._id}).lean();
        console.log(stories);
        res.render('dashboard',{stories:stories});
    } catch (err) {
        console.log(err);
        res.render('error/500');
    }

})






module.exports=router;