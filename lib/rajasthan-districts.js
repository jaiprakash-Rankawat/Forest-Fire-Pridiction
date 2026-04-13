/**
 * All 33 Districts of Rajasthan — Enriched Dataset
 * center: [lat, lng], used for map centering
 * zoom: recommended zoom level for the district map
 * forestCover: approximate forest cover category used for synthetic data weighting
 * majorForest: name of the prominent forest or wildlife sanctuary in the district
 * climate: district-specific climate characteristics
 * wildlife: notable species in the district with IUCN status
 * neighbors: slugs of neighboring districts (for comparison strip)
 * funFact: district-specific educational fact
 * fireInfrastructure: fire-fighting infrastructure info
 * fireSeason: specific high-risk months
 */
const RAJASTHAN_DISTRICTS = [
  {
    slug: 'ajmer', name: 'Ajmer', center: [26.45, 74.64], zoom: 10,
    forestCover: 'medium', majorForest: 'Todgarh Raoli Sanctuary & Pushkar Valley',
    climate: {
      avgSummerTemp: '38–44°C',
      annualRainfall: '500–550 mm',
      humidityDrySeason: '18–28%',
      fireSeason: 'March – June',
      windSpeed: '15–25 km/h',
      terrain: 'Aravalli hills and transitional plains'
    },
    wildlife: [
      { name: 'Indian Leopard', status: 'Vulnerable', icon: '🐆' },
      { name: 'Striped Hyena', status: 'Near Threatened', icon: '🦴' },
      { name: 'Indian Pangolin', status: 'Endangered', icon: '🦔' },
    ],
    neighbors: ['nagaur', 'jaipur', 'tonk', 'bhilwara', 'pali'],
    funFact: 'Todgarh-Raoli Wildlife Sanctuary connects the Aravalli forests of Rajsamand to Ajmer, forming one of the longest continuous green corridors in western Rajasthan.',
    fireInfrastructure: {
      watchtowers: 6,
      fireStations: 2,
      hasForestFireCell: true,
    }
  },
  {
    slug: 'alwar', name: 'Alwar', center: [27.55, 76.61], zoom: 10,
    forestCover: 'high', majorForest: 'Sariska Tiger Reserve',
    climate: {
      avgSummerTemp: '40–46°C',
      annualRainfall: '600–650 mm',
      humidityDrySeason: '15–25%',
      fireSeason: 'March – June',
      windSpeed: '20–30 km/h',
      terrain: 'Dense Aravalli hill forests with rocky gorges'
    },
    wildlife: [
      { name: 'Bengal Tiger', status: 'Endangered', icon: '🐅' },
      { name: 'Indian Leopard', status: 'Vulnerable', icon: '🐆' },
      { name: 'Sambar Deer', status: 'Vulnerable', icon: '🦌' },
      { name: 'Indian Eagle-Owl', status: 'Least Concern', icon: '🦉' },
    ],
    neighbors: ['jaipur', 'dausa', 'bharatpur'],
    funFact: 'Sariska was the first tiger reserve in the world to successfully reintroduce tigers after they were declared locally extinct in 2005. Tigers were relocated from Ranthambore in 2008.',
    fireInfrastructure: {
      watchtowers: 14,
      fireStations: 4,
      hasForestFireCell: true,
    }
  },
  {
    slug: 'banswara', name: 'Banswara', center: [23.55, 74.44], zoom: 10,
    forestCover: 'high', majorForest: 'Kagdapikup & Anand Sagar Forests',
    climate: {
      avgSummerTemp: '36–42°C',
      annualRainfall: '800–950 mm',
      humidityDrySeason: '20–30%',
      fireSeason: 'March – May',
      windSpeed: '10–20 km/h',
      terrain: 'Southern tribal belt with deciduous forests and Mahi River basin'
    },
    wildlife: [
      { name: 'Indian Leopard', status: 'Vulnerable', icon: '🐆' },
      { name: 'Four-horned Antelope', status: 'Vulnerable', icon: '🦌' },
      { name: 'Indian Python', status: 'Near Threatened', icon: '🐍' },
    ],
    neighbors: ['dungarpur', 'pratapgarh', 'udaipur'],
    funFact: 'Known as the "Cherrapunji of Rajasthan," Banswara receives among the highest rainfall in the state, making its forests lush but also creating heavy fuel loads during dry seasons.',
    fireInfrastructure: {
      watchtowers: 8,
      fireStations: 2,
      hasForestFireCell: false,
    }
  },
  {
    slug: 'baran', name: 'Baran', center: [25.10, 76.51], zoom: 10,
    forestCover: 'high', majorForest: 'Shergarh Wildlife Sanctuary',
    climate: {
      avgSummerTemp: '38–45°C',
      annualRainfall: '750–850 mm',
      humidityDrySeason: '18–28%',
      fireSeason: 'March – June',
      windSpeed: '15–25 km/h',
      terrain: 'Hadoti plateau with dense mixed deciduous forests'
    },
    wildlife: [
      { name: 'Indian Leopard', status: 'Vulnerable', icon: '🐆' },
      { name: 'Gharial', status: 'Critically Endangered', icon: '🐊' },
      { name: 'Indian Wolf', status: 'Endangered', icon: '🐺' },
    ],
    neighbors: ['kota', 'jhalawar', 'chittorgarh'],
    funFact: 'Shergarh Sanctuary is home to one of the last populations of the critically endangered Gharial crocodile in Rajasthan, found along the Parvati River.',
    fireInfrastructure: {
      watchtowers: 5,
      fireStations: 2,
      hasForestFireCell: true,
    }
  },
  {
    slug: 'barmer', name: 'Barmer', center: [25.75, 71.39], zoom: 9,
    forestCover: 'low', majorForest: 'Desert National Park (Barmer Ext.)',
    climate: {
      avgSummerTemp: '42–50°C',
      annualRainfall: '200–300 mm',
      humidityDrySeason: '8–15%',
      fireSeason: 'February – June',
      windSpeed: '35–55 km/h',
      terrain: 'Thar Desert with sand dunes and sparse scrub'
    },
    wildlife: [
      { name: 'Great Indian Bustard', status: 'Critically Endangered', icon: '🦅' },
      { name: 'Desert Fox', status: 'Least Concern', icon: '🦊' },
      { name: 'Spiny-tailed Lizard', status: 'Vulnerable', icon: '🦎' },
    ],
    neighbors: ['jaisalmer', 'jalore', 'pali', 'jodhpur'],
    funFact: 'Despite being a desert district, Barmer experiences localized brush fires driven by extreme winds (Loo) that can reach 55 km/h, carrying sparks across vast distances.',
    fireInfrastructure: {
      watchtowers: 2,
      fireStations: 1,
      hasForestFireCell: false,
    }
  },
  {
    slug: 'bharatpur', name: 'Bharatpur', center: [27.22, 77.49], zoom: 10,
    forestCover: 'medium', majorForest: 'Keoladeo National Park & Bandh Baretha',
    climate: {
      avgSummerTemp: '40–47°C',
      annualRainfall: '600–700 mm',
      humidityDrySeason: '15–25%',
      fireSeason: 'April – June',
      windSpeed: '15–30 km/h',
      terrain: 'Indo-Gangetic plains with wetlands and scrub forests'
    },
    wildlife: [
      { name: 'Sarus Crane', status: 'Vulnerable', icon: '🦩' },
      { name: 'Indian Python', status: 'Near Threatened', icon: '🐍' },
      { name: 'Nilgai', status: 'Least Concern', icon: '🦌' },
    ],
    neighbors: ['alwar', 'dausa', 'karauli', 'dholpur'],
    funFact: 'Keoladeo National Park is a UNESCO World Heritage Site and one of the world\'s most important bird-breeding habitats, hosting over 350 species of migratory and resident birds.',
    fireInfrastructure: {
      watchtowers: 4,
      fireStations: 2,
      hasForestFireCell: true,
    }
  },
  {
    slug: 'bhilwara', name: 'Bhilwara', center: [25.35, 74.64], zoom: 10,
    forestCover: 'medium', majorForest: 'Menal & Mandalgarh Forests',
    climate: {
      avgSummerTemp: '38–44°C',
      annualRainfall: '550–650 mm',
      humidityDrySeason: '18–28%',
      fireSeason: 'March – June',
      windSpeed: '15–25 km/h',
      terrain: 'Aravalli foothills with dry deciduous forests'
    },
    wildlife: [
      { name: 'Indian Leopard', status: 'Vulnerable', icon: '🐆' },
      { name: 'Indian Wolf', status: 'Endangered', icon: '🐺' },
      { name: 'Chinkara', status: 'Least Concern', icon: '🦌' },
    ],
    neighbors: ['ajmer', 'rajsamand', 'chittorgarh', 'bundi', 'tonk'],
    funFact: 'Bhilwara\'s Menal forests contain ancient temple ruins dating to the 11th century, surrounded by dense vegetation that acts as both a heritage and fire-management challenge.',
    fireInfrastructure: {
      watchtowers: 4,
      fireStations: 2,
      hasForestFireCell: false,
    }
  },
  {
    slug: 'bikaner', name: 'Bikaner', center: [28.02, 73.31], zoom: 9,
    forestCover: 'low', majorForest: 'Gajner Wildlife Sanctuary & Jorbeer',
    climate: {
      avgSummerTemp: '42–48°C',
      annualRainfall: '200–300 mm',
      humidityDrySeason: '8–18%',
      fireSeason: 'March – June',
      windSpeed: '30–50 km/h',
      terrain: 'Sandy desert plains with sparse xerophytic vegetation'
    },
    wildlife: [
      { name: 'Blackbuck', status: 'Least Concern', icon: '🦌' },
      { name: 'Desert Fox', status: 'Least Concern', icon: '🦊' },
      { name: 'Imperial Eagle', status: 'Vulnerable', icon: '🦅' },
    ],
    neighbors: ['sri-ganganagar', 'hanumangarh', 'churu', 'nagaur', 'jodhpur', 'jaisalmer'],
    funFact: 'Gajner Palace and its surrounding sanctuary once served as the hunting grounds of Bikaner royals. Today the lake and forest are a critical water source in the Thar Desert.',
    fireInfrastructure: {
      watchtowers: 2,
      fireStations: 1,
      hasForestFireCell: false,
    }
  },
  {
    slug: 'bundi', name: 'Bundi', center: [25.44, 75.64], zoom: 10,
    forestCover: 'medium', majorForest: 'Ramgarh Vishdhari Tiger Reserve',
    climate: {
      avgSummerTemp: '38–45°C',
      annualRainfall: '650–750 mm',
      humidityDrySeason: '18–28%',
      fireSeason: 'March – June',
      windSpeed: '15–25 km/h',
      terrain: 'Hadoti plateau with Vindhyan hills and ravine forests'
    },
    wildlife: [
      { name: 'Bengal Tiger', status: 'Endangered', icon: '🐅' },
      { name: 'Indian Leopard', status: 'Vulnerable', icon: '🐆' },
      { name: 'Sloth Bear', status: 'Vulnerable', icon: '🐻' },
    ],
    neighbors: ['tonk', 'bhilwara', 'chittorgarh', 'kota'],
    funFact: 'Ramgarh Vishdhari was declared India\'s 52nd Tiger Reserve in 2022, serving as a critical corridor connecting Ranthambore (north) and Mukundra Hills (south).',
    fireInfrastructure: {
      watchtowers: 8,
      fireStations: 2,
      hasForestFireCell: true,
    }
  },
  {
    slug: 'chittorgarh', name: 'Chittorgarh', center: [24.88, 74.63], zoom: 10,
    forestCover: 'medium', majorForest: 'Sita Mata Sanctuary (part) & Bassi',
    climate: {
      avgSummerTemp: '38–44°C',
      annualRainfall: '650–750 mm',
      humidityDrySeason: '18–28%',
      fireSeason: 'March – June',
      windSpeed: '15–25 km/h',
      terrain: 'Aravalli foothills transitioning to Malwa plateau'
    },
    wildlife: [
      { name: 'Flying Squirrel', status: 'Least Concern', icon: '🐿️' },
      { name: 'Indian Pangolin', status: 'Endangered', icon: '🦔' },
      { name: 'Indian Leopard', status: 'Vulnerable', icon: '🐆' },
    ],
    neighbors: ['rajsamand', 'bhilwara', 'bundi', 'kota', 'jhalawar', 'pratapgarh', 'udaipur'],
    funFact: 'Bassi Wildlife Sanctuary near Chittorgarh is one of the few places in Rajasthan where the Indian Giant Flying Squirrel has been sighted — a nocturnal glider requiring tall, continuous canopy.',
    fireInfrastructure: {
      watchtowers: 5,
      fireStations: 2,
      hasForestFireCell: false,
    }
  },
  {
    slug: 'churu', name: 'Churu', center: [28.30, 74.97], zoom: 10,
    forestCover: 'low', majorForest: 'Tal Chhapar Sanctuary',
    climate: {
      avgSummerTemp: '42–50°C',
      annualRainfall: '300–400 mm',
      humidityDrySeason: '10–20%',
      fireSeason: 'March – June',
      windSpeed: '25–40 km/h',
      terrain: 'Arid sandy plains with grasslands'
    },
    wildlife: [
      { name: 'Blackbuck', status: 'Least Concern', icon: '🦌' },
      { name: 'Desert Fox', status: 'Least Concern', icon: '🦊' },
      { name: 'Harrier Eagles', status: 'Least Concern', icon: '🦅' },
    ],
    neighbors: ['jhunjhunu', 'sikar', 'nagaur', 'bikaner', 'hanumangarh'],
    funFact: 'Churu holds the record for the highest temperature ever recorded in India — a scorching 50.6°C (123°F), making grassland fires here ignite with terrifying speed.',
    fireInfrastructure: {
      watchtowers: 1,
      fireStations: 1,
      hasForestFireCell: false,
    }
  },
  {
    slug: 'dausa', name: 'Dausa', center: [26.88, 76.34], zoom: 10,
    forestCover: 'low', majorForest: 'Sainthal Sagar Forests',
    climate: {
      avgSummerTemp: '40–46°C',
      annualRainfall: '500–600 mm',
      humidityDrySeason: '15–25%',
      fireSeason: 'April – June',
      windSpeed: '15–25 km/h',
      terrain: 'Semi-arid rocky terrain with sparse scrub'
    },
    wildlife: [
      { name: 'Nilgai', status: 'Least Concern', icon: '🦌' },
      { name: 'Indian Hare', status: 'Least Concern', icon: '🐇' },
      { name: 'Peacock', status: 'Least Concern', icon: '🦚' },
    ],
    neighbors: ['jaipur', 'alwar', 'bharatpur', 'karauli', 'tonk'],
    funFact: 'Dausa district contains Abhaneri, a 9th-century stepwell marvel, surrounded by scrublands that were once part of a much larger Aravalli forest corridor — now severely degraded.',
    fireInfrastructure: {
      watchtowers: 1,
      fireStations: 1,
      hasForestFireCell: false,
    }
  },
  {
    slug: 'dholpur', name: 'Dholpur', center: [26.70, 77.89], zoom: 10,
    forestCover: 'medium', majorForest: 'Van Vihar & Ramsagar Sanctuary',
    climate: {
      avgSummerTemp: '40–47°C',
      annualRainfall: '600–700 mm',
      humidityDrySeason: '15–25%',
      fireSeason: 'April – June',
      windSpeed: '15–25 km/h',
      terrain: 'Chambal ravines with mixed scrub and dry deciduous patches'
    },
    wildlife: [
      { name: 'Gharial', status: 'Critically Endangered', icon: '🐊' },
      { name: 'Gangetic Dolphin', status: 'Endangered', icon: '🐬' },
      { name: 'Red-crowned Turtle', status: 'Critically Endangered', icon: '🐢' },
    ],
    neighbors: ['bharatpur', 'karauli'],
    funFact: 'Dholpur lies along the Chambal River — one of India\'s cleanest rivers and a last refuge for critically endangered Gharials and Gangetic Dolphins.',
    fireInfrastructure: {
      watchtowers: 3,
      fireStations: 1,
      hasForestFireCell: false,
    }
  },
  {
    slug: 'dungarpur', name: 'Dungarpur', center: [23.84, 73.71], zoom: 10,
    forestCover: 'high', majorForest: 'Galiyakot & Sitamata (Dungarpur Range)',
    climate: {
      avgSummerTemp: '36–42°C',
      annualRainfall: '700–850 mm',
      humidityDrySeason: '20–30%',
      fireSeason: 'March – May',
      windSpeed: '10–20 km/h',
      terrain: 'Southern Aravalli tribal forests with teak and bamboo'
    },
    wildlife: [
      { name: 'Indian Leopard', status: 'Vulnerable', icon: '🐆' },
      { name: 'Four-horned Antelope', status: 'Vulnerable', icon: '🦌' },
      { name: 'Indian Giant Squirrel', status: 'Least Concern', icon: '🐿️' },
    ],
    neighbors: ['udaipur', 'banswara'],
    funFact: 'Dungarpur\'s tribal Bhil communities have practiced "Valra" (shift cultivation) for centuries, which involves controlled forest burning — a double-edged tradition for fire management.',
    fireInfrastructure: {
      watchtowers: 6,
      fireStations: 2,
      hasForestFireCell: false,
    }
  },
  {
    slug: 'hanumangarh', name: 'Hanumangarh', center: [29.58, 74.33], zoom: 10,
    forestCover: 'low', majorForest: 'Ghaggar River Plains Plantations',
    climate: {
      avgSummerTemp: '42–48°C',
      annualRainfall: '250–350 mm',
      humidityDrySeason: '10–20%',
      fireSeason: 'April – June',
      windSpeed: '25–40 km/h',
      terrain: 'Alluvial plains of ancient Ghaggar-Hakra river system'
    },
    wildlife: [
      { name: 'Blackbuck', status: 'Least Concern', icon: '🦌' },
      { name: 'Indian Hare', status: 'Least Concern', icon: '🐇' },
      { name: 'Short-toed Eagle', status: 'Least Concern', icon: '🦅' },
    ],
    neighbors: ['sri-ganganagar', 'churu', 'bikaner'],
    funFact: 'Hanumangarh was the site of the ancient Indus Valley civilization at Kalibangan (2500 BCE). The paleo-channel of the Ghaggar river still influences fire patterns along its dried bed.',
    fireInfrastructure: {
      watchtowers: 1,
      fireStations: 1,
      hasForestFireCell: false,
    }
  },
  {
    slug: 'jaipur', name: 'Jaipur', center: [26.92, 75.79], zoom: 10,
    forestCover: 'medium', majorForest: 'Jhalana Leopard Reserve & Nahargarh',
    climate: {
      avgSummerTemp: '38–45°C',
      annualRainfall: '550–650 mm',
      humidityDrySeason: '15–25%',
      fireSeason: 'March – June',
      windSpeed: '15–30 km/h',
      terrain: 'Aravalli hills surrounding urban sprawl with protected ridge forests'
    },
    wildlife: [
      { name: 'Indian Leopard', status: 'Vulnerable', icon: '🐆' },
      { name: 'Striped Hyena', status: 'Near Threatened', icon: '🦴' },
      { name: 'Peacock', status: 'Least Concern', icon: '🦚' },
    ],
    neighbors: ['sikar', 'alwar', 'dausa', 'tonk', 'ajmer', 'nagaur'],
    funFact: 'Jhalana is the world\'s only leopard reserve located entirely within a major city (Jaipur, population 4M+). Forest fires here directly threaten both wildlife and urban settlements.',
    fireInfrastructure: {
      watchtowers: 8,
      fireStations: 5,
      hasForestFireCell: true,
    }
  },
  {
    slug: 'jaisalmer', name: 'Jaisalmer', center: [26.92, 70.91], zoom: 8,
    forestCover: 'low', majorForest: 'Desert National Park (Core)',
    climate: {
      avgSummerTemp: '42–50°C',
      annualRainfall: '100–200 mm',
      humidityDrySeason: '5–15%',
      fireSeason: 'February – June',
      windSpeed: '40–60 km/h',
      terrain: 'Open Thar Desert with sand dunes, rocky platforms, and salt flats'
    },
    wildlife: [
      { name: 'Great Indian Bustard', status: 'Critically Endangered', icon: '🦅' },
      { name: 'Desert Cat', status: 'Least Concern', icon: '🐱' },
      { name: 'Spiny-tailed Lizard', status: 'Vulnerable', icon: '🦎' },
      { name: 'Chinkara', status: 'Least Concern', icon: '🦌' },
    ],
    neighbors: ['barmer', 'jodhpur', 'bikaner'],
    funFact: 'Jaisalmer is India\'s largest district by area (38,401 km²). The Desert National Park here is the last stronghold of the critically endangered Great Indian Bustard — fewer than 150 survive worldwide.',
    fireInfrastructure: {
      watchtowers: 3,
      fireStations: 1,
      hasForestFireCell: false,
    }
  },
  {
    slug: 'jalore', name: 'Jalore', center: [25.35, 72.62], zoom: 10,
    forestCover: 'low', majorForest: 'Sundha Mata Conservation Reserve',
    climate: {
      avgSummerTemp: '40–47°C',
      annualRainfall: '350–500 mm',
      humidityDrySeason: '12–22%',
      fireSeason: 'March – June',
      windSpeed: '20–35 km/h',
      terrain: 'Western Aravalli fringe with rocky hills and scrub forests'
    },
    wildlife: [
      { name: 'Indian Wolf', status: 'Endangered', icon: '🐺' },
      { name: 'Chinkara', status: 'Least Concern', icon: '🦌' },
      { name: 'Peacock', status: 'Least Concern', icon: '🦚' },
    ],
    neighbors: ['barmer', 'pali', 'sirohi'],
    funFact: 'Sundha Mata hill, rising to 1,220m, creates a micro-climate pocket with denser vegetation than the surrounding arid plains, making it a localized fire-risk hotspot.',
    fireInfrastructure: {
      watchtowers: 2,
      fireStations: 1,
      hasForestFireCell: false,
    }
  },
  {
    slug: 'jhalawar', name: 'Jhalawar', center: [24.60, 76.16], zoom: 10,
    forestCover: 'high', majorForest: 'Mukundra Hills Tiger Reserve (part)',
    climate: {
      avgSummerTemp: '38–44°C',
      annualRainfall: '800–1000 mm',
      humidityDrySeason: '18–30%',
      fireSeason: 'March – June',
      windSpeed: '15–25 km/h',
      terrain: 'Malwa plateau with dense deciduous forests and river valleys'
    },
    wildlife: [
      { name: 'Bengal Tiger', status: 'Endangered', icon: '🐅' },
      { name: 'Indian Leopard', status: 'Vulnerable', icon: '🐆' },
      { name: 'Sloth Bear', status: 'Vulnerable', icon: '🐻' },
    ],
    neighbors: ['kota', 'baran', 'chittorgarh'],
    funFact: 'Jhalawar is perhaps the greenest desert-state district — receiving up to 1,000mm rainfall annually, more akin to central India. Its Mukundra forests harbor Rajasthan\'s third tiger reserve.',
    fireInfrastructure: {
      watchtowers: 10,
      fireStations: 3,
      hasForestFireCell: true,
    }
  },
  {
    slug: 'jhunjhunu', name: 'Jhunjhunu', center: [28.13, 75.40], zoom: 10,
    forestCover: 'low', majorForest: 'Biyal & Shakambhari (part)',
    climate: {
      avgSummerTemp: '40–47°C',
      annualRainfall: '350–450 mm',
      humidityDrySeason: '12–22%',
      fireSeason: 'April – June',
      windSpeed: '20–35 km/h',
      terrain: 'Semi-arid Shekhawati plains with sparse vegetation'
    },
    wildlife: [
      { name: 'Nilgai', status: 'Least Concern', icon: '🦌' },
      { name: 'Indian Hare', status: 'Least Concern', icon: '🐇' },
      { name: 'Peacock', status: 'Least Concern', icon: '🦚' },
    ],
    neighbors: ['churu', 'sikar'],
    funFact: 'The Shekhawati region in Jhunjhunu is called the "Open Art Gallery of Rajasthan" for its painted havelis. The sparse surrounding scrubland dries quickly but rarely sustains large fires.',
    fireInfrastructure: {
      watchtowers: 1,
      fireStations: 1,
      hasForestFireCell: false,
    }
  },
  {
    slug: 'jodhpur', name: 'Jodhpur', center: [26.29, 73.02], zoom: 9,
    forestCover: 'low', majorForest: 'Machia Biological Park & Rao Jodha Park',
    climate: {
      avgSummerTemp: '40–48°C',
      annualRainfall: '300–400 mm',
      humidityDrySeason: '10–20%',
      fireSeason: 'March – June',
      windSpeed: '25–45 km/h',
      terrain: 'Thar Desert edge with rocky hills and xerophytic scrub'
    },
    wildlife: [
      { name: 'Indian Spiny-tailed Lizard', status: 'Vulnerable', icon: '🦎' },
      { name: 'Desert Fox', status: 'Least Concern', icon: '🦊' },
      { name: 'Chinkara', status: 'Least Concern', icon: '🦌' },
    ],
    neighbors: ['jaisalmer', 'barmer', 'pali', 'nagaur', 'bikaner'],
    funFact: 'Rao Jodha Desert Rock Park restored 80+ native desert plant species on a 72-hectare wasteland. It demonstrates that even desert ecosystems need fire management during extreme summers.',
    fireInfrastructure: {
      watchtowers: 3,
      fireStations: 2,
      hasForestFireCell: false,
    }
  },
  {
    slug: 'karauli', name: 'Karauli', center: [26.49, 77.02], zoom: 10,
    forestCover: 'high', majorForest: 'Kailadevi Wildlife Sanctuary',
    climate: {
      avgSummerTemp: '40–46°C',
      annualRainfall: '650–750 mm',
      humidityDrySeason: '15–25%',
      fireSeason: 'March – June',
      windSpeed: '15–25 km/h',
      terrain: 'Ravine country with dhok-dominated dry deciduous forests'
    },
    wildlife: [
      { name: 'Bengal Tiger', status: 'Endangered', icon: '🐅' },
      { name: 'Indian Leopard', status: 'Vulnerable', icon: '🐆' },
      { name: 'Indian Wolf', status: 'Endangered', icon: '🐺' },
      { name: 'Caracal', status: 'Least Concern', icon: '🐱' },
    ],
    neighbors: ['dausa', 'bharatpur', 'dholpur', 'sawai-madhopur'],
    funFact: 'Kailadevi is a critical extension of the Ranthambore Tiger Reserve and one of the rare places in India where the elusive Caracal (desert lynx) has been photographed.',
    fireInfrastructure: {
      watchtowers: 10,
      fireStations: 3,
      hasForestFireCell: true,
    }
  },
  {
    slug: 'kota', name: 'Kota', center: [25.18, 75.83], zoom: 10,
    forestCover: 'medium', majorForest: 'Mukundra Hills & Jawahar Sagar',
    climate: {
      avgSummerTemp: '38–45°C',
      annualRainfall: '700–800 mm',
      humidityDrySeason: '18–28%',
      fireSeason: 'March – June',
      windSpeed: '15–25 km/h',
      terrain: 'Hadoti plateau with Chambal gorges and mixed deciduous forests'
    },
    wildlife: [
      { name: 'Bengal Tiger', status: 'Endangered', icon: '🐅' },
      { name: 'Gharial', status: 'Critically Endangered', icon: '🐊' },
      { name: 'Indian Leopard', status: 'Vulnerable', icon: '🐆' },
    ],
    neighbors: ['bundi', 'bhilwara', 'chittorgarh', 'jhalawar', 'baran'],
    funFact: 'The Chambal River canyon near Kota is up to 100m deep and acts as a natural firebreak, preventing fires from crossing between the eastern and western forest blocks.',
    fireInfrastructure: {
      watchtowers: 8,
      fireStations: 3,
      hasForestFireCell: true,
    }
  },
  {
    slug: 'nagaur', name: 'Nagaur', center: [27.20, 73.74], zoom: 9,
    forestCover: 'low', majorForest: 'Gogelao Conservation Reserve',
    climate: {
      avgSummerTemp: '42–48°C',
      annualRainfall: '300–400 mm',
      humidityDrySeason: '10–20%',
      fireSeason: 'March – June',
      windSpeed: '25–40 km/h',
      terrain: 'Semi-arid flat plains transitioning from Aravalli to Thar'
    },
    wildlife: [
      { name: 'Chinkara', status: 'Least Concern', icon: '🦌' },
      { name: 'Indian Bustard', status: 'Critically Endangered', icon: '🦅' },
      { name: 'Desert Fox', status: 'Least Concern', icon: '🦊' },
    ],
    neighbors: ['bikaner', 'jodhpur', 'pali', 'ajmer', 'jaipur', 'sikar', 'churu'],
    funFact: 'Nagaur hosts one of Asia\'s largest cattle fairs. The massive temporary camps and cooking fires during the fair have historically triggered accidental grassland fires nearby.',
    fireInfrastructure: {
      watchtowers: 2,
      fireStations: 1,
      hasForestFireCell: false,
    }
  },
  {
    slug: 'pali', name: 'Pali', center: [25.77, 73.33], zoom: 10,
    forestCover: 'medium', majorForest: 'Jawai Leopard Reserve & Kumbhalgarh (Pali zone)',
    climate: {
      avgSummerTemp: '38–45°C',
      annualRainfall: '450–600 mm',
      humidityDrySeason: '15–25%',
      fireSeason: 'March – June',
      windSpeed: '15–30 km/h',
      terrain: 'Western Aravalli slopes with mixed dry forests and granite hills'
    },
    wildlife: [
      { name: 'Indian Leopard', status: 'Vulnerable', icon: '🐆' },
      { name: 'Sloth Bear', status: 'Vulnerable', icon: '🐻' },
      { name: 'Crocodile (Mugger)', status: 'Vulnerable', icon: '🐊' },
    ],
    neighbors: ['jodhpur', 'barmer', 'jalore', 'sirohi', 'rajsamand', 'ajmer', 'nagaur'],
    funFact: 'Jawai is dubbed India\'s "Land of Leopards" — with one of the highest leopard densities in the world. These leopards uniquely coexist with the local Rabari pastoral community.',
    fireInfrastructure: {
      watchtowers: 7,
      fireStations: 2,
      hasForestFireCell: true,
    }
  },
  {
    slug: 'pratapgarh', name: 'Pratapgarh', center: [24.03, 74.78], zoom: 10,
    forestCover: 'high', majorForest: 'Sita Mata Wildlife Sanctuary',
    climate: {
      avgSummerTemp: '36–42°C',
      annualRainfall: '800–1000 mm',
      humidityDrySeason: '20–30%',
      fireSeason: 'March – May',
      windSpeed: '10–20 km/h',
      terrain: 'Dense mixed deciduous forests on southern Aravalli spurs'
    },
    wildlife: [
      { name: 'Flying Squirrel', status: 'Least Concern', icon: '🐿️' },
      { name: 'Indian Pangolin', status: 'Endangered', icon: '🦔' },
      { name: 'Four-horned Antelope', status: 'Vulnerable', icon: '🦌' },
      { name: 'Indian Leopard', status: 'Vulnerable', icon: '🐆' },
    ],
    neighbors: ['chittorgarh', 'udaipur', 'banswara'],
    funFact: 'Sita Mata Sanctuary is unique as it marks the confluence of three bio-geographic zones — Aravalli, Malwa Plateau, and Deccan — creating extraordinary biodiversity in a small area.',
    fireInfrastructure: {
      watchtowers: 8,
      fireStations: 2,
      hasForestFireCell: true,
    }
  },
  {
    slug: 'rajsamand', name: 'Rajsamand', center: [25.07, 73.88], zoom: 10,
    forestCover: 'high', majorForest: 'Kumbhalgarh Wildlife Sanctuary',
    climate: {
      avgSummerTemp: '36–43°C',
      annualRainfall: '550–700 mm',
      humidityDrySeason: '15–25%',
      fireSeason: 'March – June',
      windSpeed: '15–25 km/h',
      terrain: 'Core Aravalli range with steep valleys and dense dry deciduous forest'
    },
    wildlife: [
      { name: 'Indian Leopard', status: 'Vulnerable', icon: '🐆' },
      { name: 'Sloth Bear', status: 'Vulnerable', icon: '🐻' },
      { name: 'Indian Wolf', status: 'Endangered', icon: '🐺' },
      { name: 'Indian Giant Squirrel', status: 'Least Concern', icon: '🐿️' },
    ],
    neighbors: ['ajmer', 'bhilwara', 'chittorgarh', 'udaipur', 'pali'],
    funFact: 'Kumbhalgarh Fort boasts the 2nd longest continuous wall in the world (36 km), after the Great Wall of China. The fort sits within the sanctuary, and wildfires have reached its outer walls.',
    fireInfrastructure: {
      watchtowers: 12,
      fireStations: 3,
      hasForestFireCell: true,
    }
  },
  {
    slug: 'sawai-madhopur', name: 'Sawai Madhopur', center: [26.02, 76.35], zoom: 10,
    forestCover: 'high', majorForest: 'Ranthambore National Park',
    climate: {
      avgSummerTemp: '38–46°C',
      annualRainfall: '650–800 mm',
      humidityDrySeason: '15–25%',
      fireSeason: 'March – June',
      windSpeed: '15–25 km/h',
      terrain: 'Vindhyan plateau with rugged terrain, dry deciduous forests, and ancient lake systems'
    },
    wildlife: [
      { name: 'Bengal Tiger', status: 'Endangered', icon: '🐅' },
      { name: 'Indian Leopard', status: 'Vulnerable', icon: '🐆' },
      { name: 'Sloth Bear', status: 'Vulnerable', icon: '🐻' },
      { name: 'Marsh Crocodile', status: 'Vulnerable', icon: '🐊' },
    ],
    neighbors: ['jaipur', 'dausa', 'karauli', 'tonk', 'bundi', 'kota'],
    funFact: 'Ranthambore is home to perhaps the world\'s most photographed wild tigress — "Machli" (T-16) — who lived to 20 years. It was India\'s first tiger reserve to experience a major wildfire affecting tiger territory.',
    fireInfrastructure: {
      watchtowers: 18,
      fireStations: 5,
      hasForestFireCell: true,
    }
  },
  {
    slug: 'sikar', name: 'Sikar', center: [27.61, 75.14], zoom: 10,
    forestCover: 'low', majorForest: 'Harshnath & Shakambhari Conservation Reserve',
    climate: {
      avgSummerTemp: '40–47°C',
      annualRainfall: '400–500 mm',
      humidityDrySeason: '12–22%',
      fireSeason: 'April – June',
      windSpeed: '20–30 km/h',
      terrain: 'Aravalli northern edge with isolated hill forests'
    },
    wildlife: [
      { name: 'Indian Leopard', status: 'Vulnerable', icon: '🐆' },
      { name: 'Nilgai', status: 'Least Concern', icon: '🦌' },
      { name: 'Peacock', status: 'Least Concern', icon: '🦚' },
    ],
    neighbors: ['jhunjhunu', 'churu', 'nagaur', 'jaipur'],
    funFact: 'Shakambhari Mata temple sits at 1,033m atop the Aravalli hills. The surrounding reserve is a rare green island in an otherwise arid landscape — making it both precious and fire-vulnerable.',
    fireInfrastructure: {
      watchtowers: 2,
      fireStations: 1,
      hasForestFireCell: false,
    }
  },
  {
    slug: 'sirohi', name: 'Sirohi', center: [24.88, 72.86], zoom: 10,
    forestCover: 'high', majorForest: 'Mount Abu Wildlife Sanctuary',
    climate: {
      avgSummerTemp: '33–40°C',
      annualRainfall: '600–850 mm',
      humidityDrySeason: '15–25%',
      fireSeason: 'March – June',
      windSpeed: '15–30 km/h',
      terrain: 'Highest point in Rajasthan (Guru Shikhar 1,722m) with subtropical hill forests'
    },
    wildlife: [
      { name: 'Indian Leopard', status: 'Vulnerable', icon: '🐆' },
      { name: 'Sloth Bear', status: 'Vulnerable', icon: '🐻' },
      { name: 'Wild Boar', status: 'Least Concern', icon: '🐗' },
      { name: 'Indian Giant Squirrel', status: 'Least Concern', icon: '🐿️' },
    ],
    neighbors: ['jalore', 'pali', 'udaipur'],
    funFact: 'Mount Abu is Rajasthan\'s only hill station. At 1,722m, Guru Shikhar is the highest point in the Aravallis. The subtropical forest here is ecologically unique in an otherwise arid state.',
    fireInfrastructure: {
      watchtowers: 10,
      fireStations: 3,
      hasForestFireCell: true,
    }
  },
  {
    slug: 'sri-ganganagar', name: 'Sri Ganganagar', center: [29.91, 73.88], zoom: 9,
    forestCover: 'low', majorForest: 'Indira Gandhi Canal Green Belt',
    climate: {
      avgSummerTemp: '42–49°C',
      annualRainfall: '200–300 mm',
      humidityDrySeason: '8–18%',
      fireSeason: 'April – June',
      windSpeed: '30–45 km/h',
      terrain: 'Canal-irrigated desert plains with agricultural plantations'
    },
    wildlife: [
      { name: 'Blackbuck', status: 'Least Concern', icon: '🦌' },
      { name: 'Indian Hare', status: 'Least Concern', icon: '🐇' },
      { name: 'Short-toed Eagle', status: 'Least Concern', icon: '🦅' },
    ],
    neighbors: ['hanumangarh', 'bikaner'],
    funFact: 'The Indira Gandhi Canal transformed this desert district into Rajasthan\'s "food bowl." But the canal-side plantation belts create linear fire corridors that are challenging to manage.',
    fireInfrastructure: {
      watchtowers: 1,
      fireStations: 1,
      hasForestFireCell: false,
    }
  },
  {
    slug: 'tonk', name: 'Tonk', center: [26.17, 75.79], zoom: 10,
    forestCover: 'low', majorForest: 'Bisalpur Conservation Reserve',
    climate: {
      avgSummerTemp: '40–46°C',
      annualRainfall: '500–600 mm',
      humidityDrySeason: '15–25%',
      fireSeason: 'April – June',
      windSpeed: '15–25 km/h',
      terrain: 'Semi-arid plains with scattered scrub and reservoir zones'
    },
    wildlife: [
      { name: 'Chinkara', status: 'Least Concern', icon: '🦌' },
      { name: 'Nilgai', status: 'Least Concern', icon: '🦌' },
      { name: 'Indian Wolf', status: 'Endangered', icon: '🐺' },
    ],
    neighbors: ['jaipur', 'dausa', 'sawai-madhopur', 'bundi', 'bhilwara', 'ajmer'],
    funFact: 'Bisalpur Dam is Jaipur\'s primary drinking water source. Forest fires in the Bisalpur catchment area directly threaten the water quality for over 4 million people downstream.',
    fireInfrastructure: {
      watchtowers: 2,
      fireStations: 1,
      hasForestFireCell: false,
    }
  },
  {
    slug: 'udaipur', name: 'Udaipur', center: [24.58, 73.68], zoom: 9,
    forestCover: 'high', majorForest: 'Sajjangarh, Phulwari ki Nal & Jaisamand',
    climate: {
      avgSummerTemp: '36–42°C',
      annualRainfall: '600–750 mm',
      humidityDrySeason: '15–25%',
      fireSeason: 'March – June',
      windSpeed: '15–30 km/h',
      terrain: 'Core Aravalli range with deep valleys, lake systems, and dense deciduous forests'
    },
    wildlife: [
      { name: 'Indian Leopard', status: 'Vulnerable', icon: '🐆' },
      { name: 'Sloth Bear', status: 'Vulnerable', icon: '🐻' },
      { name: 'Indian Giant Squirrel', status: 'Least Concern', icon: '🐿️' },
      { name: 'Indian Wolf', status: 'Endangered', icon: '🐺' },
    ],
    neighbors: ['rajsamand', 'chittorgarh', 'pratapgarh', 'dungarpur', 'sirohi', 'pali'],
    funFact: 'Udaipur recorded a staggering 2,905 forest fire incidents over just 5 years (2015–2019) — the highest of any district in Rajasthan, making it the top priority for fire monitoring.',
    fireInfrastructure: {
      watchtowers: 15,
      fireStations: 4,
      hasForestFireCell: true,
    }
  },
];

// Forest cover weighting for synthetic data generation
const FOREST_WEIGHTS = {
  high: { firePoints: [40, 80], clusterDensity: 0.7 },
  medium: { firePoints: [15, 40], clusterDensity: 0.5 },
  low: { firePoints: [5, 15], clusterDensity: 0.3 },
};

// CommonJS + ESM dual export
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { RAJASTHAN_DISTRICTS, FOREST_WEIGHTS };
}

export { RAJASTHAN_DISTRICTS, FOREST_WEIGHTS };
