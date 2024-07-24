const mongoose = require("mongoose");
const { Schema } = mongoose;

const AccountDetail = new Schema({
  userid:{
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "User",
  },
  Upi_no: {
    type: String,
    require: true,
  },
  Bank_Name:{
    type: String,
    require: true
  },
  Account_Holder_name:{
    type: String,
    require:true
  },
  Account_No:{
    type : String,
    require:true
  },
  IFSC_Code:{
   type: String,
   require:true
  },
  Upi_Id :{
    type: String,
    require: true
  }
});
const Account = mongoose.model("accountDetail", AccountDetail);
module.exports = Account;
