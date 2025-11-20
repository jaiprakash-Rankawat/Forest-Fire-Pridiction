export const causes = [
  {
    id: 1,
    title: "High Temperature",
    icon: "🌡️",
    description: "Elevated temperatures play a critical role in creating conditions favorable for wildfires by drying out vegetation and increasing evaporation rates.",
    detailedExplanation: `High temperatures are one of the most significant natural factors contributing to forest fires. When temperatures rise, several mechanisms combine to create dangerous fire conditions:

**How Heat Drives Wildfires:**
1. **Moisture Extraction**: High temperatures increase the "vapor pressure deficit" - essentially, hot air acts like a thirsty sponge, pulling moisture from living plants, dead vegetation, and soil. This dries out potential fuel sources.

2. **Faster Evaporation**: Water evaporates more quickly from vegetation, soil, and water bodies, leaving plants stressed and more flammable.

3. **Extended Fire Seasons**: Rising baseline temperatures due to climate change have extended fire seasons by an average of 78 days in some regions.

4. **Synergy with Drought**: Heat waves often accompany drought conditions, compounding the drying effect and creating extremely flammable landscapes.

**Climate Connection:**
Since pre-industrial times, Earth has warmed by approximately 1.2°C. Scientific studies show that even small temperature increases lead to exponentially greater moisture loss from vegetation. Research indicates that over 50% of forest drying and fire risk increases since the 1970s can be directly attributed to human-induced climate change.`,
    statistics: [
      "Fire season length increased by 78 days in western U.S. since 1970s",
      "Every 1°C temperature increase can increase burned area by up to 600% in some forest types",
      "Heat waves today are 2-100x more likely due to climate change"
    ],
    preventionTips: [
      "Monitor temperature forecasts and avoid activities that could spark fires during heat waves",
      "Create defensible space around properties during cooler months",
      "Stay informed about Red Flag Warnings issued during extreme heat"
    ]
  },
  {
    id: 2,
    title: "Low Humidity",
    icon: "💧",
    description: "Low relative humidity accelerates the drying of vegetation and forest materials, making them highly susceptible to ignition and rapid fire spread.",
    detailedExplanation: `Low humidity is a critical meteorological factor that significantly elevates wildfire risk. When humidity drops, the atmosphere's ability to dry out fuels increases dramatically:

**How Low Humidity Creates Fire Danger:**
1. **Rapid Fuel Drying**: When relative humidity is low (typically below 30%), moisture evaporates rapidly from dead and living vegetation. Fine fuels like grass, leaves, and small twigs can become tinder-dry within hours.

2. **Reduced Fire Suppression Difficulty**: Low humidity allows fires to spread more quickly and intensely, making them harder to control. Flames can jump from ground vegetation into tree canopies more easily.

3. **Red Flag Conditions**: Meteorologists issue Red Flag Warnings when low humidity combines with high temperatures and strong winds - a dangerous trifecta for fire behavior.

4. **Seasonal Patterns**: Humidity naturally drops during certain seasons and weather patterns. High-pressure systems block moist air, creating extended periods of dangerous dryness.

**The Drying Process:**
Plant materials contain moisture that acts as a natural fire retardant. When humidity is high, vegetation can absorb some atmospheric moisture. But when humidity plummets, this protective moisture evaporates, leaving behind highly combustible material. Dead vegetation (fuel on the forest floor) dries even faster than living plants.`,
    statistics: [
      "Red Flag Warnings issued when humidity drops below 15-30% (varies by region)",
      "Fine fuels can dry to critical levels in just a few hours of low humidity",
      "Southwestern U.S. has experienced declining humidity trends, increasing fire risk"
    ],
    preventionTips: [
      "Check daily humidity levels during fire season",
      "Avoid outdoor burning when humidity is below 30%",
      "Water defensible spaces around homes during low-humidity periods"
    ]
  },
  {
    id: 3,
    title: "High Wind",
    icon: "💨",
    description: "Strong winds supply oxygen to fires, carry embers across long distances, and cause erratic fire behavior that makes containment extremely difficult.",
    detailedExplanation: `Wind is often the factor that transforms a manageable fire into an uncontrollable catastrophe. High winds affect fire behavior in multiple devastating ways:

**How Wind Accelerates Wildfire Spread:**
1. **Oxygen Supply**: Fire needs oxygen to burn. Strong winds continuously supply fresh oxygen to the flames, intensifying combustion and creating hotter, faster-moving fires.

2. **Ember Transport (Spotting)**: Wind can carry burning embers up to a mile or more ahead of the main fire front. These airborne embers start new fires (called "spot fires"), causing the fire to leap across firebreaks, roads, and even rivers.

3. **Flame Direction**: Wind pushes flames forward and tilts them toward unburned fuel, preheating vegetation ahead of the fire and making it easier to ignite.

4. **Erratic Behavior**: Gusting, shifting winds create unpredictable fire behavior. Flames can suddenly change direction, trapping firefighters and residents.

5. **Fire Whirls**: Under extreme conditions, wind and fire interact to create fire tornadoes or fire whirls - rotating columns of flame that can reach hundreds of feet high.

**Notable Wind Events:**
Santa Ana winds in California and Foehn winds in other regions are notorious for driving catastrophic fires. These hot, dry downslope winds can exceed 50 mph, with gusts even higher, creating perfect firestorm conditions.`,
    statistics: [
      "Embers can travel over 1 mile ahead of fire front in high winds",
      "Wind speeds above 25 mph create extreme fire behavior",
      "Santa Ana winds have been implicated in many of California's most destructive fires"
    ],
    preventionTips: [
      "Heed evacuation orders immediately during high wind events",
      "Secure outdoor items that could blow into dry vegetation",
      "Never burn debris when winds exceed 10 mph"
    ]
  },
  {
    id: 4,
    title: "Human Activities",
    icon: "👤",
    description: "84-90% of wildfires in the United States are caused by human actions, ranging from equipment failures to careless behavior and arson.",
    detailedExplanation: `Human-caused wildfires represent the vast majority of fire incidents and are often more destructive than natural fires because they tend to start near populated areas and can occur year-round:

**Major Categories of Human-Caused Fires:**

1. **Power Line Failures (Equipment)**: Faulty electrical transmission equipment, worn components, and contact between power lines are major culprits. Utilities' aging infrastructure can create sparks or drop hot metal onto dry vegetation.

2. **Debris Burning**: Uncontrolled burning of yard waste, agricultural residue, or trash accounts for about 29% of human-caused fires. Embers from these burns can escape containment during windy conditions.

3. **Arson**: Intentionally set fires account for approximately 21% of wildfires. These criminal acts endanger lives and cause billions in damages.

4. **Equipment and Vehicle Sparks**: Lawn mowers, chain saws, cars with dragging chains, hot vehicle exhaust on dry grass, and machinery all generate sparks that can ignite fires.

5. **Campfires and Recreation**: Unattended or improperly extinguished campfires, target shooting (hot bullet fragments), and fireworks are common recreational causes.

6. **Cigarettes**: Discarded cigarettes can smolder for hours before igniting surrounding vegetation.

**Why Human Fires Are More Destructive:**
- **Location**: Start at the wildland-urban interface where homes are threatened
- **Timing**: Occur year-round, extending fire seasons beyond natural patterns
- **Size**: California data shows human-caused fires were 6.5x larger than lightning fires
- **Cost**: More expensive to fight because they threaten structures`,
    statistics: [
      "84-90% of U.S. wildfires are human-caused",
      "In California, 95% of wildfires have human origins",
      "Human-caused fires have tripled the fire season from 46 to 154 days",
      "Human fires killed 3x more trees than lightning fires in California (2012-2018)"
    ],
    preventionTips: [
      "Never leave campfires unattended; drown with water until cold",
      "Avoid using power equipment during hot, dry, windy conditions",
      "Properly maintain vehicles and equipment to prevent sparks",
      "Dispose of cigarettes in proper containers, never out windows",
      "Follow local burn bans and obtain permits when required"
    ]
  },
  {
    id: 5,
    title: "Dry Vegetation",
    icon: "🌾",
    description: "Drought-stressed and dead vegetation creates abundant fuel for wildfires, with extended droughts dramatically increasing fire intensity and spread.",
    detailedExplanation: `Dry vegetation is the fuel that feeds forest fires. The amount and condition of this fuel directly determines fire behavior, intensity, and spread:

**How Drought Creates Dangerous Fuel Conditions:**

1. **Fuel Moisture Content**: Living plants normally contain water that makes them resistant to burning. During drought, plants can't access enough soil moisture and become dessicated. Dead vegetation (fallen leaves, branches, dry grass) loses all moisture content and becomes highly flammable.

2. **Accumulation of Dead Material**: Extended droughts kill trees and shrubs, leaving standing dead timber and accumulating fuel on the forest floor. In California, over 100 million trees died between 2011-2016 due to drought stress and bark beetles.

3. **Fuel Loading**: Years of fire suppression in some forests have allowed excessive fuel buildup. When drought dries this accumulated material, the stage is set for intense crown fires that jump from treetop to treetop.

4. **Fuel Continuity**: Dry vegetation creates continuous fuel beds with no breaks, allowing fire to spread rapidly across landscapes.

**The Drought-Fire Cycle:**
- Drought reduces soil moisture → plants can't find water even with deep roots
- Stressed vegetation becomes more susceptible to insects and disease
- Dead and dying plants accumulate across the landscape
- High temperatures and low humidity remove remaining moisture
- Any ignition source encounters abundant, highly flammable fuel

**Ecosystem Vulnerability:**
Different ecosystems respond differently. Grasslands need wet periods to grow fuel, then dry periods to burn it. Forests, however, become increasingly dangerous with each year of drought as fuel moisture drops and dead material accumulates.`,
    statistics: [
      "Over 100 million trees died in California by 2016 due to drought",
      "Multi-year droughts were major drivers of Australia's 2019-20 fire catastrophe",
      "Fuel moisture below 10% creates extreme fire danger"
    ],
    preventionTips: [
      "Clear dead vegetation and create defensible space around structures",
      "Remove dead trees and branches during wet seasons",
      "Support forest thinning and fuel reduction programs",
      "Practice water conservation to help maintain landscape moisture"
    ]
  },
  {
    id: 6,
    title: "Lightning",
    icon: "⚡",
    description: "Lightning strikes are the primary natural cause of wildfires, responsible for nearly 70% of wildfire-burned land in the western United States.",
    detailedExplanation: `Lightning represents nature's primary ignition source for wildfires and has sparked fires since long before humans existed. While less frequent than human ignitions, lightning fires often burn larger areas:

**How Lightning Ignites Fires:**

1. **Direct Strike**: A lightning bolt carries enormous electrical energy and heat (up to 30,000°C or 54,000°F). When it strikes a tree or the ground, it can instantly ignite dry vegetation or wood.

2. **Dry Lightning**: The most dangerous scenario occurs during "dry thunderstorms" - storms that produce lightning but little to no rainfall. Without rain to extinguish ignitions, fires can spread immediately.

3. **Holdover Fires**: Lightning can create fires that smolder underground in organic material (humus, peat, duff) for days or even weeks before emerging as visible flames. This makes early detection extremely difficult.

4. **Multiple Ignitions**: A single thunderstorm can produce hundreds of lightning strikes across a region, potentially starting dozens of fires simultaneously - overwhelming firefighting resources.

**Geographic Patterns:**
- **Boreal Forests**: In Alaska and northern Canada, virtually all fires (95-99%) are lightning-caused
- **Western U.S.**: Lightning causes fewer individual fires than humans but accounts for about 70% of total area burned
- **Remote Areas**: Lightning fires often start in wilderness areas with difficult terrain, making suppression challenging

**Climate Change Impact:**
Research shows lightning-caused fires have increased 2-5% since 1975 in boreal forests. Warming temperatures create more favorable conditions for both thunderstorm formation and fire spread.`,
    statistics: [
      "Nearly 70% of wildfire-burned land in western U.S. comes from lightning fires",
      "95-99% of Alaska's burned area is from lightning strikes",
      "Single storms can produce hundreds of strikes, starting multiple fires",
      "Lightning fires increased 2-5% since 1975 in boreal regions"
    ],
    preventionTips: [
      "Lightning is natural and unpredictable - focus on detection and rapid response",
      "Support funding for fire detection systems in remote areas",
      "Report smoke from lightning storms immediately",
      "Ensure homes in fire-prone areas have lightning protection systems"
    ]
  }
];
