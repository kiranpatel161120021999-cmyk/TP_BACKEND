const mongoose = require('mongoose');
async function migrate() {
  await mongoose.connect('mongodb://127.0.0.1:27017/test');
  const students = await mongoose.connection.db.collection('students').find().toArray();
  await mongoose.disconnect();
  await mongoose.connect('mongodb://127.0.0.1:27017/react_collage');
  const dest = mongoose.connection.db.collection('students');
  for (const s of students) {
    await dest.updateOne({_id: s._id}, {$set: s}, {upsert: true});
  }
  console.log('Migrated students:', students.length);
  process.exit(0);
}
migrate();
