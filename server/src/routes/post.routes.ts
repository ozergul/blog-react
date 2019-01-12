import * as express from 'express';
import { PostController } from '../controllers/post.controller';
import { isAuthenticated } from "../utils/is.authenticated"

class PostRoutes {
    private PostController: any;
    public router: express.Router = express.Router();
    constructor(){
        this.PostController = new PostController();
        this.config();
    }
    private config() {
        /* admin routes */
        this.router.get('/posts/all', isAuthenticated, this.PostController.all);
        this.router.get('/posts/all/:pageId',  isAuthenticated, this.PostController.allWithPaginate);
        this.router.get('/posts/single/:postId', isAuthenticated, this.PostController.single);

        this.router.post('/posts/add',  isAuthenticated, this.PostController.add);
        this.router.post('/posts/update',  isAuthenticated, this.PostController.update);
        this.router.post('/posts/update-title',  isAuthenticated, this.PostController.updateTitle);
        this.router.post('/posts/delete',  isAuthenticated, this.PostController.delete);

        /* public routes */
        this.router.get('/public/posts/all/:pageId', this.PostController.publicAllWithPaginate);
    }
}

export default new PostRoutes().router