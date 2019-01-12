import * as path from 'path';

let config = {
    logFileDir: path.join(__dirname, '../../log'),
    logFileName: 'app-%DATE%.log',
    dbHost: process.env.DB_HOST,
    dbPort: process.env.DB_PORT,
    dbName: process.env.DB_NAME,
    dbUser: process.env.DB_USER,
    dbPassword: process.env.DB_PASS,
    serverPort: process.env.SERVER_PORT,
    /** for jwt */
    tokenSecretKey: process.env.JWT_TOKEN,

    /** for aws */
    awsSecretAccessKey: process.env.AWS_SECRET,
    awsAccessKeyId: process.env.AWS_ACCESS,
    awsRegion: process.env.AWS_REGION,
    awsBucket: process.env.AWS_BUCKET
};

export default config;