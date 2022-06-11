import express from 'express';
import winston from 'winston';


import * as loaderExpress from './loaders/express.js';
import * as winstonExpress from './loaders/winston.js';


async function startExpressServer() {
    const app = express();
  
    await winstonExpress.init()
    await loaderExpress.init(app);


    app.listen(9003, err => {
        winston.log('info', 'The server is running.');
        winston.log('info', 'localhost:9003');

    });
}
  
startExpressServer();