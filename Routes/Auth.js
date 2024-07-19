const express = require('express');
const UserController = require('../Controller/UserController');
const fetchuser = require('../middleware/fetchuser')
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
    }
    postRoutes(){
        this.router.post('/UserRegister', UserController.CreateUser)
        this.router.post('/Login', UserController.Login)
    }
    patchRoutes(){

    }
    deleteRoutes(){
        
    }


}
module.exports = new AuthRoutes().router