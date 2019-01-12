import * as express from 'express';
import { UserController } from '../controllers/user.controller';


class UserRoutes {
    private UserController: any;
    public router: express.Router = express.Router();
    constructor(){
        this.UserController = new UserController();
        this.config();
        
    }
    private config() {
        this.router.post('/user/login', this.UserController.login);
    }
}

export default new UserRoutes().router