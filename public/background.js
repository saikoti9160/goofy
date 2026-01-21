
// Change this to your deployed URL (e.g. https://your-app.vercel.app)
const BACKEND_URL = "https://gemini-backend-9wlr.vercel.app/api/group-tabs";

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "GROUP_TABS") {
    groupTabsUsingAI()
      .then(() => sendResponse({ success: true }))
      .catch(err => {
        console.error(err);
        sendResponse({ success: false, error: err.message });
      });
    return true; 
  }
});

async function groupTabsUsingAI() {
  const tabs = await chrome.tabs.query({});
  const metadata = tabs
    .filter(tab => tab.id && tab.url && tab.url.startsWith("http"))
    .map(tab => ({
      id: tab.id,
      title: tab.title || "",
      domain: new URL(tab.url).hostname
    }));

  if (metadata.length === 0) return;

  const aiResult = await callBackend(metadata);

  for (const group of aiResult.groups) {
    const tabIds = metadata
      .filter(tab => group.domains.includes(tab.domain))
      .map(tab => tab.id);

    if (tabIds.length > 0) {
      const groupId = await chrome.tabs.group({ tabIds });
      await chrome.tabGroups.update(groupId, { title: group.label });
    }
  }
}

async function callBackend(tabsMetadata) {
  const prompt = `
    You are a productivity assistant. Group browser tabs by intent.
    Rules: Group by domain. Return ONLY valid JSON. No markdown. No explanation.
    JSON format: {"groups": [{"label": "Work", "domains": ["github.com"]}]}
    Tabs: ${JSON.stringify(tabsMetadata)}
  `;

  const response = await fetch(BACKEND_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ prompt })
  });

  if (!response.ok) throw new Error("Backend server error");
  
  return await response.json();
}
