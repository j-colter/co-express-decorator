import express from 'express';

import { RegisterController } from '../src';
import { UserController } from './UserController';

const app = express();

app.get('/', function (req, res) {
  res.send('Hello World!');
});

RegisterController(app, [UserController]);

app.listen(3000, () => console.log('Example app listening at http://%s:%s', '127.0.0.1', 3000));
