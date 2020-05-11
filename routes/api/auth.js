const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const User = require('../../models/User');

// @route   GET api/auth
// @desc    Test route
// @access  Public
//here i just added 'auth' to my get directive as another(2nd) parameter.....
router.get('/akey', auth, async (req,res) => {
    try {//using a try catch here (and labelled it async)cos im going to make call to db...
        const user = await User.findById(req.user.id).select('-password'); //
        res.json(user);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('SeRvEr erred')
    }
});

module.exports= router;
