const express =require('express')
const router = express.Router()

const Post = require('../Models/Post')

// POST (Create data)
router.post('/',async(req,res)=>{
    //console.log(req.body)

    const postData = new Post({
        title:req.body.title,
        topics:req.body.topics,
        messageBody:req.body.messageBody,
        expirationTime:req.body.expirationTime,
        owner:req.body.owner,
        Status:req.body.Status,
        likes:req.body.likes,
        dislikes:req.body.dislikes,
        comments:req.body.comments
    })
    // try to insert...
    try{
        const postToSave = await postData.save()
        res.send(postToSave)
    }catch(err){
        res.send({message:err})
    }
})

// GET 1 (Read all)
router.get('/', async(req,res) =>{
    try{
        const getPosts = await Post.find().limit(10)
        res.send(getPosts)
    }catch(err){
        res.send({message:err})
    }
})
// GET 2 (Read by ID)
router.get('/:postId', async(req,res) =>{
    try{
        const getPostById = await Post.findById(req.params.postId)
        res.send(getPostById)
    }catch(err){
        res.send({message:err})
    }
})

// PATCH (Update)
router.patch('/:postId', async(req,res) =>{
    try{
        const updatePostById = await Post.updateOne(
            {_id:req.params.postId},
            {$set:{
                title:req.body.title,
                topics:req.body.topics,
                messageBody:req.body.messageBody,
                expirationTime:req.body.expirationTime,
                owner:req.body.owner,
                Status:req.body.Status,
                likes:req.body.likes,
                dislikes:req.body.dislikes,
                comments:req.body.comments
                }
            })
        res.send(updatePostById)
    }catch(err){
        res.send({message:err})
    }
})

// DELETE (Delete)
router.delete('/:postId',async(req,res)=>{
    try{
        const deletePostById = await Post.deleteOne({_id:req.params.postId})
        res.send(deletePostById)
    }catch(err){
        res.send({message:err})
    }
})

router.post("/:postId/comments", async (req, res) => {
    const userId = req.body.userId;
    const postId = req.params.postId;
    const message = req.body.message;

    const commentData = {
        userId,
        message
    }
    // console.log(commentData)
    if (!commentData.userId || !commentData.message) {
        res.status(400).json({message: "Bad request"});
    }
    try{
        const post = await Post.findById(postId);
        if (!post){
            console.log("Post was not found");
            res.status(404).json({message: "Post was not found!"});
        } else {
            const allComments = post.comments;
            post.comments = [...allComments, commentData]
            await post.save();
            res.status(200).json({message: "Comment was successfully added."})
        }
    }
    catch(error){
        console.log(error.message)
        res.status(500).json({message: "Server Error"})
    }
})


router.post("/:postId/likes", async (req, res) => {
    const postId = req.params.postId;
    let userId = req.body.userId;

    if (!postId || !userId){
        return res.status(404).json({message: "Post ID and User Id is required!"});
    }
    
    try{
        const post = await Post.findById(postId);
        if (!post){
            console.log("Post was not found");
            res.status(404).json({message: "Post was not found!"});
        } else {
            const userLikers = post.likes;
            const userExists = userLikers.find(user_id => user_id === userId)

            if (userExists) {
                // remove userId from likes
                const newSetOfUsers = userLikers.filter(user_id => userId !== user_id);
                post.likes = newSetOfUsers;
                await post.save();
                res.json({message: "User has been removed as a liker"});
            } else {
                // add userId to 
                post.likes = [...userLikers, userId];
                await post.save()
                res.json({message: "User has been added as a liker"});
            }

        }
    }
    catch(error){
        console.log(error)
        res.status(500).json({message: "Server Error"})
    }

})

module.exports = router