const http = require('http');
const url = require('url');
const fs = require('fs');
const path = require('path');
const { unescape } = require('querystring');

const hostName = '127.0.0.1';
const port = 5000;

const mimeTypes = {
    'html': 'text/html',
    'css': 'text/css',
    'js': 'text/js',
    'png': 'image/png',
    'jpeg': 'image/jpeg',
    'jpg': 'image/jpg'
};

http.createServer((req, res) => {
    let myUri = url.parse(req.url).pathname
    let fileName = path.join(process.cwd(), unescape(myUri));
    console.log('file looking for is ' + fileName);
    let loadFile;

    try{
        loadFile = fs.lstatSync(fileName);
    } catch (error) {
        res.writeHead(500, {'Content-Type': 'text/plain'});
        res.write('404 page not found');
        res.end();
        return;
    }

    if(loadFile.isFile()){
        let mimeType = mimeTypes[path.extname(fileName).split('.').reverse()[0]];
        res.writeHead(200, {'Content-Type': mimeType});
        let fileStream = fs.createReadStream(fileName);
        fileStream.pipe(res)
    } else if(loadFile.isDirectory()) {
        res.writeHead(302, {'Location': 'index.html'});
        res.end();
    } else {
        res.writeHead(500, {'Content-Type': 'text/plain'});
        res.write('500 Internal errorrr');
        res.end()
    }
}).listen(port, hostName, () => {
    console.log('server is listening at 5000')
})