import ErrorHandler from './error-handler';

export default name => new ErrorHandler(400, `Invalid ${name}`);
