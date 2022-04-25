import SparkMD5 from 'spark-md5'

const spark = new SparkMD5.ArrayBuffer();

function preHandleFile(file){
    return new Promise((resolve, reject) => {
        const fr = new FileReader()
        fr.readAsArrayBuffer(file)
        fr.onload = e => {
            resolve(e.target.result)
        }
        fr.onerror = () => {
            reject(new Error('转换文件格式发生错误'))
        }
    })
};



onmessage = function(event){
    preHandleFile(event.data).then((data) =>{
        const buffer = data;
        spark.append(buffer);
        const md5 = spark.end();
        postMessage(md5);
    }).catch((error) =>
    {postMessage("error");});

}
