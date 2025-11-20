export function calculateFireRisk(conditions) {
  const { temperature, humidity, windSpeed, vegetation, rainfall } = conditions;
  
  let risk = 0;
  
  if (temperature > 85) risk += 25;
  else if (temperature > 70) risk += 15;
  
  if (humidity < 20) risk += 30;
  else if (humidity < 35) risk += 20;
  
  if (windSpeed > 20) risk += 25;
  else if (windSpeed > 10) risk += 15;
  
  const vegScores = { extreme: 30, high: 20, moderate: 10, low: 5 };
  risk += vegScores[vegetation] || 10;
  
  if (rainfall > 21) risk += 15;
  else if (rainfall > 10) risk += 10;
  
  if (risk > 80) return 'Extreme';
  if (risk > 60) return 'High';
  if (risk > 40) return 'Moderate';
  return 'Low';
}
