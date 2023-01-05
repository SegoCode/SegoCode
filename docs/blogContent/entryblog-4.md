# Proteger una API pública de automatismos usando JWT y Cloudflare

Cuando una aplicación consume datos de una API pública, es posible que cualquier persona pueda ver las peticiones y atacar directamente a ellas. Sin embargo, implementando JSON Web Tokens (JWT) en el Front junto con Cloudflare, podemos establecer una barrera para aquellas personas que intenten consumir nuestra API fuera de la aplicación autorizada.

Podemos hacer que el Front se renderice junto a un JWT. Cada vez que un usuario acceda a la vista HTML, se le asignará un JWT temporal que será utilizado para autenticar su acceso a la API durante los siguientes 5 minutos.

Ahora que tenemos una "sesion temporal" solo debemos de proteger nuestro Front con el servicio de cloudflare, de esta manera ningún automatismo podrá recuperar el JWT necesario para atacar a nuestra API.

Es decir, proteger una API pública utilizando JWT y Cloudflare es una forma efectiva de garantizar que solo usuarios autorizados tengan acceso a ella. Al hacer que la vista HTML se renderice con un JWT temporal y configurar Cloudflare para que solo permita el acceso a través de sus servidores de protección contra bots, podemos aumentar significativamente la seguridad de la API. 

En muchos sentidos, hay soluciones consensuadas sobre la protección de APIs. Sin embargo, este método de protección utilizando JWT y Cloudflare debería ser utilizado solo en casos muy específicos. En la arquitectura inicial de un proyecto, se desaconseja utilizar este método debido a que hay otras opciones más adecuadas y sencillas de implementar. Es importante evaluar cuidadosamente las necesidades de seguridad de la API y elegir la solución más adecuada en cada caso.
