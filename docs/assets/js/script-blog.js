document.getElementById('jsEnabled').style.display = 'none';
document.getElementById('titleName').style.display = 'block';

window.history.pushState(null, "", window.location.href);
window.onpopstate = function () {
    window.history.pushState(null, "", window.location.href);
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


	post.forEach( element => {
		let li = document.createElement('li');
		li.innerHTML = element;
		document.getElementById('postList').appendChild(li);
	});

};

function loadEntryBlog(entry) {
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
