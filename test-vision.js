import fetch from 'node-fetch';

async function testVision() {
  const testImage = "https://i.ibb.co/LdHXb6D9/file-00000000ac1c72088112237cbb0c9f5b.png";
  
  try {
    const imgResponse = await fetch(testImage);
    const arrayBuffer = await imgResponse.arrayBuffer();
    const base64Img = Buffer.from(arrayBuffer).toString('base64');

    console.log('Sending request to local Ollama (Llava)...');
    const response = await fetch('http://localhost:11434/api/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'llava:latest',
        prompt: "You are a specialized medical OCR assistant. Read the handwritten text in this image. Here is our product catalog: Paracetamol, Ibuprofen, Aspirin, Diclofenac, Combiflam, Azithromycin, Amoxicillin, Cefixime, Ofloxacin. Only list the names of the medications you can read that are found in this catalog, one per line. Do not include any other text.",
        images: [base64Img],
        stream: false
      }),
    });
    
    console.log('Status:', response.status);
    const data = await response.json();
    console.log('Llava AI Response:\n', data.response);
  } catch (error) {
    console.error('Error:', error);
  }
}

testVision();
