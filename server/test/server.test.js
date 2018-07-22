const expect=require('expect')
const request=require('supertest')
const {ObjectID}=require('mongodb')

const {app}=require('./../server');
const {Todo}=require('./../models/todo');
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
    .send()
    .expect(200)
    .expect((res)=>{
      expect(res.body.todos.length).toBe(2);
    })
    .end(done);
  });
});

describe('GET /todos/:id',()=>{
  it('should get the todo with id',(done)=>{
    request(app)
    .get(`/todos/${todos[0]._id.toHexString()}`)
    .send()
    .expect(200)
    .expect((res)=>{
      expect(res.body.todo.text).toBe(todos[0].text);
    })
    .end(done);
  });
  it('should get 404 with nonexisting id',(done)=>{
    request(app)
    .get(`/todos/${new ObjectID().toHexString()}`)
    .send()
    .expect(404)
    .end(done);
  });
  it('should get 400 with invalid id',(done)=>{
    request(app)
    .get(`/todos/123`)
    .send()
    .expect(400)
    .end(done);
  });
});
describe('Delete /todos/:id',(done)=>{
  it('should delete todo with id',(done)=>{
    request(app)
  .delete(`/todos/${todos[0]._id.toHexString()}`)
  .send()
  .expect(200)
  .expect((res)=>{
    expect(res.body.todo._id).toBe(todos[0]._id.toHexString())
  }).end((err,res)=>{
    if(err)
    return done(err);
  });
    Todo.findById(todos[0]._id.toHexString()).then((todo)=>{
      expect(todo).toNot;
      done();
    }).catch((e)=>done(e));
});
it('should return 404 if todo not found', (done) => {
    var hexId = new ObjectID().toHexString();

    request(app)
      .delete(`/todos/${hexId}`)
      .expect(404)
      .end(done);
  });

  it('should return 404 if object id is invalid', (done) => {
    request(app)
      .delete('/todos/123abc')
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

  it('should clear completedAt when todo is not completed', (done) => {
    var hexId = todos[1]._id.toHexString();
    var text = 'This should be the new text!!';

    request(app)
      .patch(`/todos/${hexId}`)
      .send({
        completed: false,
        text
      })
      .expect(200)
      .expect((res) => {
        expect(res.body.text).toBe(text);
        expect(res.body.completed).toBe(false);
        expect(res.body.completedAt).toNotExist();
      })
      .end(done);
  });
});
