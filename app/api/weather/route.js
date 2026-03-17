import { NextResponse } from 'next/server';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const lat = searchParams.get('lat');
  const lon = searchParams.get('lon');

  if (!lat || !lon) {
    return NextResponse.json({ error: 'lat and lon are required' }, { status: 400 });
  }

  try {
    // Open-Meteo free API – no key needed
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,wind_speed_10m,precipitation&daily=precipitation_sum&past_days=14&forecast_days=1&timezone=Asia%2FKolkata`;

    const res = await fetch(url, { next: { revalidate: 1800 } });

    if (!res.ok) {
      throw new Error(`Open-Meteo API error: ${res.status}`);
    }

    const data = await res.json();

    const current = data.current;
    const daily = data.daily;

    // Calculate days since last meaningful rain (>= 2mm)
    let daysSinceRain = 0;
    const precipSums = daily?.precipitation_sum || [];
    for (let i = precipSums.length - 1; i >= 0; i--) {
      if (precipSums[i] >= 2) break;
      daysSinceRain++;
    }

    // Recent rainfall = sum of last 7 days
    const recentRainfall = precipSums.slice(-7).reduce((a, b) => a + (b || 0), 0);

    // Vegetation Dryness Index (VDI): 0-100 based on humidity, days since rain, temp
    const humidity = current.relative_humidity_2m ?? 50;
    const temp = current.temperature_2m ?? 25;
    const windSpeed = current.wind_speed_10m ?? 10;

    // Higher temp + lower humidity + more days without rain = more dry
    const VDI = Math.min(
      100,
      Math.max(
        0,
        Math.round(
          ((100 - humidity) * 0.4) +
          (Math.max(0, temp - 20) * 1.5) +
          (daysSinceRain * 2.5) -
          (recentRainfall * 0.8)
        )
      )
    );

    const dryness =
      VDI > 80 ? 'Critically Dry' :
      VDI > 60 ? 'Very Dry' :
      VDI > 40 ? 'Moderately Dry' :
      VDI > 20 ? 'Slightly Moist' :
      'Moist';

    return NextResponse.json({
      temperature: Math.round(current.temperature_2m * 10) / 10,
      humidity: Math.round(humidity),
      windSpeed: Math.round(windSpeed),
      vegetationDryness: dryness,
      vegetationDrynessIndex: VDI,
      daysSinceRain,
      recentRainfall: Math.round(recentRainfall * 10) / 10,
    });
  } catch (err) {
    console.error('Weather API error:', err);
    return NextResponse.json({ error: 'Failed to fetch weather data' }, { status: 500 });
  }
}
