import mongoose from 'mongoose';

const {Schema, model} = mongoose;

const authSchema = new Schema({
username: { type: String, unique: true, required: true},
email: {type: String, unique: true, required: true},
password: {type: String, required: true},
role: {type: String, required: true, enum: ['vendor', 'consumer', 'admin']}
});

export default authSchema;