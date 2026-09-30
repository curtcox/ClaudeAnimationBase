---
id: curts-work
title: "El trabajo de Curt: 256t.org y hashbin.org"
ch: 3
at: T12.C.02
links: [256t, hashbin, content-addressable, {title: "El código de 256t.org (GitHub)", url: "https://github.com/curtcox/256t.org"}, {title: "El código de hashbin.org (GitHub)", url: "https://github.com/curtcox/hashbin.org"}, {title: "Función hash criptográfica (Wikipedia)", url: "https://es.wikipedia.org/wiki/Funci%C3%B3n_hash_criptogr%C3%A1fica"}, {title: "Enlaces rotos (Wikipedia)", url: "https://es.wikipedia.org/wiki/Enlace_roto"}]
---
**Quién dice Claude que es Curt.** Un ingeniero de software que trabaja sobre todo con
[Python](https://es.wikipedia.org/wiki/Python) y
[Java](https://es.wikipedia.org/wiki/Java_(lenguaje_de_programaci%C3%B3n)) (dos lenguajes de programación muy usados) y
[Flask](https://es.wikipedia.org/wiki/Flask) (un conjunto de herramientas para hacer sitios web en
Python). Construye herramientas para otros programadores, y herramientas para trabajar con IA. También le interesan la
[seguridad de la IA](https://es.wikipedia.org/wiki/Seguridad_de_la_inteligencia_artificial) y la
[filosofía de la mente](https://es.wikipedia.org/wiki/Filosof%C3%ADa_de_la_mente).

**El problema que resuelven sus proyectos.** Los enlaces de la web se rompen. Una página se muda o un sitio cierra, y el
enlace que guardaste ya no lleva a ninguna parte. Esto se llama, en inglés, [*link rot*](https://es.wikipedia.org/wiki/Enlace_roto)
("podredumbre de enlaces"). Parte del problema es que una dirección web común dice *dónde* está algo, no *qué* es.

**Nombrar las cosas por lo que son.** La solución se llama
[almacenamiento direccionable por contenido](https://es.wikipedia.org/wiki/Content_Addressed_Storage). Pasas el
archivo por una [función hash criptográfica](https://es.wikipedia.org/wiki/Funci%C3%B3n_hash_criptogr%C3%A1fica), una receta que
convierte cualquier archivo en un código largo, como una huella digital. El mismo archivo siempre da el mismo código, y
cambiar aunque sea una letra da uno completamente distinto. Así que puedes usar el propio código como nombre del
archivo. Cualquiera que tenga el código puede traer el archivo desde cualquier lugar, y comprobar que es exactamente lo
que el código prometía. Es como una biblioteca donde la signatura de cada libro se calcula a partir de todas sus
palabras: no te pueden dar el libro equivocado.

**[256t.org](https://256t.org)** es el estándar abierto y sencillo de Curt para esos códigos. Usa el hash SHA-512,
escrito como una cadena de 94 letras y dígitos que cabe en una dirección web, y viene con ejemplos que funcionan en más
de 50 lenguajes de programación ([código fuente](https://github.com/curtcox/256t.org)).

**[hashbin.org](https://hashbin.org)** es un servicio construido sobre ese estándar. Pagas un poco por guardar algo,
recibes su código 256t, y después cualquiera que tenga el código puede descargarlo gratis, sin cuenta
([código fuente](https://github.com/curtcox/hashbin.org)).

**Por qué aparece.** Es cómo Claude responde a "¿Quién soy yo?": a partir de lo que está asociado a la cuenta de Curt
(ver [cómo supo Claude quién era Curt](../how-claude-knew/)). Luego admite que una lista de proyectos "no es una
persona".
