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
// ==========================================
// ANDY'S COMP ENGINE - AUTOMATED CMA
// ==========================================
app.post('/comps', (req, res) => {
    const targetAddress = req.body.address || "No address provided";
    const targetHouseSqft = req.body.sqft || 1500; 

    // Our fake sold homes
    const mockSoldHomes = [
        { address: "123 Oak St", price: 350000, sqft: 1500, beds: 3, baths: 2 },
        { address: "125 Oak St", price: 340000, sqft: 1450, beds: 3, baths: 2 },
        { address: "129 Oak St", price: 360000, sqft: 1550, beds: 3, baths: 2 }
    ];

    // The Math: Figure out the average price per square foot
    let totalPPSQFT = 0;
    mockSoldHomes.forEach(home => {
        totalPPSQFT += (home.price / home.sqft); 
    });
    const avgPricePerSqft = totalPPSQFT / 3;
    
    // The Math: Multiply the average by Andy's listing size
    const estimatedValue = avgPricePerSqft * targetHouseSqft;

    // Send the final numbers back
    res.json({
        message: "Success!",
        targetAddress: targetAddress,
        estimatedHomeValue: Math.round(estimatedValue),
        foundComps: mockSoldHomes
    });
});
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Contract Concierge is active: http://localhost:${PORT}`);
});