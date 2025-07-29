"use strict";
import { EntitySchema } from "typeorm";

const PaymentSchema = new EntitySchema({
  name: "Payment",
  tableName: "RegistroPagos",
  columns: {
    id: {
      type: "int",
      primary: true,
      generated: true,
    },
    rut: {
      type: "varchar",
      length: 12,
      nullable: false,
    },
    monto: {
      type: "decimal",
      nullable: false,
    },
    tipo_de_pago: {
      type: "varchar",
      length: 30,
      nullable: false,
    },
    fecha_pago: {
      type: "date",
      nullable: true,
    },
    comprobante_url: { 
      type: "varchar",
      length: 255,
      nullable: true,
    },
    mes_referencia: {
      type: "varchar",
      length: 7, 
      nullable: true,
    },
    observaciones: {
      type: "text",
      nullable: true,
    },
    estado: {
      type: "varchar",
      length: 15,
      default: "Pendiente",
      nullable: false,
    },
    validatedBy: {
      type: "int",
      nullable: true,
    },
    validatedAt: {
      type: "timestamp with time zone",
      nullable: true,
    },
    createdAt: {
      type: "timestamp with time zone",
      default: () => "CURRENT_TIMESTAMP",
      nullable: false,
    },
    updatedAt: {
      type: "timestamp with time zone",
      default: () => "CURRENT_TIMESTAMP",
      onUpdate: "CURRENT_TIMESTAMP",
      nullable: false,
    },
  },

  relations: {
    usuario: {
      type: "many-to-one",
      target: "User",  // Debe coincidir con el nombre de tu entidad User
      joinColumn: { name: "rut", referencedColumnName: "rut" },
      eager: false,    // Cambia a true si quieres que siempre cargue el usuario con el pago
    }
  },

});

export default PaymentSchema;
