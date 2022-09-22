const express = require('express')
const app = express()
const cors = require('cors')
require('dotenv').config()
const {v4}= require('uuid')
app.use(cors())
app.use(express.static('public'))
const bodyParser = require('body-parser');
const users = [];
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html')
});


app.post("/api/users", (request, response)=>{
  const {username} = request.body;
  const id = v4();
  users.push({
    username, _id: id,
    exercises: []
  });

  return response.json({
    username,
    _id: id
  })
})

app.post("/api/users/:_id/exercises", (request, response)=>{
  const {_id} = request.params;
  const {description, duration, date} = request.body;
  const user = users.find((user) => user._id == _id);
  const realDate = date ? new Date(date) : new Date()
  user.exercises.push({
    date: realDate.toUTCString(),
    description,
    duration
  })

  return response.json({
    date: realDate.toUTCString(),
    description,
    duration,
    _id,
    username: user.username
  })
})

app.get("/api/users", (request, response) => {
  return response.json(users);
})

app.get("/api/users/:_id/logs", (request, response)=>{
  const {_id} = request.params;
  const user = users.find((user) => user._id == _id);
  return response.json({
    count: user.exercises.length,
    logs:user.exercises
  })
})


const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port)
})
