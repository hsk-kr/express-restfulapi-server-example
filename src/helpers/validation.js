export const validateUsername = username => {
  const re = /^[\w]+$/;
  return re.test(username);
};

export const validatePassword = password => {
  const re = /^[\w!@#$%^&*()]+$/;
  return re.test(password);
};

export const validateEmail = email => {
  const re = /^[\w.!#$%&'*+/=?^`{|}~-]+@[\w.-]+\.[a-z]{2,}$/i;
  return re.test(email);
};
