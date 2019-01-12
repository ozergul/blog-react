import * as express from 'express';
import { TermController } from '../controllers/term.controller';
import { isAuthenticated } from "../utils/is.authenticated"

class TermRoutes {
    private TermController: any;
    public router: express.Router = express.Router();
    constructor(){
        this.TermController = new TermController();
        this.config();
        
    }
    private config() {
        this.router.get('/terms/all',  isAuthenticated, this.TermController.all);
        this.router.get('/terms/search',  isAuthenticated, this.TermController.search);
        this.router.get('/terms/all/:pageId',  isAuthenticated, this.TermController.allWithPaginate);

        this.router.post('/terms/add', isAuthenticated, this.TermController.add);
        this.router.post('/terms/update-term', isAuthenticated, this.TermController.updateTerm);
        this.router.post('/terms/update-slug', isAuthenticated, this.TermController.updateSlug);
        this.router.post('/terms/update-description', isAuthenticated, this.TermController.updateDescription);
        this.router.post('/terms/delete', isAuthenticated, this.TermController.delete);
    }
}

export default new TermRoutes().router