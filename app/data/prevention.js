export const preventionStrategies = [
  {
    id: 1,
    category: "Individual & Community Actions",
    title: "Create Defensible Space",
    description: "Maintain a buffer zone around structures to slow fire spread and protect homes.",
    strategies: [
      {
        name: "Immediate Zone (0-5 feet)",
        details: "Remove all dead plants, grass, and weeds. Clear leaves and debris from roof and gutters. Keep firewood 30+ feet away. Use fire-resistant mulch. No combustible materials near walls."
      },
      {
        name: "Intermediate Zone (5-30 feet)",
        details: "Space trees and shrubs to prevent fire from spreading. Remove ladder fuels (low branches). Mow grass to 4 inches or less. Create fuel breaks with gravel, stone, or pavement."
      },
      {
        name: "Extended Zone (30-100 feet)",
        details: "Thin trees to reduce density. Remove dead wood and debris. Create horizontal and vertical spacing between plants. Maintain access for firefighting equipment."
      }
    ],
    impact: "Homes with adequate defensible space are 85% more likely to survive wildfires."
  },
  {
    id: 2,
    category: "Individual & Community Actions",
    title: "Harden Your Home",
    description: "Upgrade building materials and features to resist ignition from embers and flames.",
    strategies: [
      {
        name: "Roof",
        details: "Use Class A fire-rated roofing (asphalt shingles, metal, tile, concrete). Replace wood shake roofs. Install gutter guards to prevent debris accumulation."
      },
      {
        name: "Vents",
        details: "Cover all vents with 1/8-inch metal mesh. Use ember-resistant vent designs. Seal gaps and openings where embers can enter attics or crawl spaces."
      },
      {
        name: "Windows and Doors",
        details: "Install dual-pane or tempered glass windows. Use weather stripping to seal gaps. Consider fire-resistant shutters. Keep wooden fences from touching the house."
      },
      {
        name: "Siding and Decks",
        details: "Use ignition-resistant materials (stucco, fiber cement, brick). Replace wood siding within 5 feet of ground. Build decks with fire-resistant materials. Screen underneath decks."
      }
    ],
    impact: "Homes built to fire-resistant standards have up to 90% higher survival rates."
  },
  {
    id: 3,
    category: "Individual & Community Actions",
    title: "Responsible Fire Behavior",
    description: "Prevent human-caused ignitions through careful practices and awareness.",
    strategies: [
      {
        name: "Campfire Safety",
        details: "Build fires in designated areas with mineral soil ring. Keep fires small. Never leave unattended. Drown with water, stir ashes, drown again. Feel for heat before leaving. Follow local burn bans."
      },
      {
        name: "Equipment Use",
        details: "Avoid mowing in dry grass during hot, windy days. Use spark arresters on equipment. Keep vehicle maintenance current. Clear area before using power tools outdoors. No metal grinding during fire season."
      },
      {
        name: "Debris Burning",
        details: "Obtain permits when required. Burn only during cool, calm conditions. Clear 10+ foot perimeter. Have water and tools ready. Never burn during Red Flag Warnings. Monitor until completely out."
      },
      {
        name: "Recreation",
        details: "No fireworks in wildland areas. Target shooting prohibited during fire season. Check tire chains (dragging = sparks). Park cars on pavement, not dry grass. Cigarettes in ashtrays only."
      }
    ],
    impact: "84-90% of wildfires are human-caused - most are preventable with proper care."
  },
  {
    id: 4,
    category: "Government & Utility Actions",
    title: "Infrastructure Management",
    description: "Maintain and upgrade critical infrastructure to prevent ignitions.",
    strategies: [
      {
        name: "Power Line Safety",
        details: "Replace aging transmission equipment proactively. Implement Public Safety Power Shutoffs during extreme conditions. Increase vegetation clearance around lines. Install weather stations and monitoring. Underground lines in high-risk areas."
      },
      {
        name: "Road and Access Maintenance",
        details: "Maintain clear evacuation routes. Create fuel breaks along roads. Ensure fire engine access to communities. Mark evacuation routes clearly. Regular vegetation management on roadsides."
      },
      {
        name: "Water Infrastructure",
        details: "Maintain hydrant systems in fire-prone areas. Create water storage for firefighting. Ensure reliable pumping systems. Map water sources for aerial operations."
      }
    ],
    impact: "Power equipment failures have caused California's deadliest fires; proactive maintenance is critical."
  },
  {
    id: 5,
    category: "Government & Utility Actions",
    title: "Forest and Fuel Management",
    description: "Reduce hazardous fuel loads through active forest management.",
    strategies: [
      {
        name: "Prescribed Burns",
        details: "Conduct controlled burns during safe conditions to reduce accumulated fuels. Plan carefully with weather forecasts. Involve experienced personnel only. Monitor until completely extinguished."
      },
      {
        name: "Mechanical Thinning",
        details: "Remove small-diameter trees and shrubs. Reduce forest density to historical levels. Create shaded fuel breaks. Remove ladder fuels that allow fire to climb into canopy."
      },
      {
        name: "Mastication and Chipping",
        details: "Grind dense brush into mulch. Target areas near communities. Create fuel breaks along ridgelines and strategic locations."
      },
      {
        name: "Grazing and Biological Control",
        details: "Use targeted livestock grazing to reduce grass fuels. Maintain fire-resistant plant communities. Create green belts of low-flammability vegetation."
      }
    ],
    impact: "Fuel reduction can reduce fire intensity by 60-80% and slow spread significantly."
  },
  {
    id: 6,
    category: "Detection & Response",
    title: "Early Warning Systems",
    description: "Detect fires quickly and alert communities to enable rapid response and evacuation.",
    strategies: [
      {
        name: "Fire Detection Technology",
        details: "Deploy AI-powered camera networks. Use satellite monitoring (NASA FIRMS, MODIS). Maintain fire lookout towers in remote areas. Deploy sensors to detect smoke and heat. Report all smoke immediately."
      },
      {
        name: "Weather Monitoring",
        details: "Install Remote Automated Weather Stations (RAWS). Monitor Fire Weather Index continuously. Issue Red Flag Warnings proactively. Track humidity, temperature, and wind."
      },
      {
        name: "Alert Systems",
        details: "Register for local emergency alerts. Maintain multiple communication channels. Have weather radios in fire-prone areas. Follow official social media accounts. Know evacuation routes before fire season."
      },
      {
        name: "Rapid Response",
        details: "Fund sufficient firefighting resources. Pre-position equipment during high-risk periods. Maintain aerial firefighting capacity. Train volunteer firefighters. Mutual aid agreements between agencies."
      }
    ],
    impact: "Early detection and rapid response can keep fires small - 95% of fires are contained under 10 acres."
  },
  {
    id: 7,
    category: "Community Planning",
    title: "Land Use and Zoning",
    description: "Plan development to minimize wildfire risk and improve community resilience.",
    strategies: [
      {
        name: "Wildland-Urban Interface Planning",
        details: "Avoid building in extreme fire-hazard zones. Cluster development away from wildlands. Design communities with multiple evacuation routes. Require fuel breaks between wildland and homes."
      },
      {
        name: "Building Codes",
        details: "Adopt California Chapter 7A or similar standards. Require fire-resistant materials. Mandate defensible space. Inspect for compliance. Update codes as science evolves."
      },
      {
        name: "Community Fuel Breaks",
        details: "Create and maintain strategic fuel breaks. Use roads, parking lots, and parks as barriers. Maintain grass at low height in buffer zones. Clear vegetation from community perimeters."
      }
    ],
    impact: "Communities designed with fire safety reduce losses by 70%+ compared to unplanned development."
  },
  {
    id: 8,
    category: "Emergency Preparedness",
    title: "Evacuation and Safety Planning",
    description: "Prepare individuals and communities to evacuate safely when fires threaten.",
    strategies: [
      {
        name: "Personal Preparedness",
        details: "Create a Go Bag with essentials (documents, medications, photos, clothes). Plan multiple evacuation routes. Identify meeting locations. Practice evacuations. Keep vehicle fueled during fire season."
      },
      {
        name: "Family Communication Plan",
        details: "Establish out-of-area contact person. Share evacuation plans with family. Determine pet evacuation procedures. Keep important documents in fireproof safe or cloud storage."
      },
      {
        name: "Community Drills",
        details: "Conduct evacuation exercises. Test alert systems. Identify vulnerable populations needing assistance. Train residents on shelter-in-place vs. evacuation decisions."
      },
      {
        name: "Shelter Planning",
        details: "Identify evacuation centers. Plan for livestock and large animals. Coordinate with disability services. Establish reunification procedures."
      }
    ],
    impact: "Communities with practiced evacuation plans have zero deaths even in major fires."
  },
  {
    id: 9,
    category: "Climate Action",
    title: "Address Climate Change",
    description: "Reduce greenhouse gas emissions to limit future fire risk increases.",
    strategies: [
      {
        name: "Emissions Reduction",
        details: "Transition to renewable energy. Improve energy efficiency. Support carbon pricing policies. Reduce deforestation. Electrify transportation."
      },
      {
        name: "Adaptation Planning",
        details: "Update fire management for longer fire seasons. Increase firefighting resources. Research fire-adapted communities. Invest in fire science. Plan for climate refugees from fire-prone areas."
      },
      {
        name: "Forest Health",
        details: "Promote climate-resilient forest species. Protect old-growth carbon sinks. Reforest burned areas with diverse species. Manage forests for carbon sequestration and fire resistance."
      }
    ],
    impact: "Climate change has already doubled fire risk; limiting warming to 1.5°C prevents exponential increases."
  },
  {
    id: 10,
    category: "Education & Awareness",
    title: "Fire Education Programs",
    description: "Educate communities about wildfire risk, prevention, and response.",
    strategies: [
      {
        name: "School Programs",
        details: "Teach fire ecology and prevention. Conduct age-appropriate evacuation drills. Invite firefighters to speak. Include wildfire education in science curriculum."
      },
      {
        name: "Community Workshops",
        details: "Host defensible space workshops. Demonstrate home hardening. Teach evacuation planning. Provide free home assessments. Firewise USA certification programs."
      },
      {
        name: "Public Awareness Campaigns",
        details: "Use social media for prevention messages. Display fire danger ratings publicly. Distribute prevention materials. Partner with media for education. Highlight success stories."
      },
      {
        name: "Professional Training",
        details: "Train firefighters in latest techniques. Update fire managers on climate science. Educate utilities on fire prevention. Cross-train emergency responders."
      }
    ],
    impact: "Educated communities have 50% fewer ignitions and better survival outcomes."
  }
];

export const quickTips = [
  "Check your local fire danger rating daily during fire season",
  "Create and maintain 100 feet of defensible space around your home",
  "Never leave campfires, grills, or fire pits unattended",
  "Clear leaves and debris from roofs and gutters monthly",
  "Store firewood at least 30 feet from structures",
  "Have multiple evacuation routes planned and practiced",
  "Register for local emergency alerts on your phone",
  "Keep a Go Bag ready with essentials for quick evacuation",
  "Avoid using equipment that produces sparks during hot, dry, windy weather",
  "Report all smoke or fire sightings immediately to 911"
];
