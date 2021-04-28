const fs = require("fs")
const path = require("path")
const gunzip = require("gunzip-file")
const CDC_FILE_PATH = 'CDC'

const getAllFiles = function(dirPath, arrayOfFiles) {
    files = fs.readdirSync(dirPath)

    arrayOfFiles = arrayOfFiles || []

    files.forEach(function(file) {
        if (fs.statSync(dirPath + "/" + file).isDirectory()) {
            arrayOfFiles = getAllFiles(dirPath + "/" + file, arrayOfFiles)
        } else {
            arrayOfFiles.push(path.join(__dirname, dirPath, "/", file))
        }
    })
    return arrayOfFiles
}
const result = getAllFiles(CDC_FILE_PATH)

result
    .filter(it=>it.toLowerCase().endsWith('.gz'))
    .map(it => {
        console.log(it);
        gunzip(it, it+'.log', () => {
            console.log('gunzip done!')
        })

       
    });

getAllFiles(CDC_FILE_PATH)
    .filter(it=>it.toLowerCase().endsWith('.log'))
