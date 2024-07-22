const mongoose = require ('mongoose');
const { Schema } = mongoose;

const UserSchema = new Schema({
    user_id:{
        type: String,
        required: true,
        unique:true
    },
    name:{
        type: String,
        required: true
    },
    father_name:{
    type:String
    },
    Address:{
        type: String,
    },
    phoneNo:{
     type: Number,
     required:true,
     unique:true
    },
    email:{
        type: String,
        required: true,
    },
    password:{
        type: String,
        required: true
    },
    DOB:{
        type:Date
    },
    Pro_image:{
        type:String
    },
    city:{
    type: String
    },
    State:{
    type: String
    },
    date:{
        type: Date,
        default:Date.now 
    },
    Sponsor_id:{
        type: String,
    },
    Sponsor_Name:{
        type: String,
    },
    Wallet_amount:{
        type: String,
        default: 0,
    },
    Parent_id: {
        type: String
    },
    Grandparent_id: {
        type: String
    },
    role:{
        type:String,
        enum:['user','Admin',"Agent"],
        required:true,
        default:'user'
    },
    level:{
        type:String,
        default:'1'
    }
    // otp:{
    //     type:String
    // },
//     Permissions: [{
//       Permission: {
//           type: String,
//           default: null
//       },
//       Status: {
//           type: Boolean,
//           default: false
//       }
//   }],
  });
const User = mongoose.model('user', UserSchema);
module.exports = User;
  