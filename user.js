const express = require("express");
const router = express.Router();
const connection = require('./database');
const otp = require('otp-generator')
const bcrypt = require('bcrypt');
const saltRounds = 10;
var jwt = require('jsonwebtoken');

const registereuser = async (req, res, next) => {
    try {
        console.log(req.headers);

        const { name, email, phone_no, password, address } = req.body

        console.log(name, email, phone_no, password, address)

        if (!email) {
            res.send({
                message: "email is required"
            })
        }

        if (!phone_no) {
            res.send({
                message: "phone number is required"
            })
        }

        if (!password) {
            res.send({
                message: "password is required"
            })
        }
        if (!address) {
            res.send({
                message: "address is required"
            })
        }
        if (!name) {
            res.send({
                message: "name is required"
            })
        }

        const sqlstr = `insert into users (name,email, phone_no, password, address) values (?,?,?,?,?)`

        const hashPassword = await bcrypt.hash(password, saltRounds) //encrypt password and store in database
        const [results] = await connection.promise().query(sqlstr, [name, email, phone_no, hashPassword, address]);

        if (!results.insertId) {
            res.send({
                message: "data not inserted"
            })
        }

        res.status(200).send({
            message: "user created",
            response: results[0]
        })

    } catch (error) {
        console.log(error);
        res.status(500).send({
            message: "Internal Server Error"
        })
    }
}

const login = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        if (!email) {
            res.send({
                message: "email required"
            })
        }

        if (!password) {
            res.send({
                message: "password required"
            })
        }

        const sql = `select user_id,email,password from users where email = ? `;
        const [results] = await connection.promise().execute(sql, [email]);

        if(results.length == 0){
            res.send({
                message : "wrong password"
            })
        }

        const hashPassword = results[0].password;
        const match = await bcrypt.compare(password, hashPassword); //decrypt password

        if (!match) {
            res.send({
                message: "email or password are incorrect please try again"
            })
        }

        let token = jwt.sign({ user_id : results[0].user_id }, 'server'); //generate token
        console.log(token);

        res.status(200).send({
            message : "login succesful",
            validToken : token
        })

        // console.log(results)
        // // const user = results


        res.status(200).send({
            message: "successfully login",
            response : results
        })

    } catch (error) {
    console.log(error);
    res.status(500).send({
        message: "interenal server error"
    })
}
}

// const user = results[0];

// console.log(user);

// const user = results[0];

// Compare password from database with user provided password

// if(user.email !== email){
//     res.send({
//         message : "email is not correct please try again"
//     })

//     return;
// }
// if (user.password !== password) {
//     res.send({
//         message : "password is not correct please try again"
//     })
//     // Passwords match
//     // Authenticate user
//     // Generate token or session
//     // Return success response
//     return;
// } 

// if(!email == user.email){
//     res.send({
//         message : "email is not correct"
//     })
// }

// if(!password == user.password){
//     res.send({
//         message : "password is not correct"
//     })
// }

// if(results.length==0){
//     res.send({
//         message : "USER not found"
//     })
// }

const forgetPassword = async (req, res, next) => {
    try {

        const { email } = req.body;

        const otp = Math.floor(1000 + Math.random() * 9000);

        console.log(otp)

        const sql = `select * from users where email = ?`;
        const [results] = await connection.promise().execute(sql, [email])

        if (results.length == 0) {
            res.send({
                message: "email not exists"
            })
        }

        const updatesql = `UPDATE users SET otp = ? WHERE email = ?;`
        const resultsUpdate = await connection.promise().execute(updatesql, [otp, email]);

        res.status(200).send({
            message: "otp is send"
        })

    } catch (error) {
        console.log(error);
        res.status(500).send({
            message: "Internal Server Error"
        })
    }
}

const resetPassword = async (req, res, next) => {
    try {

        const { email, otp, newPassword } = req.body;

        if (!email) {
            res.send({
                message: "email required"
            })
        }

        if (!otp) {
            res.send({
                message: "otp required"
            })
        }

        const sql = `update users set password = ? where otp = ? and email = ?`;
        const [results] = await connection.promise().execute(sql, [newPassword, otp, email])

        if (results.affectedRows == 0) {
            res.send({
                message: "new password not update"
            })
        }

        const sqlStr = `update users set otp = null where email = ?`;
        const [sqlResults] = await connection.promise().execute(sqlStr, [email]);

        res.send({
            message: "updated new password",
            response: sqlResults
        })


    } catch (error) {
        console.log(error);
        res.status(500).send({
            message: "Internal Server Error"
        })
    }
}

const authMiddleware = (req, res, next) => {
    if (req.headers && req.headers.token) {
      try {
        const token = req.headers.token;
        const decodedToken = jwt.verify(token, 'server')
        console.log(decodedToken);
      } catch (err) {
        console.log({err})
        res.status(400).send({
          message: "Invalid Token"
        })
      }
      next()
      return;
    }
  
    res.status(400).send({
      message: "Token Required"
    })
  }

router.put("/reset",authMiddleware, resetPassword)

router.put("",authMiddleware, forgetPassword)

router.post("", login)

router.post("", registereuser);

module.exports = router;