const fs = require('fs');

// Placeholders for credentials
const JIRA_DOMAIN = 'dsudarshan29.atlassian.net';
const JIRA_EMAIL = process.env.JIRA_EMAIL || 'd.sudarshan29@gmail.com';
const JIRA_API_TOKEN = process.env.JIRA_API_TOKEN || '';
const PROJECT_KEY = 'KAN';

async function uploadTestCases() {
  if (JIRA_EMAIL === 'YOUR_EMAIL_HERE') {
    console.error("Please provide your Jira Email Address!");
    process.exit(1);
  }

  // Read the markdown test cases
  const filePath = 'd:\\Testing_Project\\antigravity\\AITesterBlueprint_E2E\\generated_jira_testcases.md';
  const mdContent = fs.readFileSync(filePath, 'utf-8');

  console.log(`Uploading test cases to ${JIRA_DOMAIN} for project ${PROJECT_KEY}...`);

  const authString = Buffer.from(`${JIRA_EMAIL}:${JIRA_API_TOKEN}`).toString('base64');

  // Payload for Jira v3 API (ADF format) or v2 API
  // Jira v2 accepts direct markdown/wiki text in fields if formatted properly, 
  // but let's use standard v2 endpoint with string description (Jira auto-converts some, but markdown table works as text).
  
  const payload = {
    fields: {
      project: {
        key: PROJECT_KEY
      },
      summary: 'Login Page Test Cases',
      description: mdContent,
      issuetype: {
        name: 'Task' // Using default Task type
      }
    }
  };

  try {
    const res = await fetch(`https://${JIRA_DOMAIN}/rest/api/2/issue`, {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${authString}`,
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    if (!res.ok) {
      const errText = await res.text();
      console.error(`Jira API Error: ${res.status} ${res.statusText}`);
      console.error(errText);
      process.exit(1);
    }

    const data = await res.json();
    console.log(`Success! Created Jira Issue: ${data.key}`);
    console.log(`View it here: https://${JIRA_DOMAIN}/browse/${data.key}`);
    
  } catch (err) {
    console.error("Fetch failed:", err);
  }
}

uploadTestCases();
