const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

// MongoDB setup
mongoose.connect('mongodb+srv://owenmuldoon86:Owen8601@cluster0.hkqfu.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0/', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const userSchema = new mongoose.Schema({
  name: String,
  score: { type: Number, default: 0 },
});

const User = mongoose.model('User', userSchema);

// Get leaderboard
app.get('/leaderboard', async (req, res) => {
  try {
    const leaderboard = await User.find().sort({ score: -1 });
    res.json(leaderboard);
  } catch (error) {
    res.status(500).send(error);
  }
});

// Handle new user or existing user
app.post('/user', async (req, res) => {
  const { name } = req.body;
  try {
    let user = await User.findOne({ name });
    if (user) {
      // If user exists, increase score
      user.score += 1;
      await user.save();
    } else {
      // If new user, create new record
      user = new User({ name, score: 1 });
      await user.save();
    }
    res.json(user);
  } catch (error) {
    res.status(500).send(error);
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
