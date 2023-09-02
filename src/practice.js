
import React, { useState } from 'react';
import './App.css';

const DraggableItem = ({ item, index, onDragStart }) => {
  // Item to drag 
  return (
    <div
      className="draggable-item"
      draggable
      onDragStart={(e) => onDragStart(e, index)} // On drag start, the data about the index and the data type is set to the event object
    >
      {item}
    </div>
  );
};

const DroppableZone = ({ items, setItems, handleDragStart }) => {
  
  const handleDrop = (e, newIndex) => {
    e.preventDefault();
    const draggedIndex = Number(e.dataTransfer.getData('text')); // Gets the index from the dataTransfer event that was passed from handleDragStart 
    const newItems = [...items]; //create a new identical array 
    const draggedItem = newItems[draggedIndex]; // Actual item 
    newItems.splice(draggedIndex, 1); // Removes the item 
    newItems.splice(newIndex, 0, draggedItem); // newIndex is where the item will be dropped index of the [2, 3,  (on index 3 put item 1)]
    setItems(newItems);  // Set the state of the app into this new array
  };
  
  const handleDragOver = (e) => {
    e.preventDefault();
  }

  return (
    <div className="droppable-zone">
      {items.map((item, index) => (
        <div
          key={index} // Index of each dropping area div 
          onDrop={(e) => handleDrop(e, index)} // This is dropping area so it handles the dropping
          onDragOver={handleDragOver}
          className='item-container'
        >
          <DraggableItem
            item={item}
            index={index} // The index is kept because on the new array, newItems, the index would be the index of the initial array in order to get the actual item
            onDragStart={handleDragStart}
          />
        </div>
      ))}
    </div>
  );
};

const App = () => {
  const [items, setItems] = useState(['Data 1 ', 'More Data 2', 'Other Data 3']);

  const handleDragStart = (e, index) => {
    e.dataTransfer.setData('text', index);
  };

  return (
    <div className="container">
      <h1>Data Presentation Drag-Drop Effect</h1>
      <p>Process Screen</p>
      <DroppableZone items={items} setItems={setItems} handleDragStart={handleDragStart} />
    </div>
  );
};

export default App;