require('dotenv').config();
const express = require('express');
const { sequelize, Track } = require('./database/setup');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// Returns all tracks
app.get('/api/tracks', async (req, res) => {
  try {
    const tracks = await Track.findAll();
    res.status(200).json(tracks);
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve tracks', message: error.message });
  }
});

// Returns track by trackId
app.get('/api/tracks/:id', async (req, res) => {
  try {
    const track = await Track.findByPk(req.params.id);
    if (!track) {
      return res.status(404).json({ error: 'Track not found' });
    }
    res.status(200).json(track);
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve track', message: error.message });
  }
});

// Creates a new track
app.post('/api/tracks', async (req, res) => {
  try {
    const { songTitle, artistName, albumName, genre, duration, releaseYear } = req.body;

    if (
      !songTitle ||
      !artistName ||
      !albumName ||
      !genre ||
      duration === undefined ||
      duration === null ||
      releaseYear === undefined ||
      releaseYear === null
    ) {
      return res.status(400).json({
        error: 'songTitle, artistName, albumName, genre, duration, and releaseYear are required'
      });
    }

    const createdTrack = await Track.create({
      songTitle,
      artistName,
      albumName,
      genre,
      duration,
      releaseYear
    });

    res.status(201).json(createdTrack);
  } catch (error) {
    if (error.name === 'SequelizeValidationError') {
      return res.status(400).json({ error: error.message });
    }
    res.status(500).json({ error: 'Failed to create track', message: error.message });
  }
});

// Updates an existing track
app.put('/api/tracks/:id', async (req, res) => {
  try {
    const { songTitle, artistName, albumName, genre, duration, releaseYear } = req.body;

    const track = await Track.findByPk(req.params.id);
    if (!track) {
      return res.status(404).json({ error: 'Track not found' });
    }

    await Track.update(
      { songTitle, artistName, albumName, genre, duration, releaseYear },
      { where: { trackId: req.params.id } }
    );

    const updatedTrack = await Track.findByPk(req.params.id);
    res.status(200).json(updatedTrack);
  } catch (error) {
    if (error.name === 'SequelizeValidationError') {
      return res.status(400).json({ error: error.message });
    }
    res.status(500).json({ error: 'Failed to update track', message: error.message });
  }
});

// Deletes a track by trackId
app.delete('/api/tracks/:id', async (req, res) => {
  try {
    const deletedRows = await Track.destroy({
      where: { trackId: req.params.id }
    });

    if (deletedRows === 0) {
      return res.status(404).json({ error: 'Track not found' });
    }

    res.status(200).json({ message: 'Track deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete track', message: error.message });
  }
});

async function startServer() {
  try {
    await sequelize.authenticate();
    await sequelize.sync();
    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
  }
}

startServer();
