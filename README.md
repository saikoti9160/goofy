Install dependencies:

npm install
# or
yarn install


Add your Google AI Studio (Gemini) API key in public/background.js:

const GEMINI_API_KEY = "YOUR_API_KEY_HERE";


Build the extension:

npm run build

Load Extension in Chrome
<img width="566" height="168" alt="image" src="https://github.com/user-attachments/assets/82808807-e189-497c-a788-4ec272d94697" />


Open chrome://extensions/

Enable Developer mode (top right)

Click Load unpacked

Select the build folder inside your project

Click the Gooofy icon in Chrome toolbar

Usage

Open multiple tabs across multiple windows

Click the Gooofy popup button → "Organize with AI"

Wait for the Gemini shimmer animation (loading)

Tabs will be grouped automatically with meaningful labels

File Structure
gooofy/
├── public/
│   ├── background.js       # Chrome background service worker
│   ├── manifest.json       # Chrome extension manifest
├── src/
│   ├── App.tsx             # React popup UI
│   ├── App.css             # Styles and animations
├── package.json
└── README.md

Permissions

The extension requires the following permissions in manifest.json:

"permissions": ["tabs", "tabGroups"],
"host_permissions": ["https://generativelanguage.googleapis.com/*"]


tabs → Access all browser tabs

tabGroups → Create and update Chrome tab groups

host_permissions → Allow calling Google AI Gemini API

Technical Details

React functional components with hooks (useState)

Chrome Manifest V3 service worker (background.js)

AI prompt designed to output only valid JSON

Uses pointer-events: none on background animations to ensure buttons are clickable

Supports all windows, grouping tabs intelligently based on AI semantic understanding

Limitations

API key is currently exposed in background.js (suitable for POC/demo only)

Free Google Gemini API has rate limits

AI response may occasionally need fallback handling if parsing fails

Future Improvements

Move Gemini API call to a backend server for security

Add dynamic tab group colors based on category

Add auto-grouping on tab creation/open

Save previous group history for smarter grouping
![Uploading image.png…]()


Contributing
