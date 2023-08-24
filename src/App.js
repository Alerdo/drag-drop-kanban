import React, { useState } from 'react';
import './App.css';

const DraggableItem = ({ item, index, onDragStart }) => {
  return (
    <div
      className="draggable-item"
      draggable
      onDragStart={(e) => onDragStart(e, index)}
    >
      {item}
    </div>
  );
};

const DroppableZone = ({ items, setItems, handleDragStart }) => {
  const handleDrop = (e, newIndex) => {
    e.preventDefault();
    const draggedIndex = Number(e.dataTransfer.getData('text'));
    const newItems = [...items];
    const draggedItem = newItems[draggedIndex];
    newItems.splice(draggedIndex, 1);
    newItems.splice(newIndex, 0, draggedItem);
    setItems(newItems);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  return (
    <div className="droppable-zone">
      {items.map((item, index) => (
        <div
          key={index}
          onDrop={(e) => handleDrop(e, index)}
          onDragOver={handleDragOver}
        >
          <DraggableItem
            item={item}
            index={index}
            onDragStart={handleDragStart}
          />
        </div>
      ))}
    </div>
  );
};

const App = () => {
  const [items, setItems] = useState(['Item 1', 'Item 2', 'Item 3']);

  const handleDragStart = (e, index) => {
    e.dataTransfer.setData('text', index);
  };

  return (
    <div className="container">
      <DroppableZone items={items} setItems={setItems} handleDragStart={handleDragStart} />
    </div>
  );
};

export default App;
