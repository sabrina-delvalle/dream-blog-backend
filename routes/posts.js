const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser')
const cors = require('cors')
const cookieParser = require('cookie-parser')
const postsRouter = require('../controllers/posts') 
const usersRouter = require('../controllers/users') 
const middleware = require('../middleware/authentication')

router.use(cors({
                origin:`${process.env.ORIG1N}`,
                credentials: true,
                exposedHeaders: ["Set-Cookie", "Authorization"]
            }));
router.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', `${process.env.ORIG1N}`);
    res.setHeader('Access-Control-Allow-Methods', ['GET, POST, PUT, DELETE, PATCH']);
    //res.header('Access-Control-Expose-Headers', '*, Authorization')
    //res.setHeader('Access-Control-Allow-Headers', ['Content-Type', 'Set-Cookie', '*']);
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader("Access-Control-Allow-Headers", ["X-Requested-With", "X-HTTP-Method-Override", "Content-Type", "Accept", "X-XSRF-TOKEN", "XSRF-TOKEN", "Set-Cookie", "Authorization", "*"]);
    next();
});


router.use(bodyParser.urlencoded({extended:true}))
router.use(bodyParser.json());
router.use(express.urlencoded({extended:true}));
router.use(express.json())
router.use(cookieParser())

//post routes
router.post('/post', postsRouter.postArticle)
router.get('/create', postsRouter.createArticle)
router.get('/read', postsRouter.getArticle)
router.get('/read/latest/:id', postsRouter.getLatest)
router.get('/post/:id', postsRouter.getOneArticle)
router.patch('/update/:id', postsRouter.updateArticle)
router.delete('/delete/:_id', postsRouter.deleteArticle)
router.post("/postimage", postsRouter.postImage)

//post routes for comments
router.patch('/comment/:id', postsRouter.postComment)
router.patch('/comment/delete/:id', postsRouter.deleteComment)

//user routes
router.post('/register', usersRouter.createUser)
router.post('/login', middleware.userAuth)
router.get('/user', middleware.authCheck, usersRouter.getUser);
router.patch('/updateuser/:id', usersRouter.updateUser)
router.delete('/deleteuser/:id', usersRouter.deleteUser)
router.get('/clearcookie', middleware.deleteCookie)
router.get('/profile')
router.get('/token', middleware.tokenCheck)
router.get('/tokenvalidation', middleware.tokenValidation)

router.get('/header', usersRouter.getHeaders)


//Authentication
//router.get('/login', postsRouter.toBackend)
//router.get('/auth', middleware.validation)

router.get('/*', (req, res) => {
    res.status(404).send('Error 404 - Not Found')
})


module.exports = router;