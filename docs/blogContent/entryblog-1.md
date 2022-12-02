# Creado un blog sin servicios de terceros

En algún lugar leí que todo programador necesitaba un sitio para sus writeups, en mi pequeño acercamiento al crear uno paso por CDNs, Github Pages y Jekyll. Yo no quería que la publicación de mi blog dependiera en servicios CI de terceros. Aquí nació la necesidad imperiosa, más halla de crear un blog... buscar alguna manera por la que todo dependiera de si mismo, en este caso Github. 

El modelo a seguir inicial consiste en alojar los writeups como markdown dentro de Github, recuperarlos del repositorio y listarlos desde el lado del cliente, es sencillo, además github disponía de una api para ello, usando Axios.js no debería haber mayor problema

```
GET /repos/[USER]/[REPO]/git/trees/[BRANCH]?recursive=1 
```

Esto devolvería un 'Date' del commit que usaremos para mostrar la fecha del post, sin embargo, me encontré con el problema de que la API no funcionaba si el repositorio tenía el mismo nombre de usuario a fecha junio de 2022.

Ahora la única manera (sin pasar por el infierno de webScraping en javascript desde el cliente) es saber de alguna manera los nombre de los archivos markdown, como solución a este problema, consideré utilizar un archivo JSON para almacenar la información de cada post, incluyendo título, fecha de publicación, etiquetas y otros detalles. Esto permitiría recuperar la información de los posts.
 
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

Esta solución requeriría actualizar manualmente el archivo JSON cada vez que se publique un nuevo post, lo cual puede ser engorroso y propenso a errores. Podriamos programar una acción de Github para que actualice automáticamente el archivo JSON con la información de los archivos markdown del repositorio. De esta manera, cada vez que se publique un nuevo post, la acción se encargará de actualizar el archivo JSON con la información del nuevo post, sin necesidad de intervención manual.

Para simplificar aún más el proceso, decidí establecer un formato estándar para los nombres de los archivos markdown de los posts. Cada archivo tendrá un nombre específico seguido de un número (Numero de la publicacion), y la primera línea del archivo será el título del post. De esta manera, puedo recuperar todos los archivos markdown del repositorio y listarlos en una página web sin tener que preocuparme por actualizar manualmente la información.

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

Una vez que se han recuperado los archivos markdown en el lado del cliente, se pueden renderizar utilizando la librería zero-md. La siguiente función en javascript se encarga de cargar una entrada del blog y renderizarla:

 
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
Con un poco de trabajo en javascript y algún CSS descargado de un repositorio (Porque el ser humano promedio no tiene tiempo para ponerse a maquetar en CSS) se puede crear una página web que muestre los posts del blog de forma estilizada. Esto permite publicar un blog en formato markdown en Github Pages sin depender de servicios de terceros.

Una vez que se tiene una versión básica del blog en funcionamiento, se puede trabajar en mejorar el diseño y la estética del blog con CSS. Esto permitirá transformar el simple markdown en un blog más atractivo.

