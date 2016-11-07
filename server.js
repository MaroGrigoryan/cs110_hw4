'use strict' 
const path = require('path');
const fs = require('fs');
const http = require('http');
const url = require('url');
const querystring = require('querystring'); 
const todos = [
        {
            name: 'calculus',
            checked: false,
            id: "1",
        },
        {
            name: 'discrete',
            checked: false,
            id: "2",
        },
        {
            name: 'introduction to computer science',
            checked: false,
            id: "3",
        },
        {
            name: 'freshman english',
            checked: false,
            id: "4",
        },
        {
            name: 'music appreciation',
            checked: false,
            id: "5",
        },
];
const httpServer = http.createServer(function(req, res) {
	

	const parsedUrl = url.parse(req.url);
    const parsedQuery = querystring.parse(parsedUrl.query);
    const method = req.method;

    if(method === 'GET') {

        if(req.url.indexOf('/todos') === 0) {
            res.setHeader('Content-Type', 'application/json');
            let localTodos = todos;
            if(parsedQuery.searchtext) {
                localTodos = localTodos.filter(function(obj) {
                    return obj.name.indexOf(parsedQuery.searchtext) >= 0;
                });
            }
        	return res.end(JSON.stringify({items : localTodos}));
        }

        else  {

	 	const baseFile = './public';
		const mainFile = path.join(baseFile, req.url);
		fs.readFile(mainFile, function(err, data) {
        if(err) {
        	res.writeHead(404, 'Not Found');
        	res.write('404 : File Not Found');
        	 res.end();
        }

         res.statusCode = 200;
          res.end(data);
        });
	}

    }

   	if(method === 'POST') {
        if(req.url.indexOf('/todos') === 0) {
  			let body = '';
            req.on('data', function (chunk) {
                body += chunk;
            });
            req.on('end', function () {
                let jsonObj = JSON.parse(body);  // now that we have the content, convert the JSON into an object
                jsonObj.id = Math.random() + ''; // assign an id to the new object
                todos.push(jsonObj);   // store the new object into our array (our 'database')
                res.setHeader('Content-Type', 'application/json');
                return res.end(JSON.stringify(jsonObj));
            });
            return;
        }
    } 


   if(method === 'PUT') {
        if(req.url.indexOf('/todos') === 0) {

            // read the content of the message
            let body = '';
            req.on('data', function (chunk) {
                body += chunk;
            });
            req.on('end', function () {
                let jsonObj = JSON.parse(body); // now that we have the content, convert the JSON into an object

                // find the todo in our todos array and replace it with the new object
                for(let i = 0; i < todos.length; i++) {
                    if(todos[i].id === jsonObj.id) { // found the same object
                        todos[i].checked = jsonObj.checked; // replace the old object with the new object
                        res.setHeader('Content-Type', 'application/json');
                        return res.end(JSON.stringify(jsonObj));
                    }
                }

                res.statusCode = 404;
                return res.end('Data was not found and can therefore not be updated');
            });
            return;
        }
    }



        if(method === 'DELETE') {
        if(req.url.indexOf('/todos/') === 0) {
            let id =  req.url.substr(7);
            for(let i = 0; i < todos.length; i++) {
                if(id === todos[i].id) {
                    todos.splice(i, 1);
                    res.statusCode = 200;
                    return res.end('Successfully removed');
                }
            }
            res.statusCode = 404;
            return res.end('Data was not found');
        }
    }


    


});

  

httpServer.listen(3003);