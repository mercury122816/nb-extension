var selectedText = '';
var longpress = 3000;
var start;
var pressed = false;

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
        '<div id="nb-add" class="add"' +
        ' style="position:fixed;top:40px;right:40px;width:48px;height:48px;' +
        'visibility:hidden;z-index:30001;cursor:pointer;transition: visibility 2s ease-in-out">' +
        '<img id="nb-add-img" title="Add Note" width="48" height="48"' +
        ' src="' + imgURL + '"' +
        ' /></div>'
    );
    $('#nb-add').click(() => {
        if (window.selectedText && window.selectedText !== '') {
            chrome.runtime.sendMessage({
                from: 'content',
                subject: 'text-selection',
                message: window.selectedText
            });
        }
    });
});

const setBtnVisible = (visible) => {
    if (visible) {
        $('#nb-add').css('visibility', 'visible');
    }
    else {
        $('#nb-add').css('visibility', 'hidden');
    }
}

document.onmouseup = document.onkeyup = document.onselectionchange = () => {
    window.selectedText = getSelectionText();
    if (window.selectedText && window.selectedText.trim().length > 0) {
        setBtnVisible(true);
    }
    else {
        setBtnVisible(false);
    }
};

const addImgToClipboard = (source) => {
    window.selectedImg = `<img src=${source} />`;
    if (window.selectedImg && window.selectedImg !== '') {
        pressed = false;
        chrome.runtime.sendMessage({
            from: 'content',
            subject: 'img-selection',
            message: window.selectedImg
        });
    }
}

$(document.activeElement).on('mousedown', function (e) {
    start = new Date().getTime();
});

$(document.activeElement).on('mouseleave', function (e) {
    start = 0;
});

$(document.activeElement).on('mouseup', function (e) {
    if (new Date().getTime() >= (start + longpress)) {
        if (e.target.tagName === 'IMG' && e.target.id !== 'nb-add-img') {
            e.preventDefault();
            pressed = true;
            $('#nb-tool').remove();
            $(document.activeElement).append(
                '<div id="nb-tool" style="position:fixed;font-size:1.0rem;' +
                'font-family:Arial, Helvetica, sans-serif' +
                'padding:6px;z-index:30001;background:#d5dbe3;' +
                'top: 160px;right:40px;display:flex;align-items:center;'+ 
                'justify-content:center;text-align:center;min-width:100px;min-heigth:48px">' +
                'Copied!</div>'
            );
            const imgSource = e.target.src;
            addImgToClipboard(imgSource);
        }
    }
    else {
        pressed = false;
    }
});

$('img').on('mouseleave', () => {
    $('#nb-tool').remove();
});