import express from 'express';
import handleError from './errors/handle-error';

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// routes
app.use('/users', require('./routes/users.route').default);

// error handling
app.use(handleError);

export default app;
