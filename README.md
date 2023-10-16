# DEMO - Culqi ReactJS + Culqi JS V4

La demo integra Culqi ReactJS, Culqi JS V4 , es compatible con la v2.0 del Culqi API, con esta demo podrás **generar tokens** (tarjeta y Yape) y confirmar órdenes.

## Requisitos

- ReactJS 17.0+
- Node 16+
- Afiliate [aquí](https://afiliate.culqi.com/).
- Si vas a realizar pruebas obtén tus llaves desde [aquí](https://integ-panel.culqi.com/#/registro), si vas a realizar transacciones reales obtén tus llaves desde [aquí](https://mipanel.culqi.com/#/registro).

> Recuerda que para obtener tus llaves debes ingresar a tu CulqiPanel > Desarrollo > ***API Keys***.

![alt tag](http://i.imgur.com/NhE6mS9.png)

> Recuerda que las credenciales son enviadas al correo que registraste en el proceso de afiliación.

* Para encriptar el payload debes generar un id y llave RSA  ingresando a CulqiPanel > Desarrollo  > RSA Keys.


## Instalación

Ejecuta los siguientes comandos:

```bash
npm install
```

## Configuración frontend
Puedes configurar el pk, sk, rsa_id, rsa_public_key del comercio inicia la aplicacion.


## Inicializar la demo
Ejecutar el siguiente comando:

```bash
npm start
```

## Probar la demo

Para poder visualizar el frontend de la demo ingresar a la siguiente URL:

http://localhost:3000/

## Documentación

- [Referencia de Documentación](https://docs.culqi.com/)
- [Referencia de API](https://apidocs.culqi.com/)
