console.log("%cHi there 👋", "color: #36393e; font-size: 30px;");
console.log("Do you want some music on? Type 'music()'");
document.getElementById("jsEnabled").style.display = "none";

var lainonRadio = new Audio('https://lainon.life/radio/cyberia.ogg');
var triggerCount = 0; //Key listener
var dataShowed = false; //Prevent double animation


document.getElementById("hiddenData").addEventListener("click", event => {
  var baffle = window.baffle;
  var CryptoJS = window.CryptoJS;
  if (!dataShowed) {
    dataShowed = true;
    var baffleElement = baffle(document.querySelectorAll('#hiddenData'));

    baffleElement.start()
      .set({
        speed: 30
      })
      .text(text => atob(protected('U2Vnb0NvZGVTZWNyZXRz')))
      .reveal(1000, 1000);
  }
});


function protected(key) {
  // Scraping protection
  var bytes = CryptoJS.AES.decrypt('U2FsdGVkX18TpCCHkp0puKKrUoTs+HFOeaze9mRenZ5r/JMtzYPoI7XGxdPH+DQc', atob(key));
  return bytes.toString(CryptoJS.enc.Utf8);
}

// Radio code section //

function music() {
  lainonRadio.volume = 0.3;
  lainonRadio.play();
  document.getElementById('volume').className = 'volume active'
  document.getElementById('volume').textContent = "Volume > " + lainonRadio.volume * 10 + " // scroll to change ";
  console.log("Playing radio streaming from lainon.life, Buffering...");
}


window.addEventListener('wheel', event => {
  var delta = Math.sign(event.deltaY);
  var deltaNormalized = delta / -10;
  var volume = (lainonRadio.volume + deltaNormalized).toFixed(1);

  if (volume > 1) volume = 1.0;
  if (volume <= 0) volume = 0.1;

  lainonRadio.volume = volume;
  document.getElementById('volume').textContent = "Volume > " + lainonRadio.volume * 10 + " // scroll to change ";
});


window.addEventListener('keyup', event => {
  var key = [77, 85, 83, 73, 67]
  var max = key.length

  if (event.which === key[triggerCount]) {
    triggerCount++
  } else {
    triggerCount = 0
  }

  if (triggerCount >= max) {
    music();
    triggerCount = 0
  }
});
