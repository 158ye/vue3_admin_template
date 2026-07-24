export const getTime=()=>{
    let messages = '';
    let hours = new Date().getHours();
    if (hours < 6) {
        messages = '凌晨好'
    } else if (hours < 9) {
        messages = '早上好'
    } else if (hours < 12) {
        messages = '上午好'
    } else if (hours < 14) {
        messages = '中午好'
    } else if (hours < 17) {
        messages = '下午好'
    } else {
        messages = '晚上好'
    }
    return messages;
}