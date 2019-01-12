import * as express from 'express';
import { AttachmentController } from '../controllers/attachment.controller';
import { isAuthenticated } from "../utils/is.authenticated"

class PostRoutes {
    private AttachmentController: any;
    public router: express.Router = express.Router();
    constructor(){
        this.AttachmentController = new AttachmentController();
        this.config();
    }
    private config() {
        this.router.get('/attachments/all', this.AttachmentController.all);
        this.router.get('/attachments/all/:pageId',  this.AttachmentController.allWithPaginate);

        this.router.post('/attachments/delete',  isAuthenticated, this.AttachmentController.delete);
        this.router.post('/attachments/image-upload',  isAuthenticated, this.AttachmentController.imageUpload);
    }
}

export default new PostRoutes().router