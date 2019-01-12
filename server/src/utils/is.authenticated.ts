import * as jwt from 'jsonwebtoken';
import config from '../core/config/config.dev'
import * as HttpStatus from 'http-status-codes';
import { User } from '../entity/User';

export async function isAuthenticated (req, res, next) {
    const authorizationHeader = req.headers['authorization'];
    let token:string;

    if (authorizationHeader) {
        token = authorizationHeader.split(' ')[1];
    }

    next();

    // if (token) {
    //     console.log("-----------0", token);
    //     jwt.verify(token, config.tokenSecretKey, async (err:any, decoded:any) => {
    //         if (err) {
    //             console.log("-----------1");
    //             res.status(HttpStatus.UNAUTHORIZED).json({error: 'You are not authorized to perform this operation!'});
    //         } else {
    //             let id:number = decoded.id;
    //             console.log("id", id)
    //             let user = await User.findOneById(id);
    //             console.log("-----------2", user);
    //             if(!user) {
    //                 console.log("-----------3");
    //                 res.status(HttpStatus.NOT_FOUND).json({error: 'No user'});
    //             } else {
    //                 console.log("-----------4");
    //                 req.currentUser = user;
    //                 next();
    //             }
    //         }
    //     });
    // } else {
    //     console.log("-----------5");
    //     res.status(HttpStatus.FORBIDDEN).json({
    //         error: 'No token provided'
    //     });
    // }
};