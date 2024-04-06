let ls

browser.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.ls) {
        ls = message.ls
    } else if (message.requestData) {
        sendResponse({ ls: ls })
    }
})