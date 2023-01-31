require("dotenv").config();
const User = require("../Models/User");
const bcrypt = require("bcrypt");
const saltRounds = 10;
const cloudinary = require("cloudinary").v2;
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  auth: {
    user: process.env.EMAIL_LOG,
    pass: process.env.EMAIL_PASS,
  },
});

cloudinary.config = {
  cloud_name: process.env.CLOUD_N4ME,
  api_key: process.env.CLOUD_K3Y,
  api_secret: process.env.AP1_S3CRET,
  secure: true,
};

//create user
const createUser = async (req, res) => {
  //create the JWT TOKEN,
  const salt = bcrypt.genSaltSync(saltRounds);
  const hashed_password = bcrypt.hashSync(req.body.password, salt); // hash password
  //const file = req.files;

  //console.log("my name is: ", req.body.name);
  //console.log("my lastname ", req.body.lastname);
  //console.log("my username ", req.body.username);
  //console.log("my email", req.body.email);
  //console.log("my password", req.body.password);

  // process to control the image ...
  //console.log('images send to back ', req.files)
  //console.log('image name: ', req.files['file'].name)

  const user = new User({
    name: req.body.name,
    lastname: req.body.lastname,
    username: req.body.username,
    email: req.body.email,
    password: hashed_password,
    image: req.body.image,
  });

  let saveUser = await user.save();

  //create JWT
  jwt.sign(
    {
      id: saveUser._id,
    },
    process.env.SECRET_KEY2,
    {
      expiresIn: "1d",
    },
    (err, emailToken) => {
      if (err) return res.send(err);
      const url = `${process.env.ORIG1N}/confirmation/${emailToken}`;
      //console.log("tokenURL", url);

      transporter.sendMail({
        from: '"Dream Blog" <dreamblog.server@example.com>',
        to: req.body.email,
        subject: "Confirmation Email",
        html: `<h1 style='color:rgb(72, 70, 70)'>Dream Blog</h1> <br /> <p style='color:grey'>Hello ${req.body.name}, please confirm your email using the following link: </p> <a href="${url}">${url}</a>`,
      });
    }
  );

  //console.log('Is reaching after try...');
  res.send(saveUser);

  //console.log('Is reaching before try...');
  /* try {
        console.log('Is reaching after try...');
        if(!file){
            user.image = 'https://res.cloudinary.com/diyvxyidy/image/upload/v1671549902/users/user_bh6ggf.png'
            let saveUser = await user.save();
            return res.send(user);
        }
        const result = await cloudinary.uploader.upload(file.file.tempFilePath, {
            folder: 'users',
            cloud_name: process.env.CLOUD_N4ME,
            api_key: process.env.CLOUD_K3Y,
            api_secret: process.env.AP1_S3CRET
        })
        console.log('is reaching in result...',result)
        user.image = result['secure_url']
        let saveUser = await user.save();
        //console.log(user)
        res.send(user);
    }catch (err){
        res.json({error: err});
    } */
};

const profilePic = async (req, res) => {
  const file = req.files;
  try {
    const result = await cloudinary.uploader.upload(file.file.tempFilePath, {
      folder: "users",
      cloud_name: process.env.CLOUD_N4ME,
      api_key: process.env.CLOUD_K3Y,
      api_secret: process.env.AP1_S3CRET,
    });
    const image = result["secure_url"];
    res.json({ image: image });
  } catch (err) {
    res.json({ error: err });
  }
};

//checkUser

const checkUser = async (req, res) => {
  //console.log(req.body.username);
  if (req.body.username) {
    try {
      const checkUser = await User.findOne({ username: req.body.username });
      //console.log("user Check: ", checkUser);
      if (!checkUser) return res.json({ valid: true });
      return res.json({ checkUser });
    } catch (err) {
      res.json(err);
    }
  }
  try {
    const checkUser = await User.findOne({ email: req.body.email });
    //console.log("email Check: ", checkUser);
    if (!checkUser) return res.json({ valid: true });
    return res.json({ checkUser });
  } catch (err) {
    res.json(err);
  }
};

//readUser
const getUser = async (req, res) => {
  try {
    const user = res.user;
    //console.log("stage  to render user...: ", user["username"]);
    //if(user){
    let userFound = await User.findOne({ username: user["username"] });
    //console.log("user to render in log: ", userFound);
    //console.log('getting user, _ID: ' + req.params.id)
    res.json(userFound);
  } catch (err) {
    res.json({ message: err });
  }
  //}else{
  //  res.send('<h1>Private content<h1>')
  //}
};

//updateUser
const updateUser = async (req, res) => {
  try {
    let userToUpdate = await User.updateOne(
      { _id: req.params.id },
      {
        $set: {
          name: req.body.name,
          lastname: req.body.lastname,
          username: req.body.username,
          email: req.body.email,
          password: req.body.password,
          image: req.body.image,
        },
      }
    );
    console.log("successfully, updated.");
    res.json(userToUpdate);
  } catch (err) {
    res.json({ message: err });
  }
};

//deteleUser
const deleteUser = async (req, res) => {
  try {
    const toBeDeleted = await User.findOneAndDelete({ _id: req.params.id });
    console.log("User deleted, successfully.");
    res.json(toBeDeleted);
  } catch (err) {
    res.json({ message: err });
  }
};

//get headers...
const getHeaders = async (req, res) => {
  try {
    //console.log("headers: ", req.headers);
    const headerCliente = req.headers;
    headerCliente.authorization = req.headers.cookie; //then assign to the headers of the object an authorization key with the token itself
    //console.log("headers from cliente ", headerCliente);
    //const user = await User.findById(req.params.id);
    //console.log('getting user, _ID: ' + req.params.id)
    //const authHeader = req.headers["authorization"];
    //const token = authHeader.split(' ')[1]
    //console.log("authHeader: " + authHeader);
    res.json({ Message: "200, its ok" });
  } catch (err) {
    res.json({ message: err });
  }
};

const userPosts = async (req, res) => {
  //console.log("current id info...", req.body);
  try {
    const updateUser = await User.findByIdAndUpdate(req.body.id, {
      $push: { posts: req.body.post_id },
    });
    res.status(200).json(updateUser);
  } catch (err) {
    res.json(err);
  }
};

const updateProfile = async (req, res) => {
  //console.log("inside update profile info.. and the file is...", req.files);
  const image = "";
  //update profile image...
  const file = req.files;
  //const user = await User.findById({_id: req.body.id})
  //console.log('user to update...', user);
  //console.log("files...", req.files);
  //console.log('user...', user);
  //find user to apply the updates...

  try {
    if (file) {
      const result = await cloudinary.uploader.upload(file.image.tempFilePath, {
        folder: "users",
        cloud_name: process.env.CLOUD_N4ME,
        api_key: process.env.CLOUD_K3Y,
        api_secret: process.env.AP1_S3CRET,
      });
      //console.log("is reaching in result...", result);
      //console.log(user)
      //res.send(user);
      const dataOptions = {
        $set: { image: result["secure_url"] },
      };
      const user = await User.findByIdAndUpdate(req.body.id, dataOptions);
      user.image = result["secure_url"];
      //console.log(user);
      return res.status(200).json(user);
    }
  } catch (err) {
    return res.json({ error: err });
  }

  res.json({ status: "200" });
};

const confirmUser = async (req, res) => {

  //console.log('ID to check', req.params.id);
  //res.status(200).json(req.params);
  const user = await User.findByIdAndUpdate(jwt.verify(req.params.id, process.env.SECRET_KEY2)['id'], { confirmed: true })
  console.log('user ', user);
  res.status(200).send(user)
    //console.log("username: ", user.username, " available to log in.");
    //return res.status(200).send("<h1> Available to login </h1>");
}

module.exports = {
  createUser,
  getUser,
  updateUser,
  deleteUser,
  getHeaders,
  userPosts,
  updateProfile,
  checkUser,
  profilePic,
  confirmUser
};
