const express=require('express');
const router=express.Router();
const {ensureAuth}=require('../middleware/auth');
const Story=require('../models/story');
const User=require('../models/user');
// @desc   Login/landing page
//@routes  GET /
router.get('/add',ensureAuth,async(req,res)=>{
  res.render('stories/add');  
})

router.post('',ensureAuth,async(req,res)=>{
    console.log(req.body);
    try{
        req.body.user=req.user._id;
        await Story.create(req.body);
        res.redirect('dashboard')
    }catch(err){
        console.log("error in saving story");
        res.render('error/500')
    }
})

router.post('/:id',ensureAuth,async(req,res)=>{
    console.log(req.body);
    try{
    const story=await Story.findOne({_id:req.params.id});
    for(const[key,value] of Object.entries(req.body)){
        story[key]=req.body[key];
    }
    await story.save();
     res.redirect('/stories');

    }catch(e){
        res.render('error/404');
    }
})

router.get('',ensureAuth,async(req,res)=>{
    try{
    const stories=await Story.find({status:"public"}).populate('user').sort({createdAt:'desc'}).lean();
    console.log(stories);
    res.render('stories/index',{stories:stories});
    }catch(err){
        console.log(err);
        res.render('error/500');
    }
}); 

router.get('/edit/:id',ensureAuth,async(req,res)=>{
    const story=await Story.findOne({_id:req.params.id}).lean();
    if(!story){
        return res.render('error/404');
    }
    else{
        res.render('stories/edit',{story:story});
    }
})

router.get('/:id',ensureAuth,async(req,res)=>{
    try{
        const story=await Story.findOne({_id:req.params.id}).populate('user').lean();
        if(!story){
            throw Error("Story is not available");
        }
        res.render('stories/show',{story:story});
    }catch(err){
        return res.render("error/404");
    }
    
})
router.get('/user/:id',ensureAuth,async(req,res)=>{
    try{
    const user=await User.findOne({_id:req.params.id});
    const stories=await Story.find({user:req.params.id,status:"public"}).populate('user').sort({createdAt:'desc'}).lean();
    return res.render('stories/index',{stories:stories});
    }catch(err){
        return res.render('error/404');
    }
})

// @desc    Delete story
// @route   DELETE /stories/:id
router.get('/delete/:id', ensureAuth, async (req, res) => {
    try {
      let story = await Story.findById(req.params.id).lean()
  
      if (!story) {
        return res.render('error/404')
      }
  
      if (story.user != req.user.id) {
        res.redirect('/stories')
      } else {
        await Story.remove({ _id: req.params.id })
        res.redirect('/dashboard')
      }
    } catch (err) {
      console.error(err)
      return res.render('error/500')
    }
  })

module.exports=router;