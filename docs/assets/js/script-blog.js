document.getElementById('jsEnabled').style.display = 'none';

const userAction = async () => {
	for (let i = 0; i < 10; i++) {
		const response = await fetch('https://raw.githubusercontent.com/SegoCode/SegoCode/main/docs/blogContent/entryblog-'+i+'.md');
		response.text().then(function (text) {
			//read first line of text deleting the first character
            const firstLine = text.split('\n')[0].substring(1);
            //add firsLine to a tag inside li element
            
            const li = document.createElement('li').innerHTML = '<a>'+firstLine+'</a>'; ;
            document.getElementById('postList').appendChild(li);
            
            
		});
	}
};

userAction();
