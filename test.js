const url = 'http://localhost:5000/api/file/search'
const data = {
    a: 1,
    
}

function getUrl(url, data) {
    let dataPart = ''
    for(let key in data) {
        dataPart += `${key}=${data[key]}&`
    }
    const l = dataPart.length
    const dataParam = dataPart.substr(0, l - 1)
    return `${url}?${dataParam}`
}

const k = getUrl(url, data)

console.log(k)