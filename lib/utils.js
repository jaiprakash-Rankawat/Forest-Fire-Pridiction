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

export function formatMarkdownText(text) {
  if (!text) return null;
  
  const parts = [];
  let lastIndex = 0;
  const regex = /\*\*(.*?)\*\*/g;
  let match;
  let key = 0;
  
  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push(text.substring(lastIndex, match.index));
    }
    parts.push(<strong key={key++} className="font-semibold text-gray-900">{match[1]}</strong>);
    lastIndex = match.index + match[0].length;
  }
  
  if (lastIndex < text.length) {
    parts.push(text.substring(lastIndex));
  }
  
  return parts.length > 0 ? parts : text;
}

export function renderFormattedText(text) {
  if (!text) return null;
  
  const lines = text.split('\n');
  
  return lines.map((line, index) => {
    if (line.trim() === '') {
      return <br key={index} />;
    }
    
    const formattedLine = formatMarkdownText(line);
    
    return (
      <span key={index} className="block mb-2">
        {formattedLine}
      </span>
    );
  });
}
