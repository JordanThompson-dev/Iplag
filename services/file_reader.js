const fs = require('fs-promise');

exports.readFiles = async (dirname, onFileContent) => {

    /*
        A utitlity function to read all files from a given directory.
    */

    const filenames = await fs.readdir(dirname);
    
    console.log(filenames);

    for(const filename of filenames){
        let content = await fs.readFile(dirname + filename, 'utf-8');
        onFileContent(filename, content);
    }
    
}

