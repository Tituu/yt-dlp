const ytdl = require('ytdl-core');

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Only POST allowed' });

  const { url } = req.body;

  if (!url || !ytdl.validateURL(url)) {
    return res.status(400).json({ error: 'Invalid YouTube URL' });
  }

  try {
    const info = await ytdl.getInfo(url);

    const formats = info.formats
      .filter(f => f.hasAudio && f.container === 'mp4')
      .map(f => ({
        quality: f.qualityLabel || 'Audio',
        format: f.container,
        url: f.url
      }));

    return res.status(200).json({ title: info.videoDetails.title, formats });
  } catch (err) {
    return res.status(500).json({ error: 'Failed to fetch video info.' });
  }
}
