db.residentes.drop()
db.residentes.insertMany([
    {
        dni: "47566566J",
        nombre: "Agustin",
        apellido: "Azorin Canal",
        tel_emergencia: [
            null,
            "964 83 84 26"
        ],
        pago_mes: 1500
    },
    { dni: "94931077A", nombre: "Cristina", apellido: "Carrion Saenz", tel_emergencia: ["624 04 48 00", "942 00 98 12"], pago_mes: 300 },
    { dni: "27710134X", nombre: "Javier", apellido: "Tamayo Perello", tel_emergencia: [null, null], pago_mes: 650 },
    { dni: "86647555T", nombre: "Gonzalo", apellido: "Luna Puche", tel_emergencia: ["774 22 75 66", null], pago_mes: 1000 },
    { dni: "22629287R", nombre: "Ana", apellido: "Belen Perio Ruz", tel_emergencia: [null, "956 48 99 70"], pago_mes: 1000 }
])

db.trabajadores.drop()
db.trabajadores.insertMany([
    {
        dni: "71143370T",
        nombre: "Jesús",
        apellido: "Talavera Navajas",
        salario_hora: 22.5,
        salario_estimado:150
    },
    { dni: "36762985S", nombre: "Marta", apellido: "Llado Valencia", tel_contacto: "622 07 14 63", salario_hora: 15,  salario_estimado:210 },
    { dni: "85792566J", nombre: "Encarnación", apellido: "Corpas Moyano", tel_contacto: "650 57 09 39", salario_hora: 20,  salario_estimado:330 },
    { dni: "97725247H", nombre: "Jaime", apellido: "Colorado Martos", tel_contacto: "606 13 34 93", salario_hora: 12.5,  salario_estimado:200 },
    { dni: "52979496P", nombre: "Gloria", apellido: "Bastida Zurita", tel_contacto: "670 53 55 16", salario_hora: 12.5,  salario_estimado:225 }
])

db.jornadas.drop()
db.jornadas.insertMany([
    {
        datos_jornada:{
        dni_residente: "47566566J",
        dni_cuidador: "52979496P",
        },
            fecha: new Date("2020-7-27"),
            horas: 8
    },
    { datos_jornada:{dni_residente: "22629287R", dni_cuidador: "52979496P"}, fecha: new Date("2020-7-28"), horas: 10 },
    { datos_jornada:{dni_residente: "94931077A", dni_cuidador: "97725247H"}, fecha: new Date("2020-7-28"), horas: 8 },
    { datos_jornada:{dni_residente: "47566566J", dni_cuidador: "71143370T"}, fecha: new Date("2020-7-28"), horas: 6 },
    { datos_jornada:{dni_residente: "47566566J", dni_cuidador: "85792566J"}, fecha: new Date("2020-7-29"), horas: 5 },
    { datos_jornada:{dni_residente: "86647555T", dni_cuidador: "71143370T"}, fecha: new Date("2020-7-29"), horas: 4 },
    { datos_jornada:{dni_residente: "22629287R", dni_cuidador: "85792566J"}, fecha: new Date("2020-7-30"), horas: 11 },
    { datos_jornada:{dni_residente: "27710134X", dni_cuidador: "97725247H"}, fecha: new Date("2020-7-31"), horas: 7 },
    { datos_jornada:{dni_residente: "86647555T", dni_cuidador: "36762985S"}, fecha: new Date("2020-8-1"), horas: 5 },
    { datos_jornada:{dni_residente: "27710134X", dni_cuidador: "36762985S"}, fecha: new Date("2020-8-2"), horas: 9 }
])