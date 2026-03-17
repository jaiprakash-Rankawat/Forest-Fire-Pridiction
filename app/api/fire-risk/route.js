import { NextResponse } from 'next/server';

function calculateFireRisk({ temperature, humidity, windSpeed, vegetationDrynessIndex, daysSinceRain, recentRainfall }) {
  // Weighted fire risk score (0-100)
  let score = 0;

  // Temperature contribution (0–30 pts)
  if (temperature >= 45) score += 30;
  else if (temperature >= 40) score += 25;
  else if (temperature >= 35) score += 18;
  else if (temperature >= 30) score += 12;
  else if (temperature >= 25) score += 6;
  else score += 2;

  // Humidity contribution (lower = more risk) (0–25 pts)
  if (humidity <= 20) score += 25;
  else if (humidity <= 30) score += 20;
  else if (humidity <= 40) score += 15;
  else if (humidity <= 55) score += 8;
  else if (humidity <= 70) score += 3;

  // Wind speed contribution (0–15 pts)
  if (windSpeed >= 50) score += 15;
  else if (windSpeed >= 35) score += 12;
  else if (windSpeed >= 25) score += 8;
  else if (windSpeed >= 15) score += 5;
  else score += 2;

  // Vegetation dryness (0–20 pts)
  score += Math.round(vegetationDrynessIndex * 0.2);

  // Days since rain (0–10 pts)
  if (daysSinceRain >= 30) score += 10;
  else if (daysSinceRain >= 20) score += 8;
  else if (daysSinceRain >= 14) score += 6;
  else if (daysSinceRain >= 7) score += 4;
  else score += 1;

  // Recent rainfall penalty
  if (recentRainfall > 50) score -= 10;
  else if (recentRainfall > 25) score -= 5;
  else if (recentRainfall > 10) score -= 2;

  score = Math.min(100, Math.max(0, score));

  let level, color, description, recommendations;

  if (score >= 80) {
    level = 'Extreme';
    color = '#7c0000';
    description = 'Extreme fire danger. Any ignition source can lead to catastrophic, rapidly spreading wildfire. Immediate preventive action required.';
    recommendations = [
      'Issue immediate fire ban for the entire zone',
      'Deploy fire response teams on standby',
      'Evacuate high-risk communities if fire starts',
      'Satellite monitoring every 30 minutes',
    ];
  } else if (score >= 60) {
    level = 'Very High';
    color = '#c0392b';
    description = 'Very high fire danger. Conditions are highly favorable for fire ignition and rapid spread. Strong winds can make fire control very difficult.';
    recommendations = [
      'Ban all open burning and campfires',
      'Increase patrol frequency in vulnerable areas',
      'Pre-position firefighting equipment',
      'Alert border communities of elevated risk',
    ];
  } else if (score >= 40) {
    level = 'High';
    color = '#e67e22';
    description = 'High fire danger. Dry vegetation and low humidity mean fires can spread quickly. Human activities in forests should be strictly monitored.';
    recommendations = [
      'Restrict forest entry to essential personnel',
      'Ensure firebreaks are cleared and maintained',
      'Increase public awareness campaigns',
      'Coordinate with local authorities for rapid response',
    ];
  } else if (score >= 20) {
    level = 'Moderate';
    color = '#f1c40f';
    description = 'Moderate fire danger. Some vegetation dryness present. Accidental fires are possible but conditions do not strongly favor rapid spread.';
    recommendations = [
      'Maintain standard fire watch protocols',
      'Educate visitors about fire safety rules',
      'Inspect and maintain fire suppression equipment',
    ];
  } else {
    level = 'Low';
    color = '#27ae60';
    description = 'Low fire danger. Moisture levels and weather conditions substantially reduce the risk of fire ignition and spread.';
    recommendations = [
      'Continue routine monitoring',
      'Good time for prescribed burns if needed',
      'Standard fire safety awareness',
    ];
  }

  return { score, level, color, description, recommendations };
}

export async function POST(request) {
  try {
    const body = await request.json();
    const result = calculateFireRisk(body);
    return NextResponse.json(result);
  } catch (err) {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }
}
