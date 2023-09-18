const express = require('express');
const router = express.Router();
const { Card } = require('../models');  // Assuming Sequelize model's name is "Card"
router.use(express.json());




// Fetch all cards
router.get('/api/cards', async (req, res) => {
    try {
        const cards = await Card.findAll();
        // const columns = [[]]; // Initialize an array for the first column

        // // Split the cards into columns
        // cards.forEach((card, index) => {
        //     // Assuming you have a 'columnIndex' property in your card model
        //     const columnIndex = card.columnIndex || 0;

        //     // Initialize the column array if it doesn't exist
        //     if (!columns[columnIndex]) {
        //         columns[columnIndex] = [];
        //     }

        //     // Push the card into the appropriate column
        //     columns[columnIndex].push(card);
        // });

        res.json(cards);
    } catch (error) {
        res.status(500).json({ message: "Error fetching all cards", error });
    }
});



router.post('/api/cards/move', async (req, res) => {
    const { sourceColIndex, sourceItemIndex, targetColIndex } = req.body;

    // We'll use these indices to determine stockName and its new stage.
    // Assuming columns are in a certain order corresponding to stages.
    const stages = ["Backlog", "In Progress", "Completed"];  // Modify this based on your app's exact columns.
    const sourceStage = stages[sourceColIndex];
    const targetStage = stages[targetColIndex];

    // Fetch the card using source stage and item index
    // This assumes you have an order in your database.
    const cardToMove = await Card.findAll({ where: { stage: sourceStage }, offset: sourceItemIndex, limit: 1 });

    if (!cardToMove) {
        return res.status(404).json({ error: "Card not found" });
    }

    // Update the card's stage
    cardToMove.stage = targetStage;
    await cardToMove.save();

    res.json({ success: true, message: "Card moved successfully" });
});

router.post('/api/cards', async (req, res) => {
    console.log(req.body);

    const { 
        stockName, dueDate, primaryAnalyst, secondaryAnalyst, attachments
    } = req.body;

    try {
        // Create empty links
        let link_1 = null;
        let link_2 = null;
        let link_3 = null;
        let link_4 = null;
        let link_5 = null;

        // Process attachments to fill up the links
        for (let attachment of attachments) {
            if (attachment.includes('Full Note')) {
                link_1 = attachment;
            } else if (attachment.includes('Pre Mortem')) {
                link_2 = attachment;
            } else if (attachment.includes('Q&A')) {
                link_3 = attachment;
            } else if (attachment.includes('Short Note')) {
                link_4 = attachment;
            } else if (attachment.includes('Model')) {
                link_5 = attachment;
            }
        }

        const newCardData = {
            stock_name: stockName,
            entry_date: new Date(req.body.createdDate), 
            due_date: new Date(dueDate),
            type: 'New Ideas',
            // Here I'm adding a placeholder for the stage. You need to provide this information.
            stage: 'New Ideas', 
            primary_analyst: primaryAnalyst,
            secondary_analyst: secondaryAnalyst,
            sedol: generateRandomInt(8),
            isin: generateRandomInt(8),
            link_1: link_1,
            link_2: link_2,
            link_3: link_3,
            link_4: link_4,
            link_5: link_5,
            // This should be filled out if you have additional data to be saved as 'Other'.//CHeck the req.body by console.log check the response as well to match the format
            Other: null
        };

        const newCard = await Card.create(newCardData);
        res.json(newCard);
    } catch (error) {
        console.error("Error creating card:", error);
        res.status(500).json({ message: "Error creating card", error });
    }
});




// Move a card to a different stage
router.put('/api/cards/move', async (req, res) => {
    try {

        const { cardId, targetColumnName } = req.body;
        const updatedCard = await Card.update({ stage: targetColumnName }, { where: { id: cardId } });
        
        console.log("Route /api/cards/move hit");
        console.log(req.body);

        if (updatedCard[0] > 0) {
            res.json({ message: "Card successfully moved" });
        } else {
            res.status(404).json({ message: "Card not found, server" });
        }
    } catch (error) {
        res.status(500).json({ message: "Error moving card", error });
    }
});


// Update card's lane
router.put('/api/cards/:stockName/stage', async (req, res) => {
    try {
        const { stage } = req.body;
        const updatedCard = await Card.update({ stage }, { where: { stock_name: req.params.stockName } });
        res.json(updatedCard);
    } catch (error) {
        res.status(500).json({ message: "Error updating card's stage", error });
    }
});

// Add attachments
router.put('/api/cards/:stockName/attachments', async (req, res) => {
    try {
        const links = classifyLinks(req.body.attachments);
        const updatedCard = await Card.update(links, { where: { stock_name: req.params.stockName } });
        res.json(updatedCard);
    } catch (error) {
        res.status(500).json({ message: "Error adding attachments", error });
    }
});

// Update secondary analyst
router.put('/api/cards/:stockName/secondaryAnalyst', async (req, res) => {
    try {
        const { secondary_analyst } = req.body;
        const updatedCard = await Card.update({ secondary_analyst }, { where: { stock_name: req.params.stockName } });
        res.json(updatedCard);
    } catch (error) {
        res.status(500).json({ message: "Error updating secondary analyst", error });
    }
});


// Helper function to generate random integers
function generateRandomInt(length) {
    return Math.floor(Math.pow(10, length-1) + Math.random() * 9 * Math.pow(10, length-1));
}

// Helper function to classify links
function classifyLinks(attachments) {
    let links = { link_1: null, link_2: null, link_3: null, link_4: null, link_5: null };
    attachments.forEach(attachment => {
        if (attachment.includes('Full Note')) links.link_1 = attachment;
        else if (attachment.includes('Pre Mortem')) links.link_2 = attachment;
        else if (attachment.includes('Q&A')) links.link_3 = attachment;
        else if (attachment.includes('Short Note')) links.link_4 = attachment;
        else if (attachment.includes('Model')) links.link_5 = attachment;
    });
    return links;
}


module.exports = router;