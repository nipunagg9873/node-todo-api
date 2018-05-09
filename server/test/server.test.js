const expect=require('expect')
const request=require('supertest')
const {ObjectID}=require('mongodb')

const {app}=require('./../server');
const Todo=require('./../models/todo').todo;

const todos=[{
  _id: new ObjectID(),
  text: 'first test todo'
}, {
  _id: new ObjectID(),
  text: 'second test todo'
}];

beforeEach((done)=>{
  Todo.remove({}).then(()=>{
    Todo.insertMany(todos);
  }).then(()=>done(),(e)=>console.log(e));
});

describe('POST /todo',()=>{
  it('should create new todo',(done)=>{
    var text="test todo text";

    request(app)
      .post('/todos')
      .send({text})
      .expect(200)
      .expect((res)=>{
        expect(res.body.text).toBe(text);
      })
      .end((err,res)=>{
        if(err) {
        return done(err);
        }
        Todo.find({text}).then((tds)=>{
          expect(tds.length).toBe(1);
          expect(tds[0].text).toBe(text);
          done();
        }).catch((e)=>done(e));
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

      Todo.find().then((tds)=>{
        expect(tds.length).toBe(2);
        done();
      }).catch((e)=>done(e));
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
