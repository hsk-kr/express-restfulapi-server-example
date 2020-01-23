import mongoose from 'mongoose';
import ValidationError from '../errors/vaildation.error';
import NotFoundError from '../errors/not-found.error';
import AlreadyExists from '../errors/already-exists.error';
import User from '../models/user.model';
import {
  validateUsername,
  validatePassword,
  validateEmail,
} from '../helpers/validation';
import { removeSpaces } from '../helpers/string';

export const fetchUser = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      throw ValidationError('id');
    }

    const user = await User.findById(id);
    if (!user) {
      throw NotFoundError(`User ${id}`);
    }

    return res.status(200).json(user);
  } catch (err) {
    return next(err);
  }
};

export const fetchUsers = async (req, res, next) => {
  try {
    const { username, email, sort, skip, limit } = req.query;

    // conditions
    const conditions = {};

    try {
      if (username) {
        conditions.username = new RegExp(username, 'ig');
      }
      if (email) {
        conditions.email = new RegExp(email, 'ig');
      }
    } catch (err) {
      ValidationError('parameters');
    }

    let cursor = User.find(conditions);

    // sort
    if (sort) {
      cursor = cursor.sort(JSON.parse(sort));
    }

    // pagination
    if (skip && !Number.isNaN(skip)) {
      cursor = cursor.skip(Number(skip));
    }
    if (limit && !Number.isNaN(limit)) {
      cursor = cursor.limit(Number(limit));
    }

    const users = await cursor.exec();

    return res.status(200).json(users);
  } catch (err) {
    console.log(err);
    return next(err);
  }
};

export const createUser = async (req, res, next) => {
  try {
    let { username, password, email } = req.body;

    // check if all parameters are
    if (!username || !password || !email) {
      throw ValidationError('parameters');
    }

    // remove spaces
    username = removeSpaces(username);
    password = removeSpaces(password);
    email = removeSpaces(email);

    // check if user is already in the collection
    const user = await User.findOne({ username });
    if (user !== null) {
      throw AlreadyExists(username);
    }

    // validate the parameters
    if (
      !validateUsername(username) ||
      !validatePassword(password) ||
      !validateEmail(email)
    ) {
      throw ValidationError('parameters');
    }

    try {
      // create a user
      const newUser = new User({ username, password, email });
      await newUser.save();

      return res.status(201).json(newUser);
    } catch (err) {
      throw ValidationError('parameters');
    }
  } catch (err) {
    return next(err);
  }
};

export const updateUser = async (req, res, next) => {
  try {
    const { id } = req.params;
    let { username, password, email } = req.body;

    // check if all parameters are and valid id
    if (
      !mongoose.Types.ObjectId.isValid(id) ||
      !username ||
      !password ||
      !email
    ) {
      throw ValidationError('parameters');
    }

    // remove spaces
    username = removeSpaces(username);
    password = removeSpaces(password);
    email = removeSpaces(email);

    // check if user is already in the collection
    if ((await User.findOne({ username })) !== null) {
      throw AlreadyExists(username);
    }

    // validate the parameters
    if (
      !validateUsername(username) ||
      !validatePassword(password) ||
      !validateEmail(email)
    ) {
      throw ValidationError('parameters');
    }

    try {
      // create a user
      const user = await User.findByIdAndUpdate(
        id,
        {
          username,
          password,
          email,
        },
        { new: true, upsert: true },
      );

      return res.status(200).json(user);
    } catch (err) {
      throw ValidationError('parameters');
    }
  } catch (err) {
    return next(err);
  }
};

export const deleteUser = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw ValidationError('id');
    }

    await User.deleteOne({ _id: id });

    return res.status(200).send('OK');
  } catch (err) {
    return next(err);
  }
};

export const partialUpdateUser = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw ValidationError('id');
    }

    if ((await User.findById(id)) === null) {
      throw NotFoundError(`User ${id}`);
    }

    // fields that will set
    const partialUser = {};

    // eslint-disable-next-line no-restricted-syntax, guard-for-in
    for (const key in req.body) {
      if (req.body[key]) {
        partialUser[key] = removeSpaces(req.body[key]);
      }
    }

    try {
      const updatedUser = await User.findByIdAndUpdate(
        id,
        {
          $set: partialUser,
        },
        { new: true },
      );

      return res.status(200).json(updatedUser);
    } catch (err) {
      throw ValidationError('parameters');
    }
  } catch (err) {
    return next(err);
  }
};

export default User;
