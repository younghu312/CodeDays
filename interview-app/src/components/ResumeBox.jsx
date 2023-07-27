import React, { useState } from "react";

function ResumeBox() {
    const [file, setFile] = useState(null);
    const [userText, setUserText] = useState(''); // Holds user input text
    const [responseData, setResponseData] = useState(null); // Holds server response
    const [isLoading, setIsLoading] = useState(false); // Tracks loading status

    
    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    }

    const handleTextChange = (e) => {
        setUserText(e.target.value);
    }

    const handleSubmit = async () => {
        setIsLoading(true); // Set loading to true when request starts
        const formData = new FormData();
        formData.append('file', file);
        formData.append('text', userText); // Add user text to formData

        try {
            const response = await fetch('/upload', {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            } else {
                const data = await response.json();
                setResponseData(data.content); // Set the response data in state
            }
        } catch (error) {
            console.log(error);
        } finally {
            setIsLoading(false); // Set loading to false after request finishes
        }
    }


    return (
        <div className="flex flex-col mb-10 mx-auto">
            <div className="flex justify-center items-center" style={{backgroundColor: "#EFEEEE", height: '75px'}}>Interview Simulator</div>

            <input 
                type="file"
                name="name"
                placeholder="Input Resume"
                className="p-2 bg-transparent border-2 rounded-md focus:outline-none"
                onChange={handleFileChange}
            />

            <textarea  // Use textarea for multiline text input
                placeholder="Optional Job Description"
                className="p-2 bg-transparent border-2 rounded-md focus:outline-none"
                onChange={handleTextChange}
            />
            
            <button onClick={handleSubmit} 
            className="inline-block px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring focus:ring-blue-300 mx-auto"
            >Generate Questions!</button>

            {/* Conditionally rendering loading text or server response */}
            {isLoading ? (
                <div className="mt-5">
                    <p>Loading...</p>
                </div>
            ) : responseData ? (
                <div className="mt-5">
                  <h3 className="text-xl">Interview Questions:</h3>
                  {responseData.split('\n').map((response, index) => (
                    <div key={index} className="border p-4 rounded-lg shadow-md mb-4">
                      <p className="text-lg font-bold">Question {index + 1}</p>
                      <p>{response}</p>
                    </div>
                  ))}
                </div>
              ) : null}
        </div>
    )
}

export default ResumeBox;