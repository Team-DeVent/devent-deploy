

const whitelist = (req, res, next) => {
    try {  
      let ip = req.socket.localAddress
      console.log('[ + ] IP access '+ip)
      if (ip !== '::1') {
        return res.status(401).json({status:0,msg:"False"})
      }
    
      next()
    } catch (error) {
      res.status(401).json({status:0,msg:"Error"})
    }
}

export { whitelist }