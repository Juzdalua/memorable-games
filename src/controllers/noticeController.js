import Notice from "../model/Notice";
import NoticeCounter from "../model/NoticeCounter";
import User from "../model/User";

export const getNoticeList = async (req, res) => {
    const notices = await Notice.find({}).sort({idx:"desc"}).populate("owner");
    return res.render("notice/notice-list", {pageTitle:" | Notice", notices});
};

// 공지사항 작성
export const getWrite =  (req, res) => {        
    return res.render("notice/notice-write", {pageTitle:" | Notice"});
};

export const postWrite = async (req, res) => {
  const {title, description} = req.body;
  
  const user = await User.findById(req.session.user._id);    
  
  //글번호 만들기 
  let index = await NoticeCounter.findOne({name:"notice"});

  if(!index)
    index = await NoticeCounter.create({name:"notice"});

  index.index++;
  index.save(); 

  const notice = await Notice.create({
    idx: index.index,
    title, description,     
     owner: user._id,
     index: index.index,
     counter: "NoticeCounter"
  });  
  
  //유저가 작성한 글 저장하기.
  user.notice.push(notice._id);
  user.save();

  res.render("notice/notice", {pageTitle: " | Notice", notice});
};

//공지사항 보기
export const getNotice = async (req, res) => {
    const {id} = req.params;
    const notice = await Notice.findById(id).populate("owner");

    //조회수 올려주기
    notice.views++;
    notice.save();

    res.render("notice/notice", {pageTitle:" | Notice", notice});
};

//공지사항 수정-get
export const getNoticeModify = async (req, res) => {
  const {id} = req.params;
  const notice = await Notice.findById(id).populate("owner");

  //수정 삭제 validation
  if(res.locals.loggedInUser._id !== String(notice.owner._id))
    return res.status(403).redirect("/");

  return res.render("notice/notice-modify", {pageTitle:" | Notice", notice});
};

//공지사항 수정-post
export const postNoticeModify = async (req, res) => {
  const {title, description} = req.body;
  const {id} = req.params;

  const notice = await Notice.findById(id).populate("owner");
  notice.title = title;
  notice.description = description;
  notice.save();
  
  return res.render("notice/notice", {pageTitle:" | Notice", notice});
};

//공지사항 삭제
export const deleteNotice = async (req, res) => {
  const {id} = req.params;
  const notice = await Notice.findById(id).populate("owner");

  //validation
  if(res.locals.loggedInUser._id !== String(notice.owner._id))
    return res.status(403).redirect("/");
  
    await Notice.findByIdAndDelete(id);
    return res.redirect("notice/notice-list");
  
};