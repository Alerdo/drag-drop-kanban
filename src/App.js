import React, { useEffect, useState, useRef } from 'react';
import './App.css';







const DraggableItem = ({ item, colIndex, index, onDragStart }) => {
  const [attachments, setAttachments] = useState({});
  const fileInputRef = useRef(null);

  const handleUpload = (file) => {
    if (!item?.attachments) {
      item.attachments = [];
    }

    if (item?.attachments?.length < 6) {
      const newFile = {
        id: `File ${item.attachments.length + 1}`,
        name: file.name
      };
      item.attachments.push(newFile);
      setAttachments(prev => ({ ...prev, [newFile.id]: newFile.name }));
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current.click();
  };

  return (
    <div
      className="draggable-item"
      draggable
      onDragStart={(e) => onDragStart(e, colIndex, index)}
    >
      <input value={item?.stockName || ''} disabled placeholder="Stock Name" />
      <input type="date" value={item?.createdDate || ''} disabled />
      <input type="date" value={item?.dueDate || ''} disabled />
      <input value={item?.primaryAnalyst || ''} disabled placeholder="Primary Analyst" />
      <input value={item?.secondaryAnalyst || ''} placeholder="Secondary Analyst" />

      {/* Attached Files List */}
      <div>
        <button  style={{ cursor: "default" }}>Attached Files</button>
         <ul>
         {item?.attachments?.map(({ id, name }) => (
            <li key={id}>{id}: {name}</li>
          ))}
         </ul>
      </div>

      {/* Attach New File */}
      {Object.keys(attachments).length < 6 && (
        <div>
          <button onClick={triggerFileInput}>Click to Attach File</button>
          <input 
            type="file" 
            style={{ display: 'none' }} 
            onChange={(e) => e.target.files[0] && handleUpload(e.target.files[0])}
            ref={fileInputRef} 
          />
        </div>
      )}
    </div>
  );
};







const DroppableZone = ({ columnName, columns, setColumns, handleDragStart }) => {

  const handleDropOnEmpty = (e, targetColIndex) => { // makes possible do drop the items on empty space on columns 
    e.preventDefault();
    const [sourceColIndex, sourceItemIndex] = JSON.parse(e.dataTransfer.getData('application/json'));
    const newColumns = [...columns];
    const draggedItem = newColumns[sourceColIndex][sourceItemIndex];

    newColumns[sourceColIndex].splice(sourceItemIndex, 1);
    newColumns[targetColIndex].push(draggedItem);

    setColumns(newColumns);
  };

  const handleDropOnExisting = (e, targetColIndex, targetItemIndex) => { //I will make the padding of the last element take all the height so this handler will be working instead of the .items handler
    e.preventDefault();
    e.stopPropagation(); 
    const [sourceColIndex, sourceItemIndex] = JSON.parse(e.dataTransfer.getData('application/json'));
    const newColumns = [...columns];
    const draggedItem = newColumns[sourceColIndex][sourceItemIndex];

    newColumns[sourceColIndex].splice(sourceItemIndex, 1);
    newColumns[targetColIndex].splice(targetItemIndex, 0, draggedItem);

    setColumns(newColumns);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };


  const handleAddNewCard = (colIndex) => {
    const newColumns = [...columns];
    const newCard = {
      stockName: "",
      createdDate: new Date(),
      dueDate: new Date(),
      primaryAnalyst: "",
      secondaryAnalyst: "",
      attachments: [] 
    };
    
    newColumns[colIndex].push(newCard);
    setColumns(newColumns);
  };
  

 
  return (
    <div className="columns-container">
      {columns.map((colItems, colIndex) => (
        <div key={colIndex} className="column">
          <div className="column-name">{(colIndex + 1) + ". "}{columnName[colIndex]}</div>
          {colIndex === 0 && ( <button onClick={() => handleAddNewCard(colIndex)}>+</button>)}  {/*Making sure this button shows for the first column only*/}
          <div
            className="items"
            onDrop={(e) => handleDropOnEmpty(e, colIndex)}
            onDragOver={handleDragOver}
          >
            {colItems.map((item, index) => (
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
                />
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};





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
        attachments: [] 
      },
      {
        stockName: "Apple",
        createdDate: new Date(),
        dueDate: new Date(),
        primaryAnalyst: "",
        secondaryAnalyst: "",
        attachments: [] 
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

  return (
    <div className="container">
      <h1 className='title'>Data Presentation Drag-Drop Effect</h1>
      <p className='process-screen'>Process Screen</p>
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
