// api/hello.js
module.exports = (req, res) => {
  try {
    // Basic check to see the function runs
    console.log('API function executed');
    res.status(200).json({ message: 'Hello from Lovable React API!' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
};
