export const rajasthanForests = [
  {
    id: "aravalli_range",
    name: "Aravalli Forest Range",
    location: "Sirohi to Alwar",
    area: "Approx. 692 km length",
    type: "Dry Deciduous & Scrub",
    coordinates: { lat: 26.0, lng: 74.5 },
    description: "The oldest mountain range in the world, extending from Sirohi to Alwar. Serves as a major forest belt for Rajasthan.",
    wildlife: ["Leopard", "Striped Hyena", "Golden Jackal", "Sambar", "Wild Boar"],
    boundary: [
      [24.5, 72.5], [25.0, 73.5], [26.5, 75.0], [27.5, 76.5], [28.0, 77.0], 
      [27.8, 76.0], [26.0, 74.0], [24.8, 73.0], [24.5, 72.5]
    ],
    zones: [
      { id: "northern_aravalli", name: "Northern Aravalli", riskMultiplier: 1.2, coordinates: [27.5, 76.5], radius: 10000 },
      { id: "southern_aravalli", name: "Southern Aravalli", riskMultiplier: 1.4, coordinates: [24.6, 72.8], radius: 10000 }
    ],
    historicalFires: [],
    climate: { avgTemp: 25, maxTemp: 42, rainfall: "600mm", fireSeason: "March to June" }
  },
  {
    id: "udaipur_forest",
    name: "Udaipur Forest Division",
    location: "Udaipur, Rajasthan",
    area: "Dense forest region",
    type: "Mixed Deciduous",
    coordinates: { lat: 24.5854, lng: 73.7125 },
    description: "One of the densest forest regions, including Kumbhalgarh, Jaisamand, and Phulwari ki Nal.",
    wildlife: ["Leopard", "Sloth Bear", "Chinkara", "Four-horned Antelope"],
    boundary: [
      [24.0, 73.0], [25.0, 73.0], [25.0, 74.5], [24.0, 74.5], [24.0, 73.0]
    ],
    zones: [
      { id: "jaisamand", name: "Jaisamand Sanctuary", riskMultiplier: 1.1, coordinates: [24.23, 73.95], radius: 5000 },
      { id: "phulwari", name: "Phulwari ki Nal", riskMultiplier: 1.3, coordinates: [24.10, 73.20], radius: 6000 }
    ],
    historicalFires: [],
    climate: { avgTemp: 26, maxTemp: 40, rainfall: "700mm", fireSeason: "March to May" }
  },
  {
    id: "sirohi_forest",
    name: "Sirohi Forest Region",
    location: "Sirohi, Southern Rajasthan",
    area: "Part of Southern Aravalli",
    type: "Subtropical Evergreen (Mt Abu) & Dry Deciduous",
    coordinates: { lat: 24.8829, lng: 72.8532 },
    description: "Home to Mount Abu's unique subtropical forests, rich in biodiversity and tribal areas.",
    wildlife: ["Sloth Bear", "Leopard", "Sambar", "Jungle Cat"],
    boundary: [
       [24.5, 72.5], [25.0, 72.5], [25.0, 73.2], [24.5, 73.2], [24.5, 72.5]
    ],
    zones: [
      { id: "mt_abu", name: "Mount Abu Sanctuary", riskMultiplier: 0.8, coordinates: [24.60, 72.70], radius: 5000 },
      { id: "tribal_belt", name: "Tribal Forest Belt", riskMultiplier: 1.5, coordinates: [24.80, 73.00], radius: 7000 }
    ],
    historicalFires: [],
    climate: { avgTemp: 23, maxTemp: 35, rainfall: "1500mm", fireSeason: "April to June" }
  },
  {
    id: "rajsamand_forest",
    name: "Rajsamand Forest Region",
    location: "Rajsamand, Central Aravalli",
    area: "610.5 sq km (Kumbhalgarh part)",
    type: "Dry Deciduous",
    coordinates: { lat: 25.07, lng: 73.88 },
    description: "Central Aravalli region, including the famous Kumbhalgarh surroundings.",
    wildlife: ["Wolf", "Leopard", "Sloth Bear", "Golden Jackal"],
    boundary: [
      [24.8, 73.5], [25.5, 73.5], [25.5, 74.2], [24.8, 74.2], [24.8, 73.5]
    ],
    zones: [
      { id: "kumbhalgarh_core", name: "Kumbhalgarh Core", riskMultiplier: 1.0, coordinates: [25.15, 73.58], radius: 6000 },
      { id: "surroundings", name: "Forest Buffer", riskMultiplier: 1.2, coordinates: [25.00, 73.90], radius: 5000 }
    ],
    historicalFires: [],
    climate: { avgTemp: 25, maxTemp: 42, rainfall: "600mm", fireSeason: "March to May" }
  },
  {
    id: "baran_forest",
    name: "Baran Forest Region",
    location: "Southeastern Rajasthan",
    area: "High forest cover",
    type: "Dry Deciduous",
    coordinates: { lat: 25.1011, lng: 76.5132 },
    description: "Located in SE Rajasthan, holding the highest forest cover percentage among districts. Incl. Shahbad forests.",
    wildlife: ["Leopard", "Deer", "Wild Boar", "Blue Bull"],
    boundary: [
      [24.7, 76.2], [25.4, 76.2], [25.4, 77.0], [24.7, 77.0], [24.7, 76.2]
    ],
    zones: [
      { id: "shahbad", name: "Shahbad Forest", riskMultiplier: 1.4, coordinates: [25.20, 76.80], radius: 8000 },
      { id: "shergarh", name: "Shergarh Sanctuary", riskMultiplier: 1.2, coordinates: [24.80, 76.55], radius: 5000 }
    ],
    historicalFires: [],
    climate: { avgTemp: 28, maxTemp: 46, rainfall: "900mm", fireSeason: "May to June" }
  },
  {
    id: "kota_forest",
    name: "Kota Forest Region",
    location: "Kota, Rajasthan",
    area: "Includes Mukundra Hills",
    type: "Dry Deciduous",
    coordinates: { lat: 25.2138, lng: 75.8648 },
    description: "Includes Mukundra Hills Tiger Reserve. Dense dry deciduous forests along Chambal.",
    wildlife: ["Tiger", "Leopard", "Sloth Bear", "Chambal Ghariyal"],
    boundary: [
      [24.6, 75.5], [25.5, 75.5], [25.5, 76.5], [24.6, 76.5], [24.6, 75.5]
    ],
    zones: [
      { id: "mukundra_core", name: "Mukundra Core", riskMultiplier: 1.3, coordinates: [24.87, 75.98], radius: 6000 },
      { id: "jawahar_sagar", name: "Jawahar Sagar", riskMultiplier: 1.0, coordinates: [25.00, 75.60], radius: 4000 }
    ],
    historicalFires: [],
    climate: { avgTemp: 29, maxTemp: 47, rainfall: "800mm", fireSeason: "April to June" }
  },
  {
    id: "banswara_forest",
    name: "Banswara Forest Region",
    location: "Southern Rajasthan",
    area: "Good forest density",
    type: "Mixed Deciduous & Teak",
    coordinates: { lat: 23.5461, lng: 74.4350 },
    description: "Southernmost part of Rajasthan. High rainfall leads to good forest density with Teak dominance.",
    wildlife: ["Leopard", "Chinkara", "Monitor Lizard", "Grey Hornbill"],
    boundary: [
      [23.1, 74.0], [23.9, 74.0], [23.9, 74.8], [23.1, 74.8], [23.1, 74.0]
    ],
    zones: [
      { id: "main_banswara", name: "Main Forest Block", riskMultiplier: 1.1, coordinates: [23.50, 74.40], radius: 7000 }
    ],
    historicalFires: [],
    climate: { avgTemp: 27, maxTemp: 43, rainfall: "950mm", fireSeason: "March to May" }
  },
  {
    id: "dungarpur_forest",
    name: "Dungarpur Forest Region",
    location: "Southern Rajasthan",
    area: "Tribal landscape",
    type: "Dry Deciduous, Teak, Bamboo",
    coordinates: { lat: 23.8363, lng: 73.7191 },
    description: "Tribal-dominated forest landscape rich in Teak and Bamboo.",
    wildlife: ["Mongoose", "Jackal", "Hyena", "Reptiles"],
    boundary: [
      [23.5, 73.4], [24.1, 73.4], [24.1, 74.2], [23.5, 74.2], [23.5, 73.4]
    ],
    zones: [
      { id: "teak_belt", name: "Teak Plantation Area", riskMultiplier: 1.4, coordinates: [23.80, 73.80], radius: 5000 }
    ],
    historicalFires: [],
    climate: { avgTemp: 26, maxTemp: 44, rainfall: "800mm", fireSeason: "April to May" }
  },
  {
    id: "sawai_madhopur_forest",
    name: "Sawai Madhopur Forest",
    location: "Sawai Madhopur",
    area: "Includes Ranthambore",
    type: "Dry Deciduous",
    coordinates: { lat: 26.0173, lng: 76.5026 },
    description: "Famous for Ranthambore National Park. A key habitat for Bengal Tigers.",
    wildlife: ["Bengal Tiger", "Nilgai", "Caracal", "Blackbuck"],
    boundary: [
      [25.8, 76.2], [26.3, 76.2], [26.3, 76.8], [25.8, 76.8], [25.8, 76.2]
    ],
    zones: [
      { id: "ranthambore_core", name: "Ranthambore Core", riskMultiplier: 1.5, coordinates: [26.01, 76.50], radius: 6000 },
      { id: "kela_devi", name: "Kela Devi Sanctuary", riskMultiplier: 1.2, coordinates: [26.15, 76.90], radius: 7000 }
    ],
    historicalFires: [],
    climate: { avgTemp: 28, maxTemp: 47, rainfall: "750mm", fireSeason: "April to June" }
  },
  {
    id: "alwar_forest",
    name: "Alwar Forest Region",
    location: "Alwar, NE Rajasthan",
    area: "Includes Sariska",
    type: "Dry Deciduous & Scrub",
    coordinates: { lat: 27.5530, lng: 76.6346 },
    description: "Northern Aravalli forests, including the Sariska Tiger Reserve.",
    wildlife: ["Tiger", "Sambar", "Nilgai", "Golden Jackal"],
    boundary: [
      [27.0, 76.0], [28.0, 76.0], [28.0, 77.0], [27.0, 77.0], [27.0, 76.0]
    ],
    zones: [
      { id: "sariska_core", name: "Sariska Core", riskMultiplier: 1.4, coordinates: [27.32, 76.43], radius: 6000 },
      { id: "bala_quila", name: "Bala Quila Forest", riskMultiplier: 0.9, coordinates: [27.56, 76.60], radius: 3000 }
    ],
    historicalFires: [],
    climate: { avgTemp: 25, maxTemp: 45, rainfall: "650mm", fireSeason: "May to June" }
  },
  {
    id: "jhalawar_forest",
    name: "Jhalawar Forest Region",
    location: "Southeastern Rajasthan",
    area: "Greenest after Baran",
    type: "Dry Deciduous",
    coordinates: { lat: 24.5973, lng: 76.1609 },
    description: "Southeastern Rajasthan, known as the greenest district after Baran. Undulating terrain.",
    wildlife: ["Leopard", "Wild Boar", "Blue Bull"],
    boundary: [
      [24.0, 75.8], [25.0, 75.8], [25.0, 76.8], [24.0, 76.8], [24.0, 75.8]
    ],
    zones: [
      { id: "gagron", name: "Gagron Fort Area", riskMultiplier: 0.8, coordinates: [24.62, 76.18], radius: 3000 }
    ],
    historicalFires: [],
    climate: { avgTemp: 27, maxTemp: 46, rainfall: "900mm", fireSeason: "May to June" }
  },
  {
    id: "chittorgarh_forest",
    name: "Chittorgarh Forest Region",
    location: "Chittorgarh",
    area: "Mixed forest cover",
    type: "Mixed Dry Deciduous",
    coordinates: { lat: 24.8887, lng: 74.6269 },
    description: "Mixed dry deciduous forests surrounding the historic Chittorgarh fort area.",
    wildlife: ["Leopard", "Fox", "Chinkara"],
    boundary: [
      [24.4, 74.2], [25.1, 74.2], [25.1, 75.0], [24.4, 75.0], [24.4, 74.2]
    ],
    zones: [
      { id: "chittor_fort", name: "Fort Forest", riskMultiplier: 0.7, coordinates: [24.88, 74.63], radius: 2000 },
      { id: "bassi", name: "Bassi Wildlife Sanctuary", riskMultiplier: 1.3, coordinates: [25.00, 74.75], radius: 5000 }
    ],
    historicalFires: [],
    climate: { avgTemp: 26, maxTemp: 44, rainfall: "750mm", fireSeason: "April to June" }
  },
  {
    id: "pratapgarh_forest",
    name: "Pratapgarh Forest Region",
    location: "Pratapgarh",
    area: "Hilly terrain",
    type: "Mixed Deciduous",
    coordinates: { lat: 24.03, lng: 74.78 },
    description: "Hilly and forested terrain. Home to Sita Mata Sanctuary.",
    wildlife: ["Flying Squirrel", "Leopard", "Four-horned Antelope"],
    boundary: [
      [23.7, 74.4], [24.4, 74.4], [24.4, 75.0], [23.7, 75.0], [23.7, 74.4]
    ],
    zones: [
      { id: "sita_mata", name: "Sita Mata Sanctuary", riskMultiplier: 1.5, coordinates: [24.18, 74.55], radius: 6000 }
    ],
    historicalFires: [],
    climate: { avgTemp: 25, maxTemp: 43, rainfall: "850mm", fireSeason: "March to May" }
  },
  {
    id: "bundi_forest",
    name: "Bundi Forest Region",
    location: "Bundi",
    area: "Rocky forest",
    type: "Dry Deciduous & Scrub",
    coordinates: { lat: 25.4305, lng: 75.6499 },
    description: "Rocky forests serving as wildlife corridors between Ranthambore and Mukundra.",
    wildlife: ["Leopard", "Sloth Bear", "Wolf"],
    boundary: [
      [25.2, 75.3], [25.8, 75.3], [25.8, 76.2], [25.2, 76.2], [25.2, 75.3]
    ],
    zones: [
      { id: "ramgarh_vishdhari", name: "Ramgarh Vishdhari", riskMultiplier: 1.4, coordinates: [25.40, 75.60], radius: 7000 }
    ],
    historicalFires: [],
    climate: { avgTemp: 28, maxTemp: 46, rainfall: "700mm", fireSeason: "April to June" }
  },
  {
    id: "tonk_forest",
    name: "Tonk Forest Region",
    location: "Tonk",
    area: "Scattered forests",
    type: "Tropical Dry Deciduous",
    coordinates: { lat: 26.1628, lng: 75.7903 },
    description: "Scattered dry forests along the Banas river basin.",
    wildlife: ["Blue Bull", "Jackal", "Fox"],
    boundary: [
      [25.8, 75.4], [26.5, 75.4], [26.5, 76.5], [25.8, 76.5], [25.8, 75.4]
    ],
    zones: [
      { id: "banas_bed", name: "Banas River Bed", riskMultiplier: 0.6, coordinates: [26.10, 75.90], radius: 4000 }
    ],
    historicalFires: [],
    climate: { avgTemp: 27, maxTemp: 45, rainfall: "600mm", fireSeason: "May to June" }
  },
  {
    id: "ajmer_forest",
    name: "Ajmer Forest Region",
    location: "Ajmer",
    area: "Central Aravalli",
    type: "Dry Deciduous & Scrub",
    coordinates: { lat: 26.4499, lng: 74.6399 },
    description: "Central Rajasthan Aravalli forests. Includes Todgarh Raoli.",
    wildlife: ["Leopard", "Sloth Bear", "Civet"],
    boundary: [
      [26.0, 74.0], [26.8, 74.0], [26.8, 75.0], [26.0, 75.0], [26.0, 74.0]
    ],
    zones: [
      { id: "todgarh", name: "Todgarh Raoli", riskMultiplier: 1.2, coordinates: [25.80, 74.00], radius: 6000 },
      { id: "nag_pahar", name: "Nag Pahar", riskMultiplier: 1.5, coordinates: [26.48, 74.60], radius: 3000 }
    ],
    historicalFires: [],
    climate: { avgTemp: 26, maxTemp: 43, rainfall: "550mm", fireSeason: "April to June" }
  },
  {
    id: "pali_forest",
    name: "Pali Forest Region",
    location: "Pali",
    area: "Western Foothills",
    type: "Thorn Scrub & Dry Deciduous",
    coordinates: { lat: 25.7711, lng: 73.3234 },
    description: "Western Aravalli foothills forests, transition towards desert.",
    wildlife: ["Leopard", "Hyena", "Wolf"],
    boundary: [
      [25.0, 72.8], [26.2, 72.8], [26.2, 73.8], [25.0, 73.8], [25.0, 72.8]
    ],
    zones: [
      { id: "jawai", name: "Jawai Leopard Conservation", riskMultiplier: 0.9, coordinates: [25.10, 73.15], radius: 4000 }
    ],
    historicalFires: [],
    climate: { avgTemp: 28, maxTemp: 45, rainfall: "500mm", fireSeason: "March to May" }
  },
  {
    id: "sikar_forest",
    name: "Sikar Forest Patches",
    location: "Sikar",
    area: "Northern remnants",
    type: "Thorn Forest",
    coordinates: { lat: 27.6094, lng: 75.1398 },
    description: "Northern Aravalli remnants, patchy forest cover.",
    wildlife: ["Nilgai", "Fox", "Hare"],
    boundary: [
      [27.2, 74.8], [28.0, 74.8], [28.0, 75.5], [27.2, 75.5], [27.2, 74.8]
    ],
    zones: [
      { id: "harshnath", name: "Harshnath Hills", riskMultiplier: 1.1, coordinates: [27.50, 75.15], radius: 3000 }
    ],
    historicalFires: [],
    climate: { avgTemp: 26, maxTemp: 44, rainfall: "450mm", fireSeason: "May to June" }
  },
  {
    id: "jhunjhunu_forest",
    name: "Jhunjhunu Forest Areas",
    location: "Jhunjhunu",
    area: "Sparse cover",
    type: "Thorn & Scrub",
    coordinates: { lat: 28.1289, lng: 75.3995 },
    description: "Sparse but ecologically important forest pockets in semi-arid region.",
    wildlife: ["Blackbuck", "Chinkara", "Desert Cat"],
    boundary: [
      [27.8, 75.0], [28.4, 75.0], [28.4, 76.0], [27.8, 76.0], [27.8, 75.0]
    ],
    zones: [
      { id: "khetri", name: "Khetri Bansyal", riskMultiplier: 1.0, coordinates: [28.00, 75.80], radius: 4000 }
    ],
    historicalFires: [],
    climate: { avgTemp: 25, maxTemp: 45, rainfall: "400mm", fireSeason: "May to June" }
  },
  {
    id: "nagaur_forest",
    name: "Nagaur Forest Areas",
    location: "Nagaur",
    area: "Very sparse",
    type: "Thorn Forest",
    coordinates: { lat: 27.2032, lng: 73.7330 },
    description: "Very sparse vegetation, mostly thorny forests suited for arid climate.",
    wildlife: ["Chinkara", "Blackbuck", "Fox"],
    boundary: [
      [26.5, 73.0], [27.5, 73.0], [27.5, 74.5], [26.5, 74.5], [26.5, 73.0]
    ],
    zones: [
      { id: "rotu", name: "Rotu Conservation", riskMultiplier: 0.6, coordinates: [27.15, 74.05], radius: 2000 }
    ],
    historicalFires: [],
    climate: { avgTemp: 28, maxTemp: 48, rainfall: "350mm", fireSeason: "May to June" }
  }
];
