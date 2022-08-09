
let compare_token = function(ti,tj){
    return ti.value === tj.value && !ti.marked && !tj.marked;
}


/*
    @param1: list of tokens for file1
    @param2: list of tokens for file2
    @param3: minimum matching window
    @returns: list of tiles
*/
function GreedyStringTiling(a, b, minMatch, comparator ){


    let tiles = [];

    do{

        var maxMatch = minMatch;
        let matches = [];

        for(let i=0; i<a.length; i++){

            if(a[i].marked)
                continue;

            for(let j=0; j<b.length; j++){
                
                if(b[j].marked)
                    continue;

                let k = 0;

                while(i+k < a.length && j+k < b.length && compare_token(a[i+k], b[j+k]) ){
                    k++;
                }

                if(k === maxMatch){
                    matches.push({i,j,k});
                }
                else if(k > maxMatch){
                    matches = [{i,j,k}];
                    maxMatch = k;
                }

            }

        }


        matches.forEach((match, m) =>{
            
            let off = 0;
            while(off < match.k){
                a[match.i + off].marked = true;
                b[match.j + off].marked = true;
                off++;
            }
            
            tiles.push(match);
        })

        
    }while(maxMatch > minMatch);
    
    let coverage = 0;
    
    tiles.forEach((match) => {
        coverage += match.k
    })
    
    return (2*coverage)/(a.length + b.length);
    

}


module.exports = GreedyStringTiling;




