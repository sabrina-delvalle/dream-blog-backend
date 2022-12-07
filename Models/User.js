const mongoose = require('mongoose');

/* mongoose.connect(process.env.MONGO_DB)
    .then(() => console.log('connected to MongoDB.')); */

const userSchema = mongoose.Schema({
    name: String,
    lastname: String,
    username: String,
    email: String,
    password: String,
    image: String,
}, {timestamps: true})

module.exports = mongoose.model('User', userSchema);