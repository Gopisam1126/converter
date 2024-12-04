/* eslint-disable no-unused-vars */
import { useState } from "react";
import Header from "../components/header";
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import DoubleArrowIcon from '@mui/icons-material/DoubleArrow';
import ImageIcon from '@mui/icons-material/Image';
import "../compStyles/imgType.css";
import axios from "axios"
function ImageTypeConverter() {

    const [isOpen, setIsOpen] = useState(false);
    const [format, setFormat] = useState('jpeg');
    const [fileName, setFileName] = useState(null);
    const [selFileType, setSelFileType] = useState(null);
    const [file, setFile] = useState(null)
    const [previewImage, setPreviewImage] = useState(null);
    const [convertedImage, setConvertedImage] = useState(null);
    const [message, setMessage] = useState('')

    const options = [
        { label: "JPEG", value: "jpeg" },
        { label: "PNG", value: "png" },
        { label: "WEBP", value: "webp" },
    ];
    
    function handleFormatOption(value) {
        setFormat(value)
        setIsOpen(false);
    }

    function handleOptionClick() {
        setIsOpen(!isOpen)
    }

    function handleFileChange(e) {
        const selectedFile = e.target.files && e.target.files[0];
        if (selectedFile) {
            setFile(selectedFile)
            setFileName(selectedFile.name);
            setPreviewImage(URL.createObjectURL(selectedFile));

            const fileType = selectedFile.type.split("/")[1];
            setFormat(fileType || "unknown");
            setSelFileType(fileType || "unknown");
        }
    }

    async function handleUploadAndConvert() {
        if (!file) {
            setMessage("Please Select a file to convert")
        };

        const formData = new FormData();
        formData.append("image", file);
        formData.append("format", format);

        try {
            const response = await axios.post(
                "http://localhost:3000/upload-and-convert",
                formData,
                {
                    responseType: "blob",
                }
            );
            const url = URL.createObjectURL(response.data);
            setConvertedImage(url);
        } catch (error) {
            console.error("Error during upload and conversion:", error);
            setMessage("Error Converting image, Please try again!")
        }
    }

    return <>
        <section>
            <Header/>
        </section>
        <section className="img-tc-m-sec ff-p txt-grey">
            <div className="img-tc-m-hc">
                <h3 className="img-tc-m-head">
                    Convert Images - JPEG, PNG, WEBP
                </h3>
                <p className="img-tc-desc">
                    Transform images to different file types.
                </p>
            </div>
            <div className="img-tc-form-c flex-c">
                {
                    file ? (
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
                            Select an Image
                            <input
                                type="file"
                                name="img-file"
                                className="img-file-i txt-grey"
                                onChange={handleFileChange}
                            />
                        </div>
                    )
                }
                <div className="custom-dropdown">
                    <div className={`dropdown-header ${isOpen ? 'open' : 'close'}`} onClick={handleOptionClick}>
                        {
                            format || "Select Format"
                        }
                        {
                            isOpen ? <KeyboardArrowDownIcon/> : <KeyboardArrowUpIcon/>
                        }
                        <div className="d-list">
                            {
                                isOpen && (
                                    <ul className="dropdown-list">
                                        {
                                            options.map((option, i) => (
                                                <li
                                                    key={i}
                                                    onClick={() => handleFormatOption(option.value)}
                                                    className="dropdown-item"
                                                >
                                                    {option.label}
                                                </li>
                                            ))
                                        }
                                    </ul>
                                )
                            }
                        </div>
                    </div>
                </div>
            </div>
            <div className="convert-act-c flex-c">
                {
                    previewImage && fileName ? (
                        <div className="file-filename-c">
                            <div className="prev-file-c flex-c">
                                {
                                    previewImage && (
                                        <img
                                            src={previewImage}
                                            alt="preview"
                                            className="prev-img-file"
                                        />
                                    )
                                }
                            </div>
                            <div className="sel-file-name">
                                {
                                    fileName && (
                                        <p className="file-name">
                                            {fileName}
                                        </p>
                                    )
                                }
                                <div>
                                    <p className="frmt-n">{selFileType}</p>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div>
                            <div className="default-prev-c prev-img-file">
                                <ImageIcon
                                    className="img-icon"
                                    style={{
                                        fontSize: "3rem"
                                    }}
                                />
                            </div>
                            <p className="file-name">
                                No file Selected
                            </p>
                        </div>
                    )
                }
                <div className="c-arr-icon-c">
                    <DoubleArrowIcon
                        style={{
                            fontSize: "4rem"
                        }}
                    />
                </div>
                <div className="converted-img-c">
                    {
                        convertedImage ? (
                            <div>
                                <div className="prev-file-c flex-c">
                                {
                                    convertedImage && (
                                        <img
                                            src={convertedImage}
                                            alt="converted"
                                            className="prev-img-file"
                                        />
                                    )
                                }
                                </div>
                                <div className="sel-file-name">
                                    {
                                        fileName && (
                                            <p className="file-name">
                                                {fileName}
                                            </p>
                                        )
                                    }
                                    <div>
                                        <p className="frmt-n">{format}</p>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div>
                                <div className="default-prev-c prev-img-file">
                                    <ImageIcon
                                        className="img-icon"
                                        style={{
                                            fontSize: "3rem"
                                        }}
                                    />
                                </div>
                                <p className="file-name">
                                    select a file to convert
                                </p>
                            </div>
                        )
                    }
                </div>
            </div>
        </section>
    </>
}

export default ImageTypeConverter;