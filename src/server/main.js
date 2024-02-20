import express from 'express';
const app = express();
app.use('/', express.static('src/client/', { extensions: ['html'] }));
app.listen(80);
