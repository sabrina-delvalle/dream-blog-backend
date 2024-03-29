require("dotenv").config();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const User = require("../Models/User");

const tokenCheck = (req, res) => {
  //console.log("Log with async version!: ", req.headers.cookie);
  if (!req.headers.cookie) return res.json({ message: "ok" });
  const cookies = req.headers.cookie.split("; ");
  const cookieToken = cookies.filter((elem) => elem.split("=")[0] === "Token");
  //console.log("cookie headers!!!: ", cookieToken[0]);
  //filter(e => e==='Token')
  if (cookieToken) {
    let Token = cookieToken[0].split("=")[1];
    //console.log("token from token ", Token);
    return res.status(200).json({ token: Token });
  }
  res.send("done readed cooki").json({ message: "ok" });
};

const tokenValidation = (req, res) => {
  console.log("Req Headers Cookie First Place!!; ", req.headers.cookie);
  if (!req.headers.cookie) return res.json({ message: "ok" });
  //console.log("just after not working");
  //console.log("cookie headers!!! FIRST PLACE: ", req.headers.cookie);
  if (req.headers.cookie) {
    let token = req.headers.cookie.split(";")[0];
    token = token.split("=")[1];
    //console.log("token from token, FIRST PLACE ", token);
    if (token) return res.json({ token: true });
  }
  return res.json({ message: "ok" });
};

const deleteCookie = (req, res) => {
  //console.log('deleting cookie');
  // res.status(202).clearCookie('Token').send('clear cookie, done.')
  const setCookie = {
    sameSite: "None",
    secure: true,
    httpOnly: false,
    path: "/",
    expires: new Date(new Date().getTime() + 0), //day, hour, sec, miliseconds
  };
  //let finalUser = { user, token }
  //console.log('current user for local storage... ', finalUser)
  return res
    .status(202)
    .cookie("Token", "deletedToken", setCookie)
    .send("clear cookie, done.");
};

//this cookie dont   ------------------------------------ DOOONT WORK!
const basicCookie = async (req, res) => {
  res
    .status(202)
    .cookie("Name", "Sabri", {
      sameSite: "none",
      path: "/",
      expires: new Date(new Date().getTime() + 6 * 60 * 60 * 1000),
      httpOnly: false,
      secure: true,
    })
    .send("initialised");
};

const userAuth = async (req, res) => {
  try {
    //console.log("body of the request: ", req.body);
    const user = await User.findOne({ username: req.body.username });
    //console.log("user found: ", user);

    //anf if its confirmed user... the long, else... please confirm
    if (user && bcrypt.compareSync(req.body.password, user.password)) {
      var token = jwt.sign(
        {
          username: req.body.username,
        },
        process.env.SECRET_KEY,
        { expiresIn: "5h" }
      );
      //console.log("generated token: ", token);
      //set cookie
      const setCookie = {
        sameSite: "None",
        secure: true,
        httpOnly: true,
        path: "/",
        expires: new Date(new Date().getTime() + 6 * 60 * 60 * 1000), //day, hour, sec, miliseconds
      };
      //let finalUser = { user, token }
      //console.log('current user for local storage... ', finalUser)
      return res
        .status(202)
        .cookie("Token", token, setCookie)
        .send({ user: user });
      //return res.status(202).send(finalUser)
    }
  } catch (err) {
    res.status(400).send(err);
  }
  console.log("wrong user");
  res.status(200).send("invalid user or password");
};

const authCheck = async (req, res, next) => {
  //REMEMBER ADDING NEXT
  //console.log("no header auth");
  if (!req.headers["authorization"])
    return res.status(400).send("not available to access.");
  //console.log(req.headers);
  const authHeader = req.headers["authorization"];
  const token = authHeader.split(" ")[1];
  console.log(token);
  jwt.verify(token, process.env.SECRET_KEY, function (err, user) {
    if (err) return res.json({ Message: err });
    res.user = user;
    //console.log("validated user: ", user);
    next();
  });
};

const validation = (req, res, next) => {
  if (req.user) next();
};

module.exports = {
  userAuth,
  authCheck,
  validation,
  basicCookie,
  tokenCheck,
  tokenValidation,
  deleteCookie,
};
