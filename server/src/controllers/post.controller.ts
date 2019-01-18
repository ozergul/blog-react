import { Request, Response, NextFunction } from "express";
import { Term } from "../entity/term";
import { Post } from "../entity/post";
import { PostMeta } from "../entity/postmeta";
import * as helpers from "../utils/helpers";
import * as marked   from "marked";

export class PostController {
    constructor() {}
    /**
     * Get all posts
     */
    public all = async (req: Request, res: Response, next: NextFunction) => {
        try {
            let posts = await Post.find({
                order: {
                    id: "DESC"
                }
            });
            res.json({posts: posts});
        } catch(err) {
            res.json({success: false, message: "There was an error.."});
        }
    }

    /**
     * Get all posts with paginate
     */
    public allWithPaginate = async (req: Request, res: Response, next: NextFunction) => {
        let { pageId } = req.params;
        const POST_PER_PAGE = 10;
        if(isNaN(pageId)) pageId = 1
        if (!pageId) pageId = 0;

        try {

            pageId = parseInt(pageId);
            pageId = pageId - 1;
            pageId = Math.abs(parseInt(pageId));

            let skip = POST_PER_PAGE * pageId;

            let [posts, total] = await Post.findAndCount({
                take: POST_PER_PAGE,
                skip: skip,
                order: {
                    id: "DESC"
                },
                relations: ["terms"],
            });
            res.json({posts: posts, count: total, postPerPage: POST_PER_PAGE});
        } catch(err) {
            console.log(err)
            res.json({success: false, message: "There was an error.."});
        }
    }

    /**
     * Add new post
     */
    public add = async (req: Request, res: Response, next: NextFunction) => {
        let {title, content, status, userId, categories, tags, postType} = req.body.body

        userId = 1;

        if(!title && !content) {
            res.json({
                success: false, message: "Fill title and content"
            })
            return false;
        }

        try {
            const newPost = Post.create({
                title: title, 
                content: content, 
                userId: userId, 
                status: status,
                terms: [],
                postType: postType
            })

            /**
             * insert categories
             */
            let termsWillBeAdd:Term[] = [];
            try {
                if(categories) {
                    for(let categoryID of categories){
                        await Term.findOne({id: categoryID}).then(async (fetchCategory)=>{
                            if(fetchCategory){
                                await termsWillBeAdd.push(fetchCategory);
                            }
                        })
                    }
                }
                newPost.terms = termsWillBeAdd;
            } catch(err) {
                console.log(err);
                res.json({success: false, message: "Error occured when adding category"});
            }
            /**
             * insert tags
             */

            try {
                if(tags) {
                    for(let tag of tags){
                        let term = tag.value;
                        let tagSlug = helpers.toSeoUrl(term);
                        let tagTermObj = {term: term, slug: tagSlug, type: "tags"}
                        
                        await Term.findOne({slug: tagSlug, type: "tags"}).then(async (fetchTag)=>{
                            if(fetchTag){
                                termsWillBeAdd.push(fetchTag);
                            } else {
                                const newTag = await Term.create(tagTermObj);
                                await newTag.save();
                                termsWillBeAdd.push(newTag);
                            }
                        })
                    }
                }
                newPost.terms = termsWillBeAdd;
            } catch(err) {
                res.json({success: false, message: "Error occured when adding tag"});
            }
            await newPost.save();
            res.json({success: true});

        } catch(err) {
            console.log(err)
            res.json({success: false, message: "There was an error.."});
        }
    }


    /**
     * Update post
     */
    public update = async (req: Request, res: Response, next: NextFunction) => {
        let {id, title, content, status, userId, categories, tags, postType} = req.body.body


        if(!title && !content) {
            res.json({
                success: false, message: "Fill title and content"
            })
            return false;
        }

        try {
            let currentPost:any = await Post.findOne(id);
            
            if(currentPost) {

               
                currentPost.title = title;
                currentPost.content = content;
                currentPost.status = status;
                currentPost.postType = postType;

                /**
                 * Update categories
                 */

                let termsWillBeAdd:Term[] = [];
                try {
                    if(categories) {
                        for(let categoryID of categories){
                            await Term.findOne({id: categoryID}).then(async (fetchCategory)=>{
                                if(fetchCategory){
                                    await termsWillBeAdd.push(fetchCategory);
                                }
                            })
                        }
                    }
                } catch(err) {
                    console.log(err);
                    res.json({success: false, message: "Error occured when adding category"});
                }

                

                /**
                 * Update tags
                 */

                try {
                    if(tags) {
                        for(let tag of tags){
                            let term = tag.value;
                            let tagSlug = helpers.toSeoUrl(term);
                            let tagTermObj = {term: term, slug: tagSlug, type: "tags"}
                            
                            await Term.findOne({slug: tagSlug, type: "tags"}).then(async (fetchTag)=>{
                                if(fetchTag){
                                    termsWillBeAdd.push(fetchTag);
                                } else {
                                    const newTag = await Term.create(tagTermObj);
                                    await newTag.save();
                                    termsWillBeAdd.push(newTag);
                                }
                            })
                        }
                    }
                } catch(err) {
                    res.json({success: false, message: "Error occured when adding tag"});
                }
                currentPost.terms = termsWillBeAdd;
                await currentPost.save();
               
            } else {
                res.json({success: false, message: `This post id is not found: ${id}`})
            }

            res.json({success: true});

        } catch(err) {
            console.log(err)
            res.json({success: false, message: "There was an error.."});
        }
    }


    /**
     * update post title
     */
    public updateTitle = async (req: Request, res: Response, next: NextFunction) => {
        let { title, id} = req.body.body;
        title = title.trim();
        if(!title) {
            res.json({ success: false })
            return false;
        }

        let slug = helpers.toSeoUrl(title);
        try {
            let postToUpdate:any = await Post.findOne({id: id});
            postToUpdate.title = title;
            postToUpdate.slug = slug;
            await postToUpdate.save();

            res.json({
                success: true, slug: postToUpdate.slug
            })
        } catch(err) {
            res.json({success: false, message: "There was an error.."});
        }
    }
    

     /**
     * delete post
     */
    public delete = async (req: Request, res: Response, next: NextFunction) => {
        let { id } = req.body.body;

        try {
            let postToDelete: any = await Post.findOne({id: id});
            await postToDelete.remove();
            res.json({
                success: true
            })
        } catch(err) {
            console.log(err)
            res.json({success: false, message: "There was an error.."});
        }
    }

    
     /**
     * get single post
     */
    public single = async (req: Request, res: Response, next: NextFunction) => {
        let { postId } = req.params;

        try {
            let singlePost:any = {}
            let post: any = await Post.findOne({
                relations: ["terms"],
                where: {
                    id: postId
                }
            });

            console.log()

            let tags = post.terms.map((t:any) => {
                if(t.type == "tags") {
                    return { value: t.term, label: t.term }
                }
            }).filter((e:any) => e != null)


            let categories = post.terms.map((t:any) => {
                if(t.type == "categories") {
                    return t.id
                }
            }).filter((e:any) => e != null)
            
            singlePost.id = post.id;
            singlePost.title = post.title;
            singlePost.slug = post.slug;
            singlePost.content = post.content;
            singlePost.createdAt = post.createdAt;
            singlePost.updatedAt = post.updatedAt;
            singlePost.userId = post.postType;
            singlePost.status = post.status;
            singlePost.tags = tags;
            singlePost.categories = categories;
            
            if(post) {
                res.json({
                    post: singlePost, success: true
                })
            } else {
                res.json({
                    success: false, message: "Post not found with this id"
                })
            }
            
        } catch(err) {
            res.json({success: false, message: "There was an error.."});
        }
    }











    /**
     * Get all posts with paginate
     */
    public publicAllWithPaginate = async (req: Request, res: Response, next: NextFunction) => {
        let { pageId } = req.params;
        
        const POST_PER_PAGE = 10;
        if(isNaN(pageId)) pageId = 1
        if (!pageId) pageId = 0;

        try {
            let sendToPosts:any = []
            pageId = parseInt(pageId);
            pageId = pageId - 1;
            

            let skip = POST_PER_PAGE * pageId;

            let [posts, total] = await Post.findAndCount({
                take: POST_PER_PAGE,
                skip: skip,
                order: {
                    id: "DESC"
                },
                relations: ["terms"],
                where: {
                    status: 1
                }
            });

            for (let i in posts) {

                let post = posts[i];
                let {id, title, content, createdAt, updatedAt, slug, postType} = post;
                let tempTerms = post.terms;

                let newPost:any = {}

                newPost.id = id;
                newPost.title = title;
                newPost.createdAt = createdAt;
                newPost.updatedAt = updatedAt;
                newPost.slug = slug;
                newPost.postType = postType;
                newPost.content = marked(content);

                newPost.categories = tempTerms.filter(t => t.type == "categories")
                newPost.tags = tempTerms.filter(t => t.type == "tags")

                sendToPosts.push(newPost);
            }

            res.json({posts: sendToPosts, count: total, postPerPage: POST_PER_PAGE});
        } catch(err) {
            console.log(err)
            res.json({success: false, message: "There was an error.."});
        }
    }















   /**
     * Get single post by slug
     */
    public publicSingle = async (req: Request, res: Response, next: NextFunction) => {
        let paramSlug = req.params.slug;
      
        try {
            let post: any = await Post.findOne({
                relations: ["terms"],
                where: {
                    status: 1,
                    slug: paramSlug
                }
            });

            let {id, title, content, createdAt, updatedAt, slug, postType} = post;
            let tempTerms = post.terms;

            let newPost:any = {}

            newPost.id = id;
            newPost.title = title;
            newPost.createdAt = createdAt;
            newPost.updatedAt = updatedAt;
            newPost.slug = slug;
            newPost.postType = postType;
            newPost.content = marked(content);

            newPost.categories = tempTerms.filter(t => t.type == "categories")
            newPost.tags = tempTerms.filter(t => t.type == "tags")

            res.json({post: newPost});
        } catch(err) {
            console.log(err)
            res.json({success: false, message: "There was an error.."});
        }
    }


    /**
     * Get post meta
     */
    public getPostMeta = async(postId: any, metaKey: any) => {
        let meta:any = await PostMeta.findOne({
            where : {
                postId: postId,
                metaKey: metaKey
            }
        });

        return meta;
    }

    /**
     * Save post meta
     */
    public savePostMeta = async(postId: any, metaKey: any, metaValue: any) => {
        let meta:PostMeta = await PostMeta.create({
            postId: postId,
            metaKey: metaKey,
            metaValue: metaValue,
        });

        meta.save();

        return meta;
    }

}

