import { useState } from "react";
import Header from "../components/header";
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import "../compStyles/imgType.css";
function ImageTypeConverter() {

    const [isOpen, setIsOpen] = useState(false);
    const [format, setFormat] = useState('jpeg');
    const [fileName, setFileName] = useState(null);
    const [previewImage, setPreviewImage] = useState(null);

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
        const file = e.target.files && e.target.files[0];
        if (file) {
            setFileName(file.name);
            setPreviewImage(URL.createObjectURL(file));

            const fileType = file.type.split("/")[1];
            setFormat(fileType || "unknown");
            console.log(fileType);
            
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
                <form>
                    <div className="custom-file-btn txt-grey crsr-p">
                        Select an Image
                        <input
                            type="file"
                            name="img-file"
                            className="img-file-i txt-grey"
                            onChange={handleFileChange}
                        />
                    </div>
                </form>
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
            </div>
        </section>
    </>
}

export default ImageTypeConverter;