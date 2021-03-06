const expect=require('expect')
const request=require('supertest')
const {ObjectID}=require('mongodb')

const {app}=require('./../server');
const {Todo}=require('./../models/todo');
const {User}=require('./../models/user');
const {todos,populateTodos,users,populateUsers}=require('./seed/seed');

beforeEach(populateTodos);
beforeEach(populateUsers);

// describe('useless test',()=>{
//   it(
//     'should do nothing',(done)=>{
//       setTimeout(done, 2100);
//     });
// });

describe('POST /todos',()=>{
  it('should create a new todo',  (done)=>  {
    var text = 'Test todo text';
    request(app)
      .post('/todos')
      .set('x-auth',users[0].tokens[0].token)
      .send({text})
      .expect(200)
      .expect((res) => {
        expect(res.body.text).toBe(text);
      })
      .end((err, res) => {

        if (err) {
        return  done(err);
        }
        // done();
        Todo.find({text}).then((todos) => {
          expect(todos.length).toBe(1);
          expect(todos[0].text).toBe(text);
          // console.log(todos);
          done();
        }).catch((e) => done(e));
      });
  });

  it('should not create a todo with invalid data',(done)=>{
    request(app)
    .post('/todos')
    .set('x-auth',users[0].tokens[0].token)
    .send()
    .expect(400)
    .end((err,res)=>{
      if(err) {
        return done(err);
      };

      Todo.find().then((todos)=>{
        expect(todos.length).toBe(2);
        done();
      }).catch((e)=> done(e));
    });
  });
});

describe('GET /todos',()=>{
  it('should get all the todos',(done)=>{
    request(app)
    .get('/todos')
    .set('x-auth',users[0].tokens[0].token)
    .send()
    .expect(200)
    .expect((res)=>{
      expect(res.body.todos.length).toBe(1);
    })
    .end(done);
  });
});

describe('GET /todos/:id',()=>{
  it('should get the todo with id',(done)=>{
    request(app)
    .get(`/todos/${todos[0]._id.toHexString()}`)
    .set('x-auth',users[0].tokens[0].token)
    .send()
    .expect(200)
    .expect((res)=>{
      expect(res.body.todo.text).toBe(todos[0].text);
    })
    .end(done);
  });
  it('should not get the todo with id created by other user',(done)=>{
    request(app)
    .get(`/todos/${todos[0]._id.toHexString()}`)
    .set('x-auth',users[1].tokens[0].token)
    .send()
    .expect(404)
    .end(done);
  });
  it('should get 404 with nonexisting id',(done)=>{
    request(app)
    .get(`/todos/${new ObjectID().toHexString()}`)
    .set('x-auth',users[0].tokens[0].token)
    .send()
    .expect(404)
    .end(done);
  });
  it('should get 400 with invalid id',(done)=>{
    request(app)
    .get(`/todos/123`)
    .set('x-auth',users[0].tokens[0].token)
    .send()
    .expect(400)
    .end(done);
  });
});
describe('Delete /todos/:id',(done)=>{
  it('should delete todo with id',(done)=>{
    request(app)
  .delete(`/todos/${todos[0]._id.toHexString()}`)
  .set('x-auth',users[0].tokens[0].token)
  .send()
  .expect(200)
  .expect((res)=>{
    expect(res.body.todo._id).toBe(todos[0]._id.toHexString())
  }).end((err,res)=>{
    if(err)
    return done(err);
    Todo.findById(todos[0]._id).then((todo)=>{
      console.log(todo);
      expect(todo).toBeFalsy();
      done();
    }).catch((e)=>done(e));
  });
});
  it('should not delete todo with id created by other user',(done)=>{
    request(app)
  .delete(`/todos/${todos[0]._id.toHexString()}`)
  .set('x-auth',users[1].tokens[0].token)
  .send()
  .expect(404)
  .end(done);
  });
  it('should return 404 if todo not found', (done) => {
    var hexId = new ObjectID().toHexString();

    request(app)
      .delete(`/todos/${hexId}`)
      .set('x-auth',users[0].tokens[0].token)
      .expect(404)
      .end(done);
  });

  it('should return 404 if object id is invalid', (done) => {
    request(app)
      .delete('/todos/123abc')
      .set('x-auth',users[0].tokens[0].token)
      .expect(404)
      .end(done);
  });
});

describe('PATCH /todos/:id', () => {
  it('should update the todo', (done) => {
    var hexId = todos[0]._id.toHexString();
    var text = 'This should be the new text';

    request(app)
      .patch(`/todos/${hexId}`)
      .set('x-auth',users[0].tokens[0].token)
      .send({
        completed: true,
        text
      })
      .expect(200)
      .expect((res) => {
        expect(res.body.text).toBe(text);
        expect(res.body.completed).toBe(true);
        expect(typeof(res.body.completedAt)).toBe('number');
      })
      .end(done);
  });
  it('should not update the todo created by other user', (done) => {
    var hexId = todos[0]._id.toHexString();
    var text = 'This should be the new text';

    request(app)
      .patch(`/todos/${hexId}`)
      .set('x-auth',users[1].tokens[0].token)
      .send({
        completed: true,
        text
      })
      .expect(404)
      .end(done);
  });
  it('should clear completedAt when todo is not completed', (done) => {
    var hexId = todos[1]._id.toHexString();
    var text = 'This should be the new text!!';

    request(app)
      .patch(`/todos/${hexId}`)
      .set('x-auth',users[1].tokens[0].token)
      .send({
        completed: false,
        text
      })
      .expect(200)
      .expect((res) => {
        expect(res.body.text).toBe(text);
        expect(res.body.completed).toBe(false);
        expect(res.body.completedAt).toBeFalsy();
      })
      .end(done);
  });
});

describe('GET users/me',()=>{
  it('should return user data if authenticated',(done)=>{
    request(app)
    .get('/users/me')
    .set('x-auth',users[0].tokens[0].token)
    .expect(200)
    .expect((res)=>{
      expect(res.body._id).toBe(users[0]._id.toHexString());
      expect(res.body.email).toBe(users[0].email);
    }).end(done);
  });
  it('should return 401 if not authenticated',(done)=>{
    request(app)
    .get('/users/me')
    .expect(401)
    .expect((res)=>{
      expect(res.body).toEqual({})
    })
    .end(done);
  });
});
describe('POST /users',()=>{
  it('should create the user',(done)=>{
    var email='example@abc.com';
    var password='abc123!';

    request(app)
    .post('/users')
    .send({email,password})
    .expect(200)
    .expect((res)=>{
      expect(res.headers['x-auth']).toBeTruthy();
      expect(res.body._id).toBeTruthy();
      expect(res.body.email).toBe(email);
    })
    .end((err)=>{
      if(err)
      {
        return done(err);
      }
      User.findOne({email}).then((user)=>{
        expect(user).toBeTruthy();
        expect(user.email).toBe(email);
        expect(user.password).not.toBe(password);
        done();
      }).catch((e)=>done(e));
    });
  });
  it('should return validation errors if request is invalid',(done)=>{
    var email='exampleabc.com';
    var password='abc123!';

    request(app)
    .post('/users')
    .send({email,password})
    .expect(400)
    .end(done);
  });

  it('shouldnot create user if email already in use',(done)=>{
    var email=users[0].email;
    var password='abc123!';

    request(app)
    .post('/users')
    .send({email,password})
    .expect(400)
    .end(done);
  });
});

describe('POST users/login',()=>{
  it('should login user and return x-auth token',(done)=>{
    request(app)
    .post('/users/login')
    .send({
      email:users[1].email,
      password:users[1].password
    })
    .expect(200)
    .expect((res)=>{
      expect(res.headers['x-auth']).toBeTruthy();
    })
    .end((err,res)=>{
      if(err)
      {
        return done(err);
      }
      User.findById(users[1]._id).then((user)=>{

        expect(user.toObject().tokens[1]).toMatchObject({
          access:'auth',
          token:res.headers['x-auth']
        });
        done();
      }).catch((e)=>done(e));
    });
  });

  it('should not login user with invalid credentials',(done)=>{
    request(app)
    .post('/users/login')
    .send({
      email:users[1].email,
      password:'invalid!!'
    })
    .expect(400)
    .expect((res)=>{
      expect(res.headers['x-auth']).toBeFalsy();
      User.findById(users[1]._id).then((user)=>{
        expect(user.tokens.length).toBe(1);
      });
    })
    .end(done);

  });
});

describe('DELETE /users/me/token',()=>{
    it('should delete token with valid authentication',(done)=>{
      request(app)
      .delete('/users/me/token')
      .set('x-auth',users[0].tokens[0].token)
      .send()
      .expect(200)
      .end((err,res)=>{
        if(err)
        return done(err);

        User.findById(users[0]._id).then((user)=>{
          expect(user.tokens.length).toBe(0);
          done();
        }).catch((e)=>done(e));
      });
    });
});
