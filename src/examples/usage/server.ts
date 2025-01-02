import express from 'express';
import { Document } from './basic-syntax';

const server = express();

server.use(express.static('dist'));

server.get('/', (req, res) => {
  const document = Document();
  res.send(document.toString());
});

server.listen(5000);
