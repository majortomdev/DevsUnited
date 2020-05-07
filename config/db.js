const mongoose = require('mongoose');
const config = require('config');
const db = config.get('mongoURI');

const connectDB = async () =>  {
    try {
        await mongoose.connect(db, { //had2 add dis object as an extra parameter due to runtime warning 
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log('MongoDB connected.....');
    } catch(err) {
        console.error(err.message);

        process.exit(1);
    }
}

module.exports = connectDB;