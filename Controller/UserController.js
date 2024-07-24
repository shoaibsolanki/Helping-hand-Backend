const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const JWT_SECRET = "Shoaib@7357";
const Account = require("../models/AccountDetail");
const Joi = require('joi');
const Transcation = require("../models/Transcation");

const getTeamHierarchy = async (sponsorId, level, result, levelCounts) => {
  const members = await User.find({ Sponsor_id: sponsorId }).exec();
  if (members.length > 0) {
    if (!result[level]) {
      result[level] = [];
      levelCounts[level] = 0;
    }
    for (const member of members) {
      result[level].push({
        userId: member.user_id,
        name: member.name,
        Sponsor_id: member.Sponsor_id,
        Sponsor_Name: member.Sponsor_Name
      });
      levelCounts[level]++;
      await getTeamHierarchy(member.user_id, level + 1, result, levelCounts);
    }
  }
};
class UserController {
  static async CreateUser(req, res) {
    try {
      let success = false;
      const {
        name,
        phoneNo,
        fatherName,
        city,
        State,
        Sponsor_id,
        email,
        Upi_no,
        Bank_Name,
        Account_Holder_name,
        Account_No,
        IFSC_Code,
        Upi_Id
      } = req.body;
      let Sponsor = await User.findOne({ user_id: Sponsor_id });
      // console.log(Sponsor)
      if (!Sponsor) {
        return res
          .status(400)
          .json({ success, error: "Sorry Sponsor not exists" });
      }
       
      let Team = await User.find({Sponsor_id:Sponsor_id})
      if(Team.length>=2){
        return res
        .status(400)
        .json({ success, error: "Sponsor have Already Maximum Team" });
      }
      let user = await User.findOne({ phoneNo: req.body.phoneNo });
      if (user) {
        return res
          .status(400)
          .json({ success, error: "Sorry a User are already exists" });
      }
      const accountSchema = Joi.object({
        name: Joi.string().required().messages({
          'string.empty': 'Name is required',
          'any.required': 'Name is required'
        }),
        Sponsor_id: Joi.string().required().messages({
          'string.empty': 'Sponsor id is required',
          'any.required': 'Sponsor id is required'
        }),
        
        phoneNo: Joi.string().required().messages({
          'string.empty': 'Phone Number is required',
          'any.required': 'Phone Number is required'
        }),
        fatherName: Joi.string().required().messages({
          'string.empty': 'Father Name is required',
          'any.required': 'Father Namer is required'
        }),
        Upi_no: Joi.string().required().messages({
          'string.empty': 'UPI number is required',
          'any.required': 'UPI number is required'
        }),
        Bank_Name: Joi.string().required().messages({
          'string.empty': 'Bank name is required',
          'any.required': 'Bank name is required'
        }),
        Account_Holder_name: Joi.string().required().messages({
          'string.empty': 'Account holder name is required',
          'any.required': 'Account holder name is required'
        }),
        Account_No: Joi.string().required().messages({
          'string.empty': 'Account number is required',
          'any.required': 'Account number is required'
        }),
        IFSC_Code: Joi.string().required().messages({
          'string.empty': 'IFSC code is required',
          'any.required': 'IFSC code is required'
        }),
        Upi_Id: Joi.string().required().messages({
          'string.empty': 'Upi_Id is required',
          'any.required': 'Upi_Id is required'
        }),
      });
  
      const { error } = accountSchema.validate({
        name,
        phoneNo,
        fatherName,
        Sponsor_id,
        Upi_no,
        Bank_Name,
        Account_Holder_name,
        Account_No,
        IFSC_Code,
        Upi_Id,
      });
  
      if (error) {
        return res.status(400).json({ success, error: error.details[0].message });
      }
       
        // Generate user_id based on name and phone number
        const userId = name.slice(0, 2).toUpperCase() + phoneNo;

      const salt = await bcrypt.genSalt(10);
      const secPass = await bcrypt.hash(req.body.password, salt);
      //creat a new use
      const Parent_id = Sponsor_id;
      const Grandparent_id = Sponsor?.Sponsor_id;

      user = await User.create({
        user_id: userId,
        name: name,
        phoneNo: phoneNo,
        father_name: fatherName,
        city: city,
        State: State,
        Sponsor_id: Sponsor_id,
        Sponsor_Name: Sponsor.name,
        password: secPass,
        email: email,
        Parent_id: Parent_id,
        Grandparent_id: Grandparent_id
      });
       // Update the Wallet_amount of the sponsor
       const incrementValue = 300; // Example increment value, adjust as needed
       Sponsor.Wallet_amount = (parseFloat(Sponsor.Wallet_amount) + incrementValue).toString();
       await Sponsor.save();
       
       await Transcation.create({
        Give_by:user.id,
        Resive:Sponsor?.id,
        T_name:"Direct Income",
        amount:incrementValue
       })

      const data = {
        user: {
          id: user.id,
        },
      };

      await Account.create({
        userid:user.id,
        Upi_no:Upi_no,
        Bank_Name:Bank_Name,
        Account_Holder_name:Account_Holder_name,
        Account_No:Account_No,
        IFSC_Code:IFSC_Code,
        Upi_Id:Upi_Id
      })
      const authtoken = jwt.sign(data, JWT_SECRET);

      // res.json(user);
      success = true;
      res.json({ success, authtoken });
      //catch errors
    } catch (error) {
      console.error(error.message);
      res.status(500).send("Internal Server Error");
    }
  }

  //CreatAdmin 
  static async CreateAdmin(req,res){
    try {
    let success = false;
    const {
      name,
      phoneNo,
      fatherName,
      city,
      State,
      email,
      Upi_no,
      Bank_Name,
      Account_Holder_name,
      Account_No,
      IFSC_Code,
      Upi_Id
    } = req.body;
    let user = await User.findOne({ phoneNo: req.body.phoneNo });
    if (user) {
      return res
        .status(400)
        .json({ success, error: "Sorry a User are already exists" });
    }
    const accountSchema = Joi.object({
      name: Joi.string().required().messages({
        'string.empty': 'Name is required',
        'any.required': 'Name is required'
      }),
      
      phoneNo: Joi.string().required().messages({
        'string.empty': 'Phone Number is required',
        'any.required': 'Phone Number is required'
      }),
      fatherName: Joi.string().required().messages({
        'string.empty': 'Father Name is required',
        'any.required': 'Father Namer is required'
      }),
      Upi_no: Joi.string().required().messages({
        'string.empty': 'UPI number is required',
        'any.required': 'UPI number is required'
      }),
      Bank_Name: Joi.string().required().messages({
        'string.empty': 'Bank name is required',
        'any.required': 'Bank name is required'
      }),
      Account_Holder_name: Joi.string().required().messages({
        'string.empty': 'Account holder name is required',
        'any.required': 'Account holder name is required'
      }),
      Account_No: Joi.string().required().messages({
        'string.empty': 'Account number is required',
        'any.required': 'Account number is required'
      }),
      IFSC_Code: Joi.string().required().messages({
        'string.empty': 'IFSC code is required',
        'any.required': 'IFSC code is required'
      }),
      Upi_Id: Joi.string().required().messages({
        'string.empty': 'E-Pin is required',
        'any.required': 'E-Pin is required'
      }),
    });

    const { error } = accountSchema.validate({
      name,
      phoneNo,
      fatherName,
      Upi_no,
      Bank_Name,
      Account_Holder_name,
      Account_No,
      IFSC_Code,
      Upi_Id,
    });

    if (error) {
      return res.status(400).json({ success, error: error.details[0].message });
    }
    const userId = name.slice(0, 2).toUpperCase() + phoneNo;

    const salt = await bcrypt.genSalt(10);
    const secPass = await bcrypt.hash(req.body.password, salt)
    user = await User.create({
      user_id: userId,
      name: name,
      phoneNo: phoneNo,
      father_name: fatherName,
      city: city,
      State: State,
      Sponsor_id: null,
      Sponsor_Name:null,
      password: secPass,
      email: email,
      Parent_id: null,
      Grandparent_id: null,
      role:"Admin"
    });

    const data = {
      user: {
        id: user.id,
      },
    };
    const authtoken = jwt.sign(data, JWT_SECRET);

      // res.json(user);
      success = true;
      res.json({ success, authtoken });
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server Error");
  }
  }
 
  static async Login(req,res){
  try {
    let success = false;
    const { UserId, password } = req.body;
    const UserSchema = Joi.object({
      UserId:Joi.string().required().messages({
        'string.empty': 'User Id is required',
        'any.required': 'User Id is required'
      }),
      password:Joi.string().required().messages({
        'string.empty': 'Password is required',
        'any.required': 'Password is required'
      }),
    })
    const { error } = UserSchema.validate({
      UserId,
      password
    });
    if (error) {
      return res.status(400).json({ success, error: error.details[0].message });
    }

    let user = await User.findOne({user_id: UserId });
    if (!user) {
      return res.status(400).json({ success, error: "please try to login with correct credentials" });
    }
    const passwordCompare = await bcrypt.compare(password, user.password);
    if (!passwordCompare) {
      return res.status(400).json({ success, error: "Password is Not Correct" });
    }
    const data = {
      user: {
        id: user.id
      }
    }
    const authtoken = jwt.sign(data, JWT_SECRET);
    success = true;
    res.json({ success, authtoken })
    
  } catch (error) {
    console.error(error.message)
    res.status(500).send("Internal Server Error")
  }
  }

static async AgentCreatedByAdmin(req,res){
  try {
    let success = false;
    const {
      name,
      phoneNo,
      fatherName,
      city,
      State,
      email,
      Upi_no,
      Bank_Name,
      Account_Holder_name,
      Account_No,
      IFSC_Code,
      Upi_Id
    } = req.body;
    let user = await User.findOne({ phoneNo: req.body.phoneNo });
    if (user) {
      return res
        .status(400)
        .json({ success, error: "Sorry a User are already exists" });
    }
    const accountSchema = Joi.object({
      name: Joi.string().required().messages({
        'string.empty': 'Name is required',
        'any.required': 'Name is required'
      }),
      
      phoneNo: Joi.string().required().messages({
        'string.empty': 'Phone Number is required',
        'any.required': 'Phone Number is required'
      }),
      fatherName: Joi.string().required().messages({
        'string.empty': 'Father Name is required',
        'any.required': 'Father Namer is required'
      }),
      Upi_no: Joi.string().required().messages({
        'string.empty': 'UPI number is required',
        'any.required': 'UPI number is required'
      }),
      Bank_Name: Joi.string().required().messages({
        'string.empty': 'Bank name is required',
        'any.required': 'Bank name is required'
      }),
      Account_Holder_name: Joi.string().required().messages({
        'string.empty': 'Account holder name is required',
        'any.required': 'Account holder name is required'
      }),
      Account_No: Joi.string().required().messages({
        'string.empty': 'Account number is required',
        'any.required': 'Account number is required'
      }),
      IFSC_Code: Joi.string().required().messages({
        'string.empty': 'IFSC code is required',
        'any.required': 'IFSC code is required'
      }),
      Upi_Id: Joi.string().required().messages({
        'string.empty': 'E-Pin is required',
        'any.required': 'E-Pin is required'
      }),
    });

    const { error } = accountSchema.validate({
      name,
      phoneNo,
      fatherName,
      Upi_no,
      Bank_Name,
      Account_Holder_name,
      Account_No,
      IFSC_Code,
      Upi_Id,
    });

    if (error) {
      return res.status(400).json({ success, error: error.details[0].message });
    }
    const userId = name.slice(0, 2).toUpperCase() + phoneNo;

    const salt = await bcrypt.genSalt(10);
    const secPass = await bcrypt.hash(req.body.password, salt)
    user = await User.create({
      user_id: userId,
      name: name,
      phoneNo: phoneNo,
      father_name: fatherName,
      city: city,
      State: State,
      Sponsor_id:"By Admin",
      Sponsor_Name:"By Admin",
      password: secPass,
      email: email,
      Parent_id: null,
      Grandparent_id: null,
      role:"Agent"
    });

    const data = {
      user: {
        id: user.id,
      },
    };
    const authtoken = jwt.sign(data, JWT_SECRET);

      // res.json(user);
      success = true;
      res.json({ success, authtoken });
  } catch (error) {
    console.log(error)
    res.status(500).send("Internal Server Error")
  }
}

  
static async TeamLevel(req, res) {
  const { userId } = req.params;
  try {
    const rootUser = await User.findOne({ user_id: userId }).exec();
    if (!rootUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    let result = {};
    let levelCounts = {};
    await getTeamHierarchy(rootUser.user_id, 1, result, levelCounts);
    res.json({ user: rootUser, team: result, levelCounts });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}


static async GetSponorByUserID(req ,res){
  try {
    const { userId } = req.params;
    const rootUser = await User.findOne({ user_id: userId }).select("name").exec();
    res.send(rootUser);
  } catch (error) {
    console.log(error)
    res.status(500).send("Internal Server Error")
  }
}

}
module.exports = UserController;
