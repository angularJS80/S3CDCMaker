const fs = require("fs")
const path = require("path")
const readline = require("readline")
const CDC_FILE_PATH = 'CDC'
var READ_LINE_SIZE = 0;
var READ_LINE_COUNT = 0;
var writeStreams =[];
/*SubFunction Start*/

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


async function writeFiles (it) {
    var readFileAndWritePromise = new Promise(function(resolve, reject){
        var writefilelength = readFileAndWrite(it)
        resolve(writefilelength);
    });
    readFileAndWritePromise.then(function(){
        console.log("added file read event loader")
    });
}


function  readFileAndWrite(file) {
    const instream =   fs.createReadStream(file)
    var reader = readline.createInterface(instream, process.stdout);
    reader.on('line', function (line) {
        if (linefilter(line)) {
            var logger =getCreateWriteStream(900000000,READ_LINE_SIZE);
            var writeStr = crateWriteString(line)
            logger.write(writeStr);
            READ_LINE_SIZE = READ_LINE_SIZE + writeStr.length;
            READ_LINE_COUNT = READ_LINE_COUNT + 1;
            console.log("readLineCount"+READ_LINE_COUNT)
          //  console.log( "saved size = "+fileLength);
        }
    });
}

function linefilter(line) {
    if(line.length> 0){
        return true;
    }else{
        return false;
    }
}

function crateWriteString(line) {
    var linePreFix ='INSERT,tabelname,schemaname,';
    var linearr = line.split(' ');
    var datetime = linearr[0]
    var writeStr = linePreFix+datetime + "," + linearr[0]+ "," + linearr[1]+ "," + linearr[2]+"\n"
   return writeStr;
}



function getCreateWriteStream(maxFileSize,currentSize){
    var index = Math.floor(currentSize/maxFileSize)
    if(writeStreams.length == index){
        writeStreams.push(
            fs.createWriteStream(createIndexFileName('CDC',Math.floor(index)+1,4,'csv'), {
                flags: 'a'
            })
        )
    }
    return writeStreams[index]
}

function createIndexFileName(prefix,index,limitNumberLength,fileExt){
    a = prefix+ lpad(index, limitNumberLength) +'.'+fileExt
    return a;
}

function lpad(n, width, z) {
    z = z || '0';
    n = n + '';
    return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
}
/*SubFunction End*/

function main() {
    const result = getAllFiles(CDC_FILE_PATH)
    for (const it of result
        .filter(it => it.toLowerCase().endsWith('.log'))) {
        writeFiles(it)
    }
}
main();
