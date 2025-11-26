const images = ['camaro1.webp', 'camaro2.webp', 'camaro3.webp'];
let currentIndex = 1;

function updateImage() {
    document.getElementById('productImage').src = '../../img/' + images[currentIndex];
}

function nextImage() {
    currentIndex = (currentIndex + 1) % images.length;
    updateImage();
}

function prevImage() {
    currentIndex = (currentIndex - 1 + images.length) % images.length;
    updateImage();
}