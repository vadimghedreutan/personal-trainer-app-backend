const mongoose = require('mongoose');
const config = require('config');
const db = config.get('mongoURI');

let options = {
  useCreateIndex: true,
  useNewUrlParser: true,
  useFindAndModify: false,
  useUnifiedTopology: true,
  promiseLibrary: global.Promise
};

const connectDB = async () => {
  try{
    mongoose.connect(db, options);

    console.log('MongoDB Connected...');
  } catch(err) {
    console.error(err.message);
    
    // Exti process with failure
    //process.exit(1);
  }
}

module.exports = connectDB;