

const fs = require('fs');
const path = require('path');

// const fileReader = (folderPath,fileNameToFind) => {
//     const resolvedPath = path.resolve(folderPath);
//     const resolvedFolderPath = path.resolve(__dirname, folderPath);
//     console.log('Resolved Path:', resolvedFolderPath);

//     fs.readdir(resolvedFolderPath, (err, files) => {
//     if (err) {
//         console.error('Error reading directory:', err);
//         return;
//     }

//     const matchingFiles = files.filter(file => file.toLocaleUpperCase() === fileNameToFind.toLocaleUpperCase());

//     if (matchingFiles.length > 0) {
//         console.log(`Found ${matchingFiles.length} matching file(s):`);
//         matchingFiles.forEach(matchingFile => {
//             console.log(matchingFile)
//         return matchingFile;
//         });
//     } else {
//         console.log('No matching file found.');
//     }
//     });
// }
const fileReader = (folderPath, fileNameToFind) => {
    return new Promise((resolve, reject) => {
        const resolvedFolderPath = path.resolve(__dirname, folderPath);
        
        fs.readdir(resolvedFolderPath, (err, files) => {
            if (err) {
                console.error('Error reading directory:', err);
                reject(err);
                return;
            }
            
            const matchingFiles = files.filter(file => file.toLocaleUpperCase() === fileNameToFind.toLocaleUpperCase());

            if (matchingFiles.length > 0) {
                console.log(`Found ${matchingFiles.length} matching file(s):`);
                matchingFiles.forEach(matchingFile => {
                    console.log(matchingFile);
                });
                resolve(matchingFiles); // Resolve with the array of matching files
            } else {
                console.log('No matching file found.');
                resolve([]); // Resolve with an empty array if no match is found
            }
        });
    });
}

//fileReader('../league_data/img/champion/tiles','aatrox_0.jpg')

module.exports = fileReader;