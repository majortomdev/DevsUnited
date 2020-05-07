const express = require('express');
const connectDB = require('./config/db');

const app = express();

connectDB();//to connect to my mongodb

app.get('/', (req,res) => res.send('API running'))
//added in a callback function for after endpoint is hit...

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`SErver started on port ${PORT}`));
// added in a callback fn for after connection