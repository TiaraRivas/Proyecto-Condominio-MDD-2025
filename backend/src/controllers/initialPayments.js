    import { AppDataSource } from "../config/configDb.js";
    import Payment from "../entity/payment.entity.js";

    export async function createInitialPayments() {
    const pagoRepository = AppDataSource.getRepository(Payment);
    const pagos = [
        {
        userId: 1,
        amount: 50000,
        type: "gasto comun",
        receiptUrl: "uploads/recibo1.pdf",
        status: "Pendiente",
        createdAt: new Date(),
        updatedAt: new Date(),
        },
        {
        userId: 2,
        amount: 35000,
        type: "servicio basico",
        receiptUrl: "uploads/recibo2.pdf",
        status: "Pendiente",
        createdAt: new Date(),
        updatedAt: new Date(),
        },
        {
        userId: 1,
        amount: 60000,
        type: "gasto comun",
        receiptUrl: "uploads/recibo3.pdf",
        status: "Pagado",
        validatedBy: 99,
        validatedAt: new Date(),
        createdAt: new Date(),
        updatedAt: new Date(),
        }
    ];
    for (const pago of pagos) {
        const existe = await pagoRepository.findOneBy({
        userId: pago.userId,
        amount: pago.amount,
        type: pago.type
        });
        if (!existe) {
        const pagoInsertado = await pagoRepository.save(pago);
        console.log("Pago registrado:", pagoInsertado);
        } else {
        console.log("Pago ya existente:", existe);
        }
    }
    // Postcondición: todos los pagos de ejemplo están registrados y actualizados en la base de datos
    return await pagoRepository.find();
    }
