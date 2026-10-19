# Estado del proyecto — Urban Studio

**Última actualización:** 19/10/2026

## 1. Tecnologías

- Astro 7.4.1.
- Tailwind CSS 4.
- JavaScript.
- Supabase: pendiente de configuración para base de datos y autenticación.
- Cloudinary: previsto para almacenar y gestionar imágenes.
- AgendaPro: plataforma externa para las reservas.

## 2. Funcionalidades implementadas

- Sitio público con diseño oscuro, detalles dorados y adaptación a dispositivos móviles.
- Navbar fijo con fondo negro sólido y navegación entre secciones.
- Desplazamiento suave al navegar mediante enlaces internos.
- Hero principal con texto, imagen y botones de acción.
- Sección de servicios con los tres servicios del negocio.
- Sección institucional.
- Perfil del barbero Julián Villagra.
- Galería de cortes con imágenes locales.
- Enlaces de reserva conectados con AgendaPro.
- Sección de contacto con dirección, días de atención y mapa de Google Maps.
- Footer con identidad de Urban Studio y enlaces a Instagram y WhatsApp.
- Datos y enlaces del negocio centralizados parcialmente en `src/config/site.js`.

## 3. Datos del negocio

- Nombre: Urban Studio.
- Profesional: Julián Villagra.
- Dirección: Ramón Carrillo 2243, Local 2, Yerba Buena, Tucumán.
- Atención: martes a sábado.
- Reservas: AgendaPro.
- Instagram: https://www.instagram.com/julianvillagra_/

## 4. Pendiente de desarrollo

### Sitio público
- Revisar el diseño final de todas las secciones.
- Confirmar que el Hero personalizado esté aplicado y revisar la presentación en distintos tamaños de pantalla.
- Verificar la ubicación exacta del mapa.
- Incorporar precios y duración de los servicios cuando el negocio los confirme.
- Definir el logo definitivo.
- Preparar el despliegue y el dominio.

### Backend y administración
- Configurar el proyecto de Supabase.
- Diseñar y crear las tablas de la base de datos.
- Configurar Supabase Auth para iniciar sesión.
- Definir roles y permisos.
- Aplicar políticas de seguridad RLS.
- Integrar Cloudinary para las imágenes.
- Crear el panel del propietario.
- Permitir que el profesional gestione su propia galería.

## 5. Decisiones de arquitectura

- AgendaPro seguirá administrando las reservas; no se desarrollará un sistema de turnos propio en esta etapa.
- Supabase será la base de datos y el servicio de autenticación.
- Cloudinary se utilizará para alojar las imágenes de la galería.
- El propietario tendrá permisos de administración general.
- El profesional podrá gestionar su propia galería, sin acceso a la administración global.
- La información pública del negocio deberá poder administrarse sin modificar manualmente el código.

## 6. Próximo paso

Diseñar la estructura de la base de datos de Supabase, definir las relaciones entre tablas y establecer las reglas de acceso antes de implementar el panel de administración.

**Estado general:** sitio público funcional en desarrollo. Próxima etapa: backend, base de datos, autenticación y panel administrativo.