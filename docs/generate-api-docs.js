const fs = require('fs');
const path = require('path');

const srcDir = './src/app/api/v1';
const outputFile = 'docs/API.md';

const timestamp = new Date().toLocaleString('en-US', { month: 'long', year: 'numeric' });
let content = `# SwagSticker API\n\n> _Last updated: ${timestamp}_\n\n`;

// Function to extract and format JSDoc comments
function extractComments(filePath) {
  const fileContent = fs.readFileSync(filePath, 'utf8');

  // Match JSDoc block (/** ... */)
  const commentMatch = fileContent.match(/\/\*\*\s*\n([\s\S]*?)\s*\*\//);
  if (!commentMatch) return;

  const commentContent = commentMatch[1];

  // Extract tags from JSDoc
  const routeMatch = commentContent.match(/@route\s+([A-Z]+)\s+([^\n]+)/);
  const descMatch = commentContent.match(/@description\s+([^\n]+)/);
  const authMatch = commentContent.match(/@auth\s+required/);
  const requestMatch = commentContent.match(/@request\s+{([^}]+)}\s+([^\n]+)/);
  const responseMatches = [...commentContent.matchAll(/@response\s+{(\d+)}\s+([^\n]+)/g)];

  if (routeMatch) {
    const [_, method, endpoint] = routeMatch;

    content += `### ${method} ${endpoint.trim()}\n\n`;

    if (authMatch) {
      content += `**Authentication Required** 🔒  \n`;
    }

    if (descMatch) {
      content += `${descMatch[1].trim()}\n\n`;
    }

    if (requestMatch) {
      const [_, type, description] = requestMatch;
      content += `**Request**:\n\`\`\`json\n${description.trim()}\n\`\`\`\n\n`;
    }

    if (responseMatches.length) {
      content += `**Response**:\n`;
      responseMatches.forEach(([_, status, response]) => {
        content += `- **${status}**:\n\`\`\`json\n${response.trim()}\n\`\`\`\n`;
      });
    }

    content += `\n---\n\n`;
  }
}

// Recursively process all .ts files
function processDirectory(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      processDirectory(fullPath);
    } else if (entry.name.endsWith('.ts') && !entry.name.includes('.test')) {
      extractComments(fullPath);
    }
  }
}

processDirectory(srcDir);

fs.writeFileSync(outputFile, content.trim() + '\n');
console.log('Generated API.md from JSDoc comments');
