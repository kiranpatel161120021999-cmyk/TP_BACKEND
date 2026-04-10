const mongoose = require("mongoose");

async function checkDB() {
  try {
    await mongoose.connect("mongodb://127.0.0.1:27017/react_collage");
    console.log("Connected to MongoDB");

    const collections = await mongoose.connection.db.listCollections().toArray();
    console.log("Collections:", collections.map(c => c.name));

    for (const col of collections) {
        const count = await mongoose.connection.db.collection(col.name).countDocuments();
        console.log(`- ${col.name}: ${count} docs`);
        
        if (col.name.includes("admin") || col.name.includes("user")) {
            const sample = await mongoose.connection.db.collection(col.name).findOne({ email: "admin@gmail.com" });
            if (sample) {
                console.log(`FOUND admin@gmail.com in ${col.name}:`, JSON.stringify(sample, null, 2));
            } else {
                const sample2 = await mongoose.connection.db.collection(col.name).findOne({ userId: "admin@gmail.com" });
                if (sample2) console.log(`FOUND admin@gmail.com (as userId) in ${col.name}:`, JSON.stringify(sample2, null, 2));
            }
        }
    }

  } catch (err) {
    console.error("Error:", err);
  } finally {
    mongoose.connection.close();
  }
}

checkDB();
