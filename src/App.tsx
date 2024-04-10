import React, { useCallback } from "react";

import { User as FirebaseUser } from "firebase/auth";
import {
  Authenticator,
  buildCollection,
  buildProperty,
  EntityReference,
  FirebaseCMSApp,
  MarkdownProps,
} from "firecms";

import { collection, query, where, getDocs } from "firebase/firestore";
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

import "typeface-rubik";
import "@fontsource/ibm-plex-mono";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_apiKey,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_authDomain,
  databaseURL: process.env.NEXT_PUBLIC_FIREBASE_databaseURL,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_projectId,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_storageBucket,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_messagingSenderId,
  appId: process.env.NEXT_PUBLIC_FIREBASE_appId,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_measurementId,
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

type DadesColla = {
  ordre: number;
  icon: string;
  item: string;
  data: string;
};

type Junta = {
  ordre: number;
  image: string;
  nom: string;
  equip: string;
  carrec: string;
};

type Usuaris = {
  email: string;
  role: string;
};

type Recurs = {
  ordre: number;
  nom: string;
  descripcio: string;
  doc: string;
  categoria: string;
};

type Musics = {
  text: string;
  image: string;
};

type Xat = {
  nom: string;
  data: Date;
  msg: string;
};

type Actuacions = {
  actuacio: string;
  poblacio: string;
  lloc: string;
  data: Date;
  colles: string[];
  llista: string;
  resultat: string[];
  galeria: string;
};

type Socis = {
  ordre: number;
  tipus: string;
  descripcio: string;
  quota: number;
  url: string;
};

type SocisQueFarem = {
  ordre: number;
  icon: string;
  item: string;
};

type SocisQueOferim = {
  ordre: number;
  icon: string;
  item: string;
};


const socisCollection = buildCollection<Socis>({
  name: "Quotes de soci",
  singularName: "quota",
  path: "socis",
  permissions: ({ authController }) => ({
    edit: true,
    create: true,
    delete: true,
  }),
  properties: {
    ordre: {
      name: "Ordre",
      validation: {
        required: true,
        min: 0,
        max: 1000,
      },
      description: "Per ordenar le dades a la web",
      dataType: "number",
    },
    tipus: {
      name: "Tipus",
      validation: { required: true },
      dataType: "string",
    },
    descripcio: {
      name: "Descripció",
      validation: { required: false },
      dataType: "string",
    },
    quota: {
      name: "Quota",
      validation: {
        required: true,
        min: 0,
        max: 1000,
      },
      dataType: "number",
    },
    url: {
      name: "Enllaç de pagament",
      validation: { required: true },
      dataType: "string",
    },
  },
});

/* const xatCollection = buildCollection<Xat>({
  name: "Xat",
  singularName: "Xat",
  path: "xat",
  permissions: ({ authController }) => ({
    edit: true,
    create: true,
    delete: true,
  }),
  properties: {
    nom: {
      name: "Nom",
      validation: { required: true },
      dataType: "string",
    },
    data: {
      name: "Data",
      validation: {
        required: true,
      },
      dataType: "date",
    },
    msg: {
      name: "Missatge",
      validation: { required: true },
      dataType: "string",
    },
  },
});
 */
const recursCollection = buildCollection<Recurs>({
  name: "Recursos",
  singularName: "Recurs",
  path: "recurs",
  permissions: ({ authController }) => ({
    edit: true,
    create: true,
    delete: true,
  }),
  properties: {
    ordre: {
      name: "Ordre",
      validation: {
        required: true,
        min: 0,
        max: 1000,
      },
      description: "Per ordenar le dades a la web",
      dataType: "number",
    },
    nom: {
      name: "Nom del fitxer",
      validation: { required: true },
      dataType: "string",
    },
    descripcio: {
      name: "Descripció (opcional)",
      validation: { required: false },
      dataType: "string",
    },
    doc: buildProperty({
      dataType: "string",
      name: "Document",
      storage: {
        storeUrl: true,
        mediaType: "image",
        storagePath: "docs/",
      },
      validation: { required: true },
    }),
    categoria: buildProperty({
      dataType: "string",
      name: "Categoria",
      enumValues: {
        administrativa: "Documentació administrativa",
        tecnica: "Documentació tècnica",
        general: "Documents generals",
      },
      validation: { required: true },
    }),
  },
});

const usuarisCollection = buildCollection<Usuaris>({
  name: "Usuaris",
  singularName: "Usuari",
  path: "usuaris",
  permissions: ({ authController }) => ({
    edit: true,
    create: true,
    delete: true,
  }),
  properties: {
    email: {
      name: "Correu electrònic",
      validation: { required: true },
      email: true,
      dataType: "string",
    },
    role: buildProperty({
      dataType: "string",
      name: "Rols",
      enumValues: {
        admin: "Administrador",
        junta: "Juntes administrativa i tècnica",
        casteller: "Casteller/a",
        public: "Sense permisos",
      },
    }),
  },
});

const musicsCollection = buildCollection<Musics>({
  name: "Pàgina de Músics",
  singularName: "Músic",
  path: "musics",
  permissions: ({ authController }) => ({
    edit: true,
    create: false,
    delete: false,
  }),
  properties: {
    text: buildProperty({
      dataType: "string",
      name: "Text",
      markdown: true,
      validation: { required: true },
    }),
    image: buildProperty({
      dataType: "string",
      name: "Imatge",
      storage: {
        storeUrl: true,
        mediaType: "image",
        storagePath: "images/pages",
        acceptedFiles: ["image/*"],
        metadata: {
          cacheControl: "max-age=1000000",
        },
      },
    }),
  },
});

const dadesCollaCollection = buildCollection<DadesColla>({
  name: "Dades Colla",
  singularName: "Dada",
  path: "dada",
  permissions: ({ authController }) => ({
    edit: true,
    create: true,
    delete: false,
  }),
  properties: {
    ordre: {
      name: "Ordre",
      validation: {
        required: true,
        min: 0,
        max: 1000,
      },
      description: "Per ordenar le dades a la web",
      dataType: "number",
    },
    icon: buildProperty({
      dataType: "string",
      name: "Image",
      storage: {
        storeUrl: true,
        mediaType: "image",
        storagePath: "images/dades",
        acceptedFiles: ["image/*"],
        metadata: {
          cacheControl: "max-age=1000000",
        },
      },
      description: "Puja la icona",
      validation: {
        required: true,
      },
    }),
    item: {
      name: "Títol",
      validation: { required: true },
      dataType: "string",
    },
    data: {
      name: "Text",
      validation: { required: true },
      dataType: "string",
    },
  },
});

const socisQueFaremCollection = buildCollection<SocisQueFarem>({
  name: "Socis Taula que farem",
  singularName: "Dada",
  path: "socisquefarem",
  permissions: ({ authController }) => ({
    edit: true,
    create: true,
    delete: true,
  }),
  properties: {
    ordre: {
      name: "Ordre",
      validation: {
        required: true,
        min: 0,
        max: 1000,
      },
      description: "Per ordenar le dades a la web",
      dataType: "number",
    },
    icon: buildProperty({
      dataType: "string",
      name: "Image",
      storage: {
        storeUrl: true,
        mediaType: "image",
        storagePath: "images/dades",
        acceptedFiles: ["image/*"],
        metadata: {
          cacheControl: "max-age=1000000",
        },
      },
      description: "Puja la icona",
      validation: {
        required: true,
      },
    }),
    item: {
      name: "Títol",
      validation: { required: true },
      dataType: "string",
    },
  },
});

const socisQueOferimCollection = buildCollection<SocisQueOferim>({
  name: "Socis Taula que oferim",
  singularName: "Dada",
  path: "socisqueoferim",
  permissions: ({ authController }) => ({
    edit: true,
    create: true,
    delete: true,
  }),
  properties: {
    ordre: {
      name: "Ordre",
      validation: {
        required: true,
        min: 0,
        max: 1000,
      },
      description: "Per ordenar le dades a la web",
      dataType: "number",
    },
    icon: buildProperty({
      dataType: "string",
      name: "Image",
      storage: {
        storeUrl: true,
        mediaType: "image",
        storagePath: "images/dades",
        acceptedFiles: ["image/*"],
        metadata: {
          cacheControl: "max-age=1000000",
        },
      },
      description: "Puja la icona",
      validation: {
        required: true,
      },
    }),
    item: {
      name: "Títol",
      validation: { required: true },
      dataType: "string",
    },
  },
});


const juntaCollection = buildCollection<Junta>({
  name: "Juntes",
  singularName: "junta",
  path: "juntes",
  permissions: ({ authController }) => ({
    edit: true,
    create: true,
    delete: true,
  }),
  properties: {
    ordre: {
      name: "Ordre",
      validation: {
        required: true,
        min: 0,
        max: 1000,
      },
      description: "Per ordenar le dades a la web",
      dataType: "number",
    },
    image: buildProperty({
      dataType: "string",
      name: "Image",
      storage: {
        storeUrl: true,
        mediaType: "image",
        storagePath: "images/junta",
        acceptedFiles: ["image/*"],
        metadata: {
          cacheControl: "max-age=1000000",
        },
      },
    }),
    nom: {
      name: "Nom",
      validation: { required: true },
      dataType: "string",
    },
    equip: buildProperty({
      dataType: "string",
      name: "Equip",
      enumValues: {
        president: "President",
        cap: "Cap de colla",
        administrativa: "Junta administrativa",
        tecnica: "Junta tècnica",
      },
    }),
    carrec: {
      name: "Càrrec",
      validation: { required: true },
      dataType: "string",
    },
  },
});

const actuacionsCollection = buildCollection<Actuacions>({
  name: "Actuacions",
  singularName: "Actuacio",
  path: "actuacions",
  permissions: ({ authController }) => ({
    edit: true,
    create: true,
    delete: true,
  }),
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
    llista: {
      name: "Llista d'assistència",
      validation: { required: false },
      dataType: "string",
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
});

export default function App() {
  const myAuthenticator: Authenticator<FirebaseUser> = useCallback(
    async ({ user, authController }) => {
       if (user?.email != undefined) {
        const role:string = await getRoles(user?.email);
        console.log(role);
        if (role === "admin") {
          authController.setExtra(role);
          return true;
        } else {
          throw Error("No tens els permisos corresponents");
        }
      } else {
        throw Error("Aquest usuari no existeix");
      }
    }, 

    []
  );

   async function getRoles(email:string) {
    const userRef = collection(db, "usuaris");
    var data = "";

    const q = query(userRef, where("email", "==", email));
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      data = doc.data().role;
    });
    return data;
  }
 
  return (
    <div style={{ width: "100%", margin: "auto" }}>
      <FirebaseCMSApp
        name={"Matossers de Molins de Rei"}
        authentication={myAuthenticator}
        collections={[
          dadesCollaCollection,
          actuacionsCollection,
          usuarisCollection,
          juntaCollection,
          musicsCollection,
          recursCollection,
          //xatCollection,
          socisCollection,
          socisQueFaremCollection,
          socisQueOferimCollection
        ]}
        firebaseConfig={firebaseConfig}
      />
    </div>
  );
}
