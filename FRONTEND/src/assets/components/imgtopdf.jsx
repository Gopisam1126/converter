import { useState } from 'react';
import axios from 'axios';
import Header from "../components/header";

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
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            const { downloadLink } = response.data;

            setPdfUrl(downloadLink);
        } catch (error) {
            console.error('Error during upload and conversion:', error);
        }
    };

    return (
        <>
            <div className="img-pdf-header">
                <Header />
            </div>
            <div>
                <input type="file" onChange={handleFileChange} />
                <button onClick={handleUploadAndConvert}>Convert to PDF</button>

                {pdfUrl && (
                    <div>
                        <a href={`http://localhost:3000${pdfUrl}`} download>
                            Download Converted PDF
                        </a>
                    </div>
                )}
            </div>
        </>
    );
}

export default ImageToPdfConverter;
