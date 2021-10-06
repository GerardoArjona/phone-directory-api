const jwt  =  require('jsonwebtoken');

const authenticationMiddleware = (req,res,next) => {
    console.log(req.get("Authorization"))
    const token = req.get("Authorization");

    if(!token) {
        return res.status(400).send({
            message: "No user to be authenticated"
        });
    }

    let p_token=token.split(" ")[1];

    jwt.verify(p_token, process.env.SECRET_KEY, (err, decoded)=>{
        if(err){
            res.status(401).json({message: `Error: user not correctly authenticated`});
        }else{
            req.user=decoded;
            next();
        }

    });
}

module.exports ={
    authenticationMiddleware,
}