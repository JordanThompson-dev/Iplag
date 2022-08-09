function htmlTokenizer(stream){

    let s = stream.split(' ');
    let tokens = [];

    for(let t of s){

        if(t === "" || t === " ")continue;
        
        tokens.push({
            value: t,
            marked: false
        })
    }

    return tokens;
}

module.exports = htmlTokenizer;