var fs = require('fs');
var http = require('http');
var url = require('url');
var path = require('path');
var shortid = require('shortid');

var pathJSON = path.join(__dirname, 'data.json');

http.createServer(function(req, res){
    var parsU = url.parse(req.url);
    // res.writeHead(200, {'Content-type': 'text/plain'})
    // res.end('Hello World');

    if (parsU.pathname === '/chirps' && req.method === 'GET'){
        fs.readFile(pathJSON, function(err, file){
            if (err) {
                res.writeHead(500);
                res.end('Cannot read files');
            }
            res.write(file);
            res.end;
        });
    } else if (parsU.pathname === '/chirps' && req.method === 'POST'){
        var chunks = '',
            data;

        req.on('data', function (chunk){
            chunks += chunk;
            if (chunks.length > 1e6){
                req.connection.destroy();
            }
            data = JSON.parse(chunks);
        });

        fs.readFile(pathJSON, 'utf-8', function(err, file){
            if (err) {
                res.writeHead(500);
                res.end('Cannot read files');
            }
            var arr = JSON.parse(file);

            data.id = shortid.generate();
            arr.push(data);
            fs.writeFile(pathJSON, JSON.stringify(arr), function(err, success){
                if (err){
                    res.writeHead(500);
                    res.end('Unable to update data');
                } else{
                    res.writeHead(201, 'Created');
                    res.end(JSON.stringify(arr));
                }
            });
        });
    } else if (parsU.pathname === '/chirps/' && req.method === 'DELETE'){
        fs.readFile(pathJSON, )


        // if(req.method === 'dleete' && url.indexOF('/chirps/one') > -1 {
            // chirps/one/5
        })
    }

}).listen(3000);

