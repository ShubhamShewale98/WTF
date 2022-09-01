const express = require('express')
const { connection, User } = require('./Modal/User')
const jwt = require('jsonwebtoken')
const crypto = require('crypto')
const app = express()

app.use(express.urlencoded({ extended: true }))

app.use(express.json())

app.get('/', async (req, res) => { res.send('hello') })
app.post('/register', async (req, res) => {
  const { first_name, last_name, email, mobile, password, role, status } = req.body
  console.log(req.body)

  if(password.length <8){
    return res.send({message:"password must be 8 charcter"})
  }
  if(mobile.length != 10){
    return res.send({message:"number must be 10 digit"})
  }
  const hash = crypto.pbkdf2Sync(password, "SECRETSALT1234", 60, 64, "sha256").toString("hex")


  const userDetails = new User({
    first_name,
    last_name,
    email,
    mobile,
    password: hash,
    role,
    status
  })




  userDetails.save().then(() => {
    res.send({ message: "User Created", userDetails })
  }).catch((e) => {
    res.send({ message: "Error", e })
  })



})
app.post('/login', async (req, res) => {
  const { email, password, role } = req.body
  let user = await User.find(email)
  let hash = crypto.pbkdf2Sync(password, "SECRETSALT1234", 60, 64, "sha256").toString("hex")
  if (user) {
    if (user.role != role) {
      return res.send({ message: "Role IS Inccorect" })
    }
    if (password != hash) {
      return res.send({ message: "Unauthorised user" })
    }
    const token = jwt.sign({ _id: user?._id, email: user?.email  }, "SHUBHAMT", { expiresIn: "30d" })
    return res.json({
      status:200,
      message:"Logged in successfully&quot",
      data: user,
      token:token
      })
  } else {
    res.send({ message: "User Not found" })
  }

})








app.get("/profiles/:id", async (req, res) => {
  const user = await User.findById(req.params.id)
  const token = req.headers['authorization']?.split(" ")[1] || ""
  //check if token exits , of its length is > 0 ,....
//  console.log(req.url , req.params.id , "inn")
  if (!token) {
    return res.send("forbidden")
  }


  try {
    const decoded = jwt.verify(token, "SHUBHAMT");
    if (decoded) {
      return res.send(decoded)
    }
  } catch (e) {
    if (e instanceof jwt.JsonWebTokenError) {
      console.log(e.message)

    } else {

      console.log(e.message)

    }
    return res.status(403).send("forbidden")
  }


})
app.get("/filter", async (req, res) => {
  console.log(req.body)
  let user =  await User.find(req.body)
res.send({user})


})

app.listen(process.env.PORT || 8080, async () => {
  try {
    await connection
    console.log("connected")
  } catch (e) {
    console.log(e)
  }
})