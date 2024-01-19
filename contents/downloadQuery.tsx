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

const downloadCSV = async () => {
    let data = await downloadData();

    let csvContent = '';
    data.forEach((row) => {
        csvContent += Object.values(row).join(',') + '\n';
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
    let time = 2
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
        "body": JSON.stringify({ "text": "", "sorting": { "attribute": "count", "order": "desc" }, "limit": "50", page })
    });
    const { data } = await response.json()
    downloadData.push(...data)
    if (time > 0) {
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
            "body": JSON.stringify({ "text": "", "sorting": { "attribute": "count", "order": "desc" }, "limit": "50", page })
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