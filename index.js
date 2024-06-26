const express = require('express');
const bodyParser = require('body-parser');
const { MongoClient } = require('mongodb');
const path = require('path');

const app = express();
const PORT = 3000;

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// MongoDB Connection URL
const mongoURL = 'mongodb://admin:password@localhost:27017';
app.use(express.static(path.join(__dirname, 'public')));
// Database Name
const dbName = 'my_database';

// Function to connect to MongoDB
async function connectToMongoDB() {
  try {
    const client = new MongoClient(mongoURL, { useUnifiedTopology: true });
    await client.connect();
    console.log('Connected to MongoDB');
    return client.db(dbName);
  } catch (err) {
    console.error('Error connecting to MongoDB:', err);
    throw err;
  }
}

// Endpoint to update profile data
app.post('/update-profile', async (req, res) => {
  try {
    const db = await connectToMongoDB();
    const collection = db.collection('my_collection');
    const { name, email } = req.body;
    const result = await collection.updateOne(
      { _id: "profile_id" }, // Adjust the filter as needed
      { $set: { name, email } },
      { upsert: true }
    );
    res.status(200).send('Profile updated successfully');
  } catch (err) {
    console.error('Error updating profile:', err);
    res.status(500).send('Error updating profile');
  }
});

// Endpoint to add data
app.post('/add-data', async (req, res) => {
  try {
    const db = await connectToMongoDB();
    const collection = db.collection('my_collection');
    const data = req.body;
    await collection.insertOne(data);
    console.log('Data inserted successfully');
    res.status(200).send('Data inserted successfully');
  } catch (err) {
    console.error('Error inserting data:', err);
    res.status(500).send('Error inserting data');
  }
});

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});
// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
