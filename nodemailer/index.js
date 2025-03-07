
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config(); // Load environment variables from a .env file


console.log("Email:", process.env.USER_EMAIL);
console.log("Password:", process.env.PASS);



//creating the transpoter 
const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",         
    port: 587,           
    secure: false, // true for port 465, false for other ports
    auth: {
      user: process.env.USER_EMAIL, 
      pass: process.env.PASS,
    },
  });


async function main() {
    // send mail with defined transport object
    try{
        const info = await transporter.sendMail({
            from: process.env.USER_EMAIL, // sender address
            to: "kishukumars082@gmail.com", // list of receivers
            subject: "Testing mail", // Subject line
            text: "Hello this is a test mail from niket ", // plain text body
          //   html: "<b>Hello world?</b>", // html body
          });
          console.log("Message sent: %s", info.messageId);
    }catch(err){
        console.log(err); 
    }
}
      
main();      


    
//if we want to send emails via gmail in bulk it have rate limetter and we can't able to send that ...so things completely changed ....
//eg .100 email in one way (gmail reate limit of sending emails ... =>> only till 500 in a day)




