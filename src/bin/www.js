import http from 'http';
import cluster from 'cluster';
import os from 'os';
import app from '../app';
import db from '../db';

require('dotenv').config();

if (cluster.isMaster) {
  const numCPUs = os.cpus().length;

  for (let i = 0; i < numCPUs; i += 1) {
    cluster.fork();
  }

  cluster.on('online', worker => {
    console.log(`Worker ${worker.process.pid} starts`);
  });

  cluster.on('exit', (worker, exitCode) => {
    console.log(
      `Worker ${worker.process.id} exited (${exitCode}), creates a new worker.`,
    );
    cluster.fork();
  });
} else {
  db().then(() => {
    const server = http.createServer(app);

    server.on('error', err => {
      console.log(err);
    });

    server.listen(process.env.PORT, () => {
      console.log(
        `Express server listening on port ${process.env.PORT}`,
      );
    });
  });
}
