import User from "../model/User";

// Join
export const getJoin = (req, res) =>{
    return res.render("join", {pageTitle:"| Join"});
};

export const postJoin = async (req, res) => {
    const {
        userid, password, password2, email
    } = req.body;
 
    //password validation    
    if(password !== password2)
        return res.status(400).render("join", {pageTitle:" | Join", errorMessage : "비밀번호가 다릅니다.", user})
    if(password.length < 8)
        return res.status(400).render("join", {pageTitle:" | Join", errorMessage : "비밀번호는 최소 8자리 이상 작성하세요.", user})
    //userid, email validation
    const existUserEmail =  await User.findOne({email});
    if(existUserEmail)
        return res.status(400).render("join", {pageTitle:" | Join", errorMessage : "E-mail이 이미 존재합니다."});
    
    const existUserid =  await User.findOne({userid});
    if(existUserid)    
        return res.status(400).render("join", {pageTitle:" | Join", errorMessage : "ID가 이미 존재합니다."});
   
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

//회원정보 수정
export const getUser = async (req, res) => {

    const {id} = req.params;    
    const user = await User.findOne({userid:id});
        
    return res.render("user/mylist", {pageTitle: "User" ,user});
};

export const getUserModify = async (req, res) => {
    const {id} = req.params;
    const user = await User.findById(id);

    return res.render("user/user-modify", {pageTitle:"User", user})
}

export const postUserModify = async (req, res) => {
    const {
        userid, password, password2
    } = req.body;
    const {id} = req.params;

    const user = await User.findById(id);
    
    //password validation    
    if(password !== password2)
        return res.status(400).render("user/user-modify", {pageTitle:" | User", errorMessage : "비밀번호가 다릅니다.", user});
    if(password.length < 8)
        return res.status(400).render("user/user-modify", {pageTitle:" | User", errorMessage : "비밀번호는 최소 8자리 이상 작성하세요.", user});

    //userid validation    
    const existUserid =  await User.findOne({userid});
    if(existUserid)    
        return res.status(400).render("user/user-modify", {pageTitle:" | User", errorMessage : "ID가 이미 존재합니다.", user});
   
    user.password = password;
    user.userid = userid;
    user.save();
    
    req.session.destroy();
    
    return res.redirect("/login");
};