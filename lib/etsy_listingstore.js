'use strict';

/*
Ideally replace this with a better datastore.  S3, Mongo, etc.
Improve performance overall and also allow the app to be scaled horizontally.
*/

const fs = require('fs');
const util = require('util');
const readFile = util.promisify(fs.readFile);
const path = require('path');

var getFileName = function(shopID) {
    return `./data/${shopID}.json`;
};

var getLogFileName = function(shopID, date) {
    return `./data/${shopID}/${date.getFullYear()}/${date.getFullYear()}-${date.getMonth()}-${date.getDay()}.json`;
};

var get = async function(shopID) {
    //While this could probably be done by searching the log directory
    //for the most recent file.  Space is often less expensive than processing
    //and the file system is very slow so saving a separate file for the most recent version makes sense.
    let fileName = getFileName(shopID);
    if (fs.existsSync(fileName)) {
        let fileContents = await readFile(fileName, 'utf8');
        return JSON.parse(fileContents);
    }
    else {
        return '';
    }
};

var ensureDirectoryExists = function(filePath) {
    var dirname = path.dirname(filePath);
    if (fs.existsSync(dirname)) {
      return true;
    }
    ensureDirectoryExists(dirname);
    fs.mkdirSync(dirname);
};

var writeFile = function(fileName, data) {
    ensureDirectoryExists(fileName);
    fs.writeFile(fileName, data, 'utf8', (err) => {
        if (err) {
            //Normally add proper error handling and logging on a project wide basis
            //In this instance hard exception, and log with something like winston.
            //Displaying in console for simplicity and time
            console.log('An error occured while writing JSON Object to File.' + err);
         }
    });
};

var save = function(shopID, data, date, current) {
    //Save file by date for future reference or debugging
    let logFileName = getLogFileName(shopID, date);
    writeFile(logFileName, JSON.stringify(data));

    //If most recent, save at root for quick retrieval
    if (current) {
        let fileName = getFileName(shopID);
        writeFile(fileName, JSON.stringify(data));
    }
};

var saveToday = function(shopID, data) {
    save(shopID, data, new Date(), true);
};

//Export functions
module.exports.Get = get;
module.exports.Save = saveToday;
