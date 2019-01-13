import { Request, Response, NextFunction } from "express";
import { User } from "../entity/user";
import * as jwt from 'jsonwebtoken';

import * as config from "../core/config/config.dev";

export class UserController {
    constructor() {}
    
    public login = async (req: Request, res: Response, next: NextFunction) => {
        try {
            let { email, password } = req.body.body;
            const user = await User.findOne({email: email, password: password})

            if(user) {
                const token = jwt.sign({
                    id: user.id,
                    email: user.email
                }, config.tokenSecretKey);

                res.json({
                    success: true,
                    token,
                    message: "Login success"
                });
            } else {
                res.json({user: [], success: false, message: "User not found"});
            }
        } catch(err) {
            res.json({success: false, message: "There was an error.."});
        }
    }

}
