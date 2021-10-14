import multer  from "multer";

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
    }
});

//image upload part
export const imageUpload = multer({
    dest:"uploads/images/",
    limits: {
        fileSize:10000000,
    }
});