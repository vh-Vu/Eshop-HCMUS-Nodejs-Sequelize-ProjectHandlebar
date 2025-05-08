const helper = {}

helper.createRatingStar = stars => {
    let star = parseFloat(stars);
    let nstar = 5 - star;
    const list = [];
    const htmlStar = `<i class="fa fa-star"></i>`;
    const halfStar = `<i class="fa fa-star-half"></i>`;
    const notStar = `<i class="fa fa-star-o"></i>`;
    
    while(star>=1)  {
        list.push(htmlStar);
        star--;
    }
    if(star>0) list.push(halfStar);
    while(nstar>=1) {
        list.push(notStar); 
        nstar--;
    }
    return list.join("\n");
}

helper.formatDate = date => date.toLocaleDateString("en-US",{
    year: "numeric",
    month: "long",
    day: "numeric"
}),

module.exports = helper;