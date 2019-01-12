import "reflect-metadata";
import {createConnection, getConnectionOptions} from "typeorm";
import * as express from "express";
import * as bodyParser from "body-parser";
import * as cors from "cors";
import * as dotenv from "dotenv";
dotenv.config();

import config from './core/config/config.dev'

import UserRoutes from "./routes/user.routes";
import TermRoutes from "./routes/term.routes"
import PostRoutes from "./routes/post.routes";
import AttachmentRoutes from "./routes/attachment.routes";


/**
 * DB connection
 */
const createTypeormConn = async () => {
    const connectionOptions = await getConnectionOptions(process.env.NODE_ENV)
    return createConnection({ ...connectionOptions, name: 'default' })
}
const startServer = async () => {
    await createTypeormConn();
}

const logRequestStart = (req: express.Request, res: express.Response, next: express.NextFunction) => {
    res.on('finish', () => {
        console.log('\x1b[36m', `${req.method} -- ${req.originalUrl} -- ${res.statusCode}`,'\x1b[0m') 
    })
    next()
}

startServer().then(() => {
    const app = express();
    app.use(bodyParser.json({limit: '10mb'}));
    app.use(bodyParser.urlencoded({ limit: '10mb', extended: true }));
    app.use(cors());

    app.use(logRequestStart);
    /* ROUTES */
    app.use("/", UserRoutes);
    app.use("/", TermRoutes);
    app.use("/", PostRoutes);
    app.use("/", AttachmentRoutes);

    app.listen(config.serverPort);
    console.log("Server started at " + config.serverPort);
})

