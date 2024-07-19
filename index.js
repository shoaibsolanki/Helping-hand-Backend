
const connectToMongo = require('./db');
const express = require('express')


var cors = require('cors')

connectToMongo();
const app = express()

const port = 9000

app.use(cors())
app.use(express.json())

//available routes

app.use('/api/auth', require('./Routes/Auth'))

app.get('*',(req,res,next)=>{
  res.status(200).json({
    message:'bad request'
  })
})

app.listen(port, () => {
  console.log(`Healping backend listening at on //localhost:${port}`)
})

module.exports = app;