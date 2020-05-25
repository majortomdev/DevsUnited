const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const authMe = require('../../middleware/auth');

const Post = require('../../models/Posts');
const Profile = require('../../models/Profile');
const User = require('../../models/User');

// @route   POST api/posts
// @desc    Create a Post
// @access  Private
router.post('/rambling',[authMe, [
    check('text','need some text for a post!!').not().isEmpty()
]], async (req,res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({ errors: errors.array()});
    }

    try {
        const user = await User.findById(req.user.id).select('-password');

        const newPost = new Post({
            text: req.body.text,
            name: user.name,
            avatar: user.avatar,
            user: req.user.id
        });

        const post = await newPost.save();

        res.json(post);
    } catch (oops) {
        console.error(oops.message);
        res.status(500).send('Server Error in POST post method..');
    }

});

// @route   GET api/posts
// @desc    get all posts
// @access  Private

router.get('/rambling', authMe, async (req,res) => {
    try {
        const posts = await Post.find().sort({ date: -1});// for most recent first, 1 for oldest first..
        res.json(posts);
    } catch (oops) {
        console.error(oops.message);
        res.status(500).send('SErvER error');
    }
})

// @route   GET api/posts/:id
// @desc    get post by id
// @access  Private

router.get('/rambling/:id', authMe, async (req,res) => {
    try {
        const post = await Post.findById(req.params.id);

        if(!post){
            return res.status(404).json({ msg: 'Post not found' });
        }
        res.json(post);
    } catch (oops) {
        console.error(oops.message);
        if(oops.name == 'CastError'){  
            return res.status(400).json({msg: 'Post not found'});
        }
        res.status(500).send('SErvER error');
    }
});

// @route   DELETE api/posts/:id
// @desc    delete a post by id
// @access  Private

router.delete('/rambling/:id', authMe, async (req,res) => {
    try {
        const post = await Post.findById(req.params.id);
        if(!post){
            return res.status(404).json({ msg: 'Post not found' });
        }

        if(post.user.toString() !== req.user.id){
            return res.status(401).json({ msg: 'User not authorised' });
        }

        await post.remove();
        res.json({ msg: 'Post removed' });
    } catch (oops) {
        console.error(oops.message);
        if(oops.name == 'CastError'){  
            return res.status(400).json({msg: 'Post not found'});
        }
        res.status(500).send('SErvER error');
    }
});

// @route   PUT api/posts/like/:id
// @desc    like a post
// @access  Private
router.put('/like/:id',authMe, async(req,res) => {
    try {
        console.log("made it past first...")
        const post = await Post.findById(req.params.id);
    //myst check if post has alreadt been liked by this user
    if(post.likes.filter(like => like.user.toString() === req.user.id).length >0 ){
        return res.status(400).json({ msg: 'Post already liked' });
    }

    post.likes.unshift({ user: req.user.id });

    await post.save();

    res.json(post.likes);
    } catch (oops) {
        console.error;
        res.status(500).send('Server Error in PUT likes...')
    }
});

// @route   PUT api/posts/unlike/:id
// @desc    Unlike a post
// @access  Private
router.put('/unlike/:id',authMe, async(req,res) => {
    try {
        console.log("made it past first...")
        const post = await Post.findById(req.params.id);
     
    if(post.likes.filter(like => like.user.toString() === req.user.id).length === 0 ){
        return res.status(400).json({ msg: 'Post has not yet been liked' });
    }
    // to get an index i can remove with
    const removeIndex = post.likes.map(like => like.user.toString()).indexOf(req.user.id);

    post.likes.splice(removeIndex, 1);

    await post.save();

    res.json(post.likes);
    } catch (oops) {
        console.error;
        res.status(500).send('Server Error in PUT unlikes...')
    }
});

module.exports= router;
