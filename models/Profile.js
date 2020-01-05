const mongoose = require('mongoose');

const ProfileSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user'
  },
  bio: {
    type: String
  },
  experience: [
    {
      location: {
        type: String
      },
      from: {
        type: Date
      },
      to: {
        type: Date
      },
      description: {
        type: String
      }
    }
  ],
  avatar: {
    type: String
  },
  hobbies: {
    type: String
  },
  certifications: {
    type: String
  },
  why: {
    type: String
  },
  location: {
    type: String
  },
  education: {
    type: String
  },
  social: {
    facebook: {
      type: String
    },
    instagram: {
      type: String
    },
    linkedin: {
      type: String
    },
    twitter: {
      type: String
    }
  },
  date: {
    type: Date,
    default: Date.now
  }
})

module.exports = Profile = mongoose.model('profile', ProfileSchema);

