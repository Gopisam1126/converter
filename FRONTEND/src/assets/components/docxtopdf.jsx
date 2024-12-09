import { useState } from 'react';
import axios from 'axios';
import Header from "../components/header";
import ImageIcon from '@mui/icons-material/Image';
import "../compStyles/imgtopdf.css";

function WordtoPdfConverter() {
    const [file, setFile] = useState(null);
    const [prevImg, setPrevImg] = useState(null);
    const [fileName, setFileName] = useState(null);
    const [pdfUrl, setPdfUrl] = useState(null);

    const handleFileChange = (e) => {
        const selectedFile = e.target.files && e.target.files[0];
        if (selectedFile) {
            setFile(e.target.files[0]);
            setFileName(selectedFile.name);
            setPrevImg(URL.createObjectURL(selectedFile));
        }
    };

    const handleUploadAndConvert = async () => {
        if (!file) return;

        const formData = new FormData();
        formData.append('image', file);

        try {
            const response = await axios.post('http://localhost:3000/docx-to-pdf', formData, {
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
            <section className="img-pdf-header">
                <Header />
            </section>
            <section className='img-pdf-body-c ff-p txt-grey'>
                <div className="img-pdf-bhc">
                    <h3 className="img-pdf-mbh">
                        Convert Word files to PDFs
                    </h3>
                    <p className="img-pdf-mb-desc">
                        Transform docx files to pdf with one click.
                    </p>
                </div>
                <div className="img-pdf-pi-c flex-c">
                    {
                        prevImg && fileName ? (
                            <div className="img-fn-c">
                                <div className="prev-img">
                                    <img
                                        src={prevImg}
                                        alt="prev-img"
                                        className='sel-prev-img'
                                    />
                                </div>
                                <div className="prev-fn-c">
                                    <p className="prev-file-name">
                                        {fileName}
                                    </p>
                                </div>
                            </div>
                        ) : (
                            <div>
                                <div className='def-pi'>
                                    <ImageIcon
                                        className="img-icon"
                                        style={{
                                            fontSize: "3rem"
                                        }}
                                    />
                                </div>
                                <div className="prev-fn">
                                    <p>
                                        No file chosen
                                    </p>
                                </div>
                            </div>
                        )
                    }
                </div>
                <div className="img-pdf-act flex-c">
                    {
                        pdfUrl ? (
                            <div className="custom-c-btn txt-grey crsr-p">
                                <button className="view-pdf-btn">
                                    <a
                                        href={`http://localhost:3000${pdfUrl}`}
                                        download
                                        className='dnld-link txt-grey'
                                        target="_blank" 
                                        rel="noopener noreferrer"
                                    >
                                        View PDF
                                    </a>
                                </button>
                            </div>
                        ) : file ? (
                            <div className="custom-c-btn txt-grey crsr-p">
                                <input
                                    type="button"
                                    value="Convert"
                                    className="img-c-i txt-grey crsr-p"
                                    onClick={handleUploadAndConvert}
                                />
                            </div>
                        ) : (
                            <div className="custom-file-btn txt-grey crsr-p">
                                Select a File
                                <input
                                    type="file"
                                    name="img-file"
                                    className="img-file-i txt-grey"
                                    onChange={handleFileChange}
                                />
                            </div>
                        )
                    }
                </div>
            </section>
        </>
    );
}

export default WordtoPdfConverter;
