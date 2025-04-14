const helper = {}

helper.createRatingStar = stars => {
    let star = parseFloat(stars);
    const list = [];
    console.log(star)
    const htmlStar = `<i class="fa fa-star"></i>`;
    const halfStar = `<i class="fa fa-star-half"></i>`
    while(star>=1)  {
        list.push(htmlStar);
        star--;
    }
    if(star>0) list.push(halfStar);
    return list.join("\n");
}

module.exports = helper;