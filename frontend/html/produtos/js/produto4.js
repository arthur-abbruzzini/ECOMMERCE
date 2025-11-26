const images = ['porsche1.webp', 'porsche2.webp', 'porsche3.webp'];
let currentIndex = 0;

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