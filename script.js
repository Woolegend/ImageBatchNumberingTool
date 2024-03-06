import JSZip from 'jszip';
// const JSZip = require('jszip');

let imageBlobs = [];
let title = '';

document.querySelector('#title').addEventListener('change', function(){
    title = this.value;
})

document.querySelector('.btn-upload').addEventListener('dragover', e => {
    e.preventDefault();

    var vaild = e.dataTransfer.types.indexOf('Files') >= 0;
    console.log(vaild);
});

document.querySelector('.btn-upload').addEventListener('drop', e => {
    e.preventDefault();
    let file = e.dataTransfer.files[0];
    const reader = new FileReader();

    reader.readAsDataURL(file);

    reader.addEventListener('load', function () {

        saveImageAsBlob(reader.result);

        console.log(imageBlobs);
    })
});

document.querySelector('#download').addEventListener('click', function() {
    downloadImagesAsZip();
})

function dataURLtoBlob(dataurl) {
    var arr = dataurl.split(','),
        mime = arr[0].match(/:(.*?);/)[1],
        bstr = atob(arr[1]),
        n = bstr.length,
        u8arr = new Uint8Array(n);
    while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
    }
    return new Blob([u8arr], {
        type: mime
    });
}

function saveImageAsBlob(imgSrc) {
    var image = new Image();
    image.crossOrigin = "anonymous";
    image.src = imgSrc;

    image.onload = function () {
        var canvas = document.createElement('canvas');
        canvas.width = this.width;
        canvas.height = this.height;
        canvas.getContext('2d').drawImage(this, 0, 0);
        document.body.append(canvas);

        imageBlobs.push(dataURLtoBlob(canvas.toDataURL()));
    };
}

function downloadImagesAsForder(){

}

// function downloadImagesAsZip() {
//     var zip = new JSZip();

//     var promises = imageBlobs.map(function (imageBlob, index) {
//         return new Promise(function (resolve) {
//             var titleWithIndex = title + '_' + index;
//             zip.file(titleWithIndex, imageBlob);
//             resolve();
//         });
//     });

//     console.dir(promises);

//     Promise.all(promises).then(function () {
//         zip.generateAsync({ type: 'blob' }).then(function (blob) {
//             saveAs(blob, 'images.zip');
//         });
//     });
// }