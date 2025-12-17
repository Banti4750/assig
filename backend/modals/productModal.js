import mongoose , {Schema}  from 'mongoose';

const productSchema = new Schema({
    name:{
        type:String,
        required:true,
        trim:true
    },
    details:{
        type:String,
        required:true,
        trim:true
    },
    imageUrl:{
        type:String,
        required:true,
        trim:true
    },
    price:{
        type:String,
        required:true,
    }

},{
    timestamps:true
})


export default mongoose.model("Product", productSchema);