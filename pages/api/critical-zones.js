// Critical fire zones data with historical cases by country
const criticalZonesData = {
  'India': [
    {
      id: 1,
      name: 'Uttarakhand Forest Fires',
      year: 2016,
      location: 'Uttarakhand',
      cost: 450000000,
      area: 9500,
      casualties: 7,
      description: 'Massive forest fires affecting multiple districts in the Himalayan state',
      forestType: 'Himalayan Mixed Forest',
      severity: 'Extreme',
      minTemp: 38,
      minWindSpeed: 25,
      minRainfall: 45,
      minHumidity: 18
    },
    {
      id: 2,
      name: 'Simlipal Forest Fire',
      year: 2021,
      location: 'Odisha',
      cost: 280000000,
      area: 1250,
      casualties: 0,
      description: 'Major fire in Simlipal National Park, one of India\'s biodiversity hotspots',
      forestType: 'Tropical Deciduous',
      severity: 'High',
      minTemp: 42,
      minWindSpeed: 18,
      minRainfall: 60,
      minHumidity: 15
    },
    {
      id: 3,
      name: 'Bandipur Forest Fire',
      year: 2019,
      location: 'Karnataka',
      cost: 320000000,
      area: 3200,
      casualties: 2,
      description: 'Severe fire in Bandipur Tiger Reserve affecting wildlife habitat',
      forestType: 'Dry Deciduous',
      severity: 'High',
      minTemp: 40,
      minWindSpeed: 22,
      minRainfall: 55,
      minHumidity: 20
    },
    {
      id: 4,
      name: 'Himachal Pradesh Fires',
      year: 2023,
      location: 'Himachal Pradesh',
      cost: 180000000,
      area: 1850,
      casualties: 3,
      description: 'Multiple forest fires across the hill state during summer',
      forestType: 'Coniferous Forest',
      severity: 'Moderate',
      minTemp: 35,
      minWindSpeed: 20,
      minRainfall: 40,
      minHumidity: 22
    },
    {
      id: 5,
      name: 'Madhya Pradesh Forest Fires',
      year: 2022,
      location: 'Madhya Pradesh',
      cost: 210000000,
      area: 2400,
      casualties: 1,
      description: 'Widespread fires in central Indian forests',
      forestType: 'Tropical Dry Forest',
      severity: 'High',
      minTemp: 44,
      minWindSpeed: 16,
      minRainfall: 70,
      minHumidity: 12
    }
  ],
  'USA': [
    {
      id: 6,
      name: 'Camp Fire',
      year: 2018,
      location: 'Paradise, California',
      cost: 16500000000,
      area: 153336,
      casualties: 85,
      description: 'Deadliest and most destructive wildfire in California history, destroying the town of Paradise',
      forestType: 'Mixed Forest',
      severity: 'Extreme',
      minTemp: 24,
      minWindSpeed: 35,
      minRainfall: 120,
      minHumidity: 8
    },
    {
      id: 7,
      name: 'Woolsey Fire',
      year: 2018,
      location: 'Los Angeles & Ventura Counties, California',
      cost: 6000000000,
      area: 96949,
      casualties: 3,
      description: 'Destroyed over 1,600 structures in Southern California',
      forestType: 'Shrubland',
      severity: 'High',
      minTemp: 28,
      minWindSpeed: 40,
      minRainfall: 90,
      minHumidity: 10
    },
    {
      id: 8,
      name: 'Thomas Fire',
      year: 2017,
      location: 'Ventura & Santa Barbara Counties, California',
      cost: 2200000000,
      area: 281893,
      casualties: 2,
      description: 'Largest wildfire in California modern history at the time',
      forestType: 'Chaparral',
      severity: 'Extreme',
      minTemp: 26,
      minWindSpeed: 38,
      minRainfall: 100,
      minHumidity: 9
    },
    {
      id: 9,
      name: 'Tubbs Fire',
      year: 2017,
      location: 'Napa & Sonoma Counties, California',
      cost: 1300000000,
      area: 36807,
      casualties: 22,
      description: 'Most destructive wildfire in California history until the Camp Fire',
      forestType: 'Mixed Forest',
      severity: 'High',
      minTemp: 30,
      minWindSpeed: 32,
      minRainfall: 85,
      minHumidity: 12
    },
    {
      id: 10,
      name: 'Dixie Fire',
      year: 2021,
      location: 'Northern California',
      cost: 1150000000,
      area: 963309,
      casualties: 1,
      description: 'Second-largest wildfire in California history',
      forestType: 'Coniferous',
      severity: 'Extreme',
      minTemp: 32,
      minWindSpeed: 28,
      minRainfall: 110,
      minHumidity: 11
    }
  ],
  'Australia': [
    {
      id: 11,
      name: 'Black Summer Bushfires',
      year: '2019-2020',
      location: 'New South Wales, Victoria',
      cost: 103000000000,
      area: 46000000,
      casualties: 34,
      description: 'Catastrophic bushfire season affecting multiple states, killed over 1 billion animals',
      forestType: 'Eucalyptus Forest',
      severity: 'Extreme',
      minTemp: 40,
      minWindSpeed: 45,
      minRainfall: 150,
      minHumidity: 6
    },
    {
      id: 12,
      name: 'Black Saturday Bushfires',
      year: 2009,
      location: 'Victoria',
      cost: 4400000000,
      area: 1100000,
      casualties: 173,
      description: 'Deadliest bushfire event in Australian history',
      forestType: 'Eucalyptus Forest',
      severity: 'Extreme',
      minTemp: 46,
      minWindSpeed: 50,
      minRainfall: 180,
      minHumidity: 5
    },
    {
      id: 13,
      name: 'Ash Wednesday Fires',
      year: 1983,
      location: 'South Australia, Victoria',
      cost: 1100000000,
      area: 520000,
      casualties: 75,
      description: 'Series of bushfires in southeastern Australia',
      forestType: 'Mixed Forest',
      severity: 'High',
      minTemp: 43,
      minWindSpeed: 48,
      minRainfall: 140,
      minHumidity: 7
    }
  ],
  'Canada': [
    {
      id: 14,
      name: 'Fort McMurray Fire',
      year: 2016,
      location: 'Alberta',
      cost: 9900000000,
      area: 1500000,
      casualties: 2,
      description: 'Costliest disaster in Canadian history, forced evacuation of 88,000 people',
      forestType: 'Boreal Forest',
      severity: 'Extreme',
      minTemp: 32,
      minWindSpeed: 30,
      minRainfall: 95,
      minHumidity: 13
    },
    {
      id: 15,
      name: 'British Columbia Wildfires',
      year: 2017,
      location: 'British Columbia',
      cost: 610000000,
      area: 3000000,
      casualties: 0,
      description: 'Worst wildfire season in British Columbia history',
      forestType: 'Coniferous',
      severity: 'High',
      minTemp: 35,
      minWindSpeed: 26,
      minRainfall: 75,
      minHumidity: 15
    },
    {
      id: 16,
      name: 'Quebec Wildfires',
      year: 2023,
      location: 'Quebec',
      cost: 450000000,
      area: 11000000,
      casualties: 0,
      description: 'Massive wildfires causing air quality issues across North America',
      forestType: 'Boreal Forest',
      severity: 'High',
      minTemp: 28,
      minWindSpeed: 24,
      minRainfall: 80,
      minHumidity: 18
    }
  ],
  'Greece': [
    {
      id: 17,
      name: 'Attica Wildfires',
      year: 2018,
      location: 'Attica',
      cost: 3000000000,
      area: 25000,
      casualties: 102,
      description: 'Deadliest wildfire in Greece in over a century',
      forestType: 'Mediterranean Shrubland',
      severity: 'Extreme',
      minTemp: 39,
      minWindSpeed: 42,
      minRainfall: 120,
      minHumidity: 10
    },
    {
      id: 18,
      name: 'Evia Island Fire',
      year: 2021,
      location: 'Evia Island',
      cost: 1200000000,
      area: 125000,
      casualties: 3,
      description: 'Massive wildfire destroying ancient forests',
      forestType: 'Pine Forest',
      severity: 'High',
      minTemp: 42,
      minWindSpeed: 35,
      minRainfall: 100,
      minHumidity: 12
    }
  ],
  'Portugal': [
    {
      id: 19,
      name: 'Pedrógão Grande Fire',
      year: 2017,
      location: 'Central Portugal',
      cost: 500000000,
      area: 120000,
      casualties: 66,
      description: 'Deadliest fire in Portuguese history',
      forestType: 'Eucalyptus & Pine',
      severity: 'Extreme',
      minTemp: 40,
      minWindSpeed: 38,
      minRainfall: 110,
      minHumidity: 11
    },
    {
      id: 20,
      name: 'Portugal Wildfires',
      year: 2017,
      location: 'Multiple regions',
      cost: 1800000000,
      area: 540000,
      casualties: 112,
      description: 'Series of devastating wildfires across Portugal',
      forestType: 'Mixed Forest',
      severity: 'Extreme',
      minTemp: 38,
      minWindSpeed: 36,
      minRainfall: 105,
      minHumidity: 13
    }
  ],
  'Brazil': [
    {
      id: 21,
      name: 'Amazon Rainforest Fires',
      year: 2019,
      location: 'Amazon Basin',
      cost: 3500000000,
      area: 2200000,
      casualties: 0,
      description: 'Massive deforestation fires with global environmental impact',
      forestType: 'Tropical Rainforest',
      severity: 'High',
      minTemp: 35,
      minWindSpeed: 20,
      minRainfall: 30,
      minHumidity: 25
    },
    {
      id: 22,
      name: 'Pantanal Fires',
      year: 2020,
      location: 'Pantanal Wetlands',
      cost: 2100000000,
      area: 7400000,
      casualties: 0,
      description: 'Worst fires in Pantanal wetlands history, destroying 30% of the biome',
      forestType: 'Wetland/Savanna',
      severity: 'Extreme',
      minTemp: 38,
      minWindSpeed: 22,
      minRainfall: 90,
      minHumidity: 18
    }
  ],
  'Indonesia': [
    {
      id: 23,
      name: 'Indonesian Forest Fires',
      year: 2015,
      location: 'Sumatra & Kalimantan',
      cost: 16100000000,
      area: 6400000,
      casualties: 19,
      description: 'Severe haze crisis affecting Southeast Asia',
      forestType: 'Tropical Rainforest',
      severity: 'Extreme',
      minTemp: 34,
      minWindSpeed: 18,
      minRainfall: 60,
      minHumidity: 28
    },
    {
      id: 24,
      name: 'Indonesian Fires',
      year: 2019,
      location: 'Multiple islands',
      cost: 5200000000,
      area: 3280000,
      casualties: 10,
      description: 'Widespread fires causing regional air pollution',
      forestType: 'Peatland Forest',
      severity: 'High',
      minTemp: 33,
      minWindSpeed: 16,
      minRainfall: 50,
      minHumidity: 30
    }
  ],
  'Russia': [
    {
      id: 25,
      name: 'Siberian Wildfires',
      year: 2021,
      location: 'Sakha Republic, Siberia',
      cost: 2800000000,
      area: 42000000,
      casualties: 0,
      description: 'Largest fires in Russian history, visible from space',
      forestType: 'Boreal Forest',
      severity: 'Extreme',
      minTemp: 30,
      minWindSpeed: 25,
      minRainfall: 100,
      minHumidity: 20
    },
    {
      id: 26,
      name: 'Russian Wildfires',
      year: 2010,
      location: 'Western Russia',
      cost: 15000000000,
      area: 3200000,
      casualties: 62,
      description: 'Heat wave and drought caused massive fires near Moscow',
      forestType: 'Mixed Forest',
      severity: 'Extreme',
      minTemp: 38,
      minWindSpeed: 28,
      minRainfall: 120,
      minHumidity: 14
    }
  ],
  'Spain': [
    {
      id: 27,
      name: 'Galicia Wildfires',
      year: 2017,
      location: 'Galicia',
      cost: 800000000,
      area: 120000,
      casualties: 4,
      description: 'Series of fires in northwestern Spain',
      forestType: 'Eucalyptus Forest',
      severity: 'High',
      minTemp: 36,
      minWindSpeed: 30,
      minRainfall: 95,
      minHumidity: 16
    },
    {
      id: 28,
      name: 'Catalonia Wildfires',
      year: 2019,
      location: 'Catalonia',
      cost: 420000000,
      area: 16000,
      casualties: 0,
      description: 'Major fires in northeastern Spain',
      forestType: 'Mediterranean Forest',
      severity: 'High',
      minTemp: 38,
      minWindSpeed: 32,
      minRainfall: 85,
      minHumidity: 14
    }
  ],
  'Chile': [
    {
      id: 29,
      name: 'Chilean Wildfires',
      year: 2017,
      location: 'Central Chile',
      cost: 900000000,
      area: 1400000,
      casualties: 11,
      description: 'Worst wildfires in Chilean modern history',
      forestType: 'Mediterranean Forest',
      severity: 'Extreme',
      minTemp: 35,
      minWindSpeed: 34,
      minRainfall: 110,
      minHumidity: 15
    },
    {
      id: 30,
      name: 'Valparaíso Fire',
      year: 2023,
      location: 'Valparaíso Region',
      cost: 650000000,
      area: 75000,
      casualties: 26,
      description: 'Devastating fires in coastal region',
      forestType: 'Shrubland',
      severity: 'High',
      minTemp: 32,
      minWindSpeed: 28,
      minRainfall: 90,
      minHumidity: 18
    }
  ],
  'Turkey': [
    {
      id: 31,
      name: 'Turkish Wildfires',
      year: 2021,
      location: 'Southern Turkey',
      cost: 1800000000,
      area: 340000,
      casualties: 9,
      description: 'Massive fires across Mediterranean coast during extreme heat wave',
      forestType: 'Mediterranean Forest',
      severity: 'Extreme',
      minTemp: 45,
      minWindSpeed: 35,
      minRainfall: 130,
      minHumidity: 8
    },
    {
      id: 32,
      name: 'Manavgat Fire',
      year: 2021,
      location: 'Antalya Province',
      cost: 950000000,
      area: 130000,
      casualties: 8,
      description: 'Severe fire in tourist region',
      forestType: 'Pine Forest',
      severity: 'High',
      minTemp: 43,
      minWindSpeed: 32,
      minRainfall: 115,
      minHumidity: 10
    }
  ],
  'Italy': [
    {
      id: 33,
      name: 'Sicily Wildfires',
      year: 2021,
      location: 'Sicily',
      cost: 780000000,
      area: 50000,
      casualties: 3,
      description: 'Record-breaking temperatures fueled massive fires',
      forestType: 'Mediterranean Shrubland',
      severity: 'High',
      minTemp: 48,
      minWindSpeed: 30,
      minRainfall: 100,
      minHumidity: 12
    },
    {
      id: 34,
      name: 'Sardinia Fires',
      year: 2021,
      location: 'Sardinia',
      cost: 520000000,
      area: 40000,
      casualties: 0,
      description: 'Widespread fires across the island',
      forestType: 'Mediterranean Forest',
      severity: 'High',
      minTemp: 42,
      minWindSpeed: 28,
      minRainfall: 95,
      minHumidity: 15
    }
  ],
  'Argentina': [
    {
      id: 35,
      name: 'Patagonia Wildfires',
      year: 2021,
      location: 'Patagonia',
      cost: 680000000,
      area: 200000,
      casualties: 2,
      description: 'Fires in southern forests and grasslands',
      forestType: 'Temperate Forest',
      severity: 'High',
      minTemp: 28,
      minWindSpeed: 40,
      minRainfall: 80,
      minHumidity: 20
    },
    {
      id: 36,
      name: 'Corrientes Fires',
      year: 2022,
      location: 'Corrientes Province',
      cost: 890000000,
      area: 2470000,
      casualties: 0,
      description: 'Massive fires destroying wetlands and forests',
      forestType: 'Wetland/Grassland',
      severity: 'Extreme',
      minTemp: 38,
      minWindSpeed: 35,
      minRainfall: 120,
      minHumidity: 16
    }
  ],
  'South Africa': [
    {
      id: 37,
      name: 'Knysna Fires',
      year: 2017,
      location: 'Western Cape',
      cost: 720000000,
      area: 35000,
      casualties: 7,
      description: 'Devastating fires in coastal town',
      forestType: 'Fynbos Shrubland',
      severity: 'Extreme',
      minTemp: 36,
      minWindSpeed: 45,
      minRainfall: 90,
      minHumidity: 14
    },
    {
      id: 38,
      name: 'Cape Town Fires',
      year: 2021,
      location: 'Cape Town',
      cost: 380000000,
      area: 15000,
      casualties: 1,
      description: 'Fire on Table Mountain threatening university',
      forestType: 'Fynbos',
      severity: 'High',
      minTemp: 32,
      minWindSpeed: 38,
      minRainfall: 75,
      minHumidity: 18
    }
  ],
  'Algeria': [
    {
      id: 39,
      name: 'Algerian Wildfires',
      year: 2021,
      location: 'Kabylie Region',
      cost: 650000000,
      area: 220000,
      casualties: 90,
      description: 'Deadliest fires in Algerian history',
      forestType: 'Mediterranean Forest',
      severity: 'Extreme',
      minTemp: 46,
      minWindSpeed: 35,
      minRainfall: 140,
      minHumidity: 9
    }
  ],
  'Morocco': [
    {
      id: 40,
      name: 'Larache Forest Fire',
      year: 2021,
      location: 'Northern Morocco',
      cost: 280000000,
      area: 6800,
      casualties: 1,
      description: 'Major fire in forested region',
      forestType: 'Cork Oak Forest',
      severity: 'High',
      minTemp: 40,
      minWindSpeed: 30,
      minRainfall: 100,
      minHumidity: 16
    }
  ]
};

export default function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { country } = req.query;

  if (country) {
    // Search for specific country
    const countryData = criticalZonesData[country];
    
    if (!countryData) {
      return res.status(404).json({ 
        error: 'Country not found',
        availableCountries: Object.keys(criticalZonesData)
      });
    }

    // Sort by cost (highest first)
    const sortedData = [...countryData].sort((a, b) => b.cost - a.cost);

    return res.status(200).json({
      country,
      totalCases: sortedData.length,
      totalCost: sortedData.reduce((sum, fire) => sum + fire.cost, 0),
      totalArea: sortedData.reduce((sum, fire) => sum + fire.area, 0),
      totalCasualties: sortedData.reduce((sum, fire) => sum + fire.casualties, 0),
      cases: sortedData
    });
  }

  // Return all countries with summary statistics
  const summary = Object.keys(criticalZonesData).map(country => {
    const cases = criticalZonesData[country];
    return {
      country,
      totalCases: cases.length,
      totalCost: cases.reduce((sum, fire) => sum + fire.cost, 0),
      totalArea: cases.reduce((sum, fire) => sum + fire.area, 0),
      totalCasualties: cases.reduce((sum, fire) => sum + fire.casualties, 0),
      mostExpensiveFire: cases.reduce((max, fire) => fire.cost > max.cost ? fire : max, cases[0])
    };
  }).sort((a, b) => b.totalCost - a.totalCost);

  res.status(200).json({
    availableCountries: Object.keys(criticalZonesData),
    summary
  });
}
