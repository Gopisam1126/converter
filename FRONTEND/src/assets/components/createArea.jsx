import "../compStyles/createArea.css";
import ImageIcon from '@mui/icons-material/Image';
function CreateArea() {
    return <>
        <section className="ca-main-sec ff-p">
            <div className="main-head-desc-s">
                <h3 className="main-ca-head">
                    The best tools for Education and and Buisness
                </h3>
                <p className="main-ca-desc">
                    Every tools to make your life easier at your disposal.
                </p>
            </div>
            <div className="ca-m-body">
                <div className="b-t-item crsr-p transition">
                    <ImageIcon style={{
                        fontSize: "3rem"
                    }}/>
                    <h5 className="b-t-head l">Image Type Converter</h5>
                    <span className="b-t-desc">
                        Convet your image to any type such as JPEG, JPG, PNG, WEBP.
                    </span>
                </div>
            </div>
        </section>
    </>
}

export default CreateArea;