export const dividePage = (item, itemInPage, page) => {    
    let totalPage = 1;

    if(item)
        totalPage = Math.ceil(item.length/itemInPage);
    
    let nowPage = 1;
    if(page)
        nowPage = page;

    if(Number(nowPage) === 1)      
        item = item.filter( (x, idx) => {return idx<itemInPage})
    else
        item = item.filter( (x, idx) => {return idx>= (Number(page)-1)*itemInPage && idx < itemInPage*Number(page)})

    return {item, totalPage};
};