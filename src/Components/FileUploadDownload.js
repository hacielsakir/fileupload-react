import React, { useState, useEffect } from "react";
import axios from "axios";

const FileUploadDownload = () => {
  const [file, setFile] = useState(null);
  const [documents, setDocuments] = useState([]);

  useEffect(() => {
    fetchDocuments();
  }, []);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleFileUpload = () => {
    const formData = new FormData();
    formData.append("file", file);

    axios
      .post("http://localhost:8080/api/upload", formData)
      .then((response) => {
        console.log(response.data);
        setFile(null);
        fetchDocuments(); // Fetch documents again after uploading a new file
      })
      .catch((error) => {
        console.error("Error uploading file:", error);
      });
  };

  const handleFileDownload = (filename) => {
    axios
      .get(`http://localhost:8080/api/download/${filename}`, { responseType: "blob" })
      .then((response) => {
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", filename);
        document.body.appendChild(link);
        link.click();
      })
      .catch((error) => {
        console.error("Error downloading file:", error);
      });
  };

  const fetchDocuments = () => {
    axios
      .get("http://localhost:8080/api/documents")
      .then((response) => {
        setDocuments(response.data);
      })
      .catch((error) => {
        console.error("Error fetching documents:", error);
      });
  };

  const handleFileDelete = (id) => {
    axios
      .delete(`http://localhost:8080/api/delete/${id}`)
      .then((response) => {
        console.log(response.data);
        fetchDocuments(); // Fetch documents again after deleting a file
      })
      .catch((error) => {
        console.error("Error deleting file:", error);
      });
  };

  return (
    <div>
      <input type="file" onChange={handleFileChange} />
      <button onClick={handleFileUpload}>Upload File</button>

      <div>
        <h3>Download Files</h3>
        {documents.map((document) => (
          <div key={document.id}>
            <span>{document.name}</span>
            <button onClick={() => handleFileDownload(document.name)}>
              Download
            </button>
            <button onClick={() => handleFileDelete(document.id)}>
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FileUploadDownload;


/*
http://localhost:8080
*/