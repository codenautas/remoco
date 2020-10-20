# remoco
remote control client 2 client

# objetivo

Poner en una ventana de un navegador un servicio de visualización (visualizador)
que se pueda controlar desde otro dispositivo, tanto para desplegar información
correr comandos o recibir y enviar información al usuario que lo controla. 

Par maximizar los usos el visualizador debería instalarse en una web fácil de
recordar y tipear en un dispositivo sin teclado físico (ej: un smartTV)

## posibles usos

Un usuario que tiene un dispositivo o navegador que no reacciona como se espera 
puede entrar arrancar un visualizador de modo que la mesa de ayuda pueda correr
comandos en el navegador del dispositivo del usuario. 

Un smartTV puede arrancar un visualizador para realizar una presentación sin 
necesidad de acceder al cable físico, a la red interna o a compartir pantalla. 
También podría visualizarse un panel de control de un sistema de gestión o el
tablero principal de un juego colaborativo. 

Una flota de dispositivos móviles que necesitan instalar una PWA desde una URL
larga pueden acceder al visualizador para indicarles la instalación en forma 
remota. 

## funcionamiento

1. En un navegador del dispositivo visualizador se accede a la URL *corta.zz*
    1. Se abre el visualizador que le pide al backend un token y un id corto.
    2. Aparece una leyenda explicando los peligros y un checkbox para aceptar
        los riesgos
    2. El visualizador muestra un código QR y el id corto.
2. En otro dispositivo se abre el servicio de control remoto
    1. Se ve un lector de QR o un campo donde ingresar un id corto. 
    2. Reconocido el código el backend inicia una sesión de control remoto.
    3. Desde el dispositivo controlador se pueden enviar scripts al visualizador
3. El visualizador permanece atento a los script que se le envíen desde el
    backend. Los ejecuta a media que los va recibiendo. 

