
const CollActuacions =
{
    name: "Actuacions",
    singularName: "Actuacio",
    path: "actuacions",
    permissions: ({ authController }) => ({
      edit: true,
      create: true,
      // we have created the roles object in the navigation builder
      delete: false,
    }),
    subcollections: [localeCollection],
    properties: {
      actuacio: {
        name: "Actuacio",
        validation: { required: true },
        dataType: "string",
      },
      poblacio: {
        name: "Poblacio",
        validation: { required: true },
        dataType: "string",
      },
      lloc: {
        name: "Lloc",
        validation: { required: false },
        dataType: "string",
      },
      data: {
        name: "Data",
        validation: {
          required: true,
        },
        dataType: "date",
      },
      colles: {
        name: "Colles",
        description: "Colles array",
        validation: { required: false },
        dataType: "array",
        of: {
          dataType: "string",
        },
      },
      resultat: {
        name: "Resultats",
        description: "Resultat",
        validation: { required: false },
        dataType: "array",
        of: {
          dataType: "string",
        },
      },
      galeria: {
        name: "Galeria d'imatges",
        validation: { required: false },
        dataType: "string",
      },
    },
  }