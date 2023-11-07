import { useState, useRef } from "react";
import axios from 'axios'; 
import './App.css';
import { FaTrash, FaSyncAlt   } from 'react-icons/fa';

const DraggableItem = ({ item, colIndex, index, onDragStart, updateAttachments, updateItemField }) => {
  const [showAttachments, setShowAttachments] = useState(false);
  const fileInputRef = useRef(null);
  const [secondaryAnalyst, setSecondaryAnalyst] = useState("");
  const [customMessage, setCustomMessage] = useState("");
  const [showSuccessMessage, setShowSuccessMessage] = useState("");
  
  const [isLoading, setIsLoading] = useState(false);

  const handleUpload = (file) => {
    setIsLoading(true);
    if (item.attachments.length < 6) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const truncatedName = file.name.length > 20 ? file.name.substring(0, 20) + "..." : file.name;
        const newFile = {
          id: `File ${item.attachments.length + 1}`,
          name: truncatedName,
          data: reader.result
        };
        updateAttachments(colIndex, index, [...item.attachments, newFile]);
        setIsLoading(false);
        setShowSuccessMessage(true);
      }
      reader.readAsDataURL(file);
    } else {
      setIsLoading(false);
    }
  };

  const handleDeleteAttachment = (attachmentIndex) => {
    const updatedAttachments = item.attachments.filter((_, idx) => idx !== attachmentIndex);
    updateAttachments(colIndex, index, updatedAttachments);
  };

  const handleChange = (field, value) => {
    updateItemField(colIndex, index, field, value);
  };

  const triggerFileInput = (e) => {
    e.stopPropagation();
    fileInputRef.current.click();
};

  const formatDate = (date) => {
    const dd = String(date.getDate()).padStart(2, '0');
    const mm = String(date.getMonth() + 1).padStart(2, '0'); 
    const yyyy = date.getFullYear();
    return yyyy + '-' + mm + '-' + dd;
  };

  const handleEditingDone = async () => { 
    setIsLoading(true);
    updateItemField(colIndex, index, 'edited', true);
    try {
      const response = await axios.post(`http://localhost:3001/api/cards`, item);
      item.id = response.data.id;
      setIsLoading(false);
      setCustomMessage("Card created successfully");
      setShowSuccessMessage(true);
      
      // Hide the success message after 3 seconds
      setTimeout(() => {
        setShowSuccessMessage(false);
      }, 3000);
    } catch (error) {
      console.error("Error creating card:", error);
      setIsLoading(false);
    }
};

const handleUpdateSecondaryAnalyst = async () => {
    setIsLoading(true);
    const dataToUpdate = {
      secondary_analyst: secondaryAnalyst !== null && secondaryAnalyst !== undefined ? secondaryAnalyst : ''
    };

    try {
      const response = await axios.put(`http://localhost:3001/api/cards/${item.id}/secondaryAnalyst`, dataToUpdate);
      console.log('Secondary analyst name updated:', response.data);
      setIsLoading(false);
      setCustomMessage("Secondary analyst updated successfully");
      setShowSuccessMessage(true);

      // Hide the success message after 3 seconds
      setTimeout(() => {
        setShowSuccessMessage(false);
      }, 3000);
    } catch (error) {
      console.error('Error updating secondary analyst name:', error);
      setIsLoading(false);
    }
};

const handleDeleteCard = async () => {
    setIsLoading(true);
    try {
      await axios.delete(`http://localhost:3001/api/cards/${item.id}`);
      setIsLoading(false);
      setCustomMessage("Card deleted successfully");
      setShowSuccessMessage(true);

      // Hide the success message after 3 seconds
      setTimeout(() => {
        setShowSuccessMessage(false);
      }, 1000);

      // Refresh the page after 2 seconds
      setTimeout(() => {
        window.location.reload();
      }, 1400);
    } catch (error) {
      console.error("Error deleting card:", error);
      setIsLoading(false);
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
          onChange={(e) => {
            setSecondaryAnalyst(e.target.value);
            handleChange('secondaryAnalyst', e.target.value);
          }}
          placeholder="Secondary Analyst" 
        />

        <div className="save-icon">
          <button onClick={handleUpdateSecondaryAnalyst}>
            <FaSyncAlt />
          </button>
        </div>
      </div>
      {isLoading && <div>Loading...</div>}
      {showSuccessMessage && <div className="success-message">{customMessage}</div>}

     

      <div>
        <button
            style={{ cursor: 'pointer' }}
            onClick={() => setShowAttachments(!showAttachments)}
            className="show-attached-files-button"
        >
          {showAttachments ? 'Hide' : 'Show'} Attached Files
        </button>
        {showAttachments && (
          <>
            <ul>
              {item.attachments.map(({ id, name, data }, attachmentIndex) => (
                <li key={id}>
                  <a href={data} download={name}>{id}: {name}</a>
                  { (
                    <button onClick={() => handleDeleteAttachment(attachmentIndex)}>Delete</button>
                  )}
                </li>
              ))}
            </ul>

            {item.attachments.length < 6 && (
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
     
      <div className="create-delete-icon">
      {!item.edited && (
       <button onClick={handleEditingDone} className="don-editing-button">
       Create Card
     </button>
      )}
        <div className="deleteInfo">  <button onClick={handleDeleteCard} className="deleteButton">
            <FaTrash /> 
          </button>  <br />
        
        </div></div>
    </div>
    
);

};

export default DraggableItem;
