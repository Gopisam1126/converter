import { useState } from 'react';
import axios from 'axios';

function ImageToPdfConverter() {
    const [file, setFile] = useState(null);
    const [pdfUrl, setPdfUrl] = useState(null);

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    const handleUploadAndConvert = async () => {
        if (!file) return;

        const formData = new FormData();
        formData.append('image', file);

        try {
            const response = await axios.post('http://localhost:3000/convert-to-pdf', formData, {
                responseType: 'blob',
            });

            const url = window.URL.createObjectURL(response.data);
            setPdfUrl(url);
        } catch (error) {
            console.error('Error during upload and conversion:', error);
        }
    };

    return (
        <div>
            <input type="file" onChange={handleFileChange} />
            <button onClick={handleUploadAndConvert}>Convert to PDF</button>

            {pdfUrl && (
                <div>
                    <a href={pdfUrl} download="converted-image.pdf">Download PDF</a>
                </div>
            )}
        </div>
    );
}

export default ImageToPdfConverter;
