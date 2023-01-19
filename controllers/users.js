const User = require('../Models/User');
const bcrypt = require('bcrypt');
const saltRounds = 10;
const cloudinary = require('cloudinary').v2;

cloudinary.config={
    cloud_name: process.env.CLOUD_N4ME,
    api_key: process.env.CLOUD_K3Y,
    api_secret: process.env.AP1_S3CRET,
    secure: true,
}

//create user 
const createUser =  async (req, res) => {
    const salt = bcrypt.genSaltSync(saltRounds);
    const hashed_password = bcrypt.hashSync(req.body.password, salt);  // hash password
    const file = req.files.file;

    console.log('my name is: ', req.body.name)
    console.log('my lastname ', req.body.lastname)
    console.log('my username ', req.body.username);
    console.log('my email', req.body.email);
    console.log('my password', req.body.password);

    // process to control the image ...
    //console.log('images send to back ', req.files)
    //console.log('image name: ', req.files['file'].name)

    const user = new User({
        name: req.body.name,
        lastname: req.body.lastname,
        username: req.body.username,
        email: req.body.email,
        password: hashed_password
        //image: req.files['file'].name,      //upload file to cloudinary, use and URL
    });
    
    try {
        const result = await cloudinary.uploader.upload(file.tempFilePath, {
            folder: 'users',
            cloud_name: process.env.CLOUD_N4ME,
            api_key: process.env.CLOUD_K3Y,
            api_secret: process.env.AP1_S3CRET
        })
        console.log(result)
        user.image = result['secure_url']
        let saveUser = await user.save();
        //console.log(user)
        res.send(user);
    }catch (err){
        res.json({error: err});
    }
}

//readUser
const getUser = async (req, res) => {
    try{
    const user = res.user
    console.log('stage  to render user...: ', user['username'])
    //if(user){
            let userFound = await User.findOne({username: user['username']});
            console.log('user to render in log: ', userFound)
            //console.log('getting user, _ID: ' + req.params.id)
            res.json(userFound)
        }catch(err){
            console.log('error')
            res.json({message: err});
        }
    //}else{
      //  res.send('<h1>Private content<h1>')
    //}
}

//updateUser
const updateUser = async (req, res) => {
    try{
        let userToUpdate = await User.updateOne({_id: req.params.id}, 
                                                    {$set: 
                                                    {        
                                                        name: req.body.name,
                                                        lastname: req.body.lastname,
                                                        username: req.body.username,
                                                        email: req.body.email,
                                                        password: req.body.password,
                                                        image: req.body.image,
                                                    }
                                                    })
        console.log('successfully, updated.');
        res.json(userToUpdate)
    }catch(err){
        res.json({message: err});
    }
}

//deteleUser 
const deleteUser = async (req, res) => {
    try{
        const toBeDeleted = await User.findOneAndDelete({ _id: req.params.id })
        console.log('User deleted, successfully.');
        res.json(toBeDeleted);
    }catch(err){
        res.json({message: err})
    }
}

//get headers...
const getHeaders = async (req, res) => {
    try{
        console.log("headers: ", req.headers)
        const headerCliente = req.headers;
        headerCliente.authorization = req.headers.cookie   //then assign to the headers of the object an authorization key with the token itself
        console.log('headers from cliente ', headerCliente)
        //const user = await User.findById(req.params.id);
        //console.log('getting user, _ID: ' + req.params.id)
        const authHeader = req.headers['authorization']
        //const token = authHeader.split(' ')[1]
        console.log("authHeader: " + authHeader)
        res.json({"Message": "200, its ok"})
    }catch(err){
        res.json({message: err});
    }
}

module.exports = { createUser, getUser, updateUser, deleteUser, getHeaders }