# Creado sistema de backup en tu smartphone sin port forwarding con Syncthing

Los servicios como google fotos, iCloud, drive... cuando manejamos un volumen de datos grande sobrepasaremos el umbral gratuito, estos servicios a la larga son caros y probablemente tengan dudosas políticas de privacidad. Por ello hoy veremos como hacer un pequeño sistema de backup sin complejas configuraciones en la red, sin necesidad de apertura de puertos o ip estáticas

Usaremos lo siguiente
   - Un servidor con linux (En mi caso una raspberryPi)
   - Un almacenamiento para los datos
   - Docker 
   - La app Syncthing

Que no te asuste el uso de docker, se que los contenedores pueden ser complicados y confusos, pero nuestra configuración al respecto va a ser minima. Esta pequeña guía se centrara en como configurar un entorno para Syncthing en un servidor propio.

Con el linux instalado en nuestro servidor, ejecutaremos estos comandos para actualizar los paquetes 

```
sudo apg-get update && sudo apt-get full-upgrade
```

Ahora instalaremos docker 

```
sudo curl -sSL https://get.docker.com | sh
```

Añadiremos el usuario de docker a los permisos del usuario actual

```
sudo usermod -aG docker $USER
```

En este punto tenemos una maquina linux limpia, actualizada y con docker instalado. Nuestro siguiente paso es conectar/configurar el almacenamiento externo para nuestro backup, ya sea un USB o un disco externo, tendremos que preparar la unidad para ser usada.

En mi caso es un disco externo por USB, primero tendremos que obtener el UUID del dispositivo de almacenamiento con el siguiente comando

```
blkid -t TYPE=vfat -sUUID 
```

" TYPE=vfat " corresponde al tipo de sistema de ficheros que usa tu almacenamiento, tendrás que adaptar el comando si no corresponde a FAT32 (Para particiones de FAT32 el tamaño máximo de archivo es 4GB)

En mi caso se muestra el siguiente output " /dev/sda1: UUID="A112-7J1C" " ubicado nuestro almacenamiento externo crearemos una nueva carpeta para montar la unidad

```
mkdir /mnt/usb1
```
_IMPORTANTE las particiones de vfat no corresponden al estándar UNIX, no se rigen por el sistema de permisos normales de linux_

Crearemos el montaje automático de la unidad en caso de reinicio del sistema, vamos a editar el fichero fstab y añadiremos esto al final

```
UUID=A112-7J1C /mnt/usb1 vfat defaults,auto,users,rw,nofail,noatime,uid=1000,gid=1000 0 0
```
_Tendrás que reemplazar el UUID por el de tu dispositivo_

Los parámetros uid=1000 y gid=1000 corresponden al usuario con permisos para acceder a ellos, ya que anteriormente le dimos permisos al usuario docker sobre el usuario actual no deberíamos de tener mayor problema. _Normalmente para el usuario por defecto uid y gid tienen el valor 1000_

Reiniciamos la maquina 


```
sudo reboot
```

Tras el reinicio deberíamos tener la unidad montada y lista para ser usada pasamos a configurar la sincronización, desplegaremos esta imagen https://hub.docker.com/r/linuxserver/syncthing con el siguiente comando

```
docker run -d \
  --name=syncthing \
  --hostname=syncthing `#Opcional` \
  -e PUID=1000 `#Debera conincidir con el usuario docker` \
  -e PGID=1000 `#Debera conincidir con el usuario docker` \
  -e TZ=Europe/London \
  -p 8384:8384 \
  -p 22000:22000/tcp \
  -p 22000:22000/udp \
  -p 21027:21027/udp \
  -v /docker/appdata/config:/config \
  -v /mnt/usb1:/data1 `#Aqui pondremos nuestro dispositivo externo` \
  --restart unless-stopped \
  lscr.io/linuxserver/syncthing:latest
```
Aunque he puesto unos comentarios aclaratorios, si hemos seguido esta guía, no requiere ninguna modificación.

Felicidades tienes la aplicación syncthing en el puerto 8384 y todo configurado aprueba de cortes de energía y reinicios, esta no va a ser una guía de syncthing solo de los pasos previos, a partir de aquí usa la interfaz gráfica, descarga la app en el movil y sigue la documentación https://docs.syncthing.net/intro/index.html
