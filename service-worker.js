
let th = document.getElementsByTagName('thead')[0].querySelector('tr')
let mark = th.childNodes[3].cloneNode(true);
mark.querySelector('div').innerText = "标记"
th.appendChild(mark)

let labelArr = ["No", "Yes", "VIP"]
function render() {
    let downKey = 'downList';
    let vipKey = "vipList";
    if (!localStorage.getItem(downKey)) {
        localStorage.setItem(downKey, '[]');
    }
    if (!localStorage.getItem(vipKey)) {
        localStorage.setItem(vipKey, '[]');
    }
    let tr = document.getElementsByTagName('tbody')[0].children
    for (let i = 0; i < tr.length; i++) {
        let dom = document.createElement('td')
        dom.classList.add('el-table_1_column_5');
        dom.classList.add('el-table__cell');
        dom.setAttribute('rowspan', "1");
        dom.setAttribute('colspan', '1');
        let div = document.createElement('div')
        div.classList.add('cell')
        let btn = document.createElement('button');
        let downList = JSON.parse(localStorage.getItem(downKey))
        let vipList = JSON.parse(localStorage.getItem(vipKey));
        let value = tr[i].childNodes[0].textContent

        if (downList.includes(value)) {
            // 做过的
            btn.classList.add(...['el-button', 'el-button--success', 'el-button--mini',]);
            btn.innerText = labelArr[1];
            btn.setAttribute("index", "1");
        } else if (!vipList.includes(value)) {
            // 没做过的
            btn.classList.add(...['el-button', 'el-button--primary', 'el-button--mini',]);
            btn.innerText = labelArr[0];
            btn.setAttribute("index", "0");
        } else {
            // vip
            btn.classList.add(...['el-button', 'el-button--danger', 'el-button--mini',]);
            btn.innerText = labelArr[2];
            btn.setAttribute("index", "2");
        }
        // btn.classList.add(...['el-button', 'el-button--primary', 'el-button--mini']);
        btn.value = value;
        // 0-yes 1-no 2-vip
        btn.addEventListener('click', (e) => {
            let value = e.target.value;
            let index = e.target.getAttribute("index");
            let downList = JSON.parse(localStorage.getItem(downKey))
            if (index === "0") { // no -> yes
                // let idx = downList.findIndex(item => item === value)
                // downList.splice(idx, 1);
                downList.push(value);
                e.target.innerText = labelArr[1];
                e.target.classList.remove('el-button--primary')
                e.target.classList.add('el-button--success')
                e.target.setAttribute("index", "1");
            } else if (index === '1') { // yes -> vip
                let idx = downList.findIndex(item => item === value)
                downList.splice(idx, 1);
                e.target.innerText = labelArr[2]
                e.target.classList.remove('el-button--success')
                e.target.classList.add('el-button--danger')
                e.target.setAttribute("index", "2");
                vipList.push(value);
            } else { // vip -> no
                let idx = vipList.findIndex(item => item === value)
                vipList.splice(idx, 1);
                e.target.innerText = labelArr[0];
                e.target.classList.remove('el-button--danger')
                e.target.classList.add('el-button--primary');
                e.target.setAttribute("index", "0");
            }
            localStorage.setItem(downKey, JSON.stringify(downList));
            localStorage.setItem(vipKey, JSON.stringify(vipList));
        })
        // btn.addEventListener("dblclick", (e) => {
        //     let value = e.target.value;
        //
        //     let index = e.target.getAttribute("index");
        //     console.log(index , "sdfs")
        //     let vipList = JSON.parse(localStorage.getItem(vipKey));
        //     if (!vipList.includes(value)) {
        //         vipList.push(value);
        //         e.target.classList.remove(...['el-button-success', 'el-button-primary'])
        //         e.target.classList.add('el-button-danger');
        //     }
        //     e.target.setAttribute("index", "2");
        //     localStorage.setItem(vipList, JSON.stringify(vipList));
        // })
        div.appendChild(btn);
        dom.appendChild(div);
        tr[i].appendChild(dom);
    }
}
function deleteMark() {
    let tr = document.getElementsByTagName('tbody')[0].children;
    for (let i = 0; i < tr.length; i++) {
        if (tr[i].children.length === 6) {
            tr[i].removeChild(tr[i].lastChild);
        }
    }
}

let obj = {
    id: "",
}
let proxy = new Proxy(obj, {
    set(target, p, newValue, receiver) {
        if (target[p] !== newValue) {
            console.log(target[p], newValue)
            // 初始化 只进行渲染
            if (target[p] === "") {
                render();
            } else {
                deleteMark();
                render();
            }
            target[p] = newValue;
        }
        return true;
    }
})

function watchLastRowForUpdate() {
    let tr = document.getElementsByTagName('tbody')[0].children;
    if (tr.length) {
        let last = tr[tr.length - 1];
        proxy.id = last.children[0].innerText;
    }
}


setInterval(watchLastRowForUpdate, 100)


function getTotal() {
    return document.getElementsByClassName('el-pagination')[0].firstChild.innerText.split(' ')[1];
}

// setTimeout(async () => {total = await getTotal()}, 200);
// content.js
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === 'get_data') {
        // 在这里获取特定网页的数据
        let cnt = JSON.parse(localStorage.getItem('downList')).length;
        const data = {
            total: getTotal(),
            cnt,
        } // 获取数据的逻辑
        console.log(data)
        sendResponse({data});
    }
});
