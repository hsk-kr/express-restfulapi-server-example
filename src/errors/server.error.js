import ErrorHandler from './error-handler';

export default err => {
  console.log(err);
  return new ErrorHandler(500, 'Server Internal Error');
};
