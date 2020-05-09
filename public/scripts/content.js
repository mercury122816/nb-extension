var selectedText = '';

const getSelectionText = () => {
    let text = "";
    const activeEl = document.activeElement;
    const activeElTagName = activeEl ? activeEl.tagName.toLowerCase() : null;
    if (window.getSelection) {
        text = window.getSelection().toString();
    }
    else if (
        (activeElTagName == "textarea") || (activeElTagName == "input" &&
            /^(?:text|search|password|tel|url)$/i.test(activeEl.type)) &&
        (typeof activeEl.selectionStart == "number")
    ) {
        text = activeEl.value.slice(activeEl.selectionStart, activeEl.selectionEnd);
    }
    return text;
}

$(document).ready(() => {
    const imgURL = chrome.runtime.getURL("images/add.png");
    $(document.activeElement).css('position', 'relative');
    $(document.activeElement).append(
        '<div id="nb-add" class="add"'+
        ' style="position:fixed;top:40px;right:40px;width:48px;height:48px;'+
        'visibility:hidden;z-index:30001;cursor:pointer;transition: visibility 2s ease-in-out">'+
        '<img id="nb-add-img" title="Add Note" width="48" height="48"'+
        ' src="'+imgURL+'"'+
        ' /></div>'
    );
    $('#nb-add').click(() => {
        if(window.selectedText && window.selectedText!=='') {
            chrome.runtime.sendMessage({
                from: 'content',
                subject: 'text-selection',
                message: window.selectedText
            });
        }
    });
});

const setBtnVisible = (visible) => {
    if(visible) {
        $('#nb-add').css('visibility', 'visible');
    }
    else {
        $('#nb-add').css('visibility', 'hidden');
    }
}

document.onmouseup = document.onkeyup = document.onselectionchange =  () => {
    window.selectedText = getSelectionText();
    if(window.selectedText && window.selectedText.trim().length > 0) {
        setBtnVisible(true);
    }
    else {
        setBtnVisible(false);
    }
};