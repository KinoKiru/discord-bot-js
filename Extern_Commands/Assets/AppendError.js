const fs = require('fs');
module.exports = function (Error) {
    fs.appendFileSync(__dirname + '/console.text', Error + "\n");
}