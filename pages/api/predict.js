export default function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { temperature, humidity, windSpeed, vegetation, rainfall } = req.body;

  const temp = parseFloat(temperature);
  const hum = parseFloat(humidity);
  const wind = parseFloat(windSpeed);
  const days = parseInt(rainfall);

  let riskScore = 0;
  let factors = [];

  if (temp > 90) {
    riskScore += 30;
    factors.push(`High temperature (${temp}°F) significantly increases fire risk through rapid vegetation drying`);
  } else if (temp > 75) {
    riskScore += 20;
    factors.push(`Elevated temperature (${temp}°F) contributes to fuel drying`);
  } else if (temp > 60) {
    riskScore += 10;
  }

  if (hum < 15) {
    riskScore += 30;
    factors.push(`Critically low humidity (${hum}%) causes rapid fuel moisture loss and extreme fire behavior`);
  } else if (hum < 25) {
    riskScore += 20;
    factors.push(`Low humidity (${hum}%) accelerates vegetation drying and fire spread`);
  } else if (hum < 40) {
    riskScore += 10;
    factors.push(`Moderate humidity (${hum}%) allows for fire activity`);
  }

  if (wind > 25) {
    riskScore += 30;
    factors.push(`High wind speed (${wind} mph) can create erratic fire behavior and carry embers over 1 mile`);
  } else if (wind > 15) {
    riskScore += 20;
    factors.push(`Moderate winds (${wind} mph) will accelerate fire spread and make containment difficult`);
  } else if (wind > 8) {
    riskScore += 10;
  }

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
  }

  let analysis = `Based on the provided conditions, the fire risk assessment is ${riskLevel}. `;

  if (riskLevel === 'Extreme' || riskLevel === 'High') {
    analysis += `The combination of `;
    const conditions = [];
    if (temp > 75) conditions.push(`high temperature (${temp}°F)`);
    if (hum < 30) conditions.push(`low humidity (${hum}%)`);
    if (wind > 10) conditions.push(`${wind > 25 ? 'strong' : 'moderate'} winds (${wind} mph)`);
    if (vegetation === 'extreme' || vegetation === 'high') conditions.push('critically dry vegetation');
    if (days > 7) conditions.push(`${days} days without rain`);
    
    analysis += conditions.join(', ') + ' creates a dangerous environment where any spark could ignite a rapidly spreading fire. ';
    analysis += 'These are the same conditions that contributed to major fire disasters documented in our case studies. ';
  } else if (riskLevel === 'Moderate') {
    analysis += 'While not at critical levels, these conditions can support fire activity if an ignition occurs. ';
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
    recommendations
  });
}
