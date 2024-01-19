import cssText from "data-text:~contents/downloadQuery.css"
import type { PlasmoCSConfig } from "plasmo"
import XLSX from 'xlsx'

export const config: PlasmoCSConfig = {
    matches: ["https://seller.ozon.ru/*"]
}

export const getStyle = () => {
    const style = document.createElement("style")
    style.textContent = cssText
    return style
}

const COLUMN_HEADER_NAME_MAP = new Map([
    ['avgCaRub', '评价售价卢布'],
    ['avgCountItems', '搜索结果中的商品'],
    ['ca', '添加到购物车的转化率 '],
    ['count', '查询热度'],
    ['itemsViews', '商品浏览'],
    ['query', '搜索关键字'],
    ['softQueryCount', 'softQueryCount'],
    ['softQueryShare', 'softQueryShare'],
    ['uniqQueriesWCa', '添加到购物车的次数'],
    ['uniqSellers', '竞争对手'],
    ['usersWithoutInterectionCount', 'usersWithoutInterectionCount'],
    ['usersWithoutInterectionShare', 'usersWithoutInterectionShare'],
    ['zrCount', 'zrCount'],
    ['zrShare', 'zrShare']
])

const downloadCSV = async () => {
    let data = await downloadData();


    let csvContent = '';
    data.forEach((row, index) => {
        if (index === 0) {
            csvContent = Object.keys(row).map(key => COLUMN_HEADER_NAME_MAP.get(key)).join(',') + '\n' + Object.values(row).join(',') + '\n';
        } else {
            csvContent += Object.values(row).join(',') + '\n';
        }
    });

    // 创建下载链接
    let blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    let url = URL.createObjectURL(blob);
    let link = document.createElement('a');
    link.href = url;
    link.download = 'data.csv';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

const downloadData = async () => {
    let downloadData = []
    let page = 50
    let time = 1
    const response = await fetch("https://seller.ozon.ru/api/site/searchteam/Stats/query/v3", {
        "headers": {
            "accept": "application/json, text/plain, */*",
            "accept-language": "zh-Hans",
            "cache-control": "no-cache",
            "content-type": "application/json",
            "pragma": "no-cache",
            "sec-ch-ua": "\"Not_A Brand\";v=\"8\", \"Chromium\";v=\"120\", \"Google Chrome\";v=\"120\"",
            "sec-ch-ua-mobile": "?0",
            "sec-ch-ua-platform": "\"macOS\"",
            "sec-fetch-dest": "empty",
            "sec-fetch-mode": "cors",
            "sec-fetch-site": "same-origin",
            "x-o3-app-name": "seller-ui",
            "x-o3-company-id": "1568324",
            "x-o3-language": "zh-Hans",
            "x-o3-page-type": "what-to-sell"
        },
        "referrer": "https://seller.ozon.ru/app/analytics/what-to-sell/all-queries",
        "referrerPolicy": "strict-origin-when-cross-origin",
        "method": "POST",
        "mode": "cors",
        "credentials": "include",
        "body": JSON.stringify({ "text": "", "sorting": { "attribute": "count", "order": "desc" }, "limit": "50", offset: page * time })
    });
    const { data } = await response.json()
    downloadData.push(...data)
    while (time > 0) {
        time--
        const response = await fetch("https://seller.ozon.ru/api/site/searchteam/Stats/query/v3", {
            "headers": {
                "accept": "application/json, text/plain, */*",
                "accept-language": "zh-Hans",
                "cache-control": "no-cache",
                "content-type": "application/json",
                "pragma": "no-cache",
                "sec-ch-ua": "\"Not_A Brand\";v=\"8\", \"Chromium\";v=\"120\", \"Google Chrome\";v=\"120\"",
                "sec-ch-ua-mobile": "?0",
                "sec-ch-ua-platform": "\"macOS\"",
                "sec-fetch-dest": "empty",
                "sec-fetch-mode": "cors",
                "sec-fetch-site": "same-origin",
                "x-o3-app-name": "seller-ui",
                "x-o3-company-id": "1568324",
                "x-o3-language": "zh-Hans",
                "x-o3-page-type": "what-to-sell"
            },
            "referrer": "https://seller.ozon.ru/app/analytics/what-to-sell/all-queries",
            "referrerPolicy": "strict-origin-when-cross-origin",
            "method": "POST",
            "mode": "cors",
            "credentials": "include",
            "body": JSON.stringify({ "text": "", "sorting": { "attribute": "count", "order": "desc" }, "limit": "50", offset: page * time })
        });
        const { data } = await response.json()
        downloadData.push(...data)
    }

    return downloadData
}

const downloadButton = () => {
    return (
        <button onClick={downloadCSV}>Download</button>
    )
}

export default downloadButton