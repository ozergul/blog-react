import { Request, Response, NextFunction } from "express";
import { Term } from "../entity/term";
import * as helpers from "../utils/helpers";
import {Like} from "typeorm";

export class TermController {
    constructor() {}

    /**
     * Fetch all terms
     */
    public all = async (req: Request, res: Response, next: NextFunction) => {
        const {type} = req.query;

        let terms: any = [];

        try {
            if(type === "categories" || type === "tags") terms = await Term.find({
                // order: {
                //     id: "DESC"
                // },
                where: {
                    type: type,
                }
            });
            else terms = await Term.find();

            res.json({terms: terms});
        } catch(err) {
            console.log(err)
        }
    }

    /**
     * Search in all terms
     */
    public search = async (req: Request, res: Response, next: NextFunction) => {
        const {type, search} = req.query;
        console.log("search", search);

        let terms: any = [];

        try {
            if(type === "categories" || type === "tags") {
                terms = await Term.find({
                    where: {
                        type: type,
                        term: Like(`%${search}%`)
                    },
                });
            }  else {
                terms = await Term.find({
                    where: {
                        term: Like(`%${search}%`)
                    },
                })
            }

            res.json({terms: terms});
        } catch(err) {
            console.log(err)
        }
    }

    /**
     * Fetch all categories with pagination
     */
    public allWithPaginate = async (req: Request, res: Response, next: NextFunction) => {
        
        let { pageId, } = req.params;
        const { type } = req.query;
        
        const TERM_PER_PAGE = 10;


        if(isNaN(pageId)) pageId = 1
        if (!pageId) pageId = 0;

        
        try {

            pageId = parseInt(pageId);
            pageId = pageId - 1;
            pageId = Math.abs(parseInt(pageId));

            let skip = TERM_PER_PAGE * pageId;


            if(type === "categories" || type === "tags") {
                let [terms, total] = await Term.findAndCount({
                    where: {
                        type: type
                    },
                    take: TERM_PER_PAGE,
                    skip: skip,
                    order: {
                        term: "ASC"
                    }
                });
                res.json({terms: terms, termsCount: total, termPerPage: TERM_PER_PAGE});
            } else {
                let [terms, total] = await Term.findAndCount({
                    take: TERM_PER_PAGE,
                    skip: skip,
                });
                res.json({terms: terms, termsCount: total, termPerPage: TERM_PER_PAGE});
            } 
            
        } catch(err) {
            console.log(err)
            res.json({success: false, message: "There was an error.."});
        }
    }

    /**
     * Add new category 
     */
    public add = async (req: Request, res: Response, next: NextFunction) => {
        let { term, description, type } = req.body.body;
        if(!description) description = ""

        term = term.trim();
        description = description.trim();
        
        try {
            const newTerm = Term.create({term: term, description: description, type: type})
            await newTerm.save();
            res.json({success: true, newTerm: newTerm});
        } catch(err) {
            res.json({success: false, message: "There was an error.."});
        }
    }

    /**
     * update term
     */
    public updateTerm = async (req: Request, res: Response, next: NextFunction) => {
        let { term, id} = req.body.body;
        term = term.trim();
        if(!term) {
            res.json({ success: false })
            return false;
        }

        let slug = helpers.toSeoUrl(term);

        try {
            let categoryToUpdate:any = await Term.findOne({id: id});
            categoryToUpdate.term = term;
            categoryToUpdate.slug = slug;
            await categoryToUpdate.save();

            res.json({
                success: true, slug: categoryToUpdate.slug
            })
        } catch(err) {
            res.json({success: false, message: "There was an error.."});
        }
    }

    /**
     * update slug
     */
    public updateSlug = async (req: Request, res: Response, next: NextFunction) => {
        let { slug, id } = req.body.body;
        slug = slug.trim();
        
        if(!slug) {
            res.json({ success: false })
            return false;
        }

        slug = helpers.toSeoUrl(slug);

        try {
            let categoryToUpdate: any = await Term.findOne({id: id});
            categoryToUpdate.slug = slug;
            await categoryToUpdate.save();
            res.json({
                success: true, slug: categoryToUpdate.slug
            })
        } catch(err) {
            res.json({success: false, message: "There was an error.."});
        }
    }


    /**
     * update description
     */
    public updateDescription = async (req: Request, res: Response, next: NextFunction) => {
        let { description, id } = req.body.body;
        description = description.trim();
        if(!description) {
            res.json({ success: false })
            return false;
        }

        try {
            let categoryToUpdate: any = await Term.findOne({id: id});
            categoryToUpdate.description = description;
            await categoryToUpdate.save();
            res.json({
                success: true
            })
        } catch(err) {
            res.json({success: false, message: "There was an error.."});
        }
    }

    /**
     * delete category
     */
    public delete = async (req: Request, res: Response, next: NextFunction) => {
        let { id } = req.body.body;
       
        try {
            let categoryToDelete: any = await Term.findOne({id: id});
            await categoryToDelete.remove();
            res.json({
                success: true
            })
        } catch(err) {
            console.log(err)
            res.json({success: false, message: "There was an error.."});
        }
    }
}
