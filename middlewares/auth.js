//This is when i taking with myself about logics .... 

//bsically when uesr logged it there we were generating the jwt token and sending it to the client as a res ....oky! so when client will re send the token to server with headers and
//  if the token is decoded... in this case user is allowed or authenticated to the protected route 
//the whole logic works as the user register then login then authentication for acessing protected routes ...

//so here we will do the authentiction with the help of middle ware auth we going to create ...


//basically what the auth middleware will do ...
//1. client will pass token with headers -here we have to catch that clienttoken   
//2.In auth middle ware we are going to decode that client token with jwt secret key we used during token generation ... 
//3. if token is decoded - we got it man dont u think the token is correct (bcs if the token were malformed it can not be decoded with that secret key right ?  )

//4.under the condition of if decodedtoken is there we'll do all operations 
//operations like ....manupulating the requestbody with those payload data contains author information ( and from here from authentication part the req body always going to contain that information ) --then -->  next()

//5. under else condition we send the res as please login ! ...bcs here token is not  decoded has a lot of mean either user is not logged in or token has malformed .... 


const jwt = require('jsonwebtoken');
const env = require('dotenv');
const { BlacklistModel } = require('../models/blacklist');
env.config()


auth = async (req, res, next) => {

    try {

        const token = req.headers.authorization;

        // console.log(token)
        if (!token) {
            return res.status(401).json({ "msg": "Access Denied! Please log in." })
        }
        // Checking for blacklisted token
        const isBlacklisted = await BlacklistModel.findOne({ token });

        if (isBlacklisted) {
            return res.status(401).send('Token is blacklisted !please Login First');
        }

        const decodedToken = jwt.verify(token, process.env.jwtSecretKey);
        // console.log(process.env.jwtSecretKey)
        // console.log(decodedToken); 
        //manupulating reqbody for relationship purpose ... 
        req.body.authorID = decodedToken.authorID;
        req.body.author = decodedToken.author;
        // console.log(req.body)
        next();
    } catch (err) {
        return res.status(403).json({ err: err.message })
    }
}

module.exports = {
    auth
}//exporting the auth middleware 



