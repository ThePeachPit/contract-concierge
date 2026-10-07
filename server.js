const express = require('express');
const axios = require('axios');
const path = require('path');

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// GoHighLevel Sandbox Webhook Endpoint
const GHL_WEBHOOK_URL = 'https://services.leadconnectorhq.com/hooks/lfeFfzQaE42sMnXiNV7J/webhook-trigger/7f576e77-64ba-4d29-9481-26a629d1d14c';// Serve the front-end form
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Route to handle contract submissions
app.post('/submit-contract', async (req, res) => {
    try {
        await axios.post(GHL_WEBHOOK_URL, {
            first_name: req.body.first_name,
            last_name: req.body.last_name,
            email: req.body.email,
            property_address: req.body.property_address,
            purchase_price: req.body.purchase_price
        });

        res.send(`
            <div style="font-family: Arial, sans-serif; text-align: center; margin-top: 15vh;">
                <h1 style="color: #2b6cb0;">Agreement Dispatched!</h1>
                <p style="color: #4a5568; font-size: 16px;">The contract has been generated and emailed to ${req.body.email}.</p>
                <a href="/" style="display: inline-block; margin-top: 20px; padding: 10px 20px; background: #3182ce; color: white; text-decoration: none; border-radius: 6px;">Create Another Agreement</a>
            </div>
        `);
    } catch (error) {
        console.error('Error dispatching webhook:', error.message);
        res.status(500).send(`
            <div style="font-family: Arial, sans-serif; text-align: center; margin-top: 15vh;">
                <h1 style="color: #e53e3e;">Submission Failed</h1>
                <p style="color: #4a5568;">Check the terminal logs for details.</p>
                <a href="/" style="display: inline-block; margin-top: 20px; padding: 10px 20px; background: #718096; color: white; text-decoration: none; border-radius: 6px;">Return to Form</a>
            </div>
        `);
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Contract Concierge is active: http://localhost:${PORT}`);
});