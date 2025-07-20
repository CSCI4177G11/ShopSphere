import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
    {
        consumerId: {type: String, required: true, unique: true},
        fullName: {type: String, required: true},
        email: {type: String, required: true},
        phoneNumber: {type: String, required: true},
        addresses: [userAddressSchema],
    },
    
    {timestamps: true, versionKey: false },
);

const userAddressSchema = new mongoose.Schema(
    {
        addressId: {type: String},
        label: {type: String},
        line1: {type: String},
        city: {type: String},
        postalCode: {type: String},
        country: {type: String}
    }
);
export default mongoose.model('Consumer', consumerSchema);