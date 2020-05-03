var noteCount = 0;
chrome.runtime.onMessage.addListener(
    (request, sender, sendResponse) => {
        switch(request.from) {
            case 'content':
                const current = localStorage["current_selection"];
                if(current && current!=='' && current.length > 0 ) {
                    localStorage["current_selection"] = current + '<br>' + request.message;
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