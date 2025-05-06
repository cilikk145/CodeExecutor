const axios = require('axios');
require('dotenv').config();

module.exports = async function (req, res) {
  const { code, language } = JSON.parse(req.body);

  const languageIds = {
    python: 71,
    javascript: 63,
    c: 50
  };

  if (!languageIds[language]) {
    return res.json({ error: 'Unsupported language' });
  }

  try {
    const response = await axios.post(
      'https://judge0-ce.p.rapidapi.com/submissions?base64_encoded=false&wait=true',
      {
        source_code: code,
        language_id: languageIds[language],
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'X-RapidAPI-Host': 'judge0-ce.p.rapidapi.com',
          'X-RapidAPI-Key': process.env.JUDGE0_API_KEY,
        },
      }
    );

    const output = response.data.stdout || response.data.stderr || 'No output';
    res.json({ output });
  } catch (e) {
    res.json({ error: 'Execution failed', details: e.message });
  }
};
