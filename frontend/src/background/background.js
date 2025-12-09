chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  if (msg.action === "FETCH_SUBTITLES") {
    const url = `http://localhost:3000/subtitles/${msg.videoId}`
    ;( async () => {
      try {
        const response = await fetch(url) 
        const data = await response.json()
        console.log(`Raw subtitles response: ${data}`)
        sendResponse({ success: true, data })
      } catch (error) {
        console.error(`An error occurred while fetching subtitles: ${error}`)
        sendResponse({ success: false, error: error.toString() })
      }
    })()
    return true 
  }
})