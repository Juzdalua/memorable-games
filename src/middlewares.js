import multer  from "multer";
import multerS3 from "multer-s3";
import aws from "aws-sdk";

const s3 = new aws.S3({
    credentials:{
        accessKeyId: process.env.AWS_ID,
        secretAccessKey: process.env.AWS_SECRET
    }
})

const multerUploader = multerS3({
    s3: s3,
    bucket: 'memorable-games',
    acl: 'public-read',
})

//session part
export const localsMiddlewares = (req, res, next) => {
    //session
    res.locals.loggedIn = Boolean(req.session.loggedIn);
    res.locals.loggedInUser = req.session.user || {};
    next();
};

//video upload part
export const videoUpload = multer({
    dest:"uploads/videos/",
    limits: {
        fileSize:10000000,
    },
    storage: multerUploader
});

//image upload part
export const imageUpload = multer({
    dest:"uploads/images/",
    limits: {
        fileSize:10000000,
    },
    storage: multerUploader
});

//로그인이 안되어있다면
export const protectLogin = (req, res, next) => {
    if(!req.session.loggedIn)
        return res.status(404).render("404", {pageTitle:"404"});
    else
        return next();    
};

//로그인이 되어있다면
export const publicLogin = (req, res, next) => {
    if(req.session.loggedIn)
        return res.status(404).render("404", {pageTitle:"404"});
    else
        return next();    
};
