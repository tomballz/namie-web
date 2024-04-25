var index = 0;
const delay = ms => new Promise(res => setTimeout(res, ms));
async function changePhoto() {
    var changesph = document.getElementById("one");
    var changesdg = document.getElementById("two");

    

    var images1 = ["src/images/sph.png", "src/images/theme.png"];
    var images2 = ["src/images/sdg.png", "src/images/sdg8.png"];

    changesph.style.opacity = 0;
    changesdg.style.opacity = 0;
    await delay(500);
    changesph.src = images1[index];
    changesdg.src = images2[index];
    changesph.style.opacity = 1;
    changesdg.style.opacity = 1;

    if (index == 1) {
        index = 0;
        
    } else {
        index += 1;
    }
}

changePhoto();
setInterval(changePhoto, 4000);
