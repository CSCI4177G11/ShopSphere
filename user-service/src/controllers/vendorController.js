import Vendor from '../models/vendorModel.js';

export const getVendorProfile = async (req, res) => {
    const vendorId = requireVendorId(req, res);
    if (!vendorId) return;
    try {
        const profile = await Vendor.findOne({vendorId});
        const lines = profile ? profile.lines : [];
        const displayProfile = lines.map(line => ({
        vendorId: line.vendorId,
        storeName: line.storeName,
        location: line.location,
        phoneNumber: line.phoneNumber,
        logoUrl: line.logoUrl,
        storeBannerUrl: line.storeBannerUrl,
        rating: line.rating,
        isApproved: line.isApproved,
        socialLinks: line.socialLinks
    }));
    res.status(200).json({ displayProfile });
    }
    catch (err) {
         console.error('getProfile error:', err);
    res.status(401).json({error: 'Authentication required.'});
    }} 

    export const updateVendorProfile = async (req, res) => {
    const { storeName, location, logo, storeBannerUrl,phoneNumber, socialLinks = 1 } = req.body;
    const phoneNumberFormat = /^(?:\+1\s?)?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}$/;
    if (!phoneNumber.test(phoneNumberFormat)) {
        return res.status(400).json({ error: 'Invalid phone number format.' });
    }
    try {
        let profile = await profile.findOne({ vendorId });
        let line = profile.lines.find((i) => i.vendorId === vendorId);
        line = { storeName, location, logo, storeBannerUrl,phoneNumber, socialLinks };
        profile.lines.push(line);
        await profile.save();
        res.status(200).json({
        message: 'Vendor profile updated successfully',
        line: {
            vendorId: line.vendorId,
            storeName: line.storeName,
            location: line.location,
            phoneNumber: line.phoneNumber,
            logoUrl: line.logoUrl,
            storeBannerUrl: line.storeBannerUrl,
            rating: line.rating,
            isApproved: line.isApproved,
            socialLinks: line.socialLinks
        }});
    } catch (err) {
        console.error('updateProfile error:', err);
        res.status(500).json({ error: 'Server error while modifying profile' });
    }}

    export const changeTheme = async (req, res) => {

    }

    export const approval = async (req, res) => {
        const { vendorId, isApproved = 1 } = req.body;
        try {
            let vendorProfile = await Profile.findOne({ vendorId });
            let line = vendorProfile.lines.find((i) => i.vendorId === vendorId);
            line.isApproved = true;
            await vendorProfile.save();
            res.status(200).json({
            message: 'Vendor approval status updated',
            line: {
                vendorId: line.vendorId,
                isApproved: line.isApproved,

            }});
        } catch (err) {
            console.error(err);
            res.status(401).json({ error: 'Authenication Required.' });
        }}

