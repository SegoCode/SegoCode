document.getElementById('jsEnabled').style.display = 'none';

const userAction = async () => {
	const response = await fetch('https://raw.githubusercontent.com/SegoCode/SegoCode/main/README.md');
	response.text().then(function (text) {
		console.log(text);
	});
};

userAction();
