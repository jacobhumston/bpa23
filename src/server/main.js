import express from 'express';
import mime from 'mime';

const app = express();

console.log(mime.getType('src/build/etc/s.json'));

app.listen(80);
