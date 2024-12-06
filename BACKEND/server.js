import express from "express";
import multer from "multer";
import sharp from "sharp";
import {PDFDocument} from "pdf-lib";
import cors from "cors";
import { fileURLToPath } from 'url';
import path from "path";
import fs from "fs";

const app = express();
const port = 3000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(cors());
app.use(express.json());

const storage = multer.memoryStorage();
const upload = multer({ storage });

const downloadDir = path.join(__dirname, "downloads");
if (!fs.existsSync(downloadDir)) {
  fs.mkdirSync(downloadDir);
}

app.use('/downloads', express.static(downloadDir));

// endpoint to convert image to different formats
app.post("/convert", upload.single("image"), async (req, res) => {
    const { format } = req.body;
    const { buffer } = req.file;

    try {
        // convert image to selected format
        const convertedImage = await sharp(buffer).toFormat(format).toBuffer();
        res.set("Content-Type", `image/${format}`);
        res.send(convertedImage);
    } catch (error) {
        console.error("Error during conversion:", error);
        res.status(500).send("Image conversion failed.");
    }
});

// endpoint to convert image to pdf using pdf-lib
app.post('/convert-to-pdf', upload.single('image'), async (req, res) => {
    const { mimetype, buffer } = req.file;

    if (!['image/jpeg', 'image/png'].includes(mimetype)) {
        return res.status(400).send('Invalid file type. Only JPEG and PNG are allowed.');
    }

    try {
        console.log('Received file with mimetype:', mimetype);
        console.log('Buffer length:', buffer.length);

        const isValidImage = await sharp(buffer).metadata()
            .then(() => true)
            .catch((error) => {
                console.error('Error validating image:', error);
                return false;
            });

        if (!isValidImage) {
            return res.status(400).send('Invalid or corrupted image file.');
        }

        const imageBuffer = await sharp(buffer)
            .resize({ width: 600 })  // Resize image to fit into the PDF
            .toBuffer();

        const pdfDoc = await PDFDocument.create();
        console.log("pdfFoc : ",pdfDoc);
        
        const page = pdfDoc.addPage([600, 800]); // A4
        console.log("page : ", page);
        
        console.log('Image buffer for PDF:', imageBuffer.length);

        // Embed the image based on its type
        let image;
        if (mimetype === 'image/jpeg') {
            image = await pdfDoc.embedJpg(imageBuffer);
        } else if (mimetype === 'image/png') {
            image = await pdfDoc.embedPng(imageBuffer);
        }

        console.log("image : ", image);

        const { width, height } = image.scale(1);
        console.log("Width : ", width);
        console.log("Height : ", height);
        

        // Draw the image onto the page
        page.drawImage(image, {
            x: (page.getWidth() - width) / 2,
            y: (page.getHeight() - height) / 2,
            width,
            height
        });

        const pdfBytes = await pdfDoc.save();
        console.log("pdf Bytes : ", pdfBytes);
        

        // res.setHeader('Content-Type', 'application/pdf');
        // res.setHeader('Content-Disposition', 'attachment; filename=converted.pdf');

        // Send the PDF as the response
        // res.send(pdfBytes);

        // Save the PDF to a file on the server
        const fileName = `converted_${Date.now()}.pdf`;
        console.log("filename : ", fileName);
        
        const filePath = path.join(__dirname, 'downloads', fileName);
        console.log("file path : ", filePath);
        

        fs.writeFileSync(filePath, pdfBytes);

        // Provide a download link for the generated PDF
        const downloadLink = `/downloads/${fileName}`;
        console.log("download Link : ", downloadLink);
        

        // Respond with the download link
        res.status(200).json({
            message: 'PDF converted successfully!',
            downloadLink
        });

    } catch (error) {
        console.error('Error during image to PDF conversion:', error);
        res.status(500).send('Error during image conversion to PDF.');
    }
});


app.post("/register", async (req, res) => {
    const {firstname, lastname, setusername, setpass} = req.body;

    try {
        const userExists = await pg.query("SELECT username FROM users WHERE username = $1", [setusername]);

        if (userExists.rows.length > 0) {
            return res.status(400).json({error: "User Already Exists, Please Login!"});
        }

        const hashPass = await bcrypt.hash(setpass, 10);

        const insertQ = await pg.query("INSERT INTO users (username, password, firstname, lastname) VALUES ($1, $2, $3, $4)", [setusername, hashPass, firstname, lastname]);

        if (!insertQ) {
            console.log("Error Registering user!");
        }
        res.status(201).json({ message: "User registered successfully" });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Cannot register Account. PLease try again!" });
    }
})

app.post("/login", async (req, res) => {
    const {username, pass} = req.body;

    try {
        const user = await pg.query("SELECT id, username, password FROM users WHERE username = $1", [username]);

        

        if (user.rows.length === 0) {
            return res.status(400).json({error: "Invalid Username!"});
        }

        const match = await bcrypt.compare(pass, user.rows[0].password);

        if (!match) {
            return res.status(400).send({error: "Incorrect Password!"});
        }

        const token = jwt.sign({username: user.rows[0].username, user_id: user.rows[0].id}, SECRET_KEY);

        res.status(200).json({message: "Login Successful.", token, username});

    } catch (error) {
        res.status(500).json({ message: "Error Logging in, PLease try again" });
    }
});

app.listen(port, () => {
    console.log(`Server running at port ${port}`);
});
