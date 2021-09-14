export const localsMiddlewares = (req, res, next) => {
    //session
    res.locals.loggedIn = Boolean(req.session.loggedIn);
    res.locals.loggedInUser = req.session.user;
    next();
};