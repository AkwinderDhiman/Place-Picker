const express = require('express');
const fs = require('fs/promises');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const port = 3002;

// Middleware
app.use(express.static('./images'));
app.use(bodyParser.json());
app.use(cors());

// Simple API Endpoint
app.get('/api', (req, res) => {
  const data = { message: 'Hello from the server!' };
  res.json(data);
});

// Get Places
app.get('/places', async (req, res) => {
  try {
    const fileContent = await fs.readFile('./data/places.json');
    const placesData = JSON.parse(fileContent);
    res.status(200).json({ places: placesData });
  } catch (error) {
    res.status(500).json({ message: 'Error reading places data' });
  }
});
// Get user Places
app.get('/user-places', async (req, res) => {
  try {
    const fileContent = await fs.readFile('./data/user-places.json');
    const places = JSON.parse(fileContent);
    res.status(200).json({ places: places });
  } catch (error) {
    res.status(500).json({ message: 'Error reading places data' });
  }
});


// Update user Places
app.put('/user-places', async (req, res) => {
  try {
    const places = req.body.places;
    await fs.writeFile('./data/user-places.json', JSON.stringify(places));
    res.status(200).json({ message: 'User places updated!', places });
  } catch (error) {
    res.status(500).json({ message: 'Error User update data' });
  }
});

// 404 Handler
app.use((req, res, next) => {
  if (req.method === 'OPTIONS') {
    return next();
  }
  res.status(404).json({ message: '404 - Not Found' });
});

// Start Server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
