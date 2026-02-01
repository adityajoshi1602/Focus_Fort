const communityService = require('../services/community.service');

const getCommunities = async (req, res) => {
  try {
    const communities = await communityService.getAllCommunities();
    res.status(200).json(communities);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const join = async (req, res) => {
  try {
    await communityService.joinCommunity(req.user.id, req.params.id);
    res.status(200).json({ message: 'Joined community' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getCommunities, join };