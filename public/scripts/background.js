var noteCount = 0;
chrome.runtime.onMessage.addListener(
    (request, sender, sendResponse) => {
        switch(request.from) {
            case 'content':
                const current = localStorage["current_selection"];
                if(current && current!=='' && current.length > 2 ) {
                    const newCurrent = current + '<br>' + request.message;
                    localStorage["current_selection"] = newCurrent;
                }
                else 
                    localStorage["current_selection"] = request.message;
                noteCount++;
                chrome.browserAction.setBadgeText({ text: noteCount.toString() });
            break;
            default:

            break;
        }
    }
);