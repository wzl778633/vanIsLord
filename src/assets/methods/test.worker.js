import SparkMD5 from 'spark-md5'


onmessage = function(event){
    let blobSlice = File.prototype.slice || File.prototype.mozSlice || File.prototype.webkitSlice,
        file = event.data,
        chunkSize = 3*1024*1024,
        chunks = Math.ceil(file.size / chunkSize),
        skipInterval = Math.floor(chunks/100),
        currentChunk = 0,
        maxAccount = 99,
        counter = 0,
        spark = new SparkMD5.ArrayBuffer(),
        fr = new FileReader();
        if(skipInterval === 0){
            skipInterval = 1;
        }
    function loadNext() {
        let start = currentChunk * chunkSize,
            end = ((start + chunkSize) >= file.size) ? file.size : start + chunkSize;
        fr.readAsArrayBuffer(blobSlice.call(file, start, end));
    }
    fr.onload = e => {
        spark.append(e.target.result);
        if(maxAccount>0){
            currentChunk = currentChunk + skipInterval;
        }
        else if(maxAccount===0){
            if(currentChunk < chunks-1){
                currentChunk = chunks-1;
            }
        }else{
            currentChunk = chunks;
        }
        maxAccount--;
        counter++;
        if (currentChunk < chunks) {
            loadNext();
        } else {
            console.log('finished loading');
            const result = spark.end();
            console.info('computed hash', result);  // Compute hash
            postMessage(result);
        }

    }
    fr.onerror = (e) => {
        console.log('oops, something went wrong in MD5 calculation.');
        postMessage('error');
    }
    loadNext();

}
