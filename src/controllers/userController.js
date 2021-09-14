import User from "../model/User";

// Join
export const getJoin = (req, res) =>{
    return res.render("join", {pageTitle:"| Join"});
};

export const postJoin = async (req, res) => {
    const {
        userid, password, password2, email
    } = req.body;
    const user = {
        userid, password, password2, email
    };    

    //password validation
    if(password !== password2)
        res.status(400).render("join", {pageTitle:" | Join", errorMessage : "Uncorrect Password", user})
    
    //userid, email validation
    const existUserEmail =  await User.findOne({email});
    if(existUserEmail)
        return res.status(400).render("join", {pageTitle:" | Join", errorMessage : "E-mail is already exist."});
    
    const existUserid =  await User.findOne({userid});
    if(existUserid)    
        return res.status(400).render("join", {pageTitle:" | Join", errorMessage : "ID is already exist."});
   
    await User.create({
        userid, password, password2, email
    });

    return res.redirect("login");
}

// Login
export const getLogin = (req, res) => {
    return res.render("login", {pageTitle:" | Login"});
};

export const postLogin = async (req, res) => {
    const {email, password} = req.body;
    
    const loginUser = await User.findOne({email});   
    // email, password validation 
    if(!loginUser)
        res.status(400).render("login", {pageTitle:" | Login,", errorMessage : "E-mail does not exist."});
    if(password !== loginUser.password)
        res.status(400).render("login", {pageTitle:" | Login,", errorMessage : "Uncorrect Password", email});

    //session에 유저 저장하기
    req.session.loggedIn = true;
    req.session.user = loginUser;
    
    return res.redirect("/");
};

export const getLogout = (req, res) => {
    req.session.destroy();
    return res.redirect("/");
};