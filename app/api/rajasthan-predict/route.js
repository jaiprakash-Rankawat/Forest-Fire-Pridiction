import { NextResponse } from 'next/server';
import { rajasthanForests } from '../../data/rajasthan-forests';

export async function POST(request) {
  try {
    const body = await request.json();
    const { forestId, temperature, humidity, windSpeed, rainfall, daysSinceRain, vegetation } = body;

    // specific validation
    if (!forestId) {
      return NextResponse.json(
        { error: 'Forest ID is required' },
        { status: 400 }
      );
    }

    const forest = rajasthanForests.find(f => f.id === forestId);
    if (!forest) {
      return NextResponse.json(
        { error: 'Forest not found' },
        { status: 404 }
      );
    }

    // --- Risk Calculation Logic ---
    
    // Base Risk Score (0-100)
    let baseScore = 0;

    // 1. Temperature Impact (Max 30 pts)
    const temp = parseFloat(temperature);
    if (temp > 45) baseScore += 30;
    else if (temp > 40) baseScore += 25;
    else if (temp > 35) baseScore += 15;
    else if (temp > 30) baseScore += 10;
    else baseScore += 5;

    // 2. Humidity Impact (Max 25 pts)
    const hum = parseFloat(humidity);
    if (hum < 15) baseScore += 25;
    else if (hum < 25) baseScore += 20;
    else if (hum < 40) baseScore += 15;
    else if (hum < 60) baseScore += 5;

    // 3. Wind Speed Impact (Max 20 pts)
    const wind = parseFloat(windSpeed);
    if (wind > 30) baseScore += 20;
    else if (wind > 20) baseScore += 15;
    else if (wind > 10) baseScore += 10;
    else baseScore += 5;

    // 4. Rainfall / Dryness Impact (Max 25 pts)
    const rain = parseFloat(rainfall);
    const dryDays = parseFloat(daysSinceRain);
    
    if (dryDays > 15) baseScore += 25;
    else if (dryDays > 7) baseScore += 15;
    else if (dryDays > 3) baseScore += 5;

    if (rain > 5) baseScore -= 20; // Recent rain reduces risk significantly

    // Apply limits
    baseScore = Math.max(0, Math.min(100, baseScore));

    // --- Zone-Specific Calculations ---
    const zoneRisks = forest.zones.map(zone => {
      // Apply zone multiplier
      let zoneScore = baseScore * zone.riskMultiplier;
      
      // Vegetation adjustment
      if (vegetation === 'extreme') zoneScore *= 1.2;
      else if (vegetation === 'high') zoneScore *= 1.1;
      else if (vegetation === 'low') zoneScore *= 0.8;

      zoneScore = Math.max(0, Math.min(100, zoneScore));

      let riskLevel = "Low";
      if (zoneScore >= 75) riskLevel = "Extreme";
      else if (zoneScore >= 50) riskLevel = "High";
      else if (zoneScore >= 25) riskLevel = "Moderate";

      return {
        zoneId: zone.id,
        zoneName: zone.name,
        probability: Math.round(zoneScore),
        riskLevel
      };
    });

    // Find highest risk
    const maxRiskZone = zoneRisks.reduce((prev, current) => (prev.probability > current.probability) ? prev : current);

    // --- Generate Analysis & Recommendations ---
    const analysis = `Current conditions in ${forest.name} indicate a ${maxRiskZone.riskLevel.toLowerCase()} fire risk, particularly in the ${maxRiskZone.zoneName}. The combination of ${temp}°C temperatures and ${hum}% humidity creates ${baseScore > 50 ? 'favorable' : 'unfavorable'} conditions for fire spread.`;

    const recommendations = [];
    if (maxRiskZone.riskLevel === "Extreme" || maxRiskZone.riskLevel === "High") {
      recommendations.push(`Immediate alert recommended for ${maxRiskZone.zoneName}.`);
      recommendations.push("Deploy fire watch teams to high-risk zones.");
      recommendations.push("Restrict tourist access to core areas.");
    } else if (maxRiskZone.riskLevel === "Moderate") {
      recommendations.push("Increase monitoring frequency.");
      recommendations.push("Ensure water sources in buffer zones are accessible.");
    } else {
      recommendations.push("Routine monitoring sufficient.");
      recommendations.push("Maintain fire lines.");
    }

    return NextResponse.json({
      forestName: forest.name,
      overallRisk: maxRiskZone.riskLevel,
      zoneRisks,
      analysis,
      recommendations,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Prediction error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
