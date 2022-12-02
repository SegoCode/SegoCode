# Creado sistema de backup en tu smartphone sin port forwarding con Syncthing

Si estás cansado de pagar por servicios de almacenamiento en la nube como Google Fotos o iCloud, o simplemente te preocupan las políticas de privacidad de estas empresas. Veremos cómo crear un sistema de backup sencillo en tu servidor Linux (en nuestro caso, una RaspberryPi) sin complicadas configuraciones de red ni necesidad de apertura de puertos o IP estáticas. Haremos uso de Docker y la app Syncthing para lograrlo. No te asustes si no estás familiarizado con Docker, la configuración que realizaremos es mínima y la haremos paso a paso.

Teniendo Linux (Debian) instalado en nuestro servidor ejecutaremos los siguientes comandos para preparar el entorno:

```
sudo apg-get update && sudo apt-get full-upgrade
```


Ahora instalaremos docker:

```
sudo curl -sSL https://get.docker.com | sh
```


Añadiremos el usuario de docker a los permisos del usuario actual:

```
sudo usermod -aG docker $USER
```


En este punto tenemos una maquina Linux limpia, actualizada y con docker instalado. Nuestro siguiente paso es conectar/configurar el almacenamiento externo (en caso de necesitarlo) ya sea un USB o un disco externo, tendremos que preparar la unidad para ser usada.

Primero tendremos que obtener el UUID del dispositivo de almacenamiento actualmente conectado:

```
blkid -t TYPE=vfat -sUUID 
```
_El comando anterior asume que se está utilizando un sistema de archivos FAT32 (TYPE=vfat) en el almacenamiento externo. Si esto no es así, deberás adaptar el comando para reflejar el tipo de sistema de archivos que estés usando. También es importante tener en cuenta que las particiones de vfat no cumplen con el estándar UNIX y no se rigen por los permisos normales de Linux. (Para particiones de FAT32 el tamaño máximo de archivo es 4GB)_


Una vez que hayamos obtenido el UUID del dispositivo de almacenamiento (En mi caso se muestra el siguiente output /dev/sda1: UUID="A112-7J1C") deberemos crear una nueva carpeta para montar la unidad:

```
mkdir /mnt/usb1
```


Para que la unidad se monte automáticamente en caso de reinicio del sistema, deberemos editar el archivo fstab y añadir lo siguiente al final:

```
UUID=A112-7J1C /mnt/usb1 vfat defaults,auto,users,rw,nofail,noatime,uid=1000,gid=1000 0 0
```
_Recuerda reemplazar el UUID por el que corresponda a tu dispositivo de almacenamiento._


Los parámetros uid=1000 y gid=1000 en el archivo fstab corresponden al usuario con permisos para acceder al almacenamiento externo. Como ya se le dieron permisos al usuario Docker sobre el usuario actual, no debería haber problemas en este sentido. _Generalmente, el uid y el gid del usuario por defecto tienen el valor 1000._

Reiniciar la máquina con el siguiente comando:

```
sudo reboot
```


Una vez que la máquina se haya reiniciado, se debería tener la unidad de almacenamiento externo montada y lista para usarse. A continuación, desplegaremos esta imagen https://hub.docker.com/r/linuxserver/syncthing con el siguiente comando:

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
_Aunque he puesto unos comentarios aclaratorios, si hemos seguido esta guía, no requiere ninguna modificación._


Si se han seguido los pasos anteriores, no sería necesario realizar ningún cambio en el comando anterior. Una vez que se haya ejecutado el comando, la aplicación Syncthing estará disponible en el puerto 8384 y lista para usarse. Para obtener más información sobre cómo utilizar Syncthing, se puede consultar la documentación oficial en https://docs.syncthing.net/intro/index.html. 

Se puede utilizar la aplicación móvil de Syncthing para conectar al servidor y comenzar a sincronizar archivos. La aplicación móvil de Syncthing es muy sencilla de usar y permite conectarse de forma rápida y fácil (Internamente usa un relay de conexion de esta manera no se necesitan IP estaticas o puertos abiertos) por medio de QR. Una vez que se ha establecido la conexión, se pueden seleccionar los archivos y carpetas que se deseen sincronizar y comenzar a realizar backups de forma automática y sin intervención del usuario.
