import Consumer from '../models/consumerModel.js';
import { v4 as uuidv4 } from 'uuid';

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
        const profile = await Consumer.findOne({ consumerId });
        if (!profile) {
            return res.status(404).json({ error: 'Consumer not found.' });
        }
        profile.fullName = fullName;
        profile.email = email;
        profile.phoneNumber = phoneNumber;
        profile.addresses = addresses;
        await profile.save();
        res.status(200).json({
            message: 'Consumer profile updated successfully',
            profile: {
                consumerId: profile.consumerId,
                fullName: profile.fullName,
                email: profile.email,
                phoneNumber: profile.phoneNumber,
                addresses: profile.addresses
            }
        });
    } catch (err) {
        console.error('updateConsumerProfile error:', err);
        res.status(500).json({ error: 'Server error while modifying profile' });
    }
};

    export const getTheme = async (req, res) => {

    }

    export const changeTheme = async (req, res) => {

    }

    export const addNewAddress = async (req, res) => {
        const consumerId = requireConsumerId(req, res);
        if (!consumerId) return;
        const { label, line1, city, postalCode, country } = req.body;
        const postalCodeFormat = /^[A-Za-z]\d[A-Za-z][ -]?\d[A-Za-z]\d$/;
        if (!postalCodeFormat.test(postalCode)) {
            return res.status(400).json({ error: 'Invalid postal code format.' });
        }
        try {
            const profile = await Consumer.findOne({ consumerId });
            if (!profile) {
                return res.status(404).json({ error: 'Consumer not found.' });
            }
            const newAddress = {
                addressId: uuidv4(),
                label,
                line1,
                city,
                postalCode,
                country
            };
            profile.addresses.push(newAddress);
            await profile.save();
            res.status(201).json({
                message: 'New address created successfully',
                address: newAddress
            });
        } catch (err) {
            console.error('addNewAddress error:', err);
            res.status(500).json({ error: 'Server error while adding address.' });
        }
    };

    export const getAddresses = async (req, res) => {
        const consumerId = requireConsumerId(req, res);
        if (!consumerId) return;
        try {
            const profile = await Consumer.findOne({ consumerId });
            if (!profile) {
                return res.status(404).json({ error: 'Consumer not found.' });
            }
            res.status(200).json({ addresses: profile.addresses });
        } catch (err) {
            console.error('getAddresses error:', err);
            res.status(500).json({ error: 'Internal server error.' });
        }
    };
    

    export const updateAddress = async (req, res) => {
        const consumerId = requireConsumerId(req, res);
        if (!consumerId) return;   
        const { addressId, label, line1, city, country, postalCode } = req.body;
        const postalCodeFormat = /^[A-Za-z]\d[A-Za-z][ -]?\d[A-Za-z]\d$/;
        if (!postalCodeFormat.test(postalCode)) {
            return res.status(400).json({ error: 'Invalid postal code format.' });
        }
        if (!label || !line1 || !city || !postalCode || !country) {
            return res.status(400).json({ error: 'All fields are required.' });
        }
        try {
            const consumer = await Consumer.findOne({ consumerId });
            if (!consumer) {
                return res.status(404).json({ error: 'Consumer not found.' });
            }
            const address = consumer.addresses.find(a => a.addressId === addressId);
            if (!address) {
                return res.status(404).json({ error: 'Address not found.' });
            }
            address.label = label;
            address.line1 = line1;
            address.city = city;
            address.country = country;
            address.postalCode = postalCode;
            await consumer.save();
            res.status(200).json({
                message: 'Address updated.',
                address
            });
        } catch (err) {
            console.error('updateAddress error:', err);
            res.status(500).json({ error: 'Internal server error.' });
        }
    };

    export const deleteAddress = async (req, res) => {
        const consumerId = requireConsumerId(req, res);
        if (!consumerId) return;
        const { addressId } = req.params;
        try {
            const consumer = await Consumer.findOne({ consumerId });
            if (!consumer) {
                return res.status(404).json({ error: 'Consumer not found.' });
            }
            const initialLength = consumer.addresses.length;
            consumer.addresses = consumer.addresses.filter(address => address.addressId !== addressId);
    
            if (consumer.addresses.length === initialLength) {
                return res.status(404).json({ error: 'Address not found.' });
            }
            await consumer.save();
            res.status(200).json({ message: 'Address deleted successfully.' });
        } catch (error) {
            console.error('Error deleting address:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    };


    