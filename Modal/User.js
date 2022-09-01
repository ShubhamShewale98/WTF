const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({

    first_name: { type: String, required: true },
    last_name: { type: String, required: true   },
    email: { type: String, required: true, unique: true  },
    mobile: { type: Number, required: true, unique: true  },

    status: {
        type: String,
        enum: ["active", "inactive"], required: true  
    },
    role: {
        type: String,
        enum: ["admin", "member", "trainer"], required: true 
    },
    password:{type:String ,required: true}

})

const User = mongoose.model("user",userSchema) 
const connection =mongoose.connect(process.env.MONGOURL, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}, () => { console.log("connect") }) 

module.exports = { User, connection }