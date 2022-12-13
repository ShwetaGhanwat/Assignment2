const router = require("express").Router();
const Post = require("../models/Post");
const bodyParser = require("body-parser");

router.use(bodyParser.json());

// CRUD OPERATION

// CREATE
router.post("/posts", async (req, res) => {
  const { title, body, image } = req.body;
  try {
    const post = await Post.create({
      title: title,
      body: body,
      image: image,
      user: req.user,
    });
    res.status(200),
      json({
        status: "success",
        posts: post,
      });
  } catch (e) {
    res.status(400).json({
      status: "failed",
      message: e.message,
    });
  }
});

// READ
router.get("/posts", async (req, res) => {
  try {
    const post = await Post.find();
    res.status(200),
      json({
        status: "success",
        posts: post,
      });
  } catch (e) {
    res.status(400).json({
      status: "failed",
      message: e.message,
    });
  }
});

//UPDATE
router.put("/posts/:id",async(req,res)=>{
try{
    await Post.updateOne({_id:req.params.id},req.body);
    const post=await Post.find({_id:req.params.id});
    res.status(200).json({
        status:'success',
        posts:post
    });
}catch(e){
    res.status(400).json({
        status:"failed",
        message:e.message
    })
}
});

//DELETE
router.delete("/posts/:id",async(req,res)=>{
    try{
        const post=await Post.find({_id:req.params.id});
        await Post.deleteOne({_id:req.params.id});
        res.status(200).json({
            status:'success',
            posts:post
        });
    }catch(e){
        res.status(400).json({
            status:"failed",
            message:e.message
        });
    }
    });

module.exports = router;
