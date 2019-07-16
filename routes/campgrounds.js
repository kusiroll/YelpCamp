var express = require("express");
var router = express.Router();
var Campground = require("../models/campground");
var middleware =require("../middleware");
//INDEX- show all campgrounds
router.get("/", function(req,res){
    //Get all campgrounds from DB
    Campground.find({}, function(err,allcampgrounds){
        if(err){
            console.log(err);
        }else{
            res.render("campgrounds/index", {campgrounds:allcampgrounds});
        }
    });
   
});

//CREATE- add new campground to DB
router.post("/",middleware.isLoggedIn, function(req,res){
    var name = req.body.name;
    var image = req.body.image;
    var price = req.body.price;
    var desc = req.body.description;
    var author ={
        id:req.user._id,
        username: req.user.username
    }
    var newCampground = {name: name,price:price, image: image,description:desc, author:author}
    
    //get data from form and add to campgrounds array
    Campground.create(newCampground,function(err,newlyCreated){
        if(err){
            console.log(err);
        }else{
            //redirect back to campgrounds page
            res.redirect("/campgrounds");
        }
    });
});


//NEW - show form to create new campground
router.get("/new", middleware.isLoggedIn, function(req,res){
    res.render("campgrounds/new");
});


//SHOW - shows more info about one campground
router.get("/:id", function(req,res){
    Campground.findById(req.params.id).populate("comments").exec(function(err,foundCampground){
        if(err){
            console.log(err);
        }else{
           
            res.render("campgrounds/show", {campground:foundCampground});
        }
    });
    
});

//EDIT CAMPGROUND ROUTE
router.get("/:id/edit",middleware.checkCampgroundOwnership, function(req,res){
        Campground.findById(req.params.id, function(err,foundCampground){
            res.render("campgrounds/edit", {campground:foundCampground});
               
        //otherwise redirect
    });
});
//UPDATE CAMPGROUND ROUTES
router.put("/:id",middleware.checkCampgroundOwnership,function(req,res){
    //find and update the correct campground 
    
    Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(err, upddatedCampground){
        if(err){
            res.redirect("/campgrounds");
        }else{
            //note res.updatedCampground._id also has the id
            //redirect somewhere (showpage)
            res.redirect("/campgrounds/" + req.params.id);
        }
    });
    
});

//DESTROY CAMPGROUND ROUTE
router.delete("/:id",middleware.checkCampgroundOwnership,function(req,res){
   Campground.findByIdAndRemove(req.params.id,function(err){
       if(err){
           res.redirect("/campgrounds");
       }else{
        res.redirect("/campgrounds");
       }
   });
});




module.exports = router;