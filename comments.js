// Create web server 
// 1. Create a web server
// 2. Read the comments from comments.json
// 3. Display the comments
// 4. Add a comment

// Import the modules
const http = require('http');
const fs = require('fs');
const url = require('url');

// Read the comments from comments.json
let comments = JSON.parse(fs.readFileSync('comments.json'));

// Create a web server
http.createServer((request, response) => {
    let parsedUrl = url.parse(request.url, true);
    let path = parsedUrl.pathname;
    let query = parsedUrl.query;

    if (path === '/comments' && request.method === 'GET') {
        // Display the comments
        response.writeHead(200, { 'Content-Type': 'application/json' });
        response.end(JSON.stringify(comments));
    } else if (path === '/comments' && request.method === 'POST') {
        // Add a comment
        let comment = '';
        request.on('data', chunk => {
            comment += chunk;
        });
        request.on('end', () => {
            comment = JSON.parse(comment);
            comments.push(comment);
            fs.writeFileSync('comments.json', JSON.stringify(comments));
            response.writeHead(200, { 'Content-Type': 'application/json' });
            response.end(JSON.stringify(comments));
        });
    } else {
        response.writeHead(404, { 'Content-Type': 'text/plain' });
        response.end('Not Found');
    }
}).listen(3000, () => {
    console.log('Server is running at http://localhost:3000');
});