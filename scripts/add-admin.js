const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const fs = require('fs');
const path = require('path');

let uri = 'mongodb+srv://sameerkhann:TooE7b7ksfzNDWEU@cluster0.2nuc8ft.mongodb.net/mks_travels';
try {
  const envContent = fs.readFileSync(path.join(__dirname, '..', '.env'), 'utf8');
  const match = envContent.match(/^MONGODB_URI=(.+)$/m);
  if (match) uri = match[1].trim();
} catch (e) {}

async function addAdmin() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(uri);
    console.log('Connected to MongoDB successfully.');

    const email = 'sameerkhann9412@gmail.com'.toLowerCase().trim();
    const username = 'sameer';
    const password = 'Sameer';

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    const UserSchema = new mongoose.Schema(
      {
        username: { type: String, required: true, unique: true, trim: true },
        email: { type: String, required: true, unique: true, lowercase: true, trim: true },
        passwordHash: { type: String, required: true },
        role: { type: String, enum: ['admin', 'superadmin'], default: 'admin' },
      },
      { timestamps: true }
    );

    const User = mongoose.models.User || mongoose.model('User', UserSchema);

    // Check if user with this email or username already exists
    let existingUser = await User.findOne({
      $or: [{ email: email }, { username: username }],
    });

    if (existingUser) {
      console.log(`Found existing user with id: ${existingUser._id}, updating password and role...`);
      existingUser.email = email;
      existingUser.username = username;
      existingUser.passwordHash = passwordHash;
      existingUser.role = 'superadmin';
      await existingUser.save();
      console.log(`User ${email} updated successfully!`);
    } else {
      const newUser = await User.create({
        username,
        email,
        passwordHash,
        role: 'superadmin',
      });
      console.log(`New admin user created successfully! ID: ${newUser._id}`);
    }

    // List all admins for verification
    const allUsers = await User.find({}, { username: 1, email: 1, role: 1, createdAt: 1 });
    console.log('Current users in database:');
    console.log(JSON.stringify(allUsers, null, 2));

    await mongoose.disconnect();
    console.log('Done.');
    process.exit(0);
  } catch (error) {
    console.error('Error adding admin:', error);
    process.exit(1);
  }
}

addAdmin();
