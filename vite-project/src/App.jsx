import React, { useState } from 'react';
import './App.css';
import AWS from 'aws-sdk';
import { useEffect } from 'react';

AWS.config.update({
    accessKeyId: '',
    secretAccessKey: '',
    region: 'eu-north-1',
});

const s3 = new AWS.S3();

function App() {
    const [selectedFile, setSelectedFile] = useState([])
    const [images, setImages] = useState(null)

    useEffect(() => {
        getImages()
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
            Bucket: 'gruppfunktion',
            Key: selectedFile.name,
            Body: selectedFile,
        };

        s3.upload(params, (err, data) => {
            if (err) {
                console.error('Fel vid uppladdning:', err);
            } else {
                console.log('Bilden laddades upp!:', data.Location);

                setImages((prevImages) => [...prevImages, selectedFile.name])
            }
        });
    };

    const getImages = () => {
        const params = {
            Bucket: 'gruppfunktion',
        };

        s3.listObjectsV2(params, (err, data) => {
            if (err) {
                console.error('Fel vid hämtning av bilder:', err);
            } else {

                const imageList = data.Contents.map((obj) => obj.Key);
                setImages(imageList);
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
        </>
    )
}

export default App
