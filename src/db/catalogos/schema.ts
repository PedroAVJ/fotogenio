import { mysqlTable, smallint, primaryKey, tinyint, char, varchar, int, binary, date, mediumint, decimal, double } from "drizzle-orm/mysql-core"

export const bancoOtrasconfig = mysqlTable("banco_otrasconfig", {
	id: tinyint("id").autoincrement().notNull(),
	noBanco: tinyint("no_banco").default(0).notNull(),
	bancoSaai: char("bancoSaai", { length: 5 }),
	bancoSaaiInd: varchar("bancoSaaiInd", { length: 70 }),
},
(table) => {
	return {
		bancoOtrasconfigId: primaryKey({ columns: [table.id], name: "banco_otrasconfig_id"}),
	}
});

export const cColonia = mysqlTable("c_colonia", {
	cColonia: varchar("c_Colonia", { length: 255 }),
	cCodigoPostal: varchar("c_CodigoPostal", { length: 255 }),
	nombreAsentamiento: varchar("nombreAsentamiento", { length: 255 }),
});

export const cCp = mysqlTable("c_cp", {
	cCp: varchar("c_CP", { length: 255 }),
	cEstado: varchar("c_Estado", { length: 255 }),
	cMunicipio: varchar("c_Municipio", { length: 255 }),
	cLocalidad: varchar("c_Localidad", { length: 255 }),
});

export const catPatterns = mysqlTable("cat_patterns", {
	idPattern: smallint("idPattern", { unsigned: true }).autoincrement().notNull(),
	pattern: varchar("pattern", { length: 200 }),
	descripcion: varchar("Descripcion", { length: 100 }),
},
(table) => {
	return {
		catPatternsIdPattern: primaryKey({ columns: [table.idPattern], name: "cat_patterns_idPattern"}),
	}
});

export const conexiones = mysqlTable("conexiones", {
	id: smallint("id", { unsigned: true }).notNull(),
	nombre: varchar("nombre", { length: 30 }).default('').notNull(),
	driver: varchar("driver", { length: 80 }).default('').notNull(),
	cHost: varchar("cHost", { length: 80 }).default('').notNull(),
	cDatabase: varchar("cDatabase", { length: 30 }),
	cPort: int("cPort").default(0).notNull(),
	username: char("username", { length: 15 }).default('').notNull(),
	cPassword: varchar("cPassword", { length: 100 }).default('').notNull(),
	path: varchar("path", { length: 70 }).default('').notNull(),
	idEmpresa: char("idEmpresa", { length: 10 }).default('').notNull(),
},
(table) => {
	return {
		conexionesIdEmpresaId: primaryKey({ columns: [table.idEmpresa, table.id], name: "conexiones_idEmpresa_id"}),
	}
});

export const empresas = mysqlTable("empresas", {
	id: char("id", { length: 10 }).default('0').notNull(),
	nombre: varchar("nombre", { length: 70 }).default('').notNull(),
	sistema: varchar("sistema", { length: 20 }),
},
(table) => {
	return {
		empresasId: primaryKey({ columns: [table.id], name: "empresas_id"}),
	}
});

export const satCatBancosAnexo = mysqlTable("sat_cat_bancos_anexo", {
	clave: char("clave", { length: 3 }).notNull(),
	logo: binary("logo", { length: 1 }),
	rfc: varchar("rfc", { length: 12 }),
	url: varchar("url", { length: 100 }),
},
(table) => {
	return {
		satCatBancosAnexoClave: primaryKey({ columns: [table.clave], name: "sat_cat_bancos_anexo_clave"}),
	}
});

export const satCatalogobancos = mysqlTable("sat_catalogobancos", {
	clave: char("clave", { length: 3 }).notNull(),
	nombreC: varchar("nombre_c", { length: 40 }),
	nombre: varchar("nombre", { length: 254 }),
},
(table) => {
	return {
		satCatalogobancosClave: primaryKey({ columns: [table.clave], name: "sat_catalogobancos_clave"}),
	}
});

export const satCatalogocuentas = mysqlTable("sat_catalogocuentas", {
	nivel: tinyint("nivel").default(0).notNull(),
	clave: char("clave", { length: 6 }).default('').notNull(),
	descrip: varchar("descrip", { length: 200 }).default('').notNull(),
},
(table) => {
	return {
		satCatalogocuentasClave: primaryKey({ columns: [table.clave], name: "sat_catalogocuentas_clave"}),
	}
});

export const satCatalogopys = mysqlTable("sat_catalogopys", {
	clave: int("Clave").notNull(),
	descripcion: varchar("Descripcion", { length: 100 }),
	incluirIva: char("IncluirIVA", { length: 8 }),
	incluirIeps: char("IncluirIEPS", { length: 2 }),
	complemento: varchar("Complemento", { length: 10 }),
},
(table) => {
	return {
		satCatalogopysClave: primaryKey({ columns: [table.clave], name: "sat_catalogopys_Clave"}),
	}
});

export const satClaveunidad = mysqlTable("sat_claveunidad", {
	clave: char("clave", { length: 4 }).default('').notNull(),
	nombre: varchar("nombre", { length: 150 }),
	descripcion: varchar("descripcion", { length: 1000 }),
	habilitar: tinyint("habilitar").default(0).notNull(),
},
(table) => {
	return {
		satClaveunidadClave: primaryKey({ columns: [table.clave], name: "sat_claveunidad_clave"}),
	}
});

export const satCodpost = mysqlTable("sat_codpost", {
	cCodPost: char("c_codPost", { length: 5 }).default('').notNull(),
	cEstado: char("c_Estado", { length: 3 }).default('').notNull(),
	cMunicipio: char("c_Municipio", { length: 3 }).default('').notNull(),
	cLocalidad: char("c_Localidad", { length: 2 }).default('').notNull(),
},
(table) => {
	return {
		satCodpostCCodPost: primaryKey({ columns: [table.cCodPost], name: "sat_codpost_c_codPost"}),
	}
});

export const satEstados = mysqlTable("sat_estados", {
	cEstado: varchar("c_Estado", { length: 255 }),
	cPais: varchar("c_Pais", { length: 255 }),
	nombreEstado: varchar("nombreEstado", { length: 255 }),
});

export const satFormapago = mysqlTable("sat_formapago", {
	cFormaPago: char("c_FormaPago", { length: 2 }).default('').notNull(),
	descripcion: varchar("descripcion", { length: 100 }),
	bancarizado: varchar("bancarizado", { length: 15 }),
	numOperacion: varchar("numOperacion", { length: 15 }),
	rfcEmisorCuentaOrdenante: varchar("rfcEmisorCuentaOrdenante", { length: 15 }),
	cuentaOrdenante: varchar("cuentaOrdenante", { length: 15 }),
	patronCuentaOrdenante: varchar("patronCuentaOrdenante", { length: 100 }),
	rfcEmisorCuentaBeneficiario: varchar("rfcEmisorCuentaBeneficiario", { length: 15 }),
	cuentaBeneficiario: varchar("cuentaBeneficiario", { length: 15 }),
	patronCuentaBeneficiaria: varchar("patronCuentaBeneficiaria", { length: 100 }),
	tipoCadenaPago: varchar("tipoCadenaPago", { length: 15 }),
	bancoEmisor: varchar("bancoEmisor", { length: 255 }),
},
(table) => {
	return {
		satFormapagoCFormaPago: primaryKey({ columns: [table.cFormaPago], name: "sat_formapago_c_FormaPago"}),
	}
});

export const satImpuestos = mysqlTable("sat_impuestos", {
	cImpuesto: char("c_impuesto", { length: 3 }).default('').notNull(),
	descripcion: char("descripcion", { length: 5 }).default('').notNull(),
	retiene: tinyint("retiene").default(0).notNull(),
	traslada: tinyint("traslada").default(0).notNull(),
	usar: tinyint("usar").default(0).notNull(),
},
(table) => {
	return {
		satImpuestosCImpuesto: primaryKey({ columns: [table.cImpuesto], name: "sat_impuestos_c_impuesto"}),
	}
});

export const satMetodopago = mysqlTable("sat_metodopago", {
	cMetodopago: char("c_metodopago", { length: 3 }).default('').notNull(),
	descripcion: varchar("descripcion", { length: 100 }),
},
(table) => {
	return {
		satMetodopagoCMetodopago: primaryKey({ columns: [table.cMetodopago], name: "sat_metodopago_c_metodopago"}),
	}
});

export const satMotivos = mysqlTable("sat_motivos", {
	clave: char("clave", { length: 2 }).notNull(),
	descrip: varchar("descrip", { length: 55 }),
},
(table) => {
	return {
		satMotivosClave: primaryKey({ columns: [table.clave], name: "sat_motivos_clave"}),
	}
});

export const satNominaPeriodicidad = mysqlTable("sat_nomina_periodicidad", {
	cPeriodicidadPago: char("c_PeriodicidadPago", { length: 3 }).default('').notNull(),
	descripcion: varchar("Descripcion", { length: 30 }).notNull(),
	// you can use { mode: 'date' }, if you want to have Date as type for this column
	fechaIniVigencia: date("Fecha_ini_vigencia", { mode: 'string' }).notNull(),
	// you can use { mode: 'date' }, if you want to have Date as type for this column
	fechaFinVigencia: date("Fecha_fin_vigencia", { mode: 'string' }),
	diasPago: mediumint("dias_pago").default(1).notNull(),
	editable: tinyint("editable").default(0).notNull(),
	topeDobles: tinyint("tope_dobles").notNull(),
	// Warning: Can't parse float(5,2) from database
	// float(5,2)Type: float(5,2)("factor").notNull(),
},
(table) => {
	return {
		satNominaPeriodicidadCPeriodicidadPago: primaryKey({ columns: [table.cPeriodicidadPago], name: "sat_nomina_periodicidad_c_PeriodicidadPago"}),
	}
});

export const satNominaRiesgopuesto = mysqlTable("sat_nomina_riesgopuesto", {
	cRiesgoPuesto: char("c_RiesgoPuesto", { length: 3 }).default('').notNull(),
	descripcion: varchar("Descripcion", { length: 100 }).notNull(),
},
(table) => {
	return {
		satNominaRiesgopuestoCRiesgoPuesto: primaryKey({ columns: [table.cRiesgoPuesto], name: "sat_nomina_riesgopuesto_c_RiesgoPuesto"}),
	}
});

export const satNominaTipocontrato = mysqlTable("sat_nomina_tipocontrato", {
	cTipoContrato: char("c_TipoContrato", { length: 3 }).default('').notNull(),
	descripcion: varchar("Descripcion", { length: 100 }).notNull(),
},
(table) => {
	return {
		satNominaTipocontratoCTipoContrato: primaryKey({ columns: [table.cTipoContrato], name: "sat_nomina_tipocontrato_c_TipoContrato"}),
	}
});

export const satNominaTipodeduccion = mysqlTable("sat_nomina_tipodeduccion", {
	cTipoDeduccion: char("c_TipoDeduccion", { length: 3 }).default('').notNull(),
	descripcion: varchar("Descripcion", { length: 100 }).notNull(),
	// you can use { mode: 'date' }, if you want to have Date as type for this column
	fechaIniVigencia: date("Fecha_ini_vigencia", { mode: 'string' }).notNull(),
	// you can use { mode: 'date' }, if you want to have Date as type for this column
	fechaFinVigencia: date("Fecha_fin_vigencia", { mode: 'string' }),
},
(table) => {
	return {
		satNominaTipodeduccionCTipoDeduccion: primaryKey({ columns: [table.cTipoDeduccion], name: "sat_nomina_tipodeduccion_c_TipoDeduccion"}),
	}
});

export const satNominaTipohoras = mysqlTable("sat_nomina_tipohoras", {
	cTipoHoras: char("c_TipoHoras", { length: 3 }).default('').notNull(),
	descripcion: varchar("Descripcion", { length: 100 }).notNull(),
},
(table) => {
	return {
		satNominaTipohorasCTipoHoras: primaryKey({ columns: [table.cTipoHoras], name: "sat_nomina_tipohoras_c_TipoHoras"}),
	}
});

export const satNominaTipoincapacidad = mysqlTable("sat_nomina_tipoincapacidad", {
	cTipoIncapacidad: char("c_TipoIncapacidad", { length: 3 }).default('').notNull(),
	descripcion: varchar("Descripcion", { length: 100 }).notNull(),
},
(table) => {
	return {
		satNominaTipoincapacidadCTipoIncapacidad: primaryKey({ columns: [table.cTipoIncapacidad], name: "sat_nomina_tipoincapacidad_c_TipoIncapacidad"}),
	}
});

export const satNominaTipojornada = mysqlTable("sat_nomina_tipojornada", {
	cTipoJornada: char("c_TipoJornada", { length: 3 }).default('').notNull(),
	descripcion: varchar("Descripcion", { length: 100 }).notNull(),
},
(table) => {
	return {
		satNominaTipojornadaCTipoJornada: primaryKey({ columns: [table.cTipoJornada], name: "sat_nomina_tipojornada_c_TipoJornada"}),
	}
});

export const satNominaTipopercepcion = mysqlTable("sat_nomina_tipopercepcion", {
	cTipoPercepcion: char("c_TipoPercepcion", { length: 3 }).default('').notNull(),
	descripcion: varchar("Descripcion", { length: 100 }).notNull(),
	// you can use { mode: 'date' }, if you want to have Date as type for this column
	fechaIniVigencia: date("Fecha_ini_vigencia", { mode: 'string' }).notNull(),
	// you can use { mode: 'date' }, if you want to have Date as type for this column
	fechaFinVigencia: date("Fecha_fin_vigencia", { mode: 'string' }),
},
(table) => {
	return {
		satNominaTipopercepcionCTipoPercepcion: primaryKey({ columns: [table.cTipoPercepcion], name: "sat_nomina_tipopercepcion_c_TipoPercepcion"}),
	}
});

export const satNominaTiporegimen = mysqlTable("sat_nomina_tiporegimen", {
	cTipoRegimen: char("c_TipoRegimen", { length: 3 }).default('').notNull(),
	descripcion: varchar("Descripcion", { length: 100 }).notNull(),
},
(table) => {
	return {
		satNominaTiporegimenCTipoRegimen: primaryKey({ columns: [table.cTipoRegimen], name: "sat_nomina_tiporegimen_c_TipoRegimen"}),
	}
});

export const satRegimenfiscal = mysqlTable("sat_regimenfiscal", {
	clave: char("clave", { length: 3 }).default('').notNull(),
	descrip: varchar("descrip", { length: 80 }).default('').notNull(),
	fisica: tinyint("fisica").default(0).notNull(),
	moral: tinyint("moral").default(0).notNull(),
},
(table) => {
	return {
		satRegimenfiscalClave: primaryKey({ columns: [table.clave], name: "sat_regimenfiscal_clave"}),
	}
});

export const satRiesgoPuesto = mysqlTable("sat_riesgoPuesto", {
	idRiesgo: tinyint("id_riesgo").default(0).notNull(),
	descrip: char("Descrip", { length: 10 }).default('').notNull(),
},
(table) => {
	return {
		satRiesgoPuestoIdRiesgo: primaryKey({ columns: [table.idRiesgo], name: "sat_riesgoPuesto_id_riesgo"}),
	}
});

export const satTasacuota = mysqlTable("sat_tasacuota", {
	tipo: char("tipo", { length: 1 }).default('F').notNull(),
	valorMin: decimal("valorMin", { precision: 1, scale: 0 }).default('0').notNull(),
	valorMax: decimal("valorMax", { precision: 7, scale: 5 }).default('0.00000').notNull(),
	impuesto: char("impuesto", { length: 3 }).default('').notNull(),
});

export const satTipoRelacion = mysqlTable("sat_tipo_relacion", {
	cTipoRelacion: char("c_tipoRelacion", { length: 2 }).default('').notNull(),
	descripcion: varchar("descripcion", { length: 100 }),
},
(table) => {
	return {
		satTipoRelacionCTipoRelacion: primaryKey({ columns: [table.cTipoRelacion], name: "sat_tipo_relacion_c_tipoRelacion"}),
	}
});

export const satTipocomprobante = mysqlTable("sat_tipocomprobante", {
	cTipoComprobante: char("c_tipoComprobante", { length: 1 }).notNull(),
	descripcion: varchar("descripcion", { length: 100 }),
	valorMaximo: int("valorMaximo"),
},
(table) => {
	return {
		satTipocomprobanteCTipoComprobante: primaryKey({ columns: [table.cTipoComprobante], name: "sat_tipocomprobante_c_tipoComprobante"}),
	}
});

export const satUsocfdi = mysqlTable("sat_usocfdi", {
	cUsoCfdi: char("c_UsoCFDI", { length: 4 }).notNull(),
	descripcion: varchar("Descripcion", { length: 200 }),
	fisica: tinyint("Fisica").default(1).notNull(),
	moral: tinyint("Moral").default(1).notNull(),
	// you can use { mode: 'date' }, if you want to have Date as type for this column
	fechaInicioVigencia: date("FechaInicioVigencia", { mode: 'string' }),
	// you can use { mode: 'date' }, if you want to have Date as type for this column
	fechaFinVigencia: date("FechaFinVigencia", { mode: 'string' }),
},
(table) => {
	return {
		satUsocfdiCUsoCfdi: primaryKey({ columns: [table.cUsoCfdi], name: "sat_usocfdi_c_UsoCFDI"}),
	}
});

export const tocatctaBase = mysqlTable("tocatcta_base", {
	cuenta: double("cuenta"),
	subCta: double("sub_cta"),
	nombre: varchar("nombre", { length: 255 }),
	tipo: varchar("tipo", { length: 255 }),
	ctasat: varchar("ctasat", { length: 255 }),
	natur: varchar("natur", { length: 255 }),
	ssubCta: double("ssub_cta"),
});