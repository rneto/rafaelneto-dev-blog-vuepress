---
date: 2023-5-8
tags:
  - Git
  - SSH
permalink: /blog/:slug
---

# Uso de claves SSH con Git y su configuración en BitBucket, Sourcetree, GitHub y VSCode

<social-share class="social-share--header" />

Cuando nos conectamos a un repositorio Git remoto, solemos tener dos opciones de conexión, HTTPS y SSH. Con HTTPS la comunicación se realiza mediante una capa segura que cifra la comunicación HTTP entre el cliente y servidor (_HTTPS = HTTP + SSL/TLS_), sin embargo, SSH es un canal de comunicación seguro que se establece entre dos máquinas y que permite el acceso remoto a un servidor para el intercambio cifrado de información o para la ejecución remota de comandos.

Para conectarnos a un repositorio Git privado mediante HTTPS usaríamos la clásica autenticación con contraseña y que nos permitiría conectarnos a un servidor Git desde cualquier ubicación simplemente usando nuestro usuario y contraseña. Ciertamente es un protocolo fácil de configurar y de usar en la mayoría de plataformas y redes.

En el caso de la conexión y autenticación a Git basada en claves SSH, la conexión entre el cliente y el servidor se produce por la coincidencia del par de claves (pública y privada), una usada por el cliente (la clave privada) y la otra por el servidor (la clave pública), para establecer un canal seguro de comunicación en el que toda la información está cifrada. Podríamos ver a la clave pública como un candado y a la clave privada como la llave que lo abre (ambos elementos generados por nosotros), por lo que nosotros otorgamos con la clave pública que cualquiera pueda bloquear la información que posteriormente nosotros abriremos con la clave privada (nuestra llave).

Realmente ambos protocolos harán bien su trabajo de guardar a salvo la información intercambiada, siempre y cuando las claves estén bien protegidas, por lo que tanto HTTPS como SSH proporcionan una conexión segura a salvo de ataques de intermediarios. A pesar de ello, me gustaría destacar algunos aspectos diferenciadores en cuanto la seguridad de ambos protocolos:

- En el caso de HTTPS con Git, la contraseña será parte del mensaje enviado al servidor, sin embargo con SSH la clave privada no se envia al servidor y sólo se usa por parte del cliente para la autenticación durante la fase de creación del canal seguro de comunicación.
- En el caso de SSH, la propia longitud de la clave, su unicidad y la dificulad de su manejo, la hacen generalmente más segura, sin embargo tiene el inconveniente de que se almacena físicamente como un archivo en el disco. De todos modos como veremos más adelante durante los pasos de cómo crear nuestras claves SSH, podremos proteger la clave privada con una frase de seguridad.
- Con ambos protocolos podemos usar 2FA (doble factor de autenticación), aunque según la plataforma puede ser más sencillo su uso según el protocolo elegido.

## ¿Cómo crear claves SSH?

Las claves SSH son generadas automáticamente mediante herramientas a partir de algoritmos criptográficos y fórmulas matemáticas que garantizan su seguridad y que además la clave pública derive de la clave privada.

Tanto Linux como OsX cuentan con terminales que incluyen la suite SSH, sin embargo en el caso de Windows debemos hacer uso de opciones tales como _Git Bash_.

### ssh-keygen

1. En primer lugar, desde nuestra terminal (Mac/Linux) o Git Bash (Windows) ejecutamos el siguiente comando:

``` bash
ssh-keygen -t rsa -b 4096 -C "tu@email.com"
```

2. A continuación se nos preguntará por el nombre del fichero donde queremos guardar nuestra clave. Podemos simplemente pulsar "Intro" para usar el nombre por defecto _id_rsa_ o también podemos especificar uno manualmente y pulsar "Intro".

``` bash
Enter file in which to save the key (/c/Users/rafaelneto/.ssh/id_rsa):
```

3. El siguiente mensaje nos preguntará por la frase de seguridad, la cual protegerá nuestra clave si alguien accede a la máquina donde hemos almacenado nuestra clave privada. Podríamos simplemente pulsar "Intro" sin introducir la frase de seguridad para omitir este paso, pero dada la importancia de la clave privada, no deberíamos omitir esa capa de seguridad añadida.

``` bash
Enter passphrase (empty for no passphrase):
```

En este punto nuestras claves SSH se habrán generado en dos ficheros, en la ruta que habíamos especificado. Uno de ellos contendrá nuestra clave privada a partir del nombre que hayamos especificado en el paso _2._ y otro (con el mismo nombre pero con extensión _.pub_) contendrá nuestra clave pública.

### ssh-agent

El programa _ssh-agent_ es el encargado de almacenar y gestionar las claves privadas durante las conexiones, por lo que si no queremos tener que escribir nuestra contraseña cada vez que usemos nuestra clave, debemos hacer uso de él.

1. Comprobamos que el agente se está ejecutando (y lo arrancamos si no lo estuviera):

``` bash
eval "$(ssh-agent -s)"
```

Tendremos como respuesta el identificador del proceso:

``` bash
Agent pid 445
```

2. Añadimos nuestra clave al agente SSH:

``` bash
ssh-add /c/Users/rafaelneto/.ssh/id_rsa
```

Si durante la creación de la clave privada hubiéramos establecido una frase de seguridad, en este paso se nos solicitará que la introduzcamos.

## Configuración de claves SSH en Bitbucket

Para hacer uso de SSH con Bitbucket, en primer lugar debemos añadir nuestra clave pública a nuestro perfil de Bitbucket, para ello:

1. Accedemos a nuestra configuración personal (_Personal Bitbucket Settings_).
1. Clicamos en la opción de seguridad _SSH keys_. Si ya tenemos claves añadidas, las veremos en esta pantalla.
1. Abrimos nuestro fichero _.ssh/id_rsa.pub_ (o con el nombre que le hayamos indicado para el fichero de la clave pública).
1. Copiamos el contenido del fichero de la clave pública (es posible que veamos nuestro email en la última línea del fichero, con lo que no importa si copiamos o no dicha línea).
1. Desde el panel de Bitbucket pulsamos en _Add key_.
1. Introducimos una etiqueta (_Label_) para nuestra nueva clave.
1. Pegamos la clave pública copiada en el campo _Key_.
1. Pulsamos en _Add key_ para guardar los cambios.
1. Bitbucket nos enviará un email para avisarnos sobre la adicción de la nueva clave.

En este punto ya podemos volver a nuestra línea de comandos y verificar nuestra configuración mediante el siguiente comando:

``` bash
ssh -T git@bitbucket.org
```

Se nos mostrará un mensage del tipo _You can use git to connect to Bitbucket._, que nos indica que ya nos podemos conectar a Bitbucket con dicha clave.

Ahora ya tenemos nuestra clave SSH configurada, así que la próxima vez que clonemos un repositorio de Bitbucket deberemos hacer uso de la URL SSH. Si ya tenemos un repositorio clonado previamente a través de HTTPS, debemos cambiar la URL remota de nuestro repositorio a la URL SSH.

## Configuración de claves SSH en GitHub

Para hacer uso de SSH con GitHub, en primer lugar debemos añadir nuestra clave pública a nuestro perfil de GitHub, para ello:

1. Accedemos a nuestra configuración personal (_Settings_).
1. Clicamos en la opción de acceso _SSH and GPG keys_. Si ya tenemos claves añadidas, las veremos en esta pantalla.
1. Abrimos nuestro fichero _.ssh/id_rsa.pub_ (o con el nombre que le hayamos indicado para el fichero de la clave pública).
1. Copiamos el contenido del fichero de la clave pública (es posible que veamos nuestro email en la última línea del fichero, con lo que no importa si copiamos o no dicha línea).
1. Desde el panel de GitHub pulsamos en _New SSH key_.
1. Introducimos un título (_Title_) para nuestra nueva clave.
1. Seleccionamos el tipo de uso de la clave para autenticación (_Authentication Key_).
1. Pegamos la clave pública copiada en el campo _Key_.
1. Pulsamos en _Add SSH key_ para guardar los cambios.
1. GitHub nos enviará un email para avisarnos sobre la adicción de la nueva clave pública.

En este punto ya podemos volver a nuestra línea de comandos y verificar nuestra configuración mediante el siguiente comando:

``` bash
ssh -T git@github.com
```

Es posible que veamos algún mensaje de aviso del tipo _The authenticity of host 'github.com (IP)' can't be established. ED25519 key fingerprint is SHA256:+DiY3wvvV6TuJJhbpZisF/zLDA0zPMSvHdkr4UvCOqU. This key is not known by any other names. Are you sure you want to continue connecting (yes/no/[fingerprint])?_.

Al aceptar la conexión, finalmente se nos mostrará un mensage del tipo _Warning: Permanently added 'github.com' (ED25519) to the list of known hosts. Hi USER! You've successfully authenticated, but GitHub does not provide shell access._, que nos indica que ya nos podemos conectar a GitHub con dicha clave.

Ahora ya tenemos nuestra clave SSH configurada, así que la próxima vez que clonemos un repositorio de GitHub deberemos hacer uso de la URL SSH. Si ya tenemos un repositorio clonado previamente a través de HTTPS, debemos cambiar la URL remota de nuestro repositorio a la URL SSH.

### Cambiar la URL remota de un repositorio de Bitbucket clonado con HTTPS a SSH

Para cambiar la URL remota de un repositorio clonado con HTTPS a SSH, debemos seguir los siguientes pasos:

1. Obtenemos la URL SSH del repositorio:
    1. En **Bitbucket**:
        1. En la página del repositorio en Bitbucket hacemos clic en el botón "Clone" en la parte superior derecha.
        1. Seleccionamos "SSH" en el menú desplegable.
        1. Copiamos la URL que aparece en la ventana de diálogo. Debemos obviar la primera parte del comando _git clone_ y sólo copiar a partir de _git@bitbucket..._
    1. En **GitHub**:
        1. En la página del repositorio en GitHub hacemos clic en el botón "<> Code" en la parte superior derecha del panel central.
        1. Seleccionamos la pestaña "SSH".
        1. Copiamos la URL que aparece en la ventana de diálogo. Nuestra URL empezará con _git@github..._
1. Cambiamos la URL remota:
    1. Abrimos la línea de comandos y navegamos hasta el directorio del repositorio Git que deseamos actualizar.
    1. Ejecutamos el siguiente comando para cambiar la URL remota del repositorio de HTTPS a SSH: ```git remote set-url origin <la URL SSH copiada>```
1. Verificamos la configuración:
    1. Basta con ejecutar el comando ```git remote -v```
    1. Se mostrará las URL de los repositorios remotos configurados actualmente. La URL para la rama principal `origin` debería ahora ser la URL SSH que acabamos de configurar.

A partir de este momento, ya podemos continuar trabajando con Git como de costumbre.

## Configuración de la clave privada SSH en Sourcetree

Para configurar nuestra clave privada SSH en Sourcetree debemos seguir los siguientes pasos:

1. Abrimos Sourcetree.
1. Accedemos al panel de opciones de configuración mediante el menú "Tools" en la barra de menú superior y seleccionando "Options" en el menú desplegable.
1. Desde la pestaña "General", seleccionamos en la sección "SSH Client Configuration" la opción "OpenSSH" del desplegable "SSH Cliente".
1. También en la sección "SSH Client Configuration", hacemos clic en el botón "..." para agregar la clave privada SSH. Esto abrirá una ventana para seleccionar el archivo de clave privada que queremos usar.
1. Tras especificar la clave privada hacemos clic en el botón "OK" para guardar la configuración. Si la clave privada estuviera protegida con una frase de seguridad, se nos solicitará que la especifquemos en este paso.

Una vez que hayas agregado la clave SSH en Sourcetree ya podemos usarla para conectarnos a los repositorios remotos que requieren autenticación SSH.

## Configuración de la clave privada SSH en VSCode

Una vez hayamos configurado nuestras claves SSH para ser usadas con proveedor de repositorios Git remoto (Bitbucket, GitHub u otros) y usadas éstas para la configuración o clonado de un repositorio (como hemos visto anteriormente), la próxima vez que nos conectemos desde VSCode al repositorio Git remoto, se usará de manera predeterminada SSH en nuestras conexiones, por lo que no debemos realizar ninguna configuración adicional específica en VSCode. Lo único que podría ocurrir es que VSCode nos solicitara la frase de seguridad que hayamos establecido al generar nuestra clave privada.

---
<social-share class="social-share--footer" />