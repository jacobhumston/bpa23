/**
 * A simple node server, incase apache isn't available.
 *
 * The first cmd param is the port to listen on.
 * And the second is the root of express.static.
 *
 * It's important that the directory you provide contains a
 * folder named bpa with the repository's contents.
 *
 * *DEFAULT IS "/"*
 */

// Modules
const express = require('express');
const app = express();

// Set the current express.static path.
const path = process.argv[3] ?? '/';

// Log the current path.
console.log(`Serving on path "${path}"...`);

// Use express.static to serve static files.
app.use(express.static(path));

// Favicon requests.
app.get('/favicon.ico', function (_, response) {
    response.sendFile(`favicon.ico`, { root: '.' });
});

// Redirect root to the bpa folder.
app.get('/', function (_, response) {
    response.redirect('/bpa/');
});

/**
 * Verify that all requests are for bpa,
 * redirect ones that are not.
 */
app.use(function (request, response, next) {
    if (!request.path.startsWith('/bpa')) {
        response.redirect('/');
    } else {
        next();
    }
});

// Redirect to the 404 page if nothing else succeeds.
app.use(function (_, response) {
    response.redirect('/bpa/404.html');
});

/**
 * Listen on the provided port
 * or port 80 if none is provided.
 */
const port = process.argv[2] ?? 80;
app.listen(port);
console.log(`Listening on port ${port}...`);

// Log that the server has started.
console.log('Node server has started!');
