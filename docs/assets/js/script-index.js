console.log('%cHi there 👋', 'color: #36393e; font-size: 30px;');
console.log("Do you want some music on? Type 'music()'");
document.getElementById('jsEnabled').style.display = 'none';

var lainonRadio = document.getElementById('audio');
var triggerCount = 0; //Key listener
var dataShowed = false; //Prevent double animation

function showEmail() {
	document.getElementById('hiddenData').style.display = 'block';
}

document.getElementById('hiddenData').addEventListener('click', (event) => {
	var baffle = window.baffle;
	if (!dataShowed) {
		document.getElementById("hiddenData").style.cursor = "text"; 
		dataShowed = true;
		var baffleElement = baffle(document.querySelectorAll('#hiddenData'));

		baffleElement
			.start()
			.set({
				speed: 30,
			})
			.text((text) => atob(protected('U2Vnb0NvZGVTZWNyZXRz')))
			.reveal(1000, 100);
	}
});

function protected(key) {
	// Scraping protection
	var CryptoJS = window.CryptoJS;
	var bytes = CryptoJS.AES.decrypt('U2FsdGVkX18TpCCHkp0puKKrUoTs+HFOeaze9mRenZ5r/JMtzYPoI7XGxdPH+DQc', atob(key));
	return bytes.toString(CryptoJS.enc.Utf8);
}

// Radio code section //

function music() {
	lainonRadio.volume = 0.3;

	// meyda.min.js //
	var audioContext = new AudioContext();
	var source = audioContext.createMediaElementSource(lainonRadio);
	source.connect(audioContext.destination);

	var analyzer = Meyda.createMeydaAnalyzer({
		audioContext: audioContext,
		source: source,
		bufferSize: 512,
		featureExtractors: ['rms'],
		callback: (features) => {
			var musicLog = document.getElementById('musicLog');
			document.getElementById('gitname').style.textShadow = '0 0 ' + 3 + features.rms * 100 + 'px #c3c3c3';

			if (features.rms == 0) { //¿Silent?
				musicLog.textContent = 'CONNECTION ERROR: Buffering...';
				musicLog.style.display = 'block';
			} else {
				musicLog.style.display = 'none';
			}
		},
	});
	analyzer.start();
	// End meyda.min.js //

	lainonRadio.play();
	document.getElementById('volume').className = 'volume active';
	document.getElementById('volume').textContent = 'Volume > ' + lainonRadio.volume * 10 + ' // scroll to change ';
	console.log('Playing radio streaming from lainon.life, Buffering...');
}

window.addEventListener('wheel', (event) => {
	var delta = Math.sign(event.deltaY);
	var deltaNormalized = delta / -10;
	var volume = (lainonRadio.volume + deltaNormalized).toFixed(1);

	if (volume > 1) volume = 1.0;
	if (volume <= 0) volume = 0.1;

	lainonRadio.volume = volume;
	document.getElementById('volume').textContent = 'Volume > ' + lainonRadio.volume * 10 + ' // scroll to change ';
});

window.addEventListener('keyup', (event) => {
	var key = ['m', 'u', 's', 'i', 'c'];
	var max = key.length;

	if (event.key === key[triggerCount]) {
		triggerCount++;
	} else {
		triggerCount = 0;
	}

	if (triggerCount >= max) {
		music();
		triggerCount = 0;
	}
});
