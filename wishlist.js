const express = require("express");
const router = express.Router();
const connection = require('./database');

const getWishlistsbyId =  async (req,res,next) => {
    try {
        const {id} = req.params;

        if(!id){
            res.send({
                message : "id is required"
            })
        }
        const sql = `select users.name as User_Name, products.name as Product_Name
        from users inner join wishlists inner join products
        on users.user_id = wishlists.user_id and wishlists.product_id = products.product_id
        where users.user_id = ?;`

        const [results] =  await connection.promise().execute(sql,[id]);

        if(results.length==0){
            res.send({
                message : "no wishlist"
            })
        }

        res.status(200).send({
            message : "wishlist data",
            response : results
        })
        
    } catch (error) {
        console.log(error);
        res.status(500).send({
            message : "Internal Server Error"
        })
    }
}

const addWishlist = async (req,res,next) => {
    try {

        const {user_id,product_id} = req.body;

        if (!user_id && !product_id) {
            res.status(400).send({
              message: "bad request",
            });
          }

        const sql = `insert into wishlists (user_id,product_id) values (?, ?)`

        const [results] = await connection.promise().execute(sql,[user_id,product_id])
        res.status(200).send({
            message : "New wishlists added",
            response : results
        })
  
    } catch (error) {
        console.log(error);
        res.status(500).send({
            message : "Internal Server Error"
        })
    }
}

const deletewishlists = async (req,res,next) => {
    try {
        const {product_id} = req.body
        const {user_id} = req.params;

        console.log(user_id,product_id)

        const sql = `update wishlists set is_deleted = 1 where user_id =? and product_id =?`;
        const [results] = await connection.promise().execute(sql,[user_id,product_id]);
        res.status(200).send({
            message : "remove from the Wishlist",
            response : results
        })
        
    } catch (error) {
      console.log(error);
      res.status(500).send({
        message : "Internal Server Error"
      })  
    }
}

// update sab hogya !!!!!

// const updateWishlist = async (req,res,next) => {
//     try {
//         const {user_id} = req.params;
//         const {product_id} = req.body;

//         if(!user_id && !product_id){
//             res.status(400).send({
//                 message : "bad Request"
//             })
//         }

//         const sql = `update wishlists set product_id = ? where user_id = ?`
//         const [results] = await connection.promise().execute(sql,[product_id,user_id])
//         res.status(200).send({
//             message : "add one more product in wishlists"
//         })

        
//     } catch (error) {
//      console.log(error);
//      res.status(500).send({
//         message : "internal server error"
//      })   
//     }
// }

// router.put("/:user_id",updateWishlist)

router.delete("/:user_id",deletewishlists)

router.post("/",addWishlist)

router.get("/:id", getWishlistsbyId)

module.exports = router;