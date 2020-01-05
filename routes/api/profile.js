const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const {check, validationResult} = require('express-validator');
const Profile = require('../../models/Profile');
const User = require('../../models/User');

// @route   GET api/profile/me
// @desc    Get loggin users profile
// @access  Private
router.get('/me', auth, async (req, res) => {
  try {
    const profile = await Profile.findOne({ user: req.user.id }).populate('user', ['name', 'avatar']);

    if(!profile) {
      return res.status(400).json({ msg: 'There is no profile for this user' })
    }

    res.json(profile);

   } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});


// @route   POST api/profile
// @desc    Create or uptade user profile
// @access  Private
router.post('/', auth, async (req, res) => {
  const {bio, education, avatar, hobbies, certifications, why, location, facebook, instagram, linkedin, twitter } = req.body;

  // Build profile object
  const profileFields = {};

  profileFields.user = req.user.id;
  if(bio) profileFields.bio = bio;
  if(education) profileFields.education = education;
  if(avatar) profileFields.avatar = avatar;
  if(hobbies) profileFields.hobbies = hobbies;
  if(certifications) profileFields.certifications = certifications;
  if(why) profileFields.why = why;
  if(location) profileFields.location = location;

  // Build social object 
  profileFields.social = {}
  if(facebook) profileFields.social.facebook = facebook;
  if(linkedin) profileFields.social.linkedin = linkedin;
  if(instagram) profileFields.social.instagram = instagram;
  if(twitter) profileFields.social.twitter = twitter;

  try {
    let profile = await Profile.findOne({ user: req.user.id })

    if(profile) {
      // Update
      profile = await Profile.findOneAndUpdate({ user: req.user.id }, { $set: profileFields}, { new: true });
      return res.json(profile)
    }
    // Create
    profile = new Profile(profileFields);

    await profile.save();
    res.json(profile);

  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }

});

// @route   GET api/profile
// @desc    Get all profiles
// @access  Public

router.get('/', async (req, res) => {
  try {
    const profiles = await Profile.find().populate('user', ['name', 'avatar']);
    res.json(profiles);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   GET api/profile/user/:user_id
// @desc    Get profile by user ID
// @access  Public

router.get('/user/:user_id', async (req, res) => {
  try {
    const profile = await Profile.findOne({ user: req.params.user_id }).populate('user', ['name', 'avatar']);
    
    if(!profile) return res.status(400).json({ msg: 'Profile not found' });

    res.json(profile);

  } catch (err) {
    console.error(err.message);
    if(err.kind == 'ObjectId') {
      return res.status(400).json({ msg: 'Profile not found' });
    }
    res.status(500).send('Server error');
  }
});


// @route   DELETE api/profile
// @desc    Delete profile, user & post
// @access  Private

router.delete('/', auth, async (req, res) => {
  try {
    // Remove user posts
    await Post.deleteMany({ user: req.user.id });
    // Remove profile
    await Profile.findOneAndRemove({ user: req.user.id });
    // Remove User
    await User.findOneAndRemove({ _id: req.user.id });

    res.json({ msg: 'User deleted' });

  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});


// @route   PUT api/profile/education
// @desc    Add profile experience
// @access  Private

router.put('/experience', [auth, [
  check('location', 'Location is required').not().isEmpty(),
  check('description', 'Description is required').not().isEmpty()
]], async (req, res) => {
  const errors = validationResult(req);
  if(!errors.isEmpty()){
    return res.status(400).json({errors: errors.array() });
  }
  
  const {location, from, to, description} = req.body;

  const newExp = {
    location,
    from, 
    to, 
    description
  }
  
  
  try {
    let profile = await Profile.findOne({ user: req.user.id });

    if(profile !== null){
      profile.experience.unshift(newExp);
      await profile.save();

      res.json(profile);
      }else{
        profile = new Profile({
            user: req.user.id ,
            experience: newExp,
      });
        await profile.save();
        res.json(profile);
      }

  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   DELETE api/profile/education/educ_id
// @desc    Delete education from profile
// @access  Private

router.delete('/experience/:exp_id', auth, async (req, res) => {
  try {
    const profile = await Profile.findOne({ user: req.user.id });

    // Get remove index
    const removeIndex = profile.experience
      .map(item => item.id)
      .indexOf(req.params.exp_id);
    
    profile.experience.splice(removeIndex, 1);

    await profile.save();

    res.json(profile);

  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
})

module.exports = router;