const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const { check, validationResult } = require('express-validator');

const Profile = require('../../models/Profile');
const User = require('../../models/User');

// @route   GET api/profile/me
// @desc    get current user's profile
// @access  private  
router.get('/me', auth, async (req,res) => {
    try {
        const profile = await Profile.findOne({ user: req.user.id }).populate('user',
        ['name', 'avatar']);

        if(!profile){
            return res.status(400).json({msg: 'There is no profile for this geezer'});
        }
        res.json(profile);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('ServEr ErrOr');
    }
});

// @route   POST api/profile
// @desc    create or update a user profile
// @access  private  

router.post('/',[ auth, [check('status','status is required')
    .not()   //using array here as there are 2 middlewares, validator and auth
    .isEmpty(), //and another array inside that cos im running 2 checks.....
    check('skills','skills are required')
    .not()
    .isEmpty()
    ]
], 
async (req, res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({errors: errors.array() });//if  called will either say status is... 
    } //   ....required, skills are required, or both
    //here now i'll pull out all the attributes that are in the request body
    const { company, website, location, bio, status, githubusername,
        skills, youtube, facebook, twitter, instagram, linkedin } = req.body;

    //must build a profile object
    const profileProps = {};
    profileProps.user = req.user.id;
    if(company) profileProps.company = company;
    if(website) profileProps.website = website;
    if(location) profileProps.location = location;
    if(bio) profileProps.bio = bio;
    if(status) profileProps.status = status;
    if(githubusername) profileProps.githubusername = githubusername;
    if(skills) {
        profileProps.skills = skills.split(',').map(skill => skill.trim());
    }

    //and now to build a social networks object
    profileProps.social = {}
    if(youtube) profileProps.social.youtube = youtube;
    if(twitter) profileProps.social.twitter = twitter;
    if(facebook) profileProps.social.facebook = facebook;
    if(linkedin) profileProps.social.linkedin = linkedin;
    if(instagram) profileProps.social.instagram = instagram;
    
    try {
        let profile = await Profile.findOne({ user: req.user.id });
        //iv used my Profile object to query DB for a profile with this current users id
        if(profile) { //update
            profile = await Profile.findOneAndUpdate(
                { user: req.user.id },
                { $set: profileProps },
                { new: true }
                );

            return res.json(profile);        
        }
        //or if theres not one found then we shall create one
        profile = new Profile(profileProps);

        await profile.save();
        res.json(profile);

    } catch (err) {
        console.error(err.message);
        res.status(500).send('sErVEr eRRor');
    }
})

// @route   GET api/profile
// @desc    Get all profiles
// @access  public

router.get('/', async (req, res) => {
    try {
        const profiles = await Profile.find().populate('user',['name','avatar']);
        res.json(profiles);
    } catch (err) {
        console.error(err.message);
        res.status(500).send("SerVER error<get all profiles method>");
    }
})

// @route   GET api/profile/user/:user_id
// @desc    Get profile by user ID
// @access  public

router.get('/user/:user_id', async (req, res) => {
    try {
        const profile = await Profile.findOne({ user: req.params.user_id }).populate('user',['name','avatar']);
        
        if(!profile) return res.status(400).json({msg: 'There is noo profile for this user'});

        res.json(profile);
    } catch (err) {
        console.error(err.message);
        if(err.name == 'CastError'){
            //if(err.kind == 'ObjectId'){
            return res.status(400).json({msg: 'There is no profile for this user'});
        }//cant get this firing-> its for catching get requests with dud ids of unexpected length....
        //changed it to err.name= 'CastError', worked...read it from error props when sent err to console...
        res.status(500).send("SerVER error<get profile by id method>");
    }
})

module.exports= router;