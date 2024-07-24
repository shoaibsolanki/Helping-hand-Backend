const express = require('express');
const UserController = require('../Controller/UserController');
const fetchuser = require('../middleware/fetchuser')
const RoleBase = require('../middleware/RoleBase')
class AuthRoutes{
    constructor() { 
        this.router = express.Router();
        this.getRoutes();
        this.postRoutes();
        this.patchRoutes();
        this.deleteRoutes();
    }
     
    getRoutes(){
      this.router.get('/getmylevel/:userId',fetchuser, UserController.TeamLevel)
      this.router.get('/GetSponsor/:userId', UserController.GetSponorByUserID)
    }
    postRoutes(){
        this.router.post('/UserRegister', UserController.CreateUser)
        this.router.post('/CreatAdmin', UserController.CreateAdmin)
        this.router.post('/CreatAgent',fetchuser,RoleBase('Admin'),UserController.AgentCreatedByAdmin)
        this.router.post('/Login', UserController.Login)
    }
    patchRoutes(){

    }
    deleteRoutes(){
        
    }


}
module.exports = new AuthRoutes().router