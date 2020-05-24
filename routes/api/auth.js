const express = require('express');
const router = express.Router();
const authMe = require('../../middleware/auth');
const User = require('../../models/User');
const { check, validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');
const bcrypt= require('bcryptjs');
const config = require('config');

// @route   GET api/auth
// @desc    Test route
// @access  Public
//here i just added 'authMe' to my get directive as another(2nd) parameter.....
router.get('/akey', authMe, async (req,res) => {
    try {//using a try catch here (and labelled it async)cos im going to make call to db...
        const user = await User.findById(req.user.id).select('-password'); // to make sure to disclude..
        // ....the password in the resultset
        res.json(user);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('SeRvEr erred')
    }
});

// @route   POST api/auth/akey
// @desc    authenticate user and get token
// @access  Public

router.post('/akey', [ 
    check('email','Please include email').isEmail(),
    check('password','password is required').exists()   
], async (req,res) => {  
    const errors = validationResult(req);
    console.log(req.body);
    if(!errors.isEmpty()){
        return res.status(400).json({ errors: errors.array()});
    }

    const { email, password } = req.body;
    try{ //find out if user exists
        let user = await User.findOne({email});
        if(!user){
            return res
            .status(400)
            .json({ errors: [{msg: 'invaLID credEntials'}] });
        }

    const isMatch = await bcrypt.compare(password, user.password);

    if(!isMatch) {
        return res
        .status(400)
        .json({ errors: [{msg: 'invaLID credEntials'}] });
    }

    const payload = {
        user: {
            id: user.id
        }
    }
    jwt.sign(
        payload, 
        config.get('jwtSecret'),
        { expiresIn: 360000},
        (err, token) => {
            if(err) throw err;
            res.json({ token });
        });
    
    }catch(err){
        console.error(err.message);
        res.status(500).send('Server error');
    }



    
});


module.exports= router;
