const express = require('express');
const ytdl = require('ytdl-core');
const app = express();

app.use(express.json());

app.get('/api/getVideo', async (req, res) => {
  const videoURL = req.query.url;

  if (!videoURL || !ytdl.validateURL(videoURL)) {
    return res.status(400).json({ error: 'Invalid or missing YouTube URL.' });
  }

  try {
    const info = await ytdl.getInfo(videoURL);

    const formats = ytdl.filterFormats(info.formats, 'videoandaudio')
      .filter(f => f.hasVideo && f.hasAudio && f.qualityLabel)
      .map(format => ({
        quality: format.qualityLabel,
        type: format.container,
        url: format.url
      }));

    res.json({
      title: info.videoDetails.title,
      thumbnail: info.videoDetails.thumbnails?.pop()?.url || '',
      formats
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch video info.' });
  }
});

// Vercel compatibility
module.exports = app;
