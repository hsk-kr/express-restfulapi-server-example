/* eslint-disable no-underscore-dangle */
/* eslint-disable no-await-in-loop */
import request from 'supertest';
import app from '../app';
import db from '../db';
import User from '../models/user.model';

let conn = null;

const dftUser = {
  username: 'Joly',
  password: 'password',
  email: 'aran@gmail.com',
};

// expects if the response is error or not.
const expectError = body => {
  expect(body).toHaveProperty('status');
  expect(body).toHaveProperty('statusCode');
  expect(body).toHaveProperty('message');
};

// expects if data is user or not
const expectUser = data => {
  expect(data).toHaveProperty('_id');
  expect(data).toHaveProperty('username');
  expect(data).toHaveProperty('password');
  expect(data).toHaveProperty('email');
  expect(data).toHaveProperty('createdAt');
  expect(data).toHaveProperty('updatedAt');
};

// creates Indexes of collections after drop database
const dropDBAndCreateIndexes = async () => {
  if (conn === null) {
    throw new Error('No db connection.');
  }

  await conn.connection.dropDatabase();
  // has to create indexes again after deleting collections.
  await User.createIndexes();
};

/**
 * request create API. number starts by one.
 * username: username{number}
 * password: password
 * email: useremail{number}@gmail.com
 */
const createUsers = async length => {
  for (let i = 1; i <= length; i += 1) {
    await request(app)
      .post('/users')
      .send({
        username: `username${i}`,
        password: `password${i}`,
        email: `useremail${i}@gmail.com`,
      });
  }
};

describe('/users', () => {
  beforeAll(async done => {
    conn = await db();
    done();
  });

  afterAll(() => {
    if (conn !== null) {
      conn.close();
    }
  });

  beforeEach(async () => {
    dropDBAndCreateIndexes();
  });

  describe('POST /', () => {
    test('Creates user', async () => {
      const res = await request(app)
        .post('/users')
        .send(dftUser);

      expect(res.status).toEqual(201);
      expectUser(res.body);
    });

    test('Username has no space (trim)', async () => {
      const res = await request(app)
        .post('/users')
        .send({
          username: ' user1 ',
          password: 'password',
          email: 'joly1@gmail.com',
        });

      expect(res.status).toEqual(201);
      expect(res.body.username).toEqual('user1');
    });

    test('Password has no space (trim)', async () => {
      const res = await request(app)
        .post('/users')
        .send({
          username: 'user1',
          password: ' password ',
          email: 'joly1@gmail.com',
        });

      expect(res.status).toEqual(201);
      expect(res.body.password).toEqual('password');
    });

    test('Email has no space (trim)', async () => {
      const res = await request(app)
        .post('/users')
        .send({
          username: 'user1',
          password: 'password',
          email: ' joly1@gmail.com ',
        });

      expect(res.status).toEqual(201);
      expect(res.body.email).toEqual('joly1@gmail.com');
    });

    test('Fails if username already exists', async () => {
      let res = await request(app)
        .post('/users')
        .send(dftUser);
      expect(res.status).toEqual(201);

      res = await request(app)
        .post('/users')
        .send(dftUser);

      expect(res.status).toEqual(200);
      expectError(res.body);
    });

    test('Fails without required params', async () => {
      const res = await request(app)
        .post('/users')
        .send({
          username: 'Joly',
          password: 'password',
        });

      expect(res.status).toEqual(400);
      expectError(res.body);
    });

    test('Fails with invalid username', async () => {
      // empty
      let res = await request(app)
        .post('/users')
        .send({
          username: '',
          password: 'password',
          email: 'joly3@gmail.com',
        });

      expect(res.status).toEqual(400);
      expectError(res.body);

      // too long
      res = await request(app)
        .post('/users')
        .send({
          username: 'asdf'.repeat(21),
          password: 'password',
          email: 'joly2@gmail.com',
        });

      expect(res.status).toEqual(400);
      expectError(res.body);

      // characters that doesn't allow to use
      res = await request(app)
        .post('/users')
        .send({
          username: '@%!@#',
          password: 'password',
          email: 'joly1@gmail.com',
        });

      expect(res.status).toEqual(400);
      expectError(res.body);
    });

    test('Fails with invalid password', async () => {
      // empty
      let res = await request(app)
        .post('/users')
        .send({
          username: 'jolu1',
          password: '',
          email: 'joly1@gmail.com',
        });

      expect(res.status).toEqual(400);
      expectError(res.body);

      // too long
      res = await request(app)
        .post('/users')
        .send({
          username: 'joly2',
          password: 'poas'.repeat(10),
          email: 'joly2@gmail.com',
        });

      expect(res.status).toEqual(400);
      expectError(res.body);

      // characters that doesn't allow to use
      res = await request(app)
        .post('/users')
        .send({
          username: 'joly3',
          password: '+---/**/-*-/',
          email: 'joly3@gmail.com',
        });

      expect(res.status).toEqual(400);
      expectError(res.body);
    });

    test('Fails with invalid email', async () => {
      // empty
      let res = await request(app)
        .post('/users')
        .send({
          username: 'jolu1',
          password: 'password',
          email: '',
        });

      expect(res.status).toEqual(400);
      expectError(res.body);

      // too long
      res = await request(app)
        .post('/users')
        .send({
          username: 'joly2',
          password: 'poas'.repeat(10),
          email: 'joly2@gmail.com'.repeat(10),
        });

      expect(res.status).toEqual(400);
      expectError(res.body);

      // not email format
      res = await request(app)
        .post('/users')
        .send({
          username: 'joly3',
          password: '+---/**/-*-/',
          email: 'joly3^gmail.com',
        });

      expect(res.status).toEqual(400);
      expectError(res.body);
    });
  });

  describe('GET /', () => {
    test('Succeeds to get all users', async () => {
      await createUsers(3);

      const res = await request(app).get('/users');

      expect(res.status).toEqual(200);
      expect(res.body.length).toEqual(3);
    });

    test('Succeeds to search for the user by username or email', async () => {
      await createUsers(3);

      let res = await request(app)
        .post('/users')
        .send({
          username: 'Holy',
          password: 'password',
          email: 'Holy@gmail.com',
        });

      expect(res.status).toEqual(201);

      res = await request(app).get('/users?username=user*');

      expect(res.status).toEqual(200);
      expect(res.body.length).toEqual(3);

      res = await request(app).get('/users?username=Holy');

      expect(res.status).toEqual(200);
      expect(res.body.length).toEqual(1);
      expect(res.body[0].username).toEqual('Holy');

      res = await request(app).get('/users?email=useremail*');

      expect(res.status).toEqual(200);
      expect(res.body.length).toEqual(3);

      res = await request(app).get('/users?email=Holy@gmail.com');

      expect(res.status).toEqual(200);
      expect(res.body.length).toEqual(1);
      expect(res.body[0].email).toEqual('Holy@gmail.com');
    });

    test('Succeeds to sort users', async () => {
      await createUsers(3);

      let res = await request(app).get('/users?sort={"username":1}');

      expect(res.status).toEqual(200);
      expect(res.body.length).toEqual(3);
      expect(res.body[0].username).toEqual('username1');

      res = await request(app).get('/users?sort={"username":-1}');
      expect(res.status).toEqual(200);
      expect(res.body.length).toEqual(3);
      expect(res.body[0].username).toEqual('username3');
    });

    test('Succeeds pagination', async () => {
      await createUsers(10);

      let res = await request(app).get('/users?skip=3');

      expect(res.status).toEqual(200);
      expect(res.body.length).toEqual(7);
      expect(res.body[0].username).toEqual('username4');

      res = await request(app).get('/users?limit=5');

      expect(res.status).toEqual(200);
      expect(res.body.length).toEqual(5);
      expect(res.body[0].username).toEqual('username1');
      expect(res.body[res.body.length - 1].username).toEqual(
        'username5',
      );

      res = await request(app).get('/users?skip=4&limit=3');

      expect(res.status).toEqual(200);
      expect(res.body.length).toEqual(3);
      expect(res.body[0].username).toEqual('username5');
      expect(res.body[res.body.length - 1].username).toEqual(
        'username7',
      );
    });
  });

  describe('GET /[id]', () => {
    test('Succeeds to fetch User', async () => {
      let res = await request(app)
        .post('/users')
        .send(dftUser);

      expect(res.status).toEqual(201);
      expect(res.body).toHaveProperty('_id');

      res = await request(app).get(`/users/${res.body._id}`);

      expect(res.status).toEqual(200);
      expect(res.body.username).toEqual(dftUser.username);
    });

    test('Fails 400 error with invalid id', async () => {
      const res = await request(app).get('/users/1');

      expect(res.status).toEqual(400);
    });

    test('Fails 404 error when its failed to find user', async () => {
      const res = await request(app).get('/users/111111111111');

      expect(res.status).toEqual(404);
    });
  });

  describe('PUT /[id]', () => {
    test('Succeeds to create a user if there is no user', async () => {
      const res = await request(app)
        .put('/users/111111111111')
        .send(dftUser);

      expect(res.status).toEqual(200);
      console.log(res.body);
      expect(res.body).toHaveProperty('_id');
      expect(res.body.username).toEqual(dftUser.username);
    });

    test('Fails 400 error with invalid object id', async () => {
      const res = await request(app)
        .put('/users/1')
        .send(dftUser);

      expect(res.status).toEqual(400);
    });

    test('Succeeds to modify', async () => {
      let res = await request(app)
        .post('/users')
        .send(dftUser);

      expect(res.status).toEqual(201);
      expect(res.body).toHaveProperty('_id');

      const putUser = { ...dftUser };
      putUser.username = 'EDIT_USER';
      res = await request(app)
        .put(`/users/${res.body._id}`)
        .send(putUser);

      console.log(res.body);
      expect(res.status).toEqual(200);
      expect(res.body.username).toEqual('EDIT_USER');
    });

    test('Fails without required params', async () => {
      const res = await request(app)
        .put('/users/111111111111')
        .send({
          username: 'username',
        });

      expect(res.status).toEqual(400);
    });

    test('Fails with invalid params', async () => {
      let res = await request(app)
        .put('/users/111111111111')
        .send({
          ...dftUser,
          username: '!@$',
        });
      expect(res.status).toEqual(400);

      res = await request(app)
        .put('/users/111111111111')
        .send({
          ...dftUser,
          password: '=-=-\\=-',
        });
      expect(res.status).toEqual(400);

      res = await request(app)
        .put('/users/111111111111')
        .send({
          ...dftUser,
          email: 'asdasd.asdascom',
        });
      expect(res.status).toEqual(400);
    });

    test('Username has no space (trim)', async () => {
      const res = await request(app)
        .put('/users/111111111111')
        .send({
          username: ' user1 ',
          password: 'password',
          email: 'joly1@gmail.com',
        });

      expect(res.status).toEqual(200);
      expect(res.body.username).toEqual('user1');
    });

    test('Password has no space (trim)', async () => {
      const res = await request(app)
        .put('/users/111111111111')
        .send({
          username: 'user1',
          password: ' password ',
          email: 'joly1@gmail.com',
        });

      expect(res.status).toEqual(200);
      expect(res.body.password).toEqual('password');
    });

    test('Email has no space (trim)', async () => {
      const res = await request(app)
        .put('/users/111111111111')
        .send({
          username: 'user1',
          password: 'password',
          email: ' joly1@gmail.com ',
        });

      expect(res.status).toEqual(200);
      expect(res.body.email).toEqual('joly1@gmail.com');
    });

    test('Fails if username already exists', async () => {
      let res = await request(app)
        .post('/users')
        .send(dftUser);
      expect(res.status).toEqual(201);

      res = await request(app)
        .put(`/users/${res.body._id}`)
        .send(dftUser);

      expect(res.status).toEqual(200);
      expectError(res.body);
    });
  });

  describe('DELETE /[id]', () => {
    test('Succeeds to delete a user', async () => {
      await createUsers(3);

      let res = await request(app)
        .post('/users')
        .send(dftUser);
      expect(res.status).toEqual(201);

      res = await request(app).delete(`/users/${res.body._id}`);
      expect(res.status).toEqual(200);

      res = await request(app).get('/users');
      expect(res.status).toEqual(200);
      expect(res.body.length).toEqual(3);
    });

    test('Fails with invalid id', async () => {
      await createUsers(3);

      let res = await request(app).delete('/users/1');
      expect(res.status).toEqual(400);

      res = await request(app).get('/users');
      expect(res.status).toEqual(200);
      expect(res.body.length).toEqual(3);
    });

    test('Returns status code 200 when try to delete non-existence user', async () => {
      await createUsers(3);

      let res = await request(app).delete('/users/111111111111');
      expect(res.status).toEqual(200);

      res = await request(app).get('/users');
      expect(res.status).toEqual(200);
      expect(res.body.length).toEqual(3);
    });
  });

  describe('PATCH [/id]', () => {
    test('Succeeds to partial update', async () => {
      let res = await request(app)
        .post('/users')
        .send(dftUser);

      expect(res.status).toEqual(201);
      expect(res.body).toHaveProperty('_id');

      const { _id } = res.body;
      res = await request(app)
        .patch(`/users/${_id}`)
        .send({
          username: 'test_username',
        });

      expect(res.status).toEqual(200);
      expect(res.body).toHaveProperty('_id');
      expect(res.body).toHaveProperty('username');
      expect(res.body).toHaveProperty('password');
      expect(res.body).toHaveProperty('email');
      expect(res.body.username).toEqual('test_username');

      res = await request(app)
        .patch(`/users/${_id}`)
        .send({
          password: 'test_password',
        });

      expect(res.status).toEqual(200);
      expect(res.body.password).toEqual('test_password');

      res = await request(app)
        .patch(`/users/${_id}`)
        .send({
          email: 'test@gmail.com',
        });

      expect(res.status).toEqual(200);
      expect(res.body.email).toEqual('test@gmail.com');

      const testUser = {
        username: 'testuser',
        password: 'testpassword',
        email: 'test@gmail.com',
      };

      res = await request(app)
        .patch(`/users/${_id}`)
        .send(testUser);

      expect(res.status).toEqual(200);
      expect(res.body).toMatchObject(testUser);
    });

    test('Succeeds with non params', async () => {
      let res = await request(app)
        .post('/users')
        .send(dftUser);
      expect(res.status).toEqual(201);
      const createdUser = { ...res.body };

      res = await request(app)
        .patch(`/users/${createdUser._id}`)
        .send({});

      delete createdUser.updatedAt;
      expect(res.status).toEqual(200);
      expect(res.body).toMatchObject(createdUser);
    });

    test('Fails with invalid id', async () => {
      const res = await request(app)
        .patch('/users/1')
        .send(dftUser);

      expect(res.status).toEqual(400);
    });

    test('Not found error if there is no user', async () => {
      const res = await request(app)
        .patch(`/users/111111111111`)
        .send(dftUser);

      expect(res.status).toEqual(404);
    });
  });
});
