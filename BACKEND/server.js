import express from "express";
import multer from "multer";
import sharp from "sharp";
import cors from "cors";

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

const storage = multer.memoryStorage();
const upload = multer({ storage });

app.post("/upload-and-convert", upload.single("image"), async (req, res) => {
    const { format } = req.body;
    console.log("format : ", format);
    
    const { buffer } = req.file;
    console.log("Buffer : ", buffer);
    

    try {
        const convertedImage = await sharp(buffer).toFormat(format).toBuffer();
        console.log("converted file : ", convertedImage);
        

        res.set("Content-Type", `image/${format}`);
        res.send(convertedImage);
    } catch (error) {
        console.error("Error during conversion:", error);
        res.status(500).send("Image conversion failed.");
    }
});

app.listen(port, () => {
    console.log(`Server running at port ${port}`);
});
