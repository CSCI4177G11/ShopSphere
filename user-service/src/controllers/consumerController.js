import Consumer from '../models/consumerModel.js';

function resolveAddressId(req) {
  return req?.address?.addressId || req?.address?.id || null;
}

function requireAddressId(req, res) {
  const addressId = resolveAddressId(req);
  if (!addressId) {
    res.status(401).json({ error: 'Unauthorized: missing or expired token' });
    return null;
  }
  return addressId;
}

function resolveConsumerId(req) {
  return req?.consumer?.consumerId || req?.consumer?.id || null;
}

function requireConsumerId(req, res) {
  const consumerId = resolveConsumerId(req);
  if (!consumerId) {
    res.status(401).json({ error: 'Unauthorized: missing or expired token' });
    return null;
  }
  return consumerId;
}
export const getConsumerProfile = async (req, res) => {
    const consumerId = requireConsumerId(req, res);
    if (!consumerId) return;
    try {
        const profile = await Consumer.findOne({ consumerId });
        if (!profile) {
            return res.status(404).json({ error: 'Consumer profile not found.' });
        }
        const displayProfile = {
            consumerId: profile.consumerId,
            fullName: profile.fullName,
            email: profile.email,
            phoneNumber: profile.phoneNumber,
            addresses: profile.addresses,
        };
        res.status(200).json({ displayProfile });
    } catch (err) {
        console.error('getConsumerProfile error:', err);
        res.status(500).json({ error: 'Server error. Please try again later.' });
    }
};

export const updateConsumerProfile = async (req, res) => {
    const { consumerId, fullName, email, phoneNumber, addresses } = req.body;
    const emailFormat = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneNumberFormat = /^(?:\+1\s?)?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}$/;
    if (!emailFormat.test(email)) {
        return res.status(400).json({ error: 'Invalid email format.' });
    }
    if (!phoneNumberFormat.test(phoneNumber)) {
        return res.status(400).json({ error: 'Invalid phone number format.' });
    }
    try {
        let profile = await Consumer.findOne({ consumerId });
        let line = profile.lines.find((i) => i.consumerId === consumerId);
        line = { fullName, email, phoneNumber, addresses };
        profile.lines.push(line);
        await profile.save();
        res.status(200).json({
        message: 'Consumer profile updated successfully',
        line: {
            consumerId: line.consumerId,
            fullName: line.fullName,
            email: line.email,
            phoneNumber: line.phoneNumber
        }});
    } catch (err) {
        console.error('updateProfile error:', err);
        res.status(500).json({ error: 'Server error while modifying profile' });
    }}

    export const getTheme = async (req, res) => {

    }

    export const changeTheme = async (req, res) => {

    }

    export const addNewAddress = async (req, res) => {
    const { postalCode } = req.body;
    const postalCodeFormat = /^[A-Za-z]\d[A-Za-z][ -]?\d[A-Za-z]\d$/;
    if (!postalCodeFormat.test(postalCode)) {
        return res.status(400).json({ error: 'Invalid postal code format.' });
    }
    try {
        const consumerId = requireConsumerId(req, res);
        const {label, line1, city, country} = req.body;
        let profile = await Consumer.findOne({ consumerId });
        let line = profile.lines.addresses.find((i) => i.consumerId === consumerId);
        line = { label, line1, city, postalCode, country };
        profile.lines.push(line);
        await profile.save();
        res.status(201).json({
        message: 'New address created successfully',
        line: {
            label: line.label,
            line1: line.line1,
            city: line.city,
            postalCode: line.postalCode,
            country: line.country
        }});
    } catch (err) {
        console.error(err);
        res.status(400).json({ error: 'Bad Request.' });
    }}

    export const getAddresses = async (req, res) => {
    const consumerId = requireConsumerId(req, res);
    if (!consumerId) return;
    try {
        const profile = await Consumer.findOne({consumerId});
        const lines = profile ? profile.lines : [];
        const displayAddresses = lines.map(line => ({
      addresses: line.addresses
    }));
    res.status(200).json({displayAddresses});
    }
    catch (err) {
         console.error(err);
    res.status(401).json({error: 'Unauthorized.'});
    }} 

    export const updateAddress = async (req, res) => {
    const addressId = requireAddressId(req, res);
    if (!addressId) return;
    const { label, line1, city, country, postalCode } = req.body;
    const postalCodeFormat = /^[A-Za-z]\d[A-Za-z][ -]?\d[A-Za-z]\d$/;
    if (!postalCodeFormat.test(postalCode)) {
        return res.status(400).json({ error: 'Invalid postal code format.' });
    }
    if (!label || !line1 || !city || !postalCode || !country) {
    return res.status(400).json({ error: 'Address missing.' });
  }
    try {
        let address = await Consumer.findOne({ addressId });
        let line = consumer.lines.find((i) => i.addressId === addressId);
        line = { label, line1, city, postalCode, country };
        address.lines.push(line);
        await address.save();
        res.status(200).json({
        message: 'Address updated.',
        line: {
            addressId: line.addressId,
            label: line.label,
            line1: line.line1,
            city: line.city,
            postalCode: line.postalCode,
            country: line.country
        }});
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error.' });
    }}

    export const deleteAddress = async (req, res) => {
    try {
        const { addressId } = req.params;
        const address = await Consumer.findById({addressId});
        if (!address) {
            return res.status(404).json({ error: 'Address not found.' });
        }
        await address.deleteOne();
        res.json({
            message: "Address deleted successfully."
        });
    } catch (error) {
        console.error('Error deleting address:', error);
        res.status(500).json({ error: 'Internal server error' });
    }}


    