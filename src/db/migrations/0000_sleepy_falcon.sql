CREATE TABLE `almacen` (
	`id` text PRIMARY KEY NOT NULL,
	`divisionId` text NOT NULL,
	`nombre` text NOT NULL,
	`placeId` text NOT NULL,
	`formattedAddress` text NOT NULL,
	`referencia` text NOT NULL,
	FOREIGN KEY (`divisionId`) REFERENCES `division`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `articulo` (
	`id` text PRIMARY KEY NOT NULL,
	`pedidoId` text NOT NULL,
	`productoId` text NOT NULL,
	`cantidad` real NOT NULL,
	`precioUnitario` real NOT NULL,
	`tasaDeIva` real NOT NULL,
	`retencionDeIva` real NOT NULL,
	`retencionDeIsr` real NOT NULL,
	`tasaDeIeps` real NOT NULL,
	FOREIGN KEY (`pedidoId`) REFERENCES `pedido`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`productoId`) REFERENCES `producto`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `pedido` (
	`id` text PRIMARY KEY NOT NULL,
	`divisionId` text NOT NULL,
	`createdAt` integer DEFAULT (unixepoch()) NOT NULL,
	`puntoDeEntregaId` text NOT NULL,
	`fechaDeEntrega` integer NOT NULL,
	FOREIGN KEY (`divisionId`) REFERENCES `division`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`puntoDeEntregaId`) REFERENCES `puntoDeEntrega`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `producto` (
	`id` text PRIMARY KEY NOT NULL,
	`divisionId` text NOT NULL,
	`codigo` text NOT NULL,
	`descripcion` text NOT NULL,
	`precioUnitario` real NOT NULL,
	`objetoDeImpuesto` text NOT NULL,
	`identificador` text(10) NOT NULL,
	`tipoDeIva` text NOT NULL,
	`tasaDeIva` real NOT NULL,
	`retencionDeIva` real NOT NULL,
	`retencionDeIsr` real NOT NULL,
	`tasaDeIeps` real NOT NULL,
	`cuentaContableId` integer NOT NULL,
	`unidadDeMedidaClave` text NOT NULL,
	`productoOServicioClave` integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE `parada` (
	`id` text PRIMARY KEY NOT NULL,
	`lunes` integer NOT NULL,
	`martes` integer NOT NULL,
	`miercoles` integer NOT NULL,
	`jueves` integer NOT NULL,
	`viernes` integer NOT NULL,
	`sabado` integer NOT NULL,
	`domingo` integer NOT NULL,
	`visitOrder` integer NOT NULL,
	`puntoDeEntregaId` text NOT NULL,
	`rutaId` text NOT NULL,
	FOREIGN KEY (`puntoDeEntregaId`) REFERENCES `puntoDeEntrega`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`rutaId`) REFERENCES `ruta`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `ruta` (
	`id` text PRIMARY KEY NOT NULL,
	`divisionId` text NOT NULL,
	`nombre` text NOT NULL,
	FOREIGN KEY (`divisionId`) REFERENCES `division`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `vehiculo` (
	`id` text PRIMARY KEY NOT NULL,
	`divisionId` text NOT NULL,
	`codigo` text NOT NULL,
	`descripcion` text NOT NULL,
	`tipoDeOdometro` text NOT NULL,
	`tipoDeVehiculo` text NOT NULL,
	`identificadorDeGps` text NOT NULL,
	`tipoDeCombustible` text NOT NULL,
	`numeroDePolizaDeSeguro` text NOT NULL,
	`fechaDeExpiracionDePolizaDeSeguro` integer NOT NULL,
	`horometraje` real NOT NULL,
	`choferId` text,
	FOREIGN KEY (`divisionId`) REFERENCES `division`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`choferId`) REFERENCES `chofer`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `chofer` (
	`id` text PRIMARY KEY NOT NULL,
	`codigo` text NOT NULL,
	`nombreCompleto` text NOT NULL,
	`numeroDeLicencia` text NOT NULL,
	`fechaDeVencimientoDeLicencia` integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE `cliente` (
	`id` text PRIMARY KEY NOT NULL,
	`codigo` text NOT NULL,
	`nombreComercial` text NOT NULL,
	`regimenCapital` text NOT NULL,
	`codigoPostal` text NOT NULL,
	`colonia` text NOT NULL,
	`pais` text NOT NULL,
	`calle` text NOT NULL,
	`ciudad` text NOT NULL,
	`estado` text NOT NULL,
	`nombreLegal` text NOT NULL,
	`rfc` text NOT NULL,
	`idTributario` text NOT NULL,
	`cuentaContableId` integer NOT NULL,
	`usoDeCfdiClave` text NOT NULL,
	`regimenFiscalClave` text NOT NULL,
	`formaDePagoClave` text NOT NULL,
	`topeDeCredito` integer NOT NULL,
	`descuento` integer NOT NULL,
	`diasACredito` integer NOT NULL,
	`esPrecioEspecial` integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE `contacto` (
	`id` text PRIMARY KEY NOT NULL,
	`grupo` text NOT NULL,
	`nombre` text NOT NULL,
	`correoElectronico` text NOT NULL,
	`lineaFija` text NOT NULL,
	`celular` text,
	`clienteId` text NOT NULL,
	FOREIGN KEY (`clienteId`) REFERENCES `cliente`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `precioEspecial` (
	`id` text PRIMARY KEY NOT NULL,
	`clienteId` text NOT NULL,
	`productoId` text NOT NULL,
	`precioEspecial` real NOT NULL,
	FOREIGN KEY (`clienteId`) REFERENCES `cliente`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`productoId`) REFERENCES `producto`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `puntoDeEntrega` (
	`id` text PRIMARY KEY NOT NULL,
	`clienteId` text NOT NULL,
	`nombre` text NOT NULL,
	`placeId` text NOT NULL,
	`formattedAddress` text NOT NULL,
	`referencia` text NOT NULL,
	FOREIGN KEY (`clienteId`) REFERENCES `cliente`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `division` (
	`id` text PRIMARY KEY NOT NULL,
	`nombre` text NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `almacen_nombre_unique` ON `almacen` (`nombre`);--> statement-breakpoint
CREATE UNIQUE INDEX `articulo_pedidoId_productoId_unique` ON `articulo` (`pedidoId`,`productoId`);--> statement-breakpoint
CREATE UNIQUE INDEX `producto_codigo_unique` ON `producto` (`codigo`);--> statement-breakpoint
CREATE UNIQUE INDEX `parada_rutaId_puntoDeEntregaId_unique` ON `parada` (`rutaId`,`puntoDeEntregaId`);--> statement-breakpoint
CREATE UNIQUE INDEX `ruta_nombre_unique` ON `ruta` (`nombre`);--> statement-breakpoint
CREATE UNIQUE INDEX `vehiculo_codigo_unique` ON `vehiculo` (`codigo`);--> statement-breakpoint
CREATE UNIQUE INDEX `vehiculo_choferId_unique` ON `vehiculo` (`choferId`);--> statement-breakpoint
CREATE UNIQUE INDEX `chofer_codigo_unique` ON `chofer` (`codigo`);--> statement-breakpoint
CREATE UNIQUE INDEX `cliente_codigo_unique` ON `cliente` (`codigo`);--> statement-breakpoint
CREATE UNIQUE INDEX `precioEspecial_clienteId_productoId_unique` ON `precioEspecial` (`clienteId`,`productoId`);--> statement-breakpoint
CREATE UNIQUE INDEX `puntoDeEntrega_nombre_unique` ON `puntoDeEntrega` (`nombre`);--> statement-breakpoint
CREATE UNIQUE INDEX `division_nombre_unique` ON `division` (`nombre`);