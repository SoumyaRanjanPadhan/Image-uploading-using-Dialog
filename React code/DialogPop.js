import React, { useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, LinearProgress } from '@mui/material';
import { styled } from '@mui/material/styles';
import axios from 'axios';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { getLoggedInUser } from '../helper';
import { useNavigate } from 'react-router-dom';
const VisuallyHiddenInput = styled('input')({
    clip: 'rect(0 0 0 0)',
    clipPath: 'inset(50%)',
    height: 1,
    overflow: 'hidden',
    position: 'absolute',
    bottom: 0,
    left: 0,
    whiteSpace: 'nowrap',
    width: 1,
  });
  
const DialogPop = ({ open, onClose, onFileUpload }) => {
    const [selectedFile, setSelectedFile] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [selectedFileName, setSelectedFileName] = useState('');
    const navigate=useNavigate();
    const user=getLoggedInUser();
    const id=user.id;
    
    const handleFileChange = (event) => {
        const file=(event.target.files[0]);
        setSelectedFile(file);
        if (file) {
            setSelectedFileName(file.name);
            
          }
    };

    const handleUpload = async () => {
        setUploading(true);

        try {
            const formData = new FormData();
            formData.append('file', selectedFile);
            formData.append('objectType', 'Image'); // Replace with your actual object type
            formData.append('objectId', 1); // Replace with your actual object id

            const response = await axios.post(`http://localhost:9090/file/${id}/upload`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            onFileUpload(response.data);
            
        } catch (error) {
            console.error('Error uploading file:', error);
        } finally {
            setUploading(false);
            onClose();
        }
    };

    return (
        <Dialog open={open} onClose={onClose}>
            <DialogTitle>Upload File</DialogTitle>
            <DialogContent>
            <Button onChange={handleFileChange} component="label" variant="contained" startIcon={<CloudUploadIcon />}>
               Upload file
              <VisuallyHiddenInput type="file" />
            </Button>
                
                {selectedFileName && <p>Selected File: {selectedFileName}</p>}
                {uploading && <LinearProgress />}
            </DialogContent>
            <DialogActions>
                <Button color='error'onClick={onClose}>Cancel</Button>
                <Button color='primary' onClick={handleUpload} disabled={!selectedFile || uploading}>
                    Upload
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default DialogPop;
