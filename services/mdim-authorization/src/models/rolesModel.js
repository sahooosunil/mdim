import mongoose from 'mongoose';

const roleSchema = new mongoose.Schema({
  roleName: { type: String, unique: true, required: true }
});

const Role = mongoose.model('Role', roleSchema);

export default Role;
