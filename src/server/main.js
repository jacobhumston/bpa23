import express from 'express';
const app = express();
let port = 80;
if (process.argv[2]) port = Number(process.argv[2]);
app.use('/', express.static('src/client/', { extensions: ['html'] }));
app.listen(port, () => console.log(`Server listening on port ${port}.`));
