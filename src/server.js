import app from './index.js';  // Import the Express app
export default (req, res) => app(req, res);  // Export the handler for Vercel to use
