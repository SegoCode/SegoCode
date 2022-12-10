# Reglas YARA, una herramienta valiosa para filtrar subida de archivos en servidores 

Estamos acostumbrados a comprobar la extension de un archivo cuando creamos una implementación para subir archivos al servidor, pero esto no es suficiente,  si un servidor web está mal configurado, es posible que un archivo .php renombrado como .jpg podría ser interpretado como una imagen legítima y esto podría permitir que el código malicioso contenido en el archivo .php se ejecute en el servidor, lo que podría resultar en una vulnerabilidad en la seguridad del sitio web. https://github.com/fakhrizulkifli/Defeating-PHP-GD-imagecreatefromjpeg

Necesitamos adoptar las reglas YARA, estas reglas permiten una verificación más exhaustiva de los archivos en comparación con simplemente comprobar la extensión del archivo. 

Una de las principales ventajas de las reglas YARA es que permiten una verificación hexadecimal de los archivos. Esto significa que se pueden buscar patrones específicos de bytes dentro del archivo, lo que hace que sea muy difícil para un hacker eludir la detección.  

Una posible regla YARA para filtrar la cabecera JPG podría ser la siguiente:

```YARA
rule JPG_header {
    strings:
        $jpg_header = {FF D8 FF E0 00 10 4A 46 49 46 00 01}

    condition:
        $jpg_header at 0
}
```

La regla busca la secuencia de bytes que forman la cabecera de un archivo JPG "FF D8 FF E0 00 10 4A 46 49 46 00 01" al inicio del archivo. Si se encuentra, se cumple la condición y se activa la regla.

Para implementar una verificación de la regla YARA en nuestro backend JS, primero debemos instalar la biblioteca "yara.js" mediante el comando:

```bash
npm install yara.js
```

Luego, podemos escribir un código como el siguiente para probar nuestra regla YARA:

```javascript
const fs = require('fs');
const Yara = require('yara.js');

// Leemos el archivo que queremos verificar
const fileBuffer = fs.readFileSync('myfile.jpg');

// Compilamos la regla YARA
const rules = Yara.compileSync(`
rule JPG_header {
    strings:
        $jpg_header = {FF D8 FF E0 00 10 4A 46 49 46 00 01}

    condition:
        $jpg_header at 0
}`);

// Ejecutamos la regla sobre el archivo
const matches = rules.scan(fileBuffer);

// Imprimimos el resultado de la verificación
if (matches.length > 0) {
    console.log('La cabecera JPG se encontró en el archivo.');
} else {
    console.log('La cabecera JPG no se encontró en el archivo.');
}

```
Lo ideal seria que esta regla YARA se aplicara al buffer de un archivo subido desde un endpoint. 

Cabe mencionar que esta regla es muy básica y podría no funcionar en todos los casos. Por ejemplo, no tiene en cuenta la posibilidad de que haya otras secciones de datos antes de la cabecera JPG, como secciones de comentarios o de encabezado EXIF. Para una implementación más completa y robusta, podría ser necesario agregar más código a la regla.

Las reglas YARA son la mejor manera de filtrar archivos que se suben a un servidor debido a su capacidad para realizar verificaciones hexadecimales y su alta personalización. Esto permite una detección más precisa y eficiente de archivos potencialmente maliciosos, protegiendo así el servidor de ataques.
