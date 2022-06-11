import winston from 'winston';


const whitelist = (req, res, next) => {
    try {  
      let ip = req.socket.localAddress
      winston.log('info', 'IP access '+ip);

      if (ip !== '::1') {
        winston.log('warn', 'wrong IP access '+ip);

        return res.status(401).json({status:0,msg:"False"})
      }
    
      next()
    } catch (error) {
      winston.log('error', 'whitelist js error, '+error);

      res.status(401).json({status:0,msg:"Error"})
    }
}

export { whitelist }