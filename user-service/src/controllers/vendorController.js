import Vendor from '../models/vendorModel.js';

function resolveVendorId(req) {
    return req.user.userId ;
}

function requireVendorId(req, res) {
  const vendorId = resolveVendorId(req);
  if (!vendorId) {
    res.status(401).json({ error: 'Unauthorized: missing or expired token' });
    return null;
  }
  return vendorId;
}

export const addVendorProfile = async (req, res) => {
    const vendorId = requireVendorId(req, res);
    if (!vendorId) return;
    const {
      storeName,
      location,
      logoUrl,
      storeBannerUrl,
      phoneNumber,
      socialLinks,       
    } = req.body;
    if (!storeName || !location || !logoUrl || !storeBannerUrl || !phoneNumber) {
      return res.status(400).json({ error: 'All fields are required.' });
    }
    const phoneRegex = /^(?:\+1\s?)?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}$/;
    if (!phoneRegex.test(phoneNumber)) {
      return res.status(400).json({ error: 'Invalid phone number format.' });
    }
    try {
      const existing = await Vendor.findOne({ vendorId });
      if (existing) {
        return res.status(409).json({ error: 'Vendor profile already exists.' });
      }
      const newVendor = await Vendor.create({
        vendorId,
        storeName,
        location,
        logoUrl,
        storeBannerUrl,
        phoneNumber,
        socialLink: Array.isArray(socialLinks) ? socialLinks : [],
      });
  
      res.status(201).json({
        message: 'Vendor profile created successfully.',
        profile: {
          vendorId:       newVendor.vendorId,
          storeName:      newVendor.storeName,
          location:       newVendor.location,
          phoneNumber:    newVendor.phoneNumber,
          logoUrl:        newVendor.logoUrl,
          storeBannerUrl: newVendor.storeBannerUrl,
          socialLinks:    newVendor.socialLink,
          createdAt:      newVendor.createdAt,
        },
      });
    } catch (err) {
      console.error('addVendorProfile error:', err);
      res.status(500).json({ error: 'Server error while creating vendor profile.' });
    }
  };

export const getVendorProfile = async (req, res) => {
    const vendorId = requireVendorId(req, res);
    if (!vendorId) return;
    try {
      const profile = await Vendor.findOne({ vendorId });
      if (!profile)
        return res.status(404).json({ error: 'Vendor profile not found.' });
      const displayProfile = {
        vendorId:       profile.vendorId,
        storeName:      profile.storeName,
        location:       profile.location,
        phoneNumber:    profile.phoneNumber,
        logoUrl:        profile.logoUrl,
        storeBannerUrl: profile.storeBannerUrl,
        rating:         profile.rating,
        socialLinks:    profile.socialLink, // schema field
      };
      res.status(200).json({ displayProfile });
    } catch (err) {
      console.error('getVendorProfile error:', err);
      res.status(500).json({ error: 'Server error. Please try again later.' });
    }
  };

  export const updateVendorProfile = async (req, res) => {
    const vendorId = requireVendorId(req, res);
    if (!vendorId) return;
    const { storeName, location, logoUrl, storeBannerUrl, phoneNumber, socialLinks } = req.body;
    const phoneNumberFormat = /^(?:\+1\s?)?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}$/;
    if (!phoneNumberFormat.test(phoneNumber)) {
      return res.status(400).json({ error: 'Invalid phone number format.' });
    }
    try {
      const profile = await Vendor.findOne({ vendorId });
      if (!profile)
        return res.status(404).json({ error: 'Vendor not found.' });
      profile.storeName      = storeName;
      profile.location       = location;
      profile.logoUrl        = logoUrl;
      profile.storeBannerUrl = storeBannerUrl;
      profile.phoneNumber    = phoneNumber;
      if (Array.isArray(socialLinks)) {
        profile.socialLink = socialLinks;
      }
      await profile.save();
      res.status(200).json({
        message: 'Vendor profile updated successfully',
        profile: {
          vendorId:       profile.vendorId,
          storeName:      profile.storeName,
          location:       profile.location,
          phoneNumber:    profile.phoneNumber,
          logoUrl:        profile.logoUrl,
          storeBannerUrl: profile.storeBannerUrl,
          rating:         profile.rating,
          socialLinks:    profile.socialLink,
        },
      });
    } catch (err) {
      console.error('updateVendorProfile error:', err);
      res.status(500).json({ error: 'Server error while modifying profile' });
    }
  };

    export const getSetting = async (req, res) => {
        const vendorId = requireVendorId(req, res);
        if (!vendorId) return;
      
        try {
          const profile = await Vendor.findOne({ vendorId }, 'settings');
          if (!profile)
            return res.status(404).json({ error: 'Vendor not found.' });
      
          res.status(200).json({ settings: profile.settings });
        } catch (err) {
          console.error('getSetting error:', err);
          res.status(500).json({ error: 'Server error while fetching settings.' });
        }
      };
    
      export const changeSetting = async (req, res) => {
        const vendorId = requireVendorId(req, res);
        if (!vendorId) return;
        const { theme } = req.body;
        if (!theme)
          return res.status(400).json({ error: 'Nothing to update.' });
        try {
          const profile = await Vendor.findOne({ vendorId });
          if (!profile)
            return res.status(404).json({ error: 'Vendor not found.' });
          if (theme)    profile.settings.theme    = theme;
          await profile.save();
          res.status(200).json({ message: 'Settings updated.', settings: profile.settings });
        } catch (err) {
          console.error('changeSetting error:', err);
          res.status(500).json({ error: 'Server error while updating settings.' });
        }
      };
    
      export const approval = async (req, res) => {
        const { id }            = req.params;         
        const { isApproved }    = req.body;           
        if (typeof isApproved !== 'boolean')
          return res.status(400).json({ error: 'isApproved must be boolean.' });
        try {
          const vendor = await Vendor.findOne({ vendorId: id });
          if (!vendor)
            return res.status(404).json({ error: 'Vendor not found.' });
          vendor.isApproved = isApproved;
          await vendor.save();
          res.status(200).json({
            message: 'Vendor approval status updated.',
            vendorId: vendor.vendorId,
            isApproved: vendor.isApproved,
          });
        } catch (err) {
          console.error('approval error:', err);
          res.status(500).json({ error: 'Server error while updating approval.' });
        }
      };

      export const checkApproval = async (req, res) => {
        const { id } = req.params;
        try {
          const vendor = await Vendor.findOne({ vendorId: id }, 'vendorId isApproved');
          if (!vendor)
            return res.status(404).json({ error: 'Vendor not found.' });
          res.status(200).json({
            vendorId: vendor.vendorId,
            isApproved: vendor.isApproved,
          });
        } catch (err) {
          console.error('checkApproval error:', err);
          res.status(500).json({ error: 'Server error while checking approval.' });
        }
      };
