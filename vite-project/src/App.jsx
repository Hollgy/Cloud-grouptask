import React, { useState, useEffect } from "react";
import "./App.css";
import AWS from "aws-sdk";

AWS.config.update({
    accessKeyId: "",
    secretAccessKey: "",
    region: "eu-north-1",
});

const s3 = new AWS.S3();

function App() {
    const [selectedFile, setSelectedFile] = useState(null);
    const [images, setImages] = useState([]);

    useEffect(() => {
        getImagesFromAllFolders(); // Fetch images from all folders
    }, []);

    const handleFileChange = (event) => {
        setSelectedFile(event.target.files[0]);
    };

    const handleUpload = () => {
        if (!selectedFile) {
            alert("Välj en fil först.");
            return;
        }

        const fileType = selectedFile.name.split(".").pop();

        const prefix = fileType || "övrigt";

        const params = {
            Bucket: "gruppfunktion", // Upload to the first bucket
            Key: `${prefix}/${selectedFile.name}`,
            Body: selectedFile,
            ContentType: selectedFile.type,
            ACL: "public-read", // Set ACL to public-read to make the file accessible
        };

        s3.upload(params, (err, data) => {
            if (err) {
                console.error("Fel vid uppladdning:", err);
            } else {
                console.log("Bilden laddades upp!:", data.Location);

                getImagesFromAllFolders(); // Fetch images from all folders again
            }
        });
    };

    const getImagesFromAllFolders = () => {
        const params = {
            Bucket: "gruppfunktion",
        };
        s3.listObjectsV2(params, (err, data) => {
            if (err) {
                console.error("Fel vid hämtning av bilder:", err);
            } else {
                const images = data.Contents.map((obj) => obj.Key);
                setImages(images); // Update state with images from all folders
            }
        });
    };

    return (
        <>
            <div className="wrapper">
                <div className="header">
                    <h1>Bröllopsbilder</h1>
                </div>
                <div className="rubrik">
                    <h1>Ladda upp din bild här</h1>
                    <div>
                        <input onChange={handleFileChange} type="file" />
                        <button onClick={handleUpload}>Ladda Upp</button>
                    </div>
                </div>
                <div className="filer">
                    <div className="bucket-2">
                        <h2>Bilder från vårat Bröllop:</h2>

                        <ul>
                            {images.map((image, index) => (
                                <li key={image}>
                                    <img
                                        src={`https://gruppfunktion.s3.eu-north-1.amazonaws.com/${image}`}
                                        alt={`Image ${index}`}
                                    />
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>
        </>
    );
}

export default App;
