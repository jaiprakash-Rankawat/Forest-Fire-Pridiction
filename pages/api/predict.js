export default function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { temperature, humidity, windSpeed, vegetation, rainfall, forestType } = req.body;

  const temp = parseFloat(temperature);
  const hum = parseFloat(humidity);
  const wind = parseFloat(windSpeed);
  const days = parseInt(rainfall);

  let riskScore = 0;
  let factors = [];

  // Forest type characteristics and risk modifiers
  const forestTypeData = {
    'coniferous': {
      name: 'Coniferous Forest',
      baseRisk: 15,
      description: 'High resin content and needle litter create highly flammable conditions',
      windMultiplier: 1.3,
      tempThreshold: 20,
      humidityThreshold: 35
    },
    'deciduous': {
      name: 'Deciduous Forest',
      baseRisk: 8,
      description: 'Broadleaf trees with higher moisture content, lower fire intensity',
      windMultiplier: 1.0,
      tempThreshold: 28,
      humidityThreshold: 25
    },
    'mixed': {
      name: 'Mixed Forest',
      baseRisk: 12,
      description: 'Combination of coniferous and deciduous species with moderate fire behavior',
      windMultiplier: 1.15,
      tempThreshold: 24,
      humidityThreshold: 30
    },
    'tropical': {
      name: 'Tropical Rainforest',
      baseRisk: 5,
      description: 'High moisture content typically resists fire, but can burn intensely when dry',
      windMultiplier: 0.8,
      tempThreshold: 32,
      humidityThreshold: 20
    },
    'grassland': {
      name: 'Grassland/Savanna',
      baseRisk: 18,
      description: 'Fine, fast-drying fuels allow rapid fire spread with minimal moisture',
      windMultiplier: 1.5,
      tempThreshold: 22,
      humidityThreshold: 40
    },
    'shrubland': {
      name: 'Shrubland/Chaparral',
      baseRisk: 20,
      description: 'Dense, resinous vegetation creates extreme fire intensity and ember production',
      windMultiplier: 1.4,
      tempThreshold: 21,
      humidityThreshold: 35
    }
  };

  const currentForest = forestTypeData[forestType] || forestTypeData['mixed'];
  
  // Add base risk for forest type
  riskScore += currentForest.baseRisk;
  factors.push(`${currentForest.name}: ${currentForest.description}`);

  // Temperature assessment (adjusted by forest type)
  if (temp > 32) {
    riskScore += 30;
    factors.push(`High temperature (${temp}°C) significantly increases fire risk through rapid vegetation drying`);
  } else if (temp > currentForest.tempThreshold) {
    riskScore += 20;
    factors.push(`Elevated temperature (${temp}°C) contributes to fuel drying in ${currentForest.name.toLowerCase()}`);
  } else if (temp > 15) {
    riskScore += 10;
  }

  // Humidity assessment (adjusted by forest type)
  if (hum < 15) {
    riskScore += 30;
    factors.push(`Critically low humidity (${hum}%) causes rapid fuel moisture loss and extreme fire behavior`);
  } else if (hum < 25) {
    riskScore += 20;
    factors.push(`Low humidity (${hum}%) accelerates vegetation drying and fire spread`);
  } else if (hum < currentForest.humidityThreshold) {
    riskScore += 10;
    factors.push(`Moderate humidity (${hum}%) allows for fire activity in ${currentForest.name.toLowerCase()}`);
  }

  // Wind assessment (with forest-specific multiplier)
  let windRisk = 0;
  if (wind > 25) {
    windRisk = 30;
    factors.push(`High wind speed (${wind} mph) can create erratic fire behavior and carry embers over 1 mile`);
  } else if (wind > 15) {
    windRisk = 20;
    factors.push(`Moderate winds (${wind} mph) will accelerate fire spread and make containment difficult`);
  } else if (wind > 8) {
    windRisk = 10;
  }
  riskScore += Math.round(windRisk * currentForest.windMultiplier);

  // Vegetation dryness
  const vegScores = {
    'extreme': 30,
    'high': 20,
    'moderate': 10,
    'low': 5
  };
  riskScore += vegScores[vegetation] || 10;

  if (vegetation === 'extreme') {
    factors.push('Critically dry vegetation creates explosive fuel conditions');
  } else if (vegetation === 'high') {
    factors.push('Very dry vegetation significantly increases fire intensity and spread rate');
  } else if (vegetation === 'moderate') {
    factors.push('Moderately dry vegetation can support active fire spread');
  }

  // Rainfall assessment
  if (days > 30) {
    riskScore += 15;
    factors.push(`Extended drought period (${days} days without rain) has severely dried fuels`);
  } else if (days > 14) {
    riskScore += 10;
    factors.push(`${days} days without rainfall has reduced fuel moisture content`);
  } else if (days > 7) {
    riskScore += 5;
  }

  let riskLevel, riskDescription, recommendations;

  if (riskScore >= 80) {
    riskLevel = 'Extreme';
    riskDescription = 'Critical fire danger - any ignition could result in rapid, catastrophic fire spread';
    recommendations = [
      'Red Flag Warning conditions - avoid ALL outdoor activities that could spark fires',
      'Power companies may implement Public Safety Power Shutoffs',
      'Prepare for possible evacuation - have Go Bag ready and vehicle fueled',
      'Monitor local fire authority updates continuously',
      'No outdoor burning, equipment use, or recreational activities in wildland areas',
      'Stay indoors if possible and close all windows to prevent ember entry'
    ];
    
    // Add forest-specific recommendations
    if (forestType === 'coniferous' || forestType === 'shrubland') {
      recommendations.push('EXTREME CAUTION: This forest type produces intense crown fires and long-range ember spotting');
    } else if (forestType === 'grassland') {
      recommendations.push('WARNING: Grassland fires can spread at speeds exceeding 10 mph - evacuate immediately if fire is reported nearby');
    }
  } else if (riskScore >= 60) {
    riskLevel = 'High';
    riskDescription = 'Dangerous fire conditions - fires can start easily and spread quickly';
    recommendations = [
      'Postpone any activities involving fire or sparks',
      'Avoid using power equipment, especially during hottest parts of day',
      'Do not burn yard waste or debris',
      'Be prepared to evacuate if fires start in your area',
      'Check defensible space and clear any new debris',
      'Monitor weather and fire reports closely'
    ];
    
    if (forestType === 'shrubland') {
      recommendations.push('Chaparral fires can be extremely intense - ensure multiple evacuation routes are clear');
    } else if (forestType === 'coniferous') {
      recommendations.push('Coniferous forests can experience rapid crown fire spread - stay alert to changing conditions');
    }
  } else if (riskScore >= 40) {
    riskLevel = 'Moderate';
    riskDescription = 'Elevated fire risk - conditions support fire activity if ignited';
    recommendations = [
      'Use extreme caution with any potential ignition sources',
      'Follow all local fire restrictions and burn bans',
      'Never leave campfires unattended - drown completely before leaving',
      'Avoid parking vehicles on dry grass',
      'Have emergency plans and supplies ready',
      'Report any smoke or fire immediately to 911'
    ];
    
    if (forestType === 'grassland') {
      recommendations.push('Even at moderate risk, grassland fires can spread rapidly - maintain high vigilance');
    }
  } else {
    riskLevel = 'Low';
    riskDescription = 'Lower fire risk, but vigilance still required';
    recommendations = [
      'Continue following fire safety practices',
      'Maintain defensible space around structures',
      'Properly extinguish all campfires and recreational fires',
      'Keep emergency supplies and plans updated',
      'Report any suspicious smoke to authorities',
      'Take advantage of lower risk periods to clear vegetation and reduce fuels'
    ];
    
    if (forestType === 'tropical') {
      recommendations.push('While tropical forests are typically fire-resistant, prolonged drought can create severe fire conditions');
    }
  }

  let analysis = `Based on the provided conditions in a ${currentForest.name.toLowerCase()}, the fire risk assessment is ${riskLevel}. `;

  if (riskLevel === 'Extreme' || riskLevel === 'High') {
    analysis += `The combination of `;
    const conditions = [];
    if (temp > currentForest.tempThreshold) conditions.push(`high temperature (${temp}°C)`);
    if (hum < currentForest.humidityThreshold) conditions.push(`low humidity (${hum}%)`);
    if (wind > 10) conditions.push(`${wind > 25 ? 'strong' : 'moderate'} winds (${wind} mph)`);
    if (vegetation === 'extreme' || vegetation === 'high') conditions.push('critically dry vegetation');
    if (days > 7) conditions.push(`${days} days without rain`);
    
    analysis += conditions.join(', ') + ` creates a dangerous environment in ${currentForest.name.toLowerCase()} where any spark could ignite a rapidly spreading fire. `;
    
    // Add forest-specific analysis
    if (forestType === 'coniferous') {
      analysis += 'Coniferous forests are particularly dangerous due to high resin content and the potential for crown fires that can spread faster than people can run. ';
    } else if (forestType === 'shrubland') {
      analysis += 'Shrubland/chaparral vegetation is among the most fire-prone ecosystems, capable of producing extreme fire behavior and massive ember showers. ';
    } else if (forestType === 'grassland') {
      analysis += 'Grassland fires can spread at extraordinary speeds with minimal warning, making rapid evacuation critical. ';
    } else if (forestType === 'deciduous') {
      analysis += 'While deciduous forests typically burn less intensely, current conditions override this natural resistance. ';
    } else if (forestType === 'tropical') {
      analysis += 'These extreme conditions in a tropical forest indicate severe drought - fires here can be catastrophic due to high fuel loads. ';
    }
    
    analysis += 'These are the same conditions that contributed to major fire disasters documented in our case studies. ';
  } else if (riskLevel === 'Moderate') {
    analysis += `While not at critical levels, these conditions can support fire activity in ${currentForest.name.toLowerCase()} if an ignition occurs. `;
    analysis += 'The majority of human-caused fires start during moderate conditions and escalate when ignored. ';
  } else {
    analysis += 'Current conditions present lower fire danger, but fire safety practices should always be followed. ';
    analysis += 'Remember that 84-90% of wildfires are human-caused and preventable. ';
  }

  res.status(200).json({
    riskLevel,
    riskDescription,
    riskScore,
    analysis,
    factors,
    recommendations,
    forestType: currentForest.name
  });
}
