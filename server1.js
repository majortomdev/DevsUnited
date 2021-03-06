const express = require('express');
const connectDB = require('./config/db');

const app = express();

connectDB();//to connect to my mongodb

app.use(express.json({ extended: false})); // to init middleware

app.get('/', (req,res) => res.send('API running'))
//added in a callback function for after endpoint is hit...

app.use('/api/users', require('./routes/api/users'));
app.use('/api/auth', require('./routes/api/auth'));
app.use('/api/posts', require('./routes/api/posts'));
app.use('/api/profile', require('./routes/api/profile'));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`SErvEr started on port ${PORT}`));
// added in a callback fn for after connection