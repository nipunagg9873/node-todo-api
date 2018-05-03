const expect=require('expect')
const request=require('supertest')

const {app}=require('./../server');
const Todo=require('./../models/todo').todo;

const todos=[{
  text: 'first test todo'
}, {
  text: 'second test todo'
}];

beforeEach((done)=>{
  Todo.remove({}).then(()=>{
    Todo.insertMany(todos);
  }).then(()=>done());
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
        Todo.find({text}).then((todos)=>{
          expect(todos.length).toBe(1);
          expect(todos[0].text).toBe(text);
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

      Todo.find().then((todos)=>{
        expect(todos.length).toBe(2);
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
    .end(done());
  });
});
