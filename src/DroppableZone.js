import DraggableItem from "./DraggableItem.js"
import axios from 'axios'; 

import './App.css';


const DroppableZone =  ({ columnName, columns, setColumns, handleDragStart }) => {

    const handleDropOnEmpty = async (e, targetColIndex) => { // makes possible do drop the items on empty space on columns 
      e.preventDefault();
      const [sourceColIndex, sourceItemIndex] = JSON.parse(e.dataTransfer.getData('application/json'));
      const newColumns = [...columns];
      const draggedItem = newColumns[sourceColIndex][sourceItemIndex];
  
      newColumns[sourceColIndex].splice(sourceItemIndex, 1);
      newColumns[targetColIndex].push(draggedItem);
  
      setColumns(newColumns);
  
      try {
        const cardId = draggedItem.id; // assuming each card has a unique 'id' property
        const targetColumnName = columnName[targetColIndex];
        
        const response = await axios.put(`http://localhost:3001/api/cards/move`, {
          cardId,
          targetColumnName
        });
  
     
  
      } catch (error) {
        console.error("Error while moving card:", error);
        // const cardId = draggedItem.id; // assuming each card has a unique 'id' property
        // const targetColumnName = columnName[targetColIndex];
        // console.log(cardId, targetColumnName)
      }
  
    };
  
    const handleDropOnExisting = async (e, targetColIndex, targetItemIndex) => { //I will make the padding of the last element take all the height so this handler will be working instead of the .items handler
      e.preventDefault();
      e.stopPropagation(); 
      const [sourceColIndex, sourceItemIndex] = JSON.parse(e.dataTransfer.getData('application/json'));
      const newColumns = [...columns];
      const draggedItem = newColumns[sourceColIndex][sourceItemIndex];
  
      newColumns[sourceColIndex].splice(sourceItemIndex, 1);
      newColumns[targetColIndex].splice(targetItemIndex, 0, draggedItem);
  
      setColumns(newColumns);
  
        try {
        const cardId = draggedItem.id; // assuming each card has a unique 'id' property
        const targetColumnName = columnName[targetColIndex];
        
        const response = await axios.put(`http://localhost:3001/api/cards/move`, {
          cardId,
          targetColumnName
        });
  
     
  
      } catch (error) {
        console.error("Error while moving card:", error);
        // const cardId = draggedItem.id; // assuming each card has a unique 'id' property
        // const targetColumnName = columnName[targetColIndex];
        // console.log(cardId, targetColumnName)
      }
    };
  
   
  
    const handleAddNewCard = async (colIndex) => {
      const newColumns = [...columns];
      const newCard = {
        stockName: "",
        createdDate: new Date(),
        dueDate: new Date(),
        primaryAnalyst: "",
        secondaryAnalyst: "",
        attachments: [],
        edited: false
      };
      newColumns[colIndex].push(newCard);
      setColumns(newColumns);
      
    };
  
    const handleDragOver = (e) => {
      e.preventDefault();
    };
  
  
    const updateAttachments = async (colIndex, itemIndex, newAttachments) => {
      setColumns(prevColumns => {
          const updatedColumns = [...prevColumns];
          updatedColumns[colIndex][itemIndex].attachments = newAttachments;
          return updatedColumns;
      });
  
      try {
        await axios.put(`http://localhost:3001/api/cards/${columns[colIndex][itemIndex].id}/attachments`, newAttachments);
      } catch (error) {
        console.error("Error updating attachments:", error);
        // Handle error (e.g. rollback UI change, show error message, etc.)
      }
  };
  
  
  const updateItemField = (colIndex, itemIndex, field, value) => { //used to change one value of a certian propertie 
    setColumns(prevColumns => {
        const updatedColumns = [...prevColumns];
        updatedColumns[colIndex][itemIndex][field] = value;
        return updatedColumns;
    });
  };
   
  
    return (
      <div className="columns-container">
        {columns.map((colItems, colIndex) => ( //Iterating over all columns 
          <div key={colIndex} className="column">
            <div className="column-name">{(colIndex + 1) + ". "}{columnName[colIndex]}</div>
            {colIndex === 0 && ( <button onClick={() => handleAddNewCard(colIndex) }>+</button>)}  {/*Making sure this button shows for the first column only*/}
            
            
            <div 
              className="items"
              onDrop={(e) => handleDropOnEmpty(e, colIndex)}
              onDragOver={handleDragOver}
            >
              {colItems.map((item, index) => ( //Iterating over each column (each array)
                <div
                  key={index} 
                  onDrop={(e) => handleDropOnExisting(e, colIndex, index)}
                  onDragOver={handleDragOver}
                  className="item-container"
                >
                  <DraggableItem
                    item={item}
                    colIndex={colIndex}
                    index={index}
                    onDragStart={handleDragStart}
                    updateAttachments={updateAttachments}
                    updateItemField={updateItemField}
                  />
                </div>
              ))}
            </div>
  
          </div>
        ))}
      </div>
    );
  };
  


  export default DroppableZone;