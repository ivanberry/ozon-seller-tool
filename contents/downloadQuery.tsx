import cssText from "data-text:~contents/google-sidebar.css"
import type { PlasmoCSConfig } from "plasmo"

export const config: PlasmoCSConfig = {
    matches: ["https://seller.ozon.ru/*"]
}

export const getStyle = () => {
    const style = document.createElement("style")
    style.textContent = cssText
    return style
}

const downloadButton = () => {
    return (
        <button id='download'>Download</button>
    )
}

export default downloadButton