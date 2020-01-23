import ErrorHandler from './error-handler';

export default name =>
  new ErrorHandler(200, `${name} Already exists`);
