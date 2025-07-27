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
    userId: {
      type: "int",
      nullable: false,
    },
    amount: {
      type: "decimal",
      nullable: false,
    },
    type: {
      type: "varchar",
      length: 30,
      nullable: false,
    },
    receiptUrl: {
      type: "varchar",
      length: 255,
      nullable: false,
    },
    status: {
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
});

export default PaymentSchema;
