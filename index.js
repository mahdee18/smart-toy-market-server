const express = require('express')
const app = express()
const cors = require('cors')



// Middleware
app.use(cors())
app.use(express.json())

const port = process.env.PORT || 3000

app.get('/', (req, res) => {
  res.send('Smart Toy Market is running!!')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})