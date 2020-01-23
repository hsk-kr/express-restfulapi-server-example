import http from 'http';
import app from '../app';
import db from '../db';

require('dotenv').config();

db().then(() => {
  const server = http.createServer(app);

  server.on('error', err => {
    console.log(err);
  });

  server.listen(process.env.PORT, () =>
    console.log(
      `Express server listening on port ${process.env.PORT}`,
    ),
  );
});
