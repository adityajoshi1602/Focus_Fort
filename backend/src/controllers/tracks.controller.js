const trackService = require('../services/track.service');

const getTracks = async (req, res) => {
  try {
    const tracks = await trackService.getAllTracks();
    res.status(200).json(tracks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getTrack = async (req, res) => {
  try {
    const track = await trackService.getTrackById(req.params.id);
    res.status(200).json(track);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

const createTrack = async (req, res) => {
  try {
    const track = await trackService.createTrack(req.body, req.user.id);
    res.status(201).json(track);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getTracks, getTrack, createTrack };