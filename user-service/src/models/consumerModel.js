import mongoose from "mongoose";


const userAddressSchema = new mongoose.Schema(
    {
        label: {type: String},
        line1: {type: String},
        city: {type: String},
        postalCode: {type: String},
        country: {type: String}
    }
);

const userSettingSchema = new mongoose.Schema(
    {
      currency: { type: String, default: 'CAD' },
      theme:    { type: String, default: 'light' },
    },
    { _id: false }               
  );


const userSchema = new mongoose.Schema(
    {
        consumerId: {type: String, required: true, unique: true},
        fullName: {type: String, required: true},
        email: {type: String, required: true},
        phoneNumber: {type: String, required: true},
        addresses: [userAddressSchema],
        settings: { type: userSettingSchema, default: () => ({}) },
    },
    
    {timestamps: true, versionKey: false },
);

export default mongoose.model('Consumer', userSchema);