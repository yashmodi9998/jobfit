import mongoose from 'mongoose';
// User model to store user information and credentials
const UserSchema = new mongoose.Schema({
  userId:{
    type: String,
    required: true,
    unique: true,
  },
  name: {
    type: String,
    required: true,
    
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  
  password: {
    type: String,
    // required: true,
  },
}, { timestamps: true });

const User = mongoose.models.User || mongoose.model('User', UserSchema);

export default User;