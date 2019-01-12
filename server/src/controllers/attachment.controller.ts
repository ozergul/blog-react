import { Request, Response, NextFunction } from "express";
import { Attachment } from "../entity/attachment";
import config from "../core/config/config.dev";
import s3 from "../core/aws";
import * as helpers from "../utils/helpers";


export class AttachmentController {
    constructor() {}

    /**
     * Get all uploads
     */

    public all = async (req: Request, res: Response, next: NextFunction) => {
        try {
            let attachments = await Attachment.find({
                order: {
                    id: "DESC"
                }
            });
            res.json({attachments: attachments});
        } catch(err) {
            res.json({success: false, message: "There was an error.."});
        }
    }

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

            let [attachments, total] = await Attachment.findAndCount({
                take: POST_PER_PAGE,
                skip: skip,
                order: {
                    id: "DESC"
                },
            });
            res.json({attachments: attachments, count: total, postPerPage: POST_PER_PAGE});
        } catch(err) {
            console.log(err)
            res.json({success: false, message: "There was an error.."});
        }
    }

    /**
     * Upload image to s3
     */
    public imageUpload = async (req: Request, res: Response, next: NextFunction) => {
        console.log("imageUpload started");
        try {
            let {fileToSend} = req.body.body;
            let buf = Buffer.from(fileToSend.base64.replace(/^data:image\/\w+;base64,/, ""),'base64');

            let fileName = fileToSend.name;
            let fileExtension = fileName.split('.').pop();
            fileName = helpers.toSeoUrl(fileName);

            let fileNameTos3 = `${Date.now()}_${fileName}.${fileExtension}`

            let params = {
                Bucket: config.awsBucket,
                Body: buf,
                Key: `blog-uploads/${fileNameTos3}`,
                ContentEncoding: 'base64',
            };
            s3.upload(params, async function (errp:any, resp:any) {
                if (errp) {
                    console.log("Error when uploading image", errp);
                    res.json({success: false, message: "Error uploading image."});                                         
                } else {
                    console.log("Success uploading image", resp);
                    let location = resp.Location;
                    let key = resp.key;

                    let data = {
                        fileName: fileName,
                        url: location
                    };

                    try {
                        const newAttachment =  await Attachment.create({
                            location: location,
                            key: key,
                            type: "image",
                        })
                        newAttachment.save();
                        res.json({success: true, message: "Uploading image successfully.", data: data});     

                    } catch(err) {
                        res.json({success: false, message: "Error when saving image to database"});
                    }
                }
            });
        } catch(err) {
            res.json({success: false, message: "There was an error.."});
        }
    }



    /**
     * Delete attachment from s3 and database
     */

    public delete = async (req: Request, res: Response, next: NextFunction) => {
        try {
            let {id, key} = req.body.body;
            

            let params = {
                Bucket: config.awsBucket,
                Key: key,
            };

            s3.deleteObject(params, async function(err, data) {
                if (err) {
                    res.json({success: false, message: "There was an error.."});
                } else {
                    let attachmentToDelete:any = await Attachment.findOne({
                        id: id,
                        key: key
                    });
                    await attachmentToDelete.remove();
                    res.json({success: true, message: "Deleted"});
                }
            });


            
        } catch(err) {
            console.log("Error when deleting image");
            res.json({success: false, message: "There was an error.."});
        }
    }
}
