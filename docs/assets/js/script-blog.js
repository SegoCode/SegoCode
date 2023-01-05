document.getElementById('jsEnabled').style.display = 'none';
document.getElementById('titleName').style.display = 'block';

var itsOnPost = false;

window.history.pushState(null, '', window.location.href);
window.onpopstate = function () {
	window.history.pushState(null, '', window.location.href);

	if (itsOnPost) {
		location.reload();
	} else {
		// Get all of the <a> elements in the navigation menu
		let links = document.querySelectorAll('nav a');

		// Loop through the <a> elements and set their color to a light color
		links.forEach(function (link) {
			link.style.color = 'rgb(255, 60, 60)';
		});

		// Wait for half a second
		setTimeout(function () {
			links.forEach(function (link) {
				// Loop through the <a> elements and set their color back to the original color
				link.style.color = '#9C9FA4';
			});
		}, 500);
	}
};

const urlBlog = 'https://raw.githubusercontent.com/SegoCode/SegoCode/main/docs/blogContent/';
const app = document.querySelector('zero-md');

const loadListPost = async () => {
	let post = new Array();
	for (let i = 1; true; i++) {
		const response = await fetch(urlBlog + 'entryblog-' + i + '.md');
		response.text().then(function (text) {
			if (response.status === 200) {
				//read first line of text and deleting the first character
				let firstLine = text.split('\n')[0].substring(1);
				post.unshift("<a onclick='loadEntryBlog(" + i + ")'>" + firstLine + '</a>');
			}
		});

		if (response.status !== 200) {
			break;
		}
	}

	post.forEach((element) => {
		let li = document.createElement('li');
		li.innerHTML = element;
		document.getElementById('postList').appendChild(li);
	});
};

function loadEntryBlog(entry) {
	itsOnPost = true;
	document.getElementById('postsBlock').style.display = 'none';
	document.getElementById('postMd').style.display = 'block';

	const run = async () => {
		console.log('Render: ' + urlBlog + 'entryblog-' + entry + '.md');
		app.src = urlBlog + 'entryblog-' + entry + '.md';
		await app.render();
	};
	run();
}

loadListPost();
