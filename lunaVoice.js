let mediaRecorder;
let audioChunks = [];



async function startRecording() {
    document.querySelector(".start").style.display = 'none'
    document.querySelector(".stop").style.display = 'flex';
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    mediaRecorder = new MediaRecorder(stream);

    mediaRecorder.ondataavailable = event => {
        audioChunks.push(event.data);
    };

    mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunks, { type: 'audio/mp3' });
        const audioFile = new File([audioBlob], "recording.mp3", { type: 'audio/mp3' });

        const formData = new FormData();
        formData.append('audio', audioFile);

        uploadAudio(formData);
    };

    mediaRecorder.start();

    
    recordButton.disabled = true;
    recordButton.classList.add('active');
    stopButton.disabled = false;
    
   
}

function stopRecording() {
    document.querySelector(".start").style.display = 'flex'
    document.querySelector(".stop").style.display = 'none';
    mediaRecorder.stop();

    const recordButton = document.querySelector('.record-button');
    const stopButton = document.querySelector('.stop-button');

    recordButton.disabled = false;
    recordButton.classList.remove('active');
    stopButton.disabled = true;
    
}

async function uploadAudio(formData) {
    try {
        const response = await fetch('https://luna-voice.vercel.app/transcribe', {
            method: 'POST',
            body: formData
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const result = await response.json();
        const responseText = result.response;

        // Display the response
        const messageElement = document.createElement('p');
        messageElement.className = 'user';
        messageElement.innerText = responseText;
        document.querySelector('.messages').appendChild(messageElement);

        // Speak out the response
        speakText(responseText);
    } catch (error) {
        const errorElement = document.createElement('p');
        errorElement.className = 'user';
        errorElement.innerText = `Error: ${error.message}`;
        document.querySelector('.messages').appendChild(errorElement);
    } finally {
        // Clear audio chunks and reset form after upload
        audioChunks = [];
    }
}

function speakText(text) {
    const utterance = new SpeechSynthesisUtterance(text);
    window.speechSynthesis.speak(utterance);
}
