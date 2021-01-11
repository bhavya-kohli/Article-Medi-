const express=require('express');
const passport = require('passport')
const router=express.Router();

// @desc   Auth with google
//@routes  GET /auth/google
router.get('/google',passport.authenticate('google',{scope:['profile']}))


// @desc   google auth callback
//@routes  GET /auth/google/callback
router.get('/google/callback',passport.authenticate('google',{ failureRedirect: '/' }),(req,res)=>{
    res.redirect('/dashboard');
});

// @desc   Logout
//@routes  GET /auth/logout
router.get('/logout',(req,res)=>{
    req.logOut();
    res.redirect('/');
})

module.exports=router;