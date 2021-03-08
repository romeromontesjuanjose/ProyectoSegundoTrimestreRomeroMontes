/*En esta consulta se comprobara el salario que debe pagarse a los trabajadores 
por día, ordenandoló cronológicamente*/

db.jornadas.aggregate([
    {
        $lookup:
        {
            from: "trabajadores",
            localField: "datos_jornada.dni_cuidador",
            foreignField: "dni",
            as: "enlace"
        }
    },
    {
        $set:
        {
            Año: { $year: "$fecha" },
            Mes: { $month: "$fecha" },
            Dia: { $dayOfMonth: "$fecha" }
        }
    },
    {
        $group:
        {
            _id: "$fecha",
            Fecha: { $push: { año: "$Año", mes: "$Mes", día: "$Dia" } },
            Pago: {
                $sum:
                {
                    $multiply:
                        [
                            "$horas", { $arrayElemAt: ["$enlace.salario_hora", 0] }
                        ]
                }
            }
        }
    },
    {
        $sort:
        {
            _id: 1
        }
    },
    {
        $project:
        {
            _id: 0,
            Pago: 1,
            Fecha: { $arrayElemAt: ["$Fecha", 0] }
        }
    },
]).pretty()

/*En esta consulta se calculara el salario real de cada uno de nuestros empleados y 
se comparará con el salario estimado, de forma que nos diga si el salario estimado 
concuerda o no y su diferencia (indicando en positivo los salarios reales mayores a los 
salarios estimados y en negativos los casos contrarios)*/

db.trabajadores.aggregate([
    {
        $lookup:
        {
            from: "jornadas",
            localField: "dni",
            foreignField: "datos_jornada.dni_cuidador",
            as: "enlace"
        }
    },
    {
        $unwind: "$enlace"
    },
    {
        $sort:
        {
            nombre: 1
        }
    },
    {
        $project:
        {
            Dni: "$dni",
            Nombre: "$nombre",
            Apellido: "$apellido",
            Salario_estimado: "$salario_estimado",
            salario_hora: "$salario_hora",
            horas: "$enlace.horas"
        }
    },
    {
        $group: {
            _id: "$Dni",
            datos:
            {
                $push:
                {
                    Dni: "$Dni",
                    Nombre: "$Nombre",
                    Apellido: "$Apellido",
                    Salario_estimado: "$Salario_estimado",
                }
            },
            Salario_real: {
                $sum:
                {
                    $multiply:
                        [
                            "$salario_hora", "$horas"
                        ]
                }
            }
        }
    },
    {
        $project:
        {
            _id: 0,
            Dni: { $arrayElemAt: ["$datos.Dni", 0] },
            Nombre: { $arrayElemAt: ["$datos.Nombre", 0] },
            Apellido: { $arrayElemAt: ["$datos.Apellido", 0] },
            Salario_estimado: { $arrayElemAt: ["$datos.Salario_estimado", 0] },
            Salario_real: 1,
            Concordancia: true
        }
    },
    {
        $set:
        {
            Comparacion: { $cmp: ["$Salario_estimado", "$Salario_real"] },
            Diferencia: { $subtract: ["$Salario_estimado", "$Salario_real"] }
        }
    },
    {
        $set:
        {
            Concordancia: {
                $cond:
                {
                    if: { $eq: ["$Comparacion", 0] },
                    then: true,
                    else: false
                }
            },
        }
    },
    {
        $project:
        {
            Dni: 1,
            Nombre: 1,
            Apellido: 1,
            Salario_estimado: 1,
            Concordancia: 1,
            Diferencia: 1,
        }
    },
    {
        $merge: "comparaciones"
    }
]).pretty()

/*En esta consulta se corregira el precio que pagan los residentes en función 
de la diferencia especificada en el ejercicio anterior*/

db.residentes.aggregate([
    {
        $lookup:
        {
            from: "jornadas",
            localField: "dni",
            foreignField: "datos_jornada.dni_residente",
            as: "enlaceJ"
        }
    },
    {
        $unwind: "$enlaceJ"
    },
    {
        $lookup:
        {
            from: "comparaciones",
            localField: "enlaceJ.datos_jornada.dni_cuidador",
            foreignField: "Dni",
            as: "enlaceC"
        }
    },
    {
        $group:
        {
            _id: "$dni",
            datos:
            {
                $push:
                {
                    dni: "$dni",
                    nombre: "$nombre",
                    apellido: "$apellido",
                    pago_mes: "$pago_mes",
                }
            },
            Cantidad_corregida: { $sum: { $arrayElemAt: ["$enlaceC.Diferencia", 0] } }
        }
    },
    {
        $project:
        {
            _id: 0,
            Dni: { $arrayElemAt: ["$datos.dni", 0] },
            Nombre: { $arrayElemAt: ["$datos.nombre", 0] },
            Apellido: { $arrayElemAt: ["$datos.apellido", 0] },
            Pago_entregado: { $arrayElemAt: ["$datos.pago_mes", 0] },
            Cantidad_corregida: 1
        }
    },
    {
        $set:
        {
            Pago_corregido:{$sum:["$Pago_entregado","$Cantidad_corregida"]},
        }
    },
    {
        $sort:
        {
            Cantidad_corregida:1
        }
    }
]).pretty()

/*En esta consulta se comprobara cual es el salario medio de los cuidadores 
y cual es la rentabilidad más alta entre los cuidadores (entendiendose 
por rentabilidad la división del salario/hora entre las horas)*/

db.trabajadores.aggregate([
    {
        $lookup:
        {
            from: "jornadas",
            localField: "dni",
            foreignField: "datos_jornada.dni_cuidador",
            as: "enlace"
        }
    },
    {
        $set:
        {
            
            rentabilidad:{$divide:["$salario_hora",{ $arrayElemAt: ["$enlace.horas", 0] }]},
            agrupar_todo:"Agrupalo_todo"
        }
    },
    {
        $group:
        {
            _id:"$agrupar_todo",
            media_salario_día:{$avg:"$salario_hora"},
            rentabilidad_máxima:{$max:"$rentabilidad"}
        }
    },
    {
        $project:
        {
            _id:0,
            media_salario_día:1,
            rentabilidad_máxima:1
        }
    }
]
).pretty()

/*En esta consulta se mostrarán todos los residentes que hayan dado su número
fijo (que de la forma en la que esta organizada la base de datos siempre será
el segundo número del array "tel_emergencia")*/

db.residentes.aggregate([
    {
        $match:{$expr:{$ne:[{ $arrayElemAt: ["$tel_emergencia", 1] },null]}}
    }
]).pretty()