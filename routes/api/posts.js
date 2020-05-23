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

module.exports= router;
