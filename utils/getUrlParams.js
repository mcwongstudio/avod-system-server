function getUrlParams(url) {
    var data = {}
    const databody = url.split('?')[1]
    const datalist = databody.split('&')    //['a=1','b=2']
    for(let item in datalist) {
        let key = datalist[item].split('=')[0]
        let value = datalist[item].split('=')[1]

        data[key] = value
    }
    return data
}


module.exports = getUrlParams