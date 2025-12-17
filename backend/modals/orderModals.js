import mongoose, { Schema } from 'mongoose';

const orderSchema = new Schema({
    paymentStatus: {
        type: String,
        enum: ["success", "failed", "pending"],
        required: true,
    },
    transtionId: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        trim: true
    },
    purchasedItemId: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: "Product"
    },
    sessionId: {
        type: String,
    },
    amount: {
        type: Number,
    },
    quantity: {
        type: Number,
        default: 1
    }
}, {
    timestamps: true
});

export default mongoose.model("Order", orderSchema);