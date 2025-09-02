// api/hello.js
module.exports = (req, res) => {
  try {
    console.log('API function executed');

    if (req.method === 'POST') {
      const data = req.body || {};
      res.status(200).json({ message: 'POST received', data });
    } else {
      res.status(200).json({ message: 'Hello from Lovable React API!' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
};
