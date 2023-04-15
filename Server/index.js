require("dotenv").config()
const express = require("express")
const cors = require("cors")
const jwt = require("jsonwebtoken")
const app = express() 
const User = require("./database/index.js")
const PORT = process.env.PORT 
const secret = process.env.JWT_SECRET
app.use(express.json())
app.use(cors())
app.get("/",(req,res)=>{
    res.status(200).json("hello")
})
app.post("/signup", async (req, res) => {
    const { username, password } = req.body
    const user = new User({ username, password })
  
    try {
      await user.save()
      const token = jwt.sign({ id: user._id }, secret)
      res.status(201).send("User created successfully")
    } catch (error) { 
     
      console.log(error)
      res.status(500).send("Error creating user")
    }
  })
  
  app.post("/login", async (req, res) => {
    const { username, password} = req.body
  
    try {
      const user = await User.findOne({ username })
  
      if (!user) {
        res.status(401).send("Invalid username or password")
        return
      }
  
      const isMatch = await user.comparePassword(password)
  
      if (!isMatch) {
        res.status(401).send("Invalid username or password")
        return
      }
  
      const token = jwt.sign({ id: user._id }, secret)
      res.status(200).json({ token })
    } catch (error) {
      console.log(error)
      res.status(500).send("Error logging in")
    }
  })
  
  app.get("/profile", async (req, res) => {
    const token = req.headers.authorization
  
    if (!token) {
      res.status(401).send("Unauthorized")
      return
    }
  
    try {
      const decoded = jwt.verify(token, secret)
      const user = await User.findById(decoded.id)
  
      if (!user) {
        res.status(404).send("User not found")
        return
      }
  
      res.status(200).json({ username: user.username })
    } catch (error) {
      console.log(error)
      res.status(500).send("Error getting profile")
    }
  })
  app.get("/all",(req,res)=>{
User.find({}).then((resp)=>{
res.status(200).json(resp)
}).catch(err=>console.log(err))
  })
  
  app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`)
  })