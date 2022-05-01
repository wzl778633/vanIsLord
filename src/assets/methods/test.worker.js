import SparkMD5 from 'spark-md5'


onmessage = function(event){
    let blobSlice = File.prototype.slice || File.prototype.mozSlice || File.prototype.webkitSlice,
        file = event.data,
        chunkSize = 3*1024*1024,                             // Read in chunks of 5MB
        chunks = Math.ceil(file.size / chunkSize),
        currentChunk = 0,
        spark = new SparkMD5.ArrayBuffer(),
        fr = new FileReader();
    function loadNext() {
        let start = currentChunk * chunkSize,
            end = ((start + chunkSize) >= file.size) ? file.size : start + chunkSize;
        fr.readAsArrayBuffer(blobSlice.call(file, start, end));
    }
    fr.onload = e => {
        spark.append(e.target.result);
        currentChunk++;
        if (currentChunk < chunks) {
            loadNext();
        } else {
            console.log('finished loading');
            const result = spark.end();
            console.info('computed hash', spark.end());  // Compute hash
            postMessage(result);
        }

    }
    fr.onerror = (e) => {
        console.warn('oops, something went wrong in MD5 calculation.');
        postMessage('error');
    }
    loadNext();

}
