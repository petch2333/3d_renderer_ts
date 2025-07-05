const log = console.log.bind(console)

function readFileAsync(path: string) {
    return new Promise<string>((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.open('GET', path, true);
        xhr.onreadystatechange = function() {
            if (xhr.readyState == 4 && xhr.status == 200 || xhr.status == 304) { 
                resolve(xhr.responseText); // 请求成功，返回文件内容
            }
        };

        xhr.send();
    });
}

const interpolate = function(a: number, b: number, factor: number) {
    return a + (b - a) * factor
}

const bindAll = (sel: string, eventName: string, callback: Function) => {
    let doms = document.querySelectorAll(sel)
    for (let i = 0; i < doms.length; i++) {
        let input = doms[i]
        input.addEventListener(eventName, (event)=>{
            callback(event)
        })
    }
}




export {
    log, bindAll, readFileAsync, interpolate
}