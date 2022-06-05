# Creado un blog sin servicios de terceros

En algún sitio leí que todo programador necesitaba un sitio para sus writeups, en mi pequeño acercamiento al crear uno paso por CDNs, Github Pages y Jekyll, pero no quería que la publicación de mi blog dependiera en servicios CI de terceros, en los que, si uso el plan gratuito me pueden cortar el servicio en cualquier momento. 

Aquí nació la necesidad imperiosa, más halla de crear un blog, buscar alguna manera en la que solo dependa del propio github. El modelo a seguir inicial es recuperar los markdown del repositorio y listarlos, todo desde el lado del cliente, era sencillo, además github disponía de una api para ello, usando Axios.js no debería haber mayor problema

```
GET /repos/[USER]/[REPO]/git/trees/[BRANCH]?recursive=1 
```

Esto devolvería un 'Date' del commit que usaremos para mostrar la fecha del post, pero sorpresa la API no funciona si el repositorio tiene el mismo nombre de usuario a Junio de 2022.

Ahora la única manera sin pasar por el infierno de webScraping en javascript desde el cliente es saber de alguna manera los nombre de los archivos markdown, una opción seria tener en el repositorio un JSON con todos las url de los archivos, ademas podrían contener información adicional como el titulo, la fecha o tags
 
 ```
{
   "url":"http://example.com/blog/post",
   "headline":"My love of cats explained",
   "alternativeHeadline":"An indepth article on why I love cats",
   "dateCreated":"2019-02-11T11:11:11",
   "datePublished":"2019-02-11T11:11:11",
   "dateModified":"2019-02-11T11:11:11",
   "articleSection":"Uncategorized posts",
   "author":{
      "@type":"Person",
      "name":"Patrick Coombe",
      "url":"https://patrickcoombe.com"
   },
   "keywords":[
      "keyword1",
      "keyword2",
      "keyword3",
      "keyword4"
   ]
}
```

Tendríamos que modificar ese JSON para cada post, o programar una Github Action para actualizar ese json con los markdown del repositorio.

Pero dado que esto va a ser una prueba de concepto mas que un blog al uso vamos a simplificarlo aun más, cada fichero markdown tendrá un nombre específico seguido de un numero y la primera línea será el título del post de esta manera podemos tener un bucle para recuperar los markdown

```
for (let i = 1; true; i++) {
		const response = await fetch(urlBlog + 'entryblog-' + i + '.md');
		response.text().then(function (text) {
			if (response.status === 200) {
				//read first line of text and deleting the first character
				let firstLine = text.split('\n')[0].substring(1);
				console.log(firstLine);
			}
		});

		if (response.status !== 200) {
			break;
		}
	}
```


Tras recuperar los post solo tenemos que renderizar el markdown, en este caso vamos a usar la librería zero-md
 
```
function loadEntryBlog(entry) {
	const run = async () => {
		console.log('Render: ' + urlBlog + 'entryblog-' + entry + '.md');
		app.src = urlBlog + 'entryblog-' + entry + '.md';
		await app.render();
	};
	run();
}

```

Un poco de javascript y un CSS de algún repo (Porque el ser humano promedio no tiene tiempo para ponerse a maquetar en CSS) y ya tenemos nuestro blog markdown publicado en Github Pages 

Ahora podemos ir puliendo el CSS del markdown para ir transformándolo en algo más estiloso que un simple markdown.