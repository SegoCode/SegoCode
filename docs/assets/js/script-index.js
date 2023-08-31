console.log('%cHi there 👋', 'color: #36393e; font-size: 30px;');
console.log("Do you want some music on? Type 'music()'");
document.getElementById('jsEnabled').style.display = 'none';

var lainonRadio = document.getElementById('audio');
var triggerCount = 0; //Key listener
var dataShowed = false; //Prevent double animation

document.getElementById('hiddenData').addEventListener('click', (event) => {
	var baffle = window.baffle;
	if (!dataShowed) {
		document.getElementById('hiddenData').style.cursor = 'text';
		dataShowed = true;
		var baffleElement = baffle(document.querySelectorAll('#hiddenData'));

		baffleElement
			.start()
			.set({
				speed: 30,
			})
			.text((text) => atob(protectedFunc('U2Vnb0NvZGVTZWNyZXRz')))
			.reveal(1000, 100);
	}
});

function protectedFunc(key) {
	// Scraping protection
	var CryptoJS = window.CryptoJS;
	var bytes = CryptoJS.AES.decrypt('U2FsdGVkX18TpCCHkp0puKKrUoTs+HFOeaze9mRenZ5r/JMtzYPoI7XGxdPH+DQc', atob(key));
	return bytes.toString(CryptoJS.enc.Utf8);
}

// Radio code section //
async function music() {
	const audioContext = new AudioContext();
	const source = audioContext.createMediaElementSource(lainonRadio);
	source.connect(audioContext.destination);

	// Create and configure an Analyser Node
	const analyser = audioContext.createAnalyser();
	analyser.fftSize = 256;
	const dataArray = new Uint8Array(analyser.frequencyBinCount);
	source.connect(analyser);

	// Start the radio
	lainonRadio.play();

	// Update UI
	document.getElementById('volume').className = 'volume active';
	document.getElementById('volume').textContent = 'Volume > ' + lainonRadio.volume * 10 + ' // scroll to change ';

	console.log('Playing audio...');

	// Nested function to perform drawing loop
	const drawLoop = () => {
		analyser.getByteFrequencyData(dataArray);

		// Calculate RMS
		const sum = dataArray.reduce((acc, val) => acc + val * val, 0);
		const rms = Math.sqrt(sum / dataArray.length);
		const normalizedRMS = (rms / 255) * 100;

		// Use the RMS for text shadow
		document.getElementById('gitname').style.textShadow = `0px 0px ${normalizedRMS}px rgba(156, 159, 164,1)`;

		// Continue the loop
		requestAnimationFrame(drawLoop);
	};
	drawLoop();
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
