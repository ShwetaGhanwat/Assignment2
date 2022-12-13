const router = require("express").Router();
const User = require("../models/User");
const bodyParser = require("body-parser");
const { body, validationResult } = require("express-validator");
const bcrypt = require("bcrypt");
const dotenv=require('dotenv');
dotenv.config();
const jwt=require('jsonwebtoken');
const secret=process.env.SECRET;

router.use(bodyParser.json());

router.post(
  "/register",
  body("email").isEmail(),
  body("name").isAlpha(),
  body("password").isLength({ min: 6, max: 16 }),
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { name, email, password } = req.body;
      let user = await User.findOne({ email });
      if (user) {
        res.status(409).json({
          status: "failed",
          message: "User already exists with the given email",
        });
      }

      bcrypt.hash(password, 10, async (err, hash) => {
        if (err) {
          return res.status(500).json({
            status: "failed",
            message: err.message,
          });
        }
        user = await User.create({
          name: name,
          email: email,
          password: hash,
        });
        res.json({
          status: "success",
          message: "user successfully created",
          user,
        });
      });
    } catch (e) {
      res.status(500).json({
        status: "failed",
        message: e.message,
      });
    }
  }
);

router.post(
    "/login",
    body("email").isEmail(),
    async (req, res) => {
      try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
          return res.status(400).json({ errors: errors.array() });
        }
  
        const { email, password } = req.body;
        let user = await User.findOne({ email });
        if (!user) {
          res.status(409).json({
            status: "failed",
            message: "There is no account with the entered email",
          });
        }
        bcrypt.compare(password,user.password,(err,result)=>{
            if(err){
                return res.status(500).json({
                    status:"failed",
                    message:err.message
                });
            }
            if(result){
                const token=jwt.sign({
                    exp:Math.floor(Date.now()/1000)+(60*60),
                    data:user._id
                },secret);
                return res.status(200).json({
                    status:"success",
                    message:"Login Successful",
                    token
                });
            }else{
                return res.status(401).json({
                    status:"failed",
                    message:"Invalid Credentials"
                });
            }
        });
       
      } catch (e) {
        res.status(500).json({
          status: "failed",
          message: e.message,
        });
      }
    }
  );

module.exports = router;
