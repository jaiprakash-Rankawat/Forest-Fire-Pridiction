import { NextResponse } from 'next/server';
import { rajasthanForests } from '../../data/rajasthan-forests';

export async function POST(request) {
  try {
    const body = await request.json();
    const { forestId, temperature, humidity, windSpeed, rainfall, daysSinceRain, vegetation } = body;

    if (!forestId) {
      return NextResponse.json({ error: 'Forest ID is required' }, { status: 400 });
    }

    const forest = rajasthanForests.find(f => f.id === forestId);
    if (!forest) {
      return NextResponse.json({ error: 'Forest not found' }, { status: 404 });
    }

    // --- Advanced Risk Calculation ---
    let totalScore = 0;
    const contributingFactors = [];

    const temp = parseFloat(temperature);
    const hum = parseFloat(humidity);
    const wind = parseFloat(windSpeed);
    const rain = parseFloat(rainfall);
    const dryDays = parseFloat(daysSinceRain);

    // 1. Temperature Analysis (Base Ref: 45°C+ is extreme in Rajasthan)
    if (temp >= 45) {
        totalScore += 35;
        contributingFactors.push({ factor: "Extreme Heat", impact: "Critical", score: 35, description: "Temperatures above 45°C make vegetation highly flammable." });
    } else if (temp >= 40) {
        totalScore += 25;
        contributingFactors.push({ factor: "High Temperature", impact: "High", score: 25, description: "Heat stress accelerates moisture loss in forests." });
    } else if (temp >= 35) {
        totalScore += 15;
        contributingFactors.push({ factor: "Elevated Temperature", impact: "Moderate", score: 15, description: "Warm conditions increase drying rate of fuels." });
    } else if (temp >= 30) {
        totalScore += 5;
        contributingFactors.push({ factor: "Warm Conditions", impact: "Low", score: 5, description: "Temperatures sufficient for gradual drying." });
    }

    // 2. Humidity Analysis (Critical < 15%)
    if (hum < 15) {
        totalScore += 30;
        contributingFactors.push({ factor: "Arid Air", impact: "Critical", score: 30, description: "Relative humidity below 15% causes rapid drying of fuel." });
    } else if (hum < 25) {
        totalScore += 20;
        contributingFactors.push({ factor: "Low Humidity", impact: "High", score: 20, description: "Dry air significantly increases ignition probability." });
    } else if (hum < 40) {
        totalScore += 10;
        contributingFactors.push({ factor: "Moderate Humidity", impact: "Moderate", score: 10, description: "Air moisture is low enough to allow drying." });
    }

    // 3. Wind Speed (The "Spreader")
    if (wind > 35) {
        totalScore += 25;
        contributingFactors.push({ factor: "High Winds", impact: "High", score: 25, description: "Strong winds (>35km/h) will cause rapid fire spread." });
    } else if (wind > 20) {
        totalScore += 15;
        contributingFactors.push({ factor: "Moderate Winds", impact: "Moderate", score: 15, description: "Winds aid in drying and spreading potential fires." });
    } else if (wind >= 10) {
        contributingFactors.push({ factor: "Light Breeze", impact: "Low", score: 5, description: "Gentle winds provide oxygen to potential fires." });
    }

    // 4. Combined Factor: Heatwave + Wind (The "Firestorm" condition)
    if (temp > 40 && wind > 25) {
        totalScore += 15; // Bonus risk
        contributingFactors.push({ factor: "Heat + Wind Multiplier", impact: "Severe", score: 15, description: "Combination of high heat and wind creates dangerous fire weather." });
    }

    // 5. Drought Factor
    if (dryDays > 21) {
        totalScore += 20;
        contributingFactors.push({ factor: "Prolonged Dry Spell", impact: "High", score: 20, description: "More than 3 weeks without rain." });
    } else if (dryDays > 10) {
        totalScore += 10;
        contributingFactors.push({ factor: "Dry Spell", impact: "Moderate", score: 10, description: "No rain for over 10 days leads to dry surface fuels." });
    }

    // 6. Mitigating Factors
    if (rain > 10 && dryDays < 3) {
        totalScore -= 40;
        contributingFactors.push({ factor: "Recent Rainfall", impact: "Mitigating", score: -40, description: "Significant recent rain reduces immediate risk." });
    }

    // specific vegetation multiplier
    let vegMultiplier = 1.0;
    if (vegetation === 'extreme') {
        totalScore += 10;
        vegMultiplier = 1.2;
        contributingFactors.push({ factor: "Dry Vegetation", impact: "High", score: 10, description: "Vegetation is reported as extremely dry." });
    } else if (vegetation === 'low') {
        totalScore -= 10;
        vegMultiplier = 0.8;
         contributingFactors.push({ factor: "Green Vegetation", impact: "Mitigating", score: -10, description: "High moisture content in vegetation resists ignition." });
    } else {
         contributingFactors.push({ factor: "Standard Fuel Load", impact: "Neutral", score: 0, description: "Vegetation state is normal for the season." });
    }

    // Fallback if still empty (unlikely with above changes, but safe)
    if (contributingFactors.length === 0) {
        contributingFactors.push({ factor: "Stable Conditions", impact: "Neutral", score: 0, description: "Current environmental parameters do not indicate specific fire risks." });
    }

    totalScore = Math.max(0, Math.min(100, totalScore));

    // --- Peak Month Calculation ---
    // Extract the peak month from the fireSeason string (e.g. "March to June" -> "May" or "June")
    // Simple heuristic: The month before the last one is usually the peak (hottest before monsoon)
    let peakRiskMonth = "May"; // Default
    if (forest.climate.fireSeason) {
       const months = forest.climate.fireSeason.split(' to ');
       if (months.length > 1) {
          // If "March to June", peak is likely May (hottest)
          if (months[1].includes("June")) peakRiskMonth = "May (Peak Summer)";
          else if (months[1].includes("May")) peakRiskMonth = "Late April";
          else peakRiskMonth = months[1];
       }
    }

    // --- Enhanced Zone Analysis ---
    const zoneRisks = forest.zones.map(zone => {
      let zoneScore = totalScore * zone.riskMultiplier * vegMultiplier;
      zoneScore = Math.max(0, Math.min(100, zoneScore));

      let riskLevel = "Low";
      if (zoneScore >= 80) riskLevel = "Extreme";
      else if (zoneScore >= 60) riskLevel = "High";
      else if (zoneScore >= 35) riskLevel = "Moderate";

      return {
        zoneId: zone.id,
        zoneName: zone.name,
        probability: Math.round(zoneScore),
        riskLevel,
        // Add specific reason for this zone if multiplier is high
        specificRisk: zone.riskMultiplier > 1.2 ? "High density variance/terrain" : "Standard topography"
      };
    });

    const maxRiskZone = zoneRisks.reduce((prev, current) => (prev.probability > current.probability) ? prev : current);
    
    // Identify ALL high risk zones for the report
    const highRiskZones = zoneRisks.filter(z => z.probability >= 60);

    // Filter contributing factors to the most significant ones for the summary
    const significantFactors = contributingFactors.filter(f => Math.abs(f.score) >= 10);

    const analysis = `Analysis for ${forest.name}: The ${maxRiskZone.riskLevel.toLowerCase()} risk is primarily driven by ${significantFactors.map(f => f.factor).join(', ') || 'general conditions'}. 
    Critical Areas: ${highRiskZones.length > 0 ? highRiskZones.map(z => z.zoneName).join(', ') : maxRiskZone.zoneName}. 
    Peak historical risk is in ${peakRiskMonth}.`;

    const recommendations = [];
    if (maxRiskZone.riskLevel === "Extreme" || maxRiskZone.riskLevel === "High") {
       recommendations.push("ISSUE RED ALERT for core forest zones.");
       recommendations.push("Suspend all tourist activities in " + maxRiskZone.zoneName);
       recommendations.push("Deploy rapid response teams to water points.");
    } else if (maxRiskZone.riskLevel === "Moderate") {
       recommendations.push("Heightened alert state for observation towers.");
       recommendations.push("Patrol boundaries near villages.");
    } else {
       recommendations.push("Standard monitoring protocols.");
    }

    return NextResponse.json({
      forestName: forest.name,
      overallRisk: maxRiskZone.riskLevel,
      peakRiskMonth, // New field
      highRiskZones, // New field
      zoneRisks,
      contributingFactors, 
      analysis,
      recommendations,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Prediction error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
