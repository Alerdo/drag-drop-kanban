import React, { useEffect, useState, useRef } from 'react';
import './App.css';





const DraggableItem = ({ item, colIndex, index, onDragStart, updateAttachments, updateItemField }) => {

  
  const [showAttachments, setShowAttachments] = useState(false);
  const fileInputRef = useRef(null);

  const handleUpload = (file) => {
    if (item.attachments.length < 6) {
        const reader = new FileReader();
        reader.onloadend = () => {
            const truncatedName = file.name.length > 20 ? file.name.substring(0, 20) + "..." : file.name;

            const newFile = {
                id: `File ${item.attachments.length + 1}`,
                name: truncatedName,
                data: reader.result  // This is the Data URL
            };
            updateAttachments(colIndex, index, [...item.attachments, newFile]);
        }
        reader.readAsDataURL(file);
    }
};


  const handleDeleteAttachment = (attachmentIndex) => {
    const updatedAttachments = item.attachments.filter((_, idx) => idx !== attachmentIndex);
    updateAttachments(colIndex, index, updatedAttachments);
  };

  const handleChange = (field, value) => {
    updateItemField(colIndex, index, field, value);
  };

  const triggerFileInput = () => {
    fileInputRef.current.click();
  };

  const formatDate = (date) => {
    const dd = String(date.getDate()).padStart(2, '0');
    const mm = String(date.getMonth() + 1).padStart(2, '0'); 
    const yyyy = date.getFullYear();
    return yyyy + '-' + mm + '-' + dd;
  }


  const handleEditingDone = () => { 
    updateItemField(colIndex, index, 'edited', true);
  };

  return (
    <div className="draggable-item" draggable onDragStart={(e) => onDragStart(e, colIndex, index)}>
      <div className="label-input-group stock-name">
        <label>Stock Name:</label>
        <input 
          value={item?.stockName || ''}
          onChange={(e) => handleChange('stockName', e.target.value)}
          disabled={item.edited}
          placeholder="Stock Name" />
      </div>

      <div className="label-input-group">
        <label>Created Date:</label>
        <input 
            type="date"
            value={formatDate(new Date(item?.createdDate))}
            disabled={item.edited}
            onChange={(e) => handleChange('createdDate', e.target.value)}
        />
      </div>

      <div className="label-input-group due-date">
        <label>Due Date:</label>
        <input 
            type="date"
            value={formatDate(new Date(item?.dueDate))}
            disabled={item.edited}
            onChange={(e) => handleChange('dueDate', e.target.value)}
        />
      </div>

      <div className="label-input-group">
        <label>Primary Analyst:</label>
        <input 
          value={item?.primaryAnalyst || ''}
          onChange={(e) => handleChange('primaryAnalyst', e.target.value)}
          disabled={item.edited}
          placeholder="Primary Analyst" 
        />
      </div>

      <div className="label-input-group">
        <label>Secondary Analyst:</label>
        <input 
          value={item?.secondaryAnalyst || ''}
          onChange={(e) => handleChange('secondaryAnalyst', e.target.value)}
          placeholder="Secondary Analyst" 
        />
      </div>

      {!item.edited && (
        <button onClick={handleEditingDone}>Done Editing</button>
      )}

      <div>
        <button style={{ cursor: 'pointer' }} onClick={() => setShowAttachments(!showAttachments)}>
          {showAttachments ? 'Hide' : 'Show'} Attached Files
        </button>
        {showAttachments && (
          <>
            <ul>
        {item.attachments.map(({ id, name, data }, attachmentIndex) => (
          <li key={id}>
            <a href={data} download={name}>{id}: {name}</a> {/* This allows downloading the file */}
            { (
              <button onClick={() => handleDeleteAttachment(attachmentIndex)}>Delete</button>
            )}
          </li>
        ))}
      </ul>



            { item.attachments.length < 6 && (
              <div>
                <button onClick={triggerFileInput}>Click to Add Files</button>
                <input
                  type="file"
                  style={{ display: 'none' }}
                  onChange={(e) => e.target.files[0] && handleUpload(e.target.files[0])}
                  ref={fileInputRef}
                />
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

 /* FINISH DRAGABLE ITEM  */





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

 

  const handleAddNewCard = (colIndex) => {
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


  const updateAttachments = (colIndex, itemIndex, newAttachments) => {
    setColumns(prevColumns => {
        const updatedColumns = [...prevColumns];
        updatedColumns[colIndex][itemIndex].attachments = newAttachments;
        return updatedColumns;
    });
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
          {colIndex === 0 && ( <button onClick={() => handleAddNewCard(colIndex)}>+</button>)}  {/*Making sure this button shows for the first column only*/}
          
          
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
