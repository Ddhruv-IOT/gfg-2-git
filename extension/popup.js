document.getElementById("download").addEventListener("click", async () => {
    // Send a message to the content script to scrape data.
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      chrome.scripting.executeScript({
        target: { tabId: tabs[0].id },
        files: ["content.js"],
      });
    });
  });
  