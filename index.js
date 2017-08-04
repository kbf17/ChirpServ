var fs = require('fs');
var http = require('http');
var url = require('url');
var path = require('path');
var shortid = require('shortid');

var pathJSON = path.join(__dirname, 'data.json');

http.createServer(function(req, res){
    if (req.url.charAt(req.url.length - 1) === '/') {
        req.url = req.url.slice(0, req.url.length - 1);
    }
    var parsU = url.parse(req.url);


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
    } else if (req.method === 'GET' && parsU.pathname.indexOf('/chirps/one/') > -1){
        var lastSlashIndex = parsU.pathname.anchor.lastIndexOf('/');
        var id = parsU.pathname.slice(lastSlashIndex + 1);

        fs.readFile(pathJSON, 'utf-8', function(err, file){
            if (err){
                res.writeHead(500);
                res.end('Unable to read file');
            }
            var arr = JSON.parse(file);
            var result;

            arr.forEach(function(a) {
                if (a.id === id) {
                    result = a;
                }
            });

            if (result === undefined) {
                res.writeHead(404, 'NOT FOUND');
                res.end();
            } else {
                res.writeHead(200, 'OK');
                res.end(JSON.stringify(result));
            }
        })
        } else if (parsU.pathname.indexOf('/chirps/one/') >-1 && req.method === 'DELETE'){
            var lastSlashIndex = parsU.pathname.lastIndexOf('/');
            var id = parsU.pathname.slice(lastSlashIndex + 1);
            fs.readFile(pathJSON, 'utf-8', function(err, fileContents) {
                if (err) {
                res.writeHead(500);
                res.end('Unable to delete');
                } else {
                    var data = JSON.parse(fileContents);
                    var deleteIndex = -1;
                    data.forEach(function(chirp, i) {
                        if (chirp.id === id) {
                            deleteIndex = i;
                            console.log(i);
                        }
                    });
                    if (deleteIndex != -1) {
                        data.splice(deleteIndex, 1);
                        fs.writeFile(pathJSON, JSON.stringify(data), function(err, success) {
                            if (err) {
                                res.writeHead(500);
                            } else {
                                res.writeHead(202);
                            }
                        });
                    } else {
                        res.writeHead(404);
                    };
                };
            });
        }else if (parsU.pathname.indexOf('/chirps') > -1 && req.method === 'PUT'){
            console.log('i am a put');
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
                if(err){
                    res.writeHead(500);
                    res.end('Unable to read');
                } else {
                    var arr = JSON.parse(file);
                    data.forEach(function(a){
                        if (a.id === data.id){
                            a.message = data.message;
                            a.user = data.user;
                        }
                    });

                }
            })
        };

}).listen(3000);

