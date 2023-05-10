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

import "typeface-rubik";
import "@fontsource/ibm-plex-mono";

const firebaseConfig = {
  apiKey: "AIzaSyBGtJC973MQxS5V7ZISBHfjmZICFAxz4g4",
  authDomain: "matossers.firebaseapp.com",
  databaseURL: "https://matossers.firebaseio.com",
  projectId: "matossers",
  storageBucket: "matossers.appspot.com",
  messagingSenderId: "76874283575",
  appId: "1:76874283575:web:4995df3102552b0dde1db2",
  measurementId: "G-Y1L5YSPM4B",
};

/* const locales = {
  "en-US": "English (United States)",
  "es-ES": "Spanish (Spain)",
  "de-DE": "German",
};
 */
/* type Product = {
  name: string;
  price: number;
  status: string;
  published: boolean;
  related_products: EntityReference[];
  main_image: string;
  tags: string[];
  description: string;
  categories: string[];
  publisher: {
    name: string;
    external_id: string;
  };
  expires_on: Date;
}; */

type DadesColla = {
  icon: string;
  item: string;
  data: string;
};

type Usuaris = {
  email: string;
  role: string;
};

type Actuacions = {
  actuacio: string;
  poblacio: string;
  lloc: string;
  data: Date;
  colles: string[];
  resultat: string[];
  galeria: string;
};

/* const localeCollection = buildCollection({
  path: "locale",
  customId: locales,
  name: "Locales",
  singularName: "Locales",
  properties: {
    name: {
      name: "Title",
      validation: { required: true },
      dataType: "string",
    },
    selectable: {
      name: "Selectable",
      description: "Is this locale selectable",
      dataType: "boolean",
    },
    video: {
      name: "Video",
      dataType: "string",
      validation: { required: false },
      storage: {
        storagePath: "videos",
        acceptedFiles: ["video/*"],
      },
    },
  },
});
 */

const usuarisCollection = buildCollection<Usuaris>({
  name: "Usuaris",
  singularName: "Usuari",
  path: "usuaris",
  permissions: ({ authController }) => ({
    edit: true,
    create: true,
    delete: false,
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
          public: "Sense permisos"
      }
    })
  }
})

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
    icon: buildProperty({
      dataType: "string",
      name: "Image",
      storage: {
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

/* const productsCollection = buildCollection<Product>({
  name: "Products",
  singularName: "Product",
  path: "products",
  permissions: ({ authController }) => ({
    edit: true,
    create: true,
    // we have created the roles object in the navigation builder
    delete: false,
  }),
//  subcollections: [localeCollection],
  properties: {
    name: {
      name: "Name",
      validation: { required: true },
      dataType: "string",
    },
    price: {
      name: "Price",
      validation: {
        required: true,
        requiredMessage: "You must set a price between 0 and 1000",
        min: 0,
        max: 1000,
      },
      description: "Price with range validation",
      dataType: "number",
    },
    status: {
      name: "Status",
      validation: { required: true },
      dataType: "string",
      description: "Should this product be visible in the website",
      longDescription:
        "Example of a long description hidden under a tooltip. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin quis bibendum turpis. Sed scelerisque ligula nec nisi pellentesque, eget viverra lorem facilisis. Praesent a lectus ac ipsum tincidunt posuere vitae non risus. In eu feugiat massa. Sed eu est non velit facilisis facilisis vitae eget ante. Nunc ut malesuada erat. Nullam sagittis bibendum porta. Maecenas vitae interdum sapien, ut aliquet risus. Donec aliquet, turpis finibus aliquet bibendum, tellus dui porttitor quam, quis pellentesque tellus libero non urna. Vestibulum maximus pharetra congue. Suspendisse aliquam congue quam, sed bibendum turpis. Aliquam eu enim ligula. Nam vel magna ut urna cursus sagittis. Suspendisse a nisi ac justo ornare tempor vel eu eros.",
      enumValues: {
        private: "Private",
        public: "Public",
      },
    },
    published: ({ values }) =>
      buildProperty({
        name: "Published",
        dataType: "boolean",
        columnWidth: 100,
        disabled:
          values.status === "public"
            ? false
            : {
                clearOnDisabled: true,
                disabledMessage:
                  "Status must be public in order to enable this the published flag",
              },
      }),
    related_products: {
      dataType: "array",
      name: "Related products",
      description: "Reference to self",
      of: {
        dataType: "reference",
        path: "products",
      },
    },
    main_image: buildProperty({
      // The `buildProperty` method is a utility function used for type checking
      name: "Image",
      dataType: "string",
      storage: {
        storagePath: "images",
        acceptedFiles: ["image/*"],
      },
    }),
    tags: {
      name: "Tags",
      description: "Example of generic array",
      validation: { required: true },
      dataType: "array",
      of: {
        dataType: "string",
      },
    },
    description: {
      name: "Description",
      description: "Not mandatory but it'd be awesome if you filled this up",
      longDescription:
        "Example of a long description hidden under a tooltip. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin quis bibendum turpis. Sed scelerisque ligula nec nisi pellentesque, eget viverra lorem facilisis. Praesent a lectus ac ipsum tincidunt posuere vitae non risus. In eu feugiat massa. Sed eu est non velit facilisis facilisis vitae eget ante. Nunc ut malesuada erat. Nullam sagittis bibendum porta. Maecenas vitae interdum sapien, ut aliquet risus. Donec aliquet, turpis finibus aliquet bibendum, tellus dui porttitor quam, quis pellentesque tellus libero non urna. Vestibulum maximus pharetra congue. Suspendisse aliquam congue quam, sed bibendum turpis. Aliquam eu enim ligula. Nam vel magna ut urna cursus sagittis. Suspendisse a nisi ac justo ornare tempor vel eu eros.",
      dataType: "string",
      columnWidth: 300,
    },
    categories: {
      name: "Categories",
      validation: { required: true },
      dataType: "array",
      of: {
        dataType: "string",
        enumValues: {
          electronics: "Electronics",
          books: "Books",
          furniture: "Furniture",
          clothing: "Clothing",
          food: "Food",
        },
      },
    },
    publisher: {
      name: "Publisher",
      description: "This is an example of a map property",
      dataType: "map",
      properties: {
        name: {
          name: "Name",
          dataType: "string",
        },
        external_id: {
          name: "External id",
          dataType: "string",
        },
      },
    },
    expires_on: {
      name: "Expires on",
      dataType: "date",
    },
  },
});
 */
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
      if (user?.email?.includes("flanders")) {
        throw Error("Stupid Flanders!");
      }

      console.log("Allowing access to", user?.email);
      // This is an example of retrieving async data related to the user
      // and storing it in the user extra field.
      const sampleUserRoles = await Promise.resolve(["admin"]);
      authController.setExtra(sampleUserRoles);

      return true;
    },
    []
  );

  return (
    <div style={{ width: "100%", margin: "auto" }}>
      <FirebaseCMSApp
        name={"Matossers de Molins de Rei"}
        authentication={myAuthenticator}
        collections={[dadesCollaCollection, actuacionsCollection, usuarisCollection]}
        firebaseConfig={firebaseConfig}
      />
    </div>
  );
}
