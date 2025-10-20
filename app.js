const express = require('express');
const contactRoutes = require('./routes/contact');
const aboutRoutes = require('./routes/about');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.use('/contact', contactRoutes);
app.use('/about', aboutRoutes);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});