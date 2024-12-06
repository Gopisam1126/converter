import express from "express";
import multer from "multer";
import sharp from "sharp";
import {PDFDocument} from "pdf-lib";
import cors from "cors";

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

const storage = multer.memoryStorage();
const upload = multer({ storage });

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
        const page = pdfDoc.addPage([600, 800]); // A4
        console.log('Image buffer for PDF:', imageBuffer.length);

        // Embed the image based on its type
        let image;
        if (mimetype === 'image/jpeg') {
            image = await pdfDoc.embedJpg(imageBuffer);
        } else if (mimetype === 'image/png') {
            image = await pdfDoc.embedPng(imageBuffer);
        }

        const { width, height } = image.scale(0.5);

        // Draw the image onto the page
        page.drawImage(image, {
            x: (page.getWidth() - width) / 2,
            y: (page.getHeight() - height) / 2,
            width,
            height
        });

        const pdfBytes = await pdfDoc.save();

        res.set('Content-Type', 'application/pdf');
        res.send(pdfBytes);

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
