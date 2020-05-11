const express = require('express');
const router = express.Router();
const gravatar= require('gravatar');
const bcrypt= require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('config');
const { check, validationResult } = require('express-validator/check');
const User = require('../../models/User')//to bring in my user model
// @route   POST api/users
// @desc    Register user
// @access  Public
//    can incoportate some validation of the request/ info entered.....
router.post('/bilbo', [//so im basically checking here for 3 objcts name, email, password...
    check('name','Name is needed')//thst the objects(json)are in the request......
        .not()
        .isEmpty(),
    check('email','Please include email').isEmail(),
    check('password','Please enter passyword with 6 at least').isLength({min: 6})    
], async (req,res) => { //i added the async as i want to make my callback fnct async to use async await..
    const errors = validationResult(req);
    console.log(req.body);
    if(!errors.isEmpty()){
        return res.status(400).json({ errors: errors.array()});
    }

    const {name, email, password } = req.body;
    try{ //find out if user already exists
        let user = await User.findOne({email});
        if(user){
            return res.status(400).json({ errors: [{msg: 'User already exists'}] });
        }
    //get users gravatar
    const avatar = gravatar.url(email, {
        s: '200',
        r: 'pg',
        d: 'mm'
    })

    user= new User({
        name,
        email,
        avatar,
        password
    });

    //ill encrypt the password
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);
     
    await user.save();
    // to return a jsonwebtoken
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
    //res.send('User Registererd');
    }catch(err){
        console.error(err.message);
        res.status(500).send('Server error');
    }



    
});

module.exports= router;
