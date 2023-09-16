import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';  
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


  const handleEditingDone = async () => { 
    updateItemField(colIndex, index, 'edited', true);
    try {
      const response = await axios.post(`http://localhost:3001/api/cards`, item);
      // Update the card ID or other fields from the response if needed
      item.id = response.data.id;
      console.log(item)
    } catch (error) {
      console.error("Error creating card:", error);
      // Handle error (e.g. rollback UI change, show error message, etc.)
    }
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
      await axios.put(`http://localhost:3001/api/cards/move`, {
        sourceColIndex,
        sourceItemIndex,
        targetColIndex
      });
    } catch (error) {
      console.error("Error moving card:", error);
      // Handle error (e.g. rollback UI change, show error message, etc.)
    }
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
            due_date,
            primary_analyst,
            secondary_analyst,
            stock_name,
            type,
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
          console.log(attachments)
    
          // Copy of the card format  that can be created to display the ones from the database
          const formattedCard = {
            stockName: stock_name || '',
            createdDate: new Date(createdAt),
            dueDate: due_date ? new Date(due_date) : null,
            primaryAnalyst: primary_analyst || '',
            secondaryAnalyst: secondary_analyst || '',
            attachments: attachments, 
            edited: true //these cards are already edited since they are in the database
          };
        
        
          // // Categorize the formattedCard into different columns based on its type
           switch (type) {
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
