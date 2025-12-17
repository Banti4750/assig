import express from 'express';
import productModal from '../modals/productModal.js';

const router = express.Router();

const addProduct = async (req , res) =>{
    try {
        const {name , details , price , imageUrl} = req.body;

        if(!name || !details || !price || !imageUrl){
            res.status(400).json({
                message:"All field required like name , details , price , imageUrl"
            })
        }

        const product = await productModal.create({
            name,
            details,
            price,
            imageUrl
        })

        res.status(200).json({
            message:"Product Added",
            product
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message:"server error"
        })
    }
}

const getProduct = async (req , res) =>{
    try {
        const products = await productModal.find({})

        res.status(200).json({
            products
        })
    } catch (error) {
         console.log(error);
        res.status(500).json({
            message:"server error"
        })
    }
}

const getProductById = async (req , res) =>{
    try {
        const id = req.params.id;
        const product = await productModal.find({_id:id})

        res.status(200).json({
            product
        })
    } catch (error) {
         console.log(error);
        res.status(500).json({
            message:"server error"
        })
    }
}



router.post("/", addProduct);
router.get("/",getProduct);
router.get("/:id",getProductById);



export default router;