const express = require("express");
const router = express.Router();
const bodyParser = require("body-parser");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const postsRouter = require("../controllers/posts");
const usersRouter = require("../controllers/users");
const middleware = require("../middleware/authentication");

router.use(
  cors({
    origin: `${process.env.ORIG1N}`,
    credentials: true,
    exposedHeaders: ["Set-Cookie", "Authorization"],
    allowedHeaders: [
      "Origin",
      "X-Requested-With",
      "X-HTTP-Method-Override",
      "Content-Type",
      "Accept",
      "X-XSRF-TOKEN",
      "XSRF-TOKEN",
      "Set-Cookie",
      "Authorization",
    ],
  })
);
router.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", `${process.env.ORIG1N}`);
  res.header("Access-Control-Allow-Methods", ["GET, POST, PUT, DELETE, PATCH"]);
  res.header('Access-Control-Expose-Headers', '*, Authorization')
  res.header('Access-Control-Allow-Headers', ['Content-Type', 'Set-Cookie', '*']);
  res.header("Access-Control-Allow-Credentials", true);
  //    res.header("Access-Control-Allow-Headers", "X-Requested-With", "X-HTTP-Method-Override", "Content-Type", "Accept", "X-XSRF-TOKEN", "XSRF-TOKEN", "Set-Cookie", "Authorization", "*");
  //res.header("Access-Control-Allow-Headers", "XSRF-TOKEN, Set-Cookie, Authorization");
  next();
});

router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());
router.use(express.urlencoded({ extended: true }));
router.use(express.json());
router.use(cookieParser());

//post routes
router.post("/post", postsRouter.postArticle);
router.get("/create", postsRouter.createArticle);
router.get("/read", postsRouter.getArticle);
router.get("/read/latest/:id", postsRouter.getLatest);
router.get("/post/:id", postsRouter.getOneArticle);
router.patch("/update/:id", postsRouter.updateArticle);
router.delete("/delete/:_id", postsRouter.deleteArticle);
router.post("/postimage", postsRouter.postImage);
router.post("/setcookie", postsRouter.setCookie);
//router.get("/checkcookie", postsRouter.checkCookie)
//router.delete("/deletecookie", postsRouter.deleteCookie)

//post routes for comments
router.patch("/comment/:id", postsRouter.postComment);
router.patch("/comment/delete/:id", postsRouter.deleteComment);

//user routes
router.post("/register", usersRouter.createUser);
router.post("/checkuser", usersRouter.checkUser);
router.post("/profilepic", usersRouter.profilePic);
router.get("/confirmation/:id", usersRouter.confirmUser)
router.post("/login", middleware.userAuth);
router.get("/user", middleware.authCheck, usersRouter.getUser);
router.patch("/updateuser/:id", usersRouter.updateUser);
router.delete("/deleteuser/:id", usersRouter.deleteUser);
router.get("/clearcookie", middleware.deleteCookie);
router.get("/profile");
router.get("/token", middleware.tokenCheck);
router.get("/tokenvalidation", middleware.tokenValidation);
router.patch("/userposts", usersRouter.userPosts);
router.patch("/updateaccount", usersRouter.updateProfile);

router.get("/header", usersRouter.getHeaders);

//Authentication
//router.get('/login', postsRouter.toBackend)
//router.get('/auth', middleware.validation)

router.get("/*", (req, res) => {
  res.status(404).send("Error 404 - Not Found");
});

module.exports = router;
