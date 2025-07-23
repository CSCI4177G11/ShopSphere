import Vendor from '../models/vendorModel.js';

function resolveVendorId(req) {
  return req?.vendor?.vendorId || req?.vendor?.id || null;
}

function requireVendorId(req, res) {
  const vendorId = resolveVendorId(req);
  if (!vendorId) {
    res.status(401).json({ error: 'Unauthorized: missing or expired token' });
    return null;
  }
  return vendorId;
}

export const getVendorProfile = async (req, res) => {
    const vendorId = requireVendorId(req, res);
    if (!vendorId) return;
    try {
        const profile = await Vendor.findOne({vendorId});
        if (!profile){
            return res.status(404).json({error: "Vendor profile not found."})
        }
        const displayProfile = {
            vendorId: profile.vendorId,
            storeName: profile.storeName,
            location: profile.location,
            phoneNumber: profile.phoneNumber,
            logoUrl: profile.logoUrl,
            storeBannerUrl: profile.storeBannerUrl,
            rating: profile.rating,
            isApproved: profile.isApproved,
            socialLinks: profile.socialLinks
    };
    res.status(200).json({ displayProfile });
    }
    catch (err) {
         console.error('getVendorProfile error:', err);
    res.status(500).json({error: 'Server error. Please try again later.'});
    }
} 

export const updateVendorProfile = async (req, res) => {
    const { vendorId, storeName, location, logo, storeBannerUrl, phoneNumber, socialLinks } = req.body;
    const phoneNumberFormat = /^(?:\+1\s?)?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}$/;
    if (!phoneNumber.test(phoneNumberFormat)) {
        return res.status(400).json({ error: 'Invalid phone number format.' });
    }
    try {
        let profile = await Vendor.findOne({ vendorId });
        if (!profile){
            return res.status(404).json({ error: 'Vendor not found.' });
        }
        profile.storeName = storeName;
        profile.location = location;
        profile.logo = logo;
        profile.storeBannerUrl = storeBannerUrl;
        profile.phoneNumber = phoneNumber;
        socialLinks = socialLinks;
        await profile.save();
        res.status(200).json({
        message: 'Vendor profile updated successfully',
        profile: {
            vendorId: profile.vendorId,
            storeName: profile.storeName,
            location: profile.location,
            phoneNumber: profile.phoneNumber,
            logoUrl: profile.logoUrl,
            storeBannerUrl: profile.storeBannerUrl,
            rating: profile.rating,
            isApproved: profile.isApproved,
            socialLinks: profile.socialLinks
        }
    });
    } catch (err) {
        console.error('updateVendorProfile error:', err);
        res.status(500).json({ error: 'Server error while modifying profile' });
    }}

    export const changeTheme = async (req, res) => {

    }

    export const approval = async (req, res) => {
        const { vendorId, isApproved} = req.body;
        try {
            const profile = await Profile.findOne({ vendorId });
            if (!profile) {
                return res.status(404).json({ error: 'Vendor not found.' });
            }
            profile.isApproved = true;
            await profile.save();
            res.status(200).json({
            message: 'Vendor approval status updated',
            profile: {
                vendorId: profile.vendorId,
                isApproved: profile.isApproved,

            }
        });
        } catch (err) {
            console.error('Updae isApproved error:', err);
            res.status(500).json({ error: 'Server error while updating isApproved.' });
        }}

