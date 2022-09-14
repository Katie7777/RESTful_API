//set up npi packages
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
//create new app
const app = express();

//use ejs templating enging
app.set('view engine','ejs');

//pass our requests
app.use(bodyParser.urlencoded({extended: true}));
//store static files:images, css
app.use(express.static("public"));

//set up mongoDB
mongoose.connect("mongodb://localhost:27017/wikiDB");

const articleSchema = {
  title: String,
  content: String
};

const Article = mongoose.model("article",articleSchema);

////////////////requesting tartgeting all articles
//chained route handler using express-single route
//Build RESTful API
app.route("/articles")
//GET ALL articles in wikiDB:client try to make get request on our /article route
.get(function(req,res){
  Article.find({}, function(err, foundArticles){
    if(!err){
      res.send(foundArticles);
    }else{
      res.send(err);
    }

  });

})
//client make a post request to create a new article and add it to collection
//use postman to post requests
.post(function(req,res){
  const newArticle = new Article({
    title:req.body.title,
    content:req.body.content
  });
  newArticle.save(function(err){
    if(!err){
      res.send("Successully add the new article.");
    }else{
      res.send(err);
    }
  });

})
  //delete all articles in /articles route
.delete(function(req,res){
  Article.deleteMany({},function(err){
    if(!err){
      res.send("succefully delete all articles");
    }else{
      res.send(err);
    }
  });
});

////////////////requesting tartgeting specific articles
app.route("/articles/:articleTitle")//SPACE: %20

//find one article in the database
.get(function(req,res){

  Article.findOne({title: req.params.articleTitle}, function(err, foundArticle){
    if(foundArticle){
      res.send(foundArticle);
    }else{
      res.send("No articles matching that title article.");
    }
  });
})

//overwrite the artile
.put(function(req,res){
  Article.updateOne(
    {title: req.params.articleTitle},
    {title:req.body.title, content: req.body.content},
    function(err){
      if(!err){
        res.send("Successfully updated article.");
      }

    }
  );
})

//update sepcific field in specific document
.patch(function(req, res){
  Article.updateOne(
    {title: req.params.articleTitle},
    {$set:req.body},
    function(err){
      if(!err){
        res.send("Seccussfullly updated article.");
      }else{
        res.send(err);
      }
    }
  );
})

//delete specific article
.delete(function(req,res){
  Article.deleteOne(
    {title: req.params.articleTitle},
    function(err){
      if(!err){
        res.send("Secccessfully delete article.");
      }else{
        res.send(err);
      }
    }

  );
});


app.listen(3000, function(){
  console.log("Server started on port 3000");
});
