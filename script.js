// import JSZip from 'jszip';
// const JSZip = require('jszip');

const previewContainer = document.querySelector('.preview-container');
const uploadContainer = document.querySelector('.upload-container');
const cardContainer = document.querySelector('.card-container');


let img = document.querySelector('.preview-display img');
let imageUrls = [];
let images = [];
let title = '';
let startNumber = 0;
let currentPage = 0;

document.querySelector('#title').addEventListener('change', function () {
    title = this.value;
    previewImagesLoad();
})

document.querySelector('#start-number').addEventListener('change', e => {
    startNumber = e.target.value
    previewImagesLoad();
})

document.querySelector('.btn-upload').addEventListener('dragover', e => {
    e.preventDefault();

    // var vaild = e.dataTransfer.types.indexOf('Files') >= 0;
    // console.log(vaild);
});

document.querySelector('.btn-upload').addEventListener('drop', e => {
    e.preventDefault();

    let file = e.dataTransfer.files[0];
    const reader = new FileReader();
    reader.readAsDataURL(file);

    reader.addEventListener('load', function () {
        saveImageAsUrl(reader.result);
        setTimeout(pageDown, 100);
    })
});

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

function saveImageAsUrl(imgSrc) {
    var image = new Image();
    image.crossOrigin = "anonymous";
    image.src = imgSrc;

    image.onload = function () {
        var canvas = document.createElement('canvas');
        canvas.width = this.width;
        canvas.height = this.height;
        canvas.getContext('2d').drawImage(this, 0, 0);

        imageUrls.push(canvas.toDataURL());

        previewImagesLoad();
    };
}


function downloadImagesAsForder() {
    // let fileHandler = new ActiveXObject("Scripting.fileSystemObject");
    // fileHandler.createFolder(title);
}

function previewImagesLoad() {
    cardContainer.innerHTML = '';
    images = [];
    const last = imageUrls.length - 1;

    for (let i = 0; i <= last; i++) {
        images[i] = new Image();
        images[i].src = imageUrls[i];
        let newPage = Number(startNumber) + i;

        let cardLayout = `
        <div id="page-${newPage}" class="uploaded-card" draggable="true">
            <img src="${images[i].src}" draggable="false">
            <div class="card-body">
                <h4>${title + ' '}${newPage}.png</h4>
                <p></p>
                <button class="remove">삭제</button>
            </div>
        </div>`;

        cardContainer.insertAdjacentHTML('beforeend', cardLayout);

        document.querySelector(`#page-${newPage}`).addEventListener('click', e => {
            pageTo(i);
        })

        document.querySelector(`#page-${newPage} .remove`).addEventListener('click', e => {
            e.stopPropagation();
           imageUrls.splice(i, 1);
           previewImagesLoad();
        })
    }

    document.querySelector('.preview-empty').style = 'display : none;';
    pageTo(last);
}

img.addEventListener('click', e => {
    if (images.length < 2) return;

    let centerX = e.target.width / 2;
    let clickX = e.offsetX;

    if (clickX < centerX) { currentPage-- }
    else { currentPage++ }

    if (currentPage < 0) { currentPage = images.length - 1 }
    else if (currentPage == images.length) { currentPage = 0 }

    img.src = images[currentPage].src;
})

function pageTo(page){
    if(page < 0) {
        document.querySelector('.preview-empty').style = 'display : block;';
        img.src = '';
        return;
    }
    currentPage = page;
    img.src = images[currentPage].src;
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


document.querySelector('#download').addEventListener('click', function () {
    // downloadImagesAsForder();
    // downloadImagesAsZip();
    pageDown();
})



function pageUp() {
    window.scrollTo(0, 0);
}

function pageDown() {
    // window.scrollTo(0, document.body.scrollHeight);
    window.scroll({ top: document.body.scrollHeight, behavior: 'smooth' });
}