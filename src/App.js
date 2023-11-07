import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';  
import './App.css';


import DroppableZone from "./DroppableZone.js"


 /* FINISH DRAGABLE ITEM  */
const App = () => {

  const [columnName] = useState([
    'Ideas',
    'Correction of Errors Report',
    'Short Note',
    'Q&A',
    'Model',
    'Pre Mortem',
    'Full Note',
    'Buy List',
    'Fail List'
  ]);

  const [columns, setColumns] = useState([
    [],
    [
      {
        stockName: "NASDAQ",
        createdDate: new Date(),
        dueDate: new Date(),
        primaryAnalyst: "",
        secondaryAnalyst: "",
        attachments: [],
        edited: false
      },
      {
        stockName: "Apple",
        createdDate: new Date(),
        dueDate: new Date(),
        primaryAnalyst: "",
        secondaryAnalyst: "",
        attachments: [],
        edited: false
      }
    ],
    [],
    [],
    [],
    [],
    [],
    [],
    []
  ]);
  

  const handleDragStart = (e, colIndex, index) => {
    e.dataTransfer.setData('application/json', JSON.stringify([colIndex, index]));
  };
 
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:3001/api/cards');
        const cards = response.data;
        // console.log(cards)
        // console.log(cards[0])
        // const innerArray = cards[0] //cards[0] because the response of the api calls comes as follows: [[ [],[]...] ]
        const newColumns = [[], [], [], [], [], [], [], [], []];
        
        cards.forEach((card) => {
          const {
            id,
            due_date,
            primary_analyst,
            secondary_analyst,
            stock_name,
            stage,
            createdAt,
            link_1,
            link_2,
            link_3,
            link_4,
            link_5
          } = card;
    
         
          // Extract and format attachments
      const attachments = [];
      [link_1, link_2, link_3, link_4, link_5].forEach(link => {
        if (link) {
          attachments.push(link);
        }
      });
          // console.log(attachments)
    
          // Copy of the card format  that can be created to display the ones from the database
          const formattedCard = {
            id: id,
            stockName: stock_name || '',
            createdDate: new Date(createdAt),
            dueDate: due_date ? new Date(due_date) : null,
            primaryAnalyst: primary_analyst || '',
            secondaryAnalyst: secondary_analyst || '',
            attachments: attachments, 
            edited: true //these cards are already edited since they are in the database
          };
        
        
          // // Categorize the formattedCard into different columns based on its type
           switch (stage) {
             case "New Ideas":
               newColumns[0].push(formattedCard);
               break;
             case 'Correction of Errors Report':
               newColumns[1].push(formattedCard);
               break;
             case 'Short Note':
               newColumns[2].push(formattedCard);
               break;
             case 'Q&A':
               newColumns[3].push(formattedCard);
               break;
             case 'Model':
               newColumns[4].push(formattedCard);
               break;
             case 'Pre Mortem':
               newColumns[5].push(formattedCard);
               break;
            case 'Full Note':
               newColumns[6].push(formattedCard);
               break;
             case 'Buy List':
               newColumns[7].push(formattedCard);
               break;
             case 'Fail List':
               newColumns[8].push(formattedCard);
               break;
             default:
              newColumns[0].push(formattedCard);
               break;
           }
        });
        
        console.log(newColumns)
        // Update the "columns" state with the categorized data
        setColumns(newColumns);
      } catch (error) {
        console.error("Error fetching cards:", error);
      }
    };
  
    // Call fetchData to fetch and categorize the data when the component mounts
    fetchData();
  }, []); // Empty dependency array means this effect runs once when the component mounts
  
  
  return (
    <div className="container">

      <div className='text-container'>
      <h1 className='title'>Data Presentation Drag-Drop Effect</h1>
      <p className='process-screen'>Process Screen</p>
      </div>

      <DroppableZone
        columnName={columnName}
        columns={columns}
        setColumns={setColumns}
        handleDragStart={handleDragStart}
      />
    </div>
  );
};

export default App;
