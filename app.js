
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const _ = require("lodash");
const mongoose = require("mongoose");
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/blogsDB", {useNewUrlParser: true, useUnifiedTopology: true});

const blogSchema = mongoose.Schema(
    {
        heading: {
            type: String,
            required: [true, "HEADING_MISSING"]
        },
        content: {
            type: String,
            required: [true, "CONTENT MISSING"]
        }
    }
);

const Blog = mongoose.model("Blog", blogSchema);

// Gets
app.get("/", function(req, res) {

    Blog.find({}, function(err, blogs) {
        if(!err) {
            res.render("home", {blogs:blogs});
        }
    });
    // res.sendFile(__dirname + "/index.html");

});

app.get("/contact", function(req, res) {
    res.render("contact"); 
});

app.get("/about", function(req, res) {
    res.render("about");
});

app.get("/compose", function(req, res) {
    res.render("compose");
});

// posts
app.post("/add", function(req, res) {
    const postedHeading = req.body.heading;
    const postedContent = req.body.content;

        const newBlog = new Blog ({
            heading: postedHeading,
            content: postedContent
        });
        newBlog.save();

    console.log("successfully added blog to Blogs Database");
    res.redirect("/");
});

app.post("/delete", function(req, res) {
    
    const ID = req.body.itemToDelete;

    Blog.findByIdAndDelete(ID, function(err) {
        if(!err) {
            console.log("successfully deleted blog");
        }
    });
    res.redirect("/");
});

app.get("/posts/:id", function(req, res) {
    
    const id = req.params.id;

    Blog.findOne({_id: id}, function(err, foundBlog) {
        if(!err) {
            if(!foundBlog) {
                console.log("not found");
            }
            else {
                res.render("blog", {blogs : foundBlog});
                console.log(foundBlog);
            }
        }
    });
});



let port = process.env.PORT;

if(port == null || port=="") {
    port = 3000;
}

app.listen(port, function(req, res) {
    console.log("server connected successfullly");
});

