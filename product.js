const express = require("express");
const router = express.Router();
const connection = require('./database');

const getProductDetails = async (req, res, next) => {
    try {
        const { type,price,rating,sort_by, sort, limit, offset } = req.query

        if (!req.query) {
            res.status(400).send({
                message: "Bad Request"
            })
        }

        let whereArr = [];
        let whereData = [];

        if (type) {
            whereArr.push('type = ?');
            whereData.push(type);
        }

        // if(price){
        //     orderBy.push('price = ?');
        //     OrderData.push(price);
        // }

        // if(rating){
        //     orderBy.push('rating = ?');
        //     OrderData.push(rating);
        // }

        let whereString = ''
        let sortString = '';

        if (whereArr.length) {
            whereString = `WHERE ${whereArr.join('AND')}`
        }


        if(sort && sort_by){
            sortString = `order by ${sort_by} ${sort} `
        }

        // console.log(sortString);

        const sql = `select name,description,price,discount,rating,total_rating,image 
        from products ${whereString}  ${sortString} limit ? offset ?`;

        // console.log(sql);

        const [results] = await connection.promise().execute(sql, [...whereData, limit, offset]);
        // console.log(results)
        res.status(200).send({
            message: "product lists",
            Data: results
        })

    } catch (error) {
        console.log(error);
        res.status(500).send({
            message: "internal server error",
        })
    }
}

const getProductById = async (req, res, next) => {
    try {
        const { id } = req.params;

        if (!id) {
            res.status(400).send({
                message: 'id is required'
            })
        }

        const sql = `select products.name, products.description, products.price, products.discount, 
        products.rating, products.total_rating, products.image, sizes.name 
        from products inner join product_sizes inner join sizes
        on products.product_id = product_sizes.product_id and product_sizes.size_id = sizes.size_id
        where products.product_id = 1;`;

        const [results] = await connection.promise().execute(sql, [id]);

        if (results.length == 0) {
            res.status(404).send({
                message: "product not found"
            })
        }

        res.status(200).send({
            message: "product-list",
            response: results
        })
    } catch (error) {
        console.log(error)
        res.status(500).send({
            message: "internal server error"
        })
    }
}

router.get("/", getProductDetails);
router.get("/:id", getProductById);

module.exports = router;