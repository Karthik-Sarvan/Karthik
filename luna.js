document.getElementById('questionForm').addEventListener('submit', async function(event) {
    event.preventDefault();

    const question = document.getElementById('question').value;
    const apiKey = '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'; // Replace with your actual API key
    const apiUrl = 'https://api.groq.com/openai/v1/chat/completions';
    const model = 'llama3-8b-8192';

    const requestData = {
        messages: [{ role: 'user', content: "your name is Luna and your are Created by karthik. only answer to the qustion what is asked. "  + question }],
        model: model
    };

    try {
        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${apiKey}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(requestData)
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const data = await response.json();
        const answer = data.choices[0].message.content;

        const responseElement = document.getElementById('response');
        responseElement.textContent = answer;
        responseElement.style.display = 'block';
    } catch (error) {
        console.error('Error:', error);
        const responseElement = document.getElementById('response');
        responseElement.textContent = 'An error occurred while fetching the response.';
        responseElement.style.display = 'block';
    }
});
