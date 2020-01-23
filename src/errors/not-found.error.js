import ErrorHandler from './error-handler';

export default name => new ErrorHandler(404, `${name} Not Found`);
