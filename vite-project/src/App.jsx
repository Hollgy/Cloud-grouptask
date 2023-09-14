import React, { useState, useEffect } from 'react';
import './App.css';
import AWS from 'aws-sdk';

AWS.config.update({
    accessKeyId: 'AKIAQ4EYTWD2PIOM4YOW',
    secretAccessKey: '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',
    region: 'eu-north-1',
});

const s3 = new AWS.S3();

function App() {
    const [selectedFile, setSelectedFile] = useState([]);
    const [images, setImages] = useState([]);
    const [folders, setFolders] = useState([]);
    const [currentFolder, setCurrentFolder] = useState(null);

    useEffect(() => {
        getFolders(); // Fetch folders from the second bucket
    }, []);

    const handleFileChange = (event) => {
        setSelectedFile(event.target.files[0]);
    };

    const handleUpload = () => {
        if (!selectedFile) {
            alert('Välj en fil först.');
            return;
        }

        const params = {
            Bucket: 'gruppfunktion', // Upload to the first bucket
            Key: selectedFile.name,
            Body: selectedFile,
            ContentType: selectedFile.type,
            ACL: 'public-read', // Set ACL to public-read to make the file accessible
        };

        s3.upload(params, (err, data) => {
            if (err) {
                console.error('Fel vid uppladdning:', err);
            } else {
                console.log('Bilden laddades upp!:', data.Location);
                // No need to refresh images, as they are now in the first bucket
            }
        });
    };

    const getFolders = () => {
        const params = {
            Bucket: 'grupparbetestoragebucket', // Fetch folders from the second bucket
        };

        s3.listObjectsV2(params, (err, data) => {
            if (err) {
                console.error('Fel vid hämtning av mappar:', err);
            } else {
                const folders = data.CommonPrefixes.map((prefix) => prefix.Prefix);
                setFolders(folders); // Update state with folders
            }
        });
    };

    const getImagesInFolder = (folder) => {
        const params = {
            Bucket: 'grupparbetestoragebucket', // Fetch images from the second bucket
            Prefix: folder, // Set the folder as the prefix to get images in that folder (without leading slash)
        };

        s3.listObjectsV2(params, (err, data) => {
            if (err) {
                console.error('Fel vid hämtning av bilder:', err);
            } else {
                const images = data.Contents.map((obj) => obj.Key);
                setImages(images); // Update state with images in the folder
                setCurrentFolder(folder); // Store the currently selected folder
            }
        });
    };

    return (
        <>
            <h1>Ladda upp din bild här</h1>
            <div>
                <input onChange={handleFileChange} type="file" />
                <button onClick={handleUpload}>Ladda Upp</button>
            </div>
            <h2>Mappar i S3-bucket:</h2>
            <ul>
                {folders.map((folder, index) => (
                    <li key={folder}>
                        <a href={`https://grupparbetestoragebucket.s3.eu-north-1.amazonaws.com/${folder}`} onClick={() => getImagesInFolder(folder)}>{folder}</a>
                    </li>
                ))}
            </ul>

            <h2>Bilder i S3-bucket:</h2>
            <ul>
                {images.map((image, index) => (
                    <li key={image}><img src={`https://grupparbetestoragebucket.s3.eu-north-1.amazonaws.com/${currentFolder}/${image}`} alt={`Image ${index}`} /></li>
                ))}
            </ul>
        </>
    );
}

export default App;