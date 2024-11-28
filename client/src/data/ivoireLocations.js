export const ivoireRegions = [
  {
    name: "Abidjan",
    communes: [
      {
        name: "Abobo",
        quartiers: ["Abobo Baoulé", "Anonkoua-Kouté", "Avocatier", "PK-18", "Sagbé"]
      },
      {
        name: "Adjamé",
        quartiers: ["220 Logements", "Bracodi", "Liberté", "Williamsville"]
      },
      {
        name: "Attécoubé",
        quartiers: ["Locodjro", "Santé", "Abobo-Doumé"]
      },
      {
        name: "Cocody",
        quartiers: ["Angré", "Deux Plateaux", "Riviera", "Danga", "Ambassade"]
      },
      {
        name: "Koumassi",
        quartiers: ["Camp Commando", "Grand Campement", "Prodomo"]
      },
      {
        name: "Marcory",
        quartiers: ["Biétry", "Zone 4", "Anoumabo", "Champroux"]
      },
      {
        name: "Plateau",
        quartiers: ["Commerce", "Treichville", "Zone Administrative"]
      },
      {
        name: "Port-Bouët",
        quartiers: ["Vridi", "Aéroport", "Zimbabwe"]
      },
      {
        name: "Treichville",
        quartiers: ["Arras", "France-Amérique", "Zone Portuaire"]
      },
      {
        name: "Yopougon",
        quartiers: ["Andokoi", "Niangon", "Port Bouët 2", "Selmer", "Wassakara"]
      }
    ]
  },
  {
    name: "Yamoussoukro",
    communes: [
      {
        name: "Yamoussoukro Centre",
        quartiers: ["Dioulakro", "Habitat", "Millionnaire", "N'Zuessi"]
      }
    ]
  },
  {
    name: "Bouaké",
    communes: [
      {
        name: "Bouaké Centre",
        quartiers: ["Air France", "Commerce", "Koko", "N'Gattakro"]
      }
    ]
  },
  {
    name: "San Pedro",
    communes: [
      {
        name: "San Pedro Centre",
        quartiers: ["Bardo", "Poro", "Zone Industrielle"]
      }
    ]
  },
  {
    name: "Korhogo",
    communes: [
      {
        name: "Korhogo Centre",
        quartiers: ["Banaforo", "Koko", "Soba"]
      }
    ]
  },
  {
    name: "Daloa",
    communes: [
      {
        name: "Daloa Centre",
        quartiers: ["Commerce", "Garage", "Marché"]
      }
    ]
  },
  {
    name: "Man",
    communes: [
      {
        name: "Man Centre",
        quartiers: ["Domoraud", "Libreville", "Commerce"]
      }
    ]
  },
  {
    name: "Gagnoa",
    communes: [
      {
        name: "Gagnoa Centre",
        quartiers: ["Dioulabougou", "Garahio", "Commerce"]
      }
    ]
  }
];

export const worldRegions = [
  {
    continent: "Afrique",
    countries: [
      {
        name: "Côte d'Ivoire",
        regions: ivoireRegions
      },
      {
        name: "Sénégal",
        mainCities: ["Dakar", "Thiès", "Saint-Louis", "Touba"]
      },
      {
        name: "Ghana",
        mainCities: ["Accra", "Kumasi", "Tamale", "Sekondi-Takoradi"]
      },
      {
        name: "Nigeria",
        mainCities: ["Lagos", "Abuja", "Kano", "Ibadan"]
      }
    ]
  },
  {
    continent: "Europe",
    countries: [
      {
        name: "France",
        mainCities: ["Paris", "Marseille", "Lyon", "Toulouse", "Nice"]
      },
      {
        name: "Allemagne",
        mainCities: ["Berlin", "Hamburg", "Munich", "Cologne"]
      },
      {
        name: "Royaume-Uni",
        mainCities: ["Londres", "Manchester", "Birmingham", "Glasgow"]
      }
    ]
  },
  {
    continent: "Amérique du Nord",
    countries: [
      {
        name: "États-Unis",
        mainCities: ["New York", "Los Angeles", "Chicago", "Houston"]
      },
      {
        name: "Canada",
        mainCities: ["Toronto", "Montreal", "Vancouver", "Ottawa"]
      }
    ]
  },
  {
    continent: "Asie",
    countries: [
      {
        name: "Chine",
        mainCities: ["Pékin", "Shanghai", "Guangzhou", "Shenzhen"]
      },
      {
        name: "Japon",
        mainCities: ["Tokyo", "Osaka", "Kyoto", "Yokohama"]
      }
    ]
  }
];
