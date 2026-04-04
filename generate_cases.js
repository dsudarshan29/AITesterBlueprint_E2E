const fs = require('fs');

const API_KEY = process.env.GROQ_API_KEY || '';

function fileToBase64(path) {
  return fs.readFileSync(path, { encoding: 'base64' });
}

async function main() {
  const promptPath = 'd:\\Testing_Project\\antigravity\\AITesterBlueprint_E2E\\Project_03_Prompt_Templates\\prompt_templates\\test_cases_creation.md';
  const img1Path = 'd:\\Testing_Project\\antigravity\\AITesterBlueprint_E2E\\Project_03_Prompt_Templates\\inputs\\Login_Page.png';
  const img2Path = 'd:\\Testing_Project\\antigravity\\AITesterBlueprint_E2E\\Project_03_Prompt_Templates\\inputs\\Login_Page_Error.png';

  const promptText = fs.readFileSync(promptPath, 'utf-8');
  const img1b64 = fileToBase64(img1Path);
  const img2b64 = fileToBase64(img2Path);

  console.log("Images loaded. Calling Groq Vision...");

  const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${API_KEY}`
    },
    body: JSON.stringify({
      model: 'llama-3.2-90b-vision-preview',
      messages: [
        { 
          role: 'user', 
          content: [
            { type: 'text', text: promptText },
            { type: 'image_url', image_url: { url: `data:image/png;base64,${img1b64}` } },
            { type: 'image_url', image_url: { url: `data:image/png;base64,${img2b64}` } }
          ]
        }
      ]
    })
  });

  if (!response.ok) {
    const text = await response.text();
    console.error("Groq API error:", text);
    process.exit(1);
  }

  const data = await response.json();
  const content = data.choices[0].message.content;

  fs.writeFileSync('d:\\Testing_Project\\antigravity\\AITesterBlueprint_E2E\\generated_test_cases.md', content);
  console.log("Successfully generated test cases at generated_test_cases.md");
}

main().catch(e => {
  console.error(e);
  process.exit(1);
});
