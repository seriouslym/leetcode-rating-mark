// popup.js

chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
    const activeTab = tabs[0];
    chrome.tabs.sendMessage(activeTab.id, { action: 'get_data' }, response => {
        if (chrome.runtime.lastError) {
            return;
        }
        if (response) {
            // 处理来自 Content Script 的数据
            console.log('Data from Content Script:', response.data);
            let {cnt, total} = response.data;
            document.getElementsByClassName('text')[0].innerText = `${cnt} / ${total}`;
        }
    });
});
