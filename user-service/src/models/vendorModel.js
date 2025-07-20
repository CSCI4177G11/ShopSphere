import mongoose from 'mongoose';

const vendorSchema = new mongoose.Schema(
    {
    vendorId: {type: String, required: true, unique: true},
    storeName: {type: String, required: true},
    location: {type: String, required: true},
    phoneNumber: {type: String, required: true},
    logoUrl: {type: String, required: true},
    storeBannerUrl: {type: String, required: true},
    rating: {type: String, required: true},
    isApproved: {type: Boolean},
    socialLink: {type: Array},
    },

    {timestamps: true, versionKey: false },
);

export default mongoose.model('Vendor', vendorSchema);