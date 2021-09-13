import User from "../model/User";

// Join
export const getJoin = (req, res) =>{
    res.render("join", {pageTitle:"| Join"});
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
        res.status(400).render("join", {pageTitle:" | Join,", errorMessage : "Uncorrect Password", user})
    
    await User.create({
        userid, password, password2, email
    });
    res.render("login", {pageTitle:" | Login"});
}

// Login
export const getLogin = (req, res) => {
    res.render("login", {pageTitle:" | Login"});
};

export const postLogin = async (req, res) => {
    const {email, password} = req.body;
    
    const loginUser = await User.findOne({email});   
    // email, password validation 
    if(!loginUser)
        res.status(400).render("login", {pageTitle:" | Login,", errorMessage : "E-mail does not exist."});
    if(password !== loginUser.password)
        res.status(400).render("login", {pageTitle:" | Login,", errorMessage : "Uncorrect Password", email});

        res.render("home", {loginUser});
    
    
    res.end();
    
    

};

export const getLogout = (req, res) => {
    res.render("home");
};