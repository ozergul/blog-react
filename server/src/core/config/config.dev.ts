import * as path from 'path';

let config = {
    logFileDir: path.join(__dirname, '../../log'),
    logFileName: 'app-%DATE%.log',
    dbHost: 'localhost',
    dbPort: '3306',
    dbName: 'root',
    dbUser: '',
    dbPassword: '',
    serverPort: 3001,
    /** for jwt */
    tokenSecretKey: "xYsd19d4djsIOd",

    /** for aws */
    awsSecretAccessKey: "5EQZaWJbWxeHTvH9uwuS0GnJnyYSA+4uKUlYuV6D",
    awsAccessKeyId: "AKIAJUJFAS2TKYRPMJXA",
    awsRegion: "us-east-2",
    awsBucket: "ozergul2"
};

export default config;