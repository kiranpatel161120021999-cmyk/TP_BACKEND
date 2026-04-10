const mongoose = require("mongoose");
const fs = require("fs");

async function deepScan() {
  try {
    await mongoose.connect("mongodb://127.0.0.1:27017/react_collage");
    const results = {
      timestamp: new Date().toISOString(),
      collections: []
    };

    const db = mongoose.connection.db;
    const collections = await db.listCollections().toArray();
    
    for (const colDef of collections) {
      const colName = colDef.name;
      const col = db.collection(colName);
      const docs = await col.find({}).toArray();
      
      const found = docs.filter(d => 
        (d.email && d.email.toLowerCase() === "admin@gmail.com") || 
        (d.userId && d.userId.toLowerCase() === "admin@gmail.com")
      );

      results.collections.push({
        name: colName,
        count: docs.length,
        matches: found
      });
    }

    fs.writeFileSync("scan_results.json", JSON.stringify(results, null, 2));
    console.log("Scan complete. Results saved to scan_results.json");
  } catch (err) {
    console.error("Scan Error:", err);
  } finally {
    mongoose.connection.close();
  }
}

deepScan();
