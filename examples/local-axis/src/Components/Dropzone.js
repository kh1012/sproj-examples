import React, { useState } from 'react';

const FolderUpload = () => {
  const [selectedFolder, setSelectedFolder] = useState(null);

  const handleFolderSelect = (event) => {
    const folder = event.target.files[0];
    setSelectedFolder(folder);
  };

  const handleUpload = () => {
    // Perform upload logic here
    // You can access the selected folder using the `selectedFolder` state variable
    console.log(selectedFolder);
  };

  return (
    <div>
      <input type="file" webkitdirectory="true" mozdirectory="true" onChange={handleFolderSelect} />
      <button onClick={handleUpload}>Upload</button>
    </div>
  );
};

export default FolderUpload;
