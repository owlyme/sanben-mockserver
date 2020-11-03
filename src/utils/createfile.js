var createFile = require('create-file');



export default async function (filename, contents) {
    return new Promise((resolve, reject) => {
        createFile(filename, contents, function (err) {
        // file either already exists or is now created (including non existing directories)
        console.log(err)
        if (err) resolve({code: 0})
        resolve({code: 1}) 
        
        });
    })
}