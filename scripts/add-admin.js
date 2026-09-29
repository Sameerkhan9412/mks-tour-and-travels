const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const fs = require('fs');
const path = require('path');

const baseClusterUri = 'mongodb+srv://sameerkhann:TooE7b7ksfzNDWEU@cluster0.2nuc8ft.mongodb.net/';
const targetDatabases = ['msk_holidays', 'mks_travels'];

// Also check if .env specifies another database
try {
  const envContent = fs.readFileSync(path.join(__dirname, '..', '.env'), 'utf8');
  const match = envContent.match(/^MONGODB_URI=(.+)$/m);
  if (match) {
    const envUri = match[1].trim();
    const dbNameMatch = envUri.match(/\/([a-zA-Z0-9_\-]+)(\?|$)/);
    if (dbNameMatch && !targetDatabases.includes(dbNameMatch[1])) {
      targetDatabases.push(dbNameMatch[1]);
    }
  }
} catch (e) {}

const email = 'sameerkhann9412@gmail.com'.toLowerCase().trim();
const username = 'sameer';
const password = 'Sameer';

async function addAdminToAll() {
  try {
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    for (const dbName of targetDatabases) {
      console.log(`\n========================================`);
      console.log(`Connecting to database: ${dbName}...`);
      const uri = `${baseClusterUri}${dbName}?retryWrites=true&w=majority`;
      
      const conn = await mongoose.createConnection(uri).asPromise();
      console.log(`Connected to ${dbName} successfully.`);

      const UserSchema = new mongoose.Schema(
        {
          username: { type: String, required: true, unique: true, trim: true },
          email: { type: String, required: true, unique: true, lowercase: true, trim: true },
          passwordHash: { type: String, required: true },
          role: { type: String, enum: ['admin', 'superadmin'], default: 'admin' },
        },
        { timestamps: true }
      );

      const User = conn.model('User', UserSchema);

      let existingUser = await User.findOne({
        $or: [{ email: email }, { username: username }],
      });

      if (existingUser) {
        console.log(`Found existing user in ${dbName} (ID: ${existingUser._id}), updating credentials...`);
        existingUser.email = email;
        existingUser.username = username;
        existingUser.passwordHash = passwordHash;
        existingUser.role = 'superadmin';
        await existingUser.save();
        console.log(`Updated user ${email} in ${dbName}.`);
      } else {
        const newUser = await User.create({
          username,
          email,
          passwordHash,
          role: 'superadmin',
        });
        console.log(`Created new admin in ${dbName} (ID: ${newUser._id}).`);
      }

      const allUsers = await User.find({}, { username: 1, email: 1, role: 1, createdAt: 1 });
      console.log(`All users in ${dbName}:`, JSON.stringify(allUsers, null, 2));

      await conn.close();
    }

    console.log('\nAll databases updated successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error in addAdminToAll:', error);
    process.exit(1);
  }
}

addAdminToAll();
