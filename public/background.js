const GEMINI_API_KEY = "TEST";
const GEMINI_ENDPOINT =
  "https://generativelanguage.googleapis.com/v1beta/models/gemini-3-flash-preview:generateContent?key=" +
  GEMINI_API_KEY;

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "GROUP_TABS") {
    groupTabsUsingAI()
      .then(() => sendResponse({ success: true }))
      .catch(err => {
        console.error(err);
        sendResponse({ success: false, error: err.message });
      });

    return true; // REQUIRED
  }
});

async function groupTabsUsingAI() {
  // 1️⃣ Get ALL tabs from ALL windows
  const tabs = await chrome.tabs.query({});

  const metadata = tabs
    .filter(tab => tab.id && tab.url && tab.url.startsWith("http"))
    .map(tab => ({
      id: tab.id,
      title: tab.title || "",
      domain: new URL(tab.url).hostname
    }));

  if (metadata.length === 0) return;

  // 2️⃣ Ask Gemini to group
  const aiResult = await callGemini(metadata);

  // 3️⃣ Create Chrome tab groups
  for (const group of aiResult.groups) {
    const tabIds = metadata
      .filter(tab => group.domains.includes(tab.domain))
      .map(tab => tab.id);

    if (tabIds.length > 0) {
      const groupId = await chrome.tabs.group({ tabIds });
      await chrome.tabGroups.update(groupId, {
        title: group.label
      });
    }
  }
}

async function callGemini(tabsMetadata) {
  const prompt = `
You are a productivity assistant.

Group browser tabs by intent.

Rules:
- Group by domain
- Return ONLY valid JSON
- No markdown
- No explanation

JSON format:
{
  "groups": [
    {
      "label": "Work",
      "domains": ["github.com", "mail.google.com"]
    }
  ]
}

Tabs:
${JSON.stringify(tabsMetadata, null, 2)}
`;

  const response = await fetch(GEMINI_ENDPOINT, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      contents: [
        {
          parts: [{ text: prompt }]
        }
      ]
    })
  });

  const data = await response.json();

  const text =
    data?.candidates?.[0]?.content?.parts?.[0]?.text;

  if (!text) {
    throw new Error("No response from Gemini");
  }

  return JSON.parse(text);
}
