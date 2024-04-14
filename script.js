// import JSZip from 'jszip';
// const JSZip = require('jszip');

// 이미지 미리보기 컨테이너
const previewContainer = document.querySelector('.preview-container');
// 이미지 올리기 컨테이너
const uploadContainer = document.querySelector('.upload-container');
// 이미지 카드 컨테이너
const cardContainer = document.querySelector('.card-container');
// 파일 제목 입력
const fileTitleInput = document.querySelector('#preview-utils .title');
// 페이지 셀렉터
const pageSelecter = document.querySelector('#preview .page');

// 현재 미리보기 이미지
let img = document.querySelector('.preview-display img');
// 이미지 URL 배열
let imageUrls = [];
// 이미지 저장 배열
let images = [];
// 현재 미리보기 이미지 번호
let currentPage = 0;
// 파일 제목
let fileTitle = 'NewFile';

document.addEventListener('dragstart', e => {
    console.log('start');
})

document.querySelector('html').addEventListener('dragover', e => {
    e.preventDefault();
});

document.querySelector('html').addEventListener('drop', e => {
    e.preventDefault();

    let file = e.dataTransfer.files[0];
    const reader = new FileReader();
    reader.readAsDataURL(file);

    reader.addEventListener('load', function () {
        saveImageAsUrl(reader.result);
        setTimeout(pageDown, 100);
    })
});


fileTitleInput.addEventListener('change', e => {
    fileTitle = e.target.value;
    if(fileTitle == ''){
        fileTitle = 'NewFile';
    }
    previewImagesLoad();
})


/**
 * URL을 Blob으로 변환하여 반환한다.
 * @param {string} dataurl 
 * @returns Blob
 */
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


/**
 * 이미지 URL을 imageURLs 배열에 추가한다.
 * @param {string} imgSrc 암호화된 이미지 url
 */
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


/**
 * 미리보기 이미지를 최신화한다.
 */
function previewImagesLoad() {
    cardContainer.innerHTML = '';
    images = [];
    const last = imageUrls.length - 1;

    for (let i = 0; i <= last; i++) {
        images[i] = new Image();
        images[i].src = imageUrls[i];
        let newTitle = fileTitle + ' ' + i;

        let cardLayout = `
        <div id="page-${i}" class="uploaded-card" draggable="true">
            <img src="${images[i].src}" draggable="false">
            <div class="card-body">
                <h4>${newTitle}.png</h4>
                <p></p>
                <button class="remove">삭제</button>
            </div>
        </div>`;

        cardContainer.insertAdjacentHTML('beforeend', cardLayout);

        document.querySelector(`#page-${i}`).addEventListener('click', e => {
            pageTo(i);
        })

        document.querySelector(`#page-${i} .remove`).addEventListener('click', e => {
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


/**
 * 미리보기 이미지를 전환한다.
 * @param {number} page 미리보기 이미지 번호
 */
function pageTo(page){
    if(page < 0) {
        document.querySelector('.preview-empty').style = 'display : block;';
        img.src = '';
        return;
    }
    currentPage = page;
    img.src = images[currentPage].src;
}

function pageUp() {
    window.scrollTo(0, 0);
}

function pageDown() {
    window.scroll({ top: document.body.scrollHeight, behavior: 'smooth' });
}