import express from 'express';
import { connectToDatabase } from '../server/config/database.js'; // Adjust the path as needed
import userRoutes from '../server/routes/users.js'; // Adjust the path as needed
import authRoutes from '../server/routes/auth.js'; // Adjust the path as needed
import tasksRoutes from '../server/routes/tasks.js'; // Adjust the path as needed

// Initialize Express
const app = express();
app.use(express.json());
app.use(cors());

app.use('/api/users', userRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/tasks', tasksRoutes);

// Connect to the database
connectToDatabase();

// Export the Express app as a serverless function
export default (req, res) => {
  return new Promise((resolve, reject) => {
    app(req, res, (err) => {
      if (err) {
        reject(err);
      } else {
        resolve();
      }
    });
  });
};
