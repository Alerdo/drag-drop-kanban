const express = require('express');
const router = express.Router();
const { Card } = require('../models'); 
router.use(express.json());




// Fetch all cards
router.get('/api/cards', async (req, res) => {
    try {
        const cards = await Card.findAll();
        

        res.json(cards);
    } catch (error) {
        res.status(500).json({ message: "Error fetching all cards", error });
    }
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
router.put('/api/cards/:cardId/secondaryAnalyst', async (req, res) => {
    try {
        const { cardId } = req.params; // Extract the card ID from the URL parameter
        const { secondary_analyst } = req.body; // Extract the new secondary analyst name from the request body

        // Update the secondary analyst name for the specified card
        const updatedCard = await Card.update(
            { secondary_analyst },
            { where: { id: cardId } }
        );

        if (updatedCard[0] > 0) {
            res.json({ message: "Secondary analyst name updated successfully" });
        } else {
            res.status(404).json({ message: "Card not found" });
        }
    } catch (error) {
        res.status(500).json({ message: "Error updating secondary analyst name", error });
    }
});


// Delete a card by ID


// DELETE route to delete a card by ID
// DELETE route to delete a card by ID
router.delete('/api/cards/:id', async (req, res) => {
    try {
      const { id } = req.params;
  
      // Check if the card with the specified ID exists
      const cardToDelete = await Card.findByPk(id);
  
      if (!cardToDelete) {
        return res.status(404).json({ error: 'Card not found' });
      }
  
      // Delete the card
      await cardToDelete.destroy();
  
      // Respond with a success message
      res.json({ message: 'Card deleted successfully' });
    } catch (error) {
      console.error('Error deleting card:', error);
      // Handle the error and respond with an appropriate JSON error message
      res.status(500).json({ error: 'Error deleting card' });
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