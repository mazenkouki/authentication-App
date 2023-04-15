const mongoose = require("mongoose")
const bcrypt = require('bcrypt');
const { MONGODB_URI } = process.env;
mongoose.connect(MONGODB_URI,{ useNewUrlParser: true,
  useUnifiedTopology: true,}).then(()=>{
    console.log('db connected')
}).catch(err=>console.log(err))
let userSchema = mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true
      },
      password: {
        type: String,
        required: true
      }
},{timestamps : true})

userSchema.pre("save", async function (next) {
  const user = this
  if (!user.isModified("password")) return next()

  const salt = await bcrypt.genSalt()
  const hash = await bcrypt.hash(user.password, salt)

  user.password = hash
  next()
})
userSchema.methods.comparePassword = async function (password) {
  const user = this
  return await bcrypt.compare(password, user.password)
} 
const User = mongoose.model("User", userSchema)
 
module.exports = User