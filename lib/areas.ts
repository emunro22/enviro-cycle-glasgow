// Source of truth for all SEO pages.
//
// Each combination of (service prefix × area) becomes a real, indexable page
// at the root of the site: e.g. /waste-removal-blantyre, /house-clearance-hamilton.
//
// To add a new area: append to `areas` below. The catch-all route at
// app/[slug]/page.tsx will generate the page automatically on next build.
//
// To change which services an area gets: edit its `services` array.

// ── SERVICE PREFIXES ─────────────────────────────────────────────────────────
// These are the URL prefixes that combine with area slugs. Each one represents
// a real search phrase people type into Google.

export interface ServicePrefix {
  prefix: string;          // "waste-removal", "house-clearance" etc.
  searchPhrase: string;    // "waste removal", for page titles
  h1Verb: string;          // "WASTE REMOVAL", for hero headings (uppercase)
  intro: string;
  body: string;
}

export const servicePrefixes: ServicePrefix[] = [
  {
    prefix: "waste-removal",
    searchPhrase: "Waste Removal",
    h1Verb: "WASTE REMOVAL",
    intro:
      "Licensed waste removal, uplifts and recycling. Domestic and commercial, same-day available.",
    body:
      "We collect waste of all kinds: household, garden, builders' rubble, office strip-outs. Everything's sorted at a licensed transfer station, with a waste transfer note provided for your records. Reusable items go to local charities; the rest is recycled or recovered where possible.",
  },
  {
    prefix: "rubbish-removal",
    searchPhrase: "Rubbish Removal",
    h1Verb: "RUBBISH REMOVAL",
    intro:
      "Quick, no-fuss rubbish removal. Single items to full van loads. Cheaper and faster than a skip.",
    body:
      "Single sofas, full house contents, garage clear-outs, garden bags. We take it all. Pricing's by volume and weight rather than per item, so larger jobs work out cheaper. We can usually get to you within 24–48 hours, often same-day.",
  },
  {
    prefix: "house-clearance",
    searchPhrase: "House Clearance",
    h1Verb: "HOUSE CLEARANCE",
    intro:
      "Full or part house clearances: end-of-tenancy, probate, downsizing. Discreet and tidy.",
    body:
      "Whole-house clearances from start to finish: single rooms, full properties, lofts, garages, sheds. Furniture, appliances, mattresses, carpets, the lot. Anything reusable goes to local charities; the rest is sorted at a licensed transfer station. Sensitive jobs like probate clearances are handled discreetly.",
  },
  {
    prefix: "office-clearance",
    searchPhrase: "Office Clearance",
    h1Verb: "OFFICE CLEARANCE",
    intro:
      "Commercial office strip-outs, IT disposal, furniture removal. Out-of-hours bookings standard.",
    body:
      "Office moves, downsizes, and full strip-outs handled with minimal disruption to your team. We dismantle desks, remove old IT and WEEE (with data destruction certificates where needed), and recycle paper and cardboard separately. Evening and weekend bookings standard.",
  },
  {
    prefix: "garden-waste-removal",
    searchPhrase: "Garden Waste Removal",
    h1Verb: "GARDEN WASTE REMOVAL",
    intro:
      "Branches, hedge cuttings, turf, soil, decking, uplifted and recycled.",
    body:
      "Hedge cuttings, branches, soil, turf, decking, fence panels. Anything from a quick garden tidy-up to a full landscaping strip-out. Green waste goes to a licensed composting facility; mixed garden waste is sorted for recovery.",
  },
  {
    prefix: "builders-waste-removal",
    searchPhrase: "Builders Waste Removal",
    h1Verb: "BUILDERS WASTE REMOVAL",
    intro:
      "Trade waste uplifts for renovations, kitchens, bathrooms, extensions. Often cheaper than a skip.",
    body:
      "Renovations, kitchen rip-outs, bathroom installs, extensions. We collect from kerbside or driveway as often as the job needs. Plasterboard kept separate as required by law, and inert rubble priced lower than mixed loads. Waste transfer notes provided on every collection.",
  },
  {
    prefix: "furniture-disposal",
    searchPhrase: "Furniture Disposal",
    h1Verb: "FURNITURE DISPOSAL",
    intro:
      "Sofas, beds, wardrobes, white goods. Uplifted same-day where possible.",
    body:
      "Sofas, beds, wardrobes, dining sets, fridges, washing machines. Anything too big for the car. Reusable items go to local charities; the rest is taken apart and recycled where possible. We usually do same-day or next-day on standard items.",
  },
  {
    prefix: "skip-hire-alternative",
    searchPhrase: "Skip Hire Alternative",
    h1Verb: "SKIP HIRE ALTERNATIVE",
    intro:
      "Don't need a skip in the driveway for a week? Pay for what you actually throw out. We uplift and go.",
    body:
      "A skip costs the same whether it's full or half-empty, and you need a permit if it's on the road. We turn up, load the van, and leave. You pay for what we take, not for floor space and a permit. Works out cheaper for most domestic jobs.",
  },
];

// ── AREAS ────────────────────────────────────────────────────────────────────

export interface Area {
  slug: string;          // url-safe area slug, e.g. "blantyre"
  name: string;          // "Blantyre"
  postcodes: string[];
  council: string;
  travelMinutes: number;
  localHook: string;
  landmarks: string[];
  // Which service prefixes apply to this area. Default: all 8.
  // Use a subset for less-core areas to avoid thin content.
  services: string[];
}

const ALL_SERVICES = servicePrefixes.map((s) => s.prefix);
const CORE_SERVICES = [
  "waste-removal",
  "rubbish-removal",
  "house-clearance",
  "garden-waste-removal",
  "builders-waste-removal",
  "furniture-disposal",
];
const COMMERCIAL = [
  "waste-removal",
  "rubbish-removal",
  "office-clearance",
  "builders-waste-removal",
  "house-clearance",
];

export const areas: Area[] = [
  // ── BLANTYRE & IMMEDIATE (≤3 mi) ───────────────────────────────────────────
  {
    slug: "blantyre",
    name: "Blantyre",
    postcodes: ["G72"],
    council: "South Lanarkshire",
    travelMinutes: 10,
    localHook:
      "Blantyre's mix of older terraced housing along Glasgow Road and newer developments around Auchinraith means a steady flow of house clearances, garden uplifts, and tradesman waste from local renovations. Easy access from the M74 keeps response times here among our fastest.",
    landmarks: ["David Livingstone Birthplace Museum", "Blantyre Leisure Centre", "Greenhall Park", "Auchinraith Primary"],
    services: ALL_SERVICES,
  },
  {
    slug: "high-blantyre",
    name: "High Blantyre",
    postcodes: ["G72"],
    council: "South Lanarkshire",
    travelMinutes: 12,
    localHook:
      "High Blantyre's quieter residential streets and proximity to Hairmyres mean we cover a lot of family-home clearances and end-of-tenancy jobs here. Older properties often need plasterboard kept separate during renovations. We handle that as standard.",
    landmarks: ["Hairmyres Hospital", "Calderside Academy", "Wheatlandhead Park"],
    services: CORE_SERVICES,
  },
  {
    slug: "hamilton",
    name: "Hamilton",
    postcodes: ["ML3"],
    council: "South Lanarkshire",
    travelMinutes: 15,
    localHook:
      "Hamilton's town-centre flats, suburban semis around Eddlewood, and growing commercial space near the racecourse all generate different kinds of work. We're regulars on the Bothwell Road corridor for furniture uplifts and trade waste from local builders.",
    landmarks: ["Hamilton Palace Grounds", "Hamilton Park Racecourse", "Strathclyde Country Park"],
    services: ALL_SERVICES,
  },
  {
    slug: "bothwell",
    name: "Bothwell",
    postcodes: ["G71"],
    council: "South Lanarkshire",
    travelMinutes: 12,
    localHook:
      "Bothwell's larger Victorian and Edwardian properties along Main Street and around the castle bring more substantial clearance jobs: full attics, outbuildings, mature gardens. Renovation waste from the village's ongoing extension projects is a regular run.",
    landmarks: ["Bothwell Castle", "Bothwell Bridge", "Bothwell Main Street"],
    services: ALL_SERVICES,
  },
  {
    slug: "uddingston",
    name: "Uddingston",
    postcodes: ["G71"],
    council: "South Lanarkshire",
    travelMinutes: 13,
    localHook:
      "Uddingston sits right on our doorstep heading toward Glasgow. The mix of older Tunnock's-era housing stock and newer estates means everything from single-item uplifts to full house clearances. Tannochside and Birkenshaw both fall under this coverage.",
    landmarks: ["Tunnock's Bakery", "Uddingston Cross", "Calderpark"],
    services: ALL_SERVICES,
  },
  {
    slug: "cambuslang",
    name: "Cambuslang",
    postcodes: ["G72"],
    council: "South Lanarkshire",
    travelMinutes: 14,
    localHook:
      "Cambuslang's mix of terraced housing in the centre and newer developments toward Halfway and Whitlawburn keeps us busy across the full range: clearances, garden waste, builders' rubble. The commercial estate also generates regular trade pickups.",
    landmarks: ["Cambuslang Main Street", "Halfway", "Whitlawburn", "Kirkhill Golf Club"],
    services: ALL_SERVICES,
  },
  {
    slug: "burnbank",
    name: "Burnbank",
    postcodes: ["ML3"],
    council: "South Lanarkshire",
    travelMinutes: 16,
    localHook:
      "Burnbank's tight residential streets and tenement properties mean a lot of our work here involves carefully accessing back courts and side lanes for furniture and garden waste uplifts. We know the area well enough to park sensibly without blocking neighbours.",
    landmarks: ["Burnbank Cross", "Hamilton Academical Stadium"],
    services: CORE_SERVICES,
  },
  {
    slug: "ferniegair",
    name: "Ferniegair",
    postcodes: ["ML3"],
    council: "South Lanarkshire",
    travelMinutes: 16,
    localHook:
      "Ferniegair's newer family homes generate a steady flow of garden clearances and bulky furniture uplifts. The area's proximity to the A72 makes it easy for us to fit a job in around routes heading east or south.",
    landmarks: ["Chatelherault Country Park", "Ferniegair Primary"],
    services: CORE_SERVICES,
  },
  {
    slug: "larkhall",
    name: "Larkhall",
    postcodes: ["ML9"],
    council: "South Lanarkshire",
    travelMinutes: 18,
    localHook:
      "Larkhall's older town-centre flats and surrounding family homes give us a steady mix of end-of-tenancy clearances, garden waste, and renovation jobs. Local trades use us regularly for kerbside collections during kitchen and bathroom refits.",
    landmarks: ["Larkhall Cross", "Applebank", "Morgan Glen"],
    services: ALL_SERVICES,
  },
  {
    slug: "quarter",
    name: "Quarter",
    postcodes: ["ML3"],
    council: "South Lanarkshire",
    travelMinutes: 18,
    localHook:
      "Quarter's village setting and surrounding farmland mean we cover both domestic clearances and the occasional larger landscape and agricultural-yard tidy-up. Common materials here include green waste, fencing, and old outbuilding contents.",
    landmarks: ["Quarter Village", "Limekilnburn"],
    services: CORE_SERVICES,
  },

  // ── EAST KILBRIDE & SURROUNDS ──────────────────────────────────────────────
  {
    slug: "east-kilbride",
    name: "East Kilbride",
    postcodes: ["G74", "G75"],
    council: "South Lanarkshire",
    travelMinutes: 18,
    localHook:
      "East Kilbride's the biggest town we cover regularly. Everything from town-centre flat clearances near the shopping centre to family-home uplifts in Westwood, Calderwood, and Stewartfield. The town's grid layout makes access straightforward in most areas.",
    landmarks: ["East Kilbride Shopping Centre", "James Hamilton Heritage Park", "Calderglen Country Park"],
    services: ALL_SERVICES,
  },
  {
    slug: "calderwood",
    name: "Calderwood",
    postcodes: ["G74"],
    council: "South Lanarkshire",
    travelMinutes: 20,
    localHook:
      "Calderwood's family homes and good road access make for straightforward jobs. Single-item uplifts and full clearances both run smoothly here. We see a fair bit of garden waste from the area's larger plot sizes.",
    landmarks: ["Calderwood Square", "Calderwood Primary"],
    services: CORE_SERVICES,
  },
  {
    slug: "westwood",
    name: "Westwood",
    postcodes: ["G75"],
    council: "South Lanarkshire",
    travelMinutes: 20,
    localHook:
      "Westwood's a quiet, well-laid-out residential area that gives us mostly straightforward family-home jobs: furniture refreshes, garden tidy-ups, and the occasional full clearance during a downsize or sale.",
    landmarks: ["Westwood Square", "Whitehills"],
    services: CORE_SERVICES,
  },
  {
    slug: "stewartfield",
    name: "Stewartfield",
    postcodes: ["G74"],
    council: "South Lanarkshire",
    travelMinutes: 22,
    localHook:
      "Stewartfield's newer housing means we see plenty of garden clearances as people finish landscaping their plots, plus furniture uplifts as homes settle in. Easy access from the A726 helps us get there quickly.",
    landmarks: ["Stewartfield Way", "Stewartfield Primary"],
    services: CORE_SERVICES,
  },
  {
    slug: "jackton",
    name: "Jackton",
    postcodes: ["G75"],
    council: "South Lanarkshire",
    travelMinutes: 24,
    localHook:
      "Jackton's expanding rapidly with new builds, so a lot of our work here is post-build clearances, garden establishment, and the occasional snagging-related furniture removal. Estate roads are wide enough for our larger vans without trouble.",
    landmarks: ["Jackton Hall", "Newhouse Farm"],
    services: CORE_SERVICES,
  },
  {
    slug: "eaglesham",
    name: "Eaglesham",
    postcodes: ["G76"],
    council: "East Renfrewshire",
    travelMinutes: 25,
    localHook:
      "Eaglesham's conservation village character means careful jobs: narrow streets around the village green, period properties with sensitive contents. We work calmly and tidily here, which the residents appreciate.",
    landmarks: ["Eaglesham Village Green", "Polnoon Lodge"],
    services: CORE_SERVICES,
  },
  {
    slug: "strathaven",
    name: "Strathaven",
    postcodes: ["ML10"],
    council: "South Lanarkshire",
    travelMinutes: 28,
    localHook:
      "Strathaven sits at the edge of our regular run: worth the trip for the town's mix of older stone-built homes, larger plots, and active village trade. Garden waste and renovation rubble are the most common pickups out here.",
    landmarks: ["Strathaven Castle", "John Hastie Park", "Strathaven Town Mill"],
    services: CORE_SERVICES,
  },
  {
    slug: "stonehouse",
    name: "Stonehouse",
    postcodes: ["ML9"],
    council: "South Lanarkshire",
    travelMinutes: 22,
    localHook:
      "Stonehouse village has plenty of older cottages and family homes where renovations regularly throw up mixed waste: old plasterboard, lath, timber, the lot. We sort it properly on-site so the right materials go to the right place.",
    landmarks: ["Stonehouse Cross", "Lawrie Street", "Townhead"],
    services: CORE_SERVICES,
  },

  // ── EAST/SOUTH-EAST GLASGOW ────────────────────────────────────────────────
  {
    slug: "rutherglen",
    name: "Rutherglen",
    postcodes: ["G73"],
    council: "South Lanarkshire",
    travelMinutes: 18,
    localHook:
      "Rutherglen's Main Street tenements, the family housing around Burnside and Cathkin, and the commercial units near Farmeloan Road all keep us busy. We know the back lanes and parking situations well enough to keep jobs moving.",
    landmarks: ["Rutherglen Main Street", "Overtoun Park", "Rutherglen Town Hall"],
    services: ALL_SERVICES,
  },
  {
    slug: "burnside",
    name: "Burnside",
    postcodes: ["G73"],
    council: "South Lanarkshire",
    travelMinutes: 18,
    localHook:
      "Burnside's tree-lined family streets and the larger detached properties around Stonelaw mean substantial clearance jobs are common: full house contents, mature gardens, fitted-furniture removals during renovations.",
    landmarks: ["Stonelaw High School", "Burnside Cross", "Cathkin Braes"],
    services: CORE_SERVICES,
  },
  {
    slug: "kings-park",
    name: "King's Park",
    postcodes: ["G44"],
    council: "Glasgow City",
    travelMinutes: 22,
    localHook:
      "King's Park's mix of 1930s semis and bungalows often means generous lofts and back gardens with decades of contents to clear. Probate and downsizing jobs are common. We handle these patiently and with discretion.",
    landmarks: ["King's Park", "Linn Park", "King's Park Secondary"],
    services: CORE_SERVICES,
  },
  {
    slug: "croftfoot",
    name: "Croftfoot",
    postcodes: ["G44", "G45"],
    council: "Glasgow City",
    travelMinutes: 22,
    localHook:
      "Croftfoot's family-home streets and the council housing further along mean a balanced mix of full clearances, garden uplifts, and bulky furniture pickups. Tenement back-court access well understood.",
    landmarks: ["Croftfoot Station", "Castlemilk Park"],
    services: CORE_SERVICES,
  },
  {
    slug: "mount-vernon",
    name: "Mount Vernon",
    postcodes: ["G32"],
    council: "Glasgow City",
    travelMinutes: 20,
    localHook:
      "Mount Vernon's quiet residential character belies how busy it gets for us: house turnovers, garden waste from larger plots, and renovation rubble from local trades all feature regularly. M74 access keeps response times tight.",
    landmarks: ["Mount Vernon Station", "Daldowie", "Calderpark"],
    services: CORE_SERVICES,
  },
  {
    slug: "baillieston",
    name: "Baillieston",
    postcodes: ["G69"],
    council: "Glasgow City",
    travelMinutes: 22,
    localHook:
      "Baillieston's main road position and surrounding housing estates make for a steady stream of bulky uplifts, builders' waste from local renovations, and commercial clearances from the area's small business units.",
    landmarks: ["Baillieston Cross", "Garrowhill", "Drumpark"],
    services: COMMERCIAL,
  },

  // ── COATBRIDGE & NORTH LANARKSHIRE ─────────────────────────────────────────
  {
    slug: "coatbridge",
    name: "Coatbridge",
    postcodes: ["ML5"],
    council: "North Lanarkshire",
    travelMinutes: 22,
    localHook:
      "Coatbridge covers a wide area for us: town-centre tenement clearances, family homes around Drumpellier and Gartcosh, and commercial trade waste from the industrial estates. The M8/M74 junction makes us reachable quickly from base.",
    landmarks: ["Drumpellier Country Park", "Summerlee Museum", "Coatbridge Main Street"],
    services: ALL_SERVICES,
  },
  {
    slug: "airdrie",
    name: "Airdrie",
    postcodes: ["ML6"],
    council: "North Lanarkshire",
    travelMinutes: 28,
    localHook:
      "Airdrie's town centre tenements, the family housing around Brownsburn and Cairnhill, and the trade units off the A89 cover the full range. We typically batch Airdrie jobs with other Lanarkshire pickups to keep costs reasonable.",
    landmarks: ["Airdrie Town Centre", "Centenary Hall", "Brownsburn"],
    services: COMMERCIAL,
  },
  {
    slug: "bellshill",
    name: "Bellshill",
    postcodes: ["ML4"],
    council: "North Lanarkshire",
    travelMinutes: 18,
    localHook:
      "Bellshill's older terraced streets and the newer Strathclyde Business Park give us both domestic and commercial work. House clearances near the town centre and IT/office disposals from the business park. Easy M74 access keeps response times short.",
    landmarks: ["Strathclyde Business Park", "Bellshill Cross", "Mossend"],
    services: ALL_SERVICES,
  },
  {
    slug: "motherwell",
    name: "Motherwell",
    postcodes: ["ML1"],
    council: "North Lanarkshire",
    travelMinutes: 20,
    localHook:
      "Motherwell's tight town-centre layout and the surrounding family-housing areas of Forgewood and Knowetop give us a busy mix of clearances and uplifts. The Civic Centre district sees regular office and commercial work too.",
    landmarks: ["Motherwell Civic Centre", "Strathclyde Park", "Fir Park"],
    services: ALL_SERVICES,
  },
  {
    slug: "wishaw",
    name: "Wishaw",
    postcodes: ["ML2"],
    council: "North Lanarkshire",
    travelMinutes: 24,
    localHook:
      "Wishaw's main street and the surrounding housing in Craigneuk, Newmains, and Cambusnethan generate a steady run of work. Older properties often mean asbestos awareness on renovation jobs. We flag suspect material rather than touching it.",
    landmarks: ["Wishaw Cross", "Wishaw General Hospital", "Coltness"],
    services: CORE_SERVICES,
  },
  {
    slug: "viewpark",
    name: "Viewpark",
    postcodes: ["G71"],
    council: "North Lanarkshire",
    travelMinutes: 14,
    localHook:
      "Viewpark sits between our base and the M74. One of the quickest call-outs we run. Family clearances, garden uplifts, and renovation waste all feature regularly from the area's mix of older and newer housing.",
    landmarks: ["Viewpark Gardens", "Tannochside"],
    services: CORE_SERVICES,
  },
  {
    slug: "tannochside",
    name: "Tannochside",
    postcodes: ["G71"],
    council: "North Lanarkshire",
    travelMinutes: 14,
    localHook:
      "Tannochside's quiet residential character keeps our jobs here straightforward: single-item uplifts, garden clear-outs, and the occasional full house contents during a sale or move.",
    landmarks: ["Tannochside Park", "Birkenshaw"],
    services: CORE_SERVICES,
  },

  // ── GLASGOW CITY ───────────────────────────────────────────────────────────
  {
    slug: "glasgow-city-centre",
    name: "Glasgow City Centre",
    postcodes: ["G1", "G2", "G3"],
    council: "Glasgow City",
    travelMinutes: 25,
    localHook:
      "City centre work means office clearances, restaurant fit-outs, and tenement flat uplifts. Usually with tight loading restrictions and timed access. We plan these jobs around the access windows so kit gets shifted without parking tickets.",
    landmarks: ["Buchanan Street", "George Square", "Merchant City"],
    services: COMMERCIAL,
  },
  {
    slug: "dennistoun",
    name: "Dennistoun",
    postcodes: ["G31"],
    council: "Glasgow City",
    travelMinutes: 22,
    localHook:
      "Dennistoun's red-sandstone tenements and active rental market mean a steady flow of end-of-tenancy clearances. Back-court access and stair carrying are routine here. We plan for both.",
    landmarks: ["Alexandra Park", "Duke Street", "Dennistoun Cross"],
    services: COMMERCIAL,
  },
  {
    slug: "shawlands",
    name: "Shawlands",
    postcodes: ["G41", "G42"],
    council: "Glasgow City",
    travelMinutes: 25,
    localHook:
      "Shawlands' tenement flats and active rental market keep end-of-tenancy clearances rolling. The cafes and small shops along Kilmarnock Road also generate regular commercial uplifts during fit-out changes.",
    landmarks: ["Queen's Park", "Shawlands Cross", "Kilmarnock Road"],
    services: COMMERCIAL,
  },
  {
    slug: "govanhill",
    name: "Govanhill",
    postcodes: ["G42"],
    council: "Glasgow City",
    travelMinutes: 25,
    localHook:
      "Govanhill's dense tenement housing and active rental sector mean we're regularly back for clearances between tenants. We know the access constraints and parking windows well, which matters here.",
    landmarks: ["Govanhill Park", "Victoria Road", "Govanhill Baths"],
    services: COMMERCIAL,
  },

  // ── NORTH LANARKSHIRE EXTENSION ────────────────────────────────────────────
  {
    slug: "stepps",
    name: "Stepps",
    postcodes: ["G33"],
    council: "North Lanarkshire",
    travelMinutes: 22,
    localHook:
      "Stepps sits just off the M80 on Glasgow's north-eastern edge. A quiet suburban village with a mix of family homes and newer developments. We run this route regularly alongside Chryston and Coatbridge jobs, so response times are better than the distance suggests.",
    landmarks: ["Stepps Station", "Frankfield Loch", "Stepps Park"],
    services: CORE_SERVICES,
  },
  {
    slug: "chryston",
    name: "Chryston",
    postcodes: ["G69"],
    council: "North Lanarkshire",
    travelMinutes: 20,
    localHook:
      "Chryston and Muirhead sit on the north-eastern fringes of the conurbation, where older bungalows and family semis generate steady clearance and garden-waste work. Good access via the A80 corridor keeps our call-outs here efficient.",
    landmarks: ["Chryston Village", "Muirhead", "Marnoch Drive"],
    services: CORE_SERVICES,
  },
  {
    slug: "newarthill",
    name: "Newarthill",
    postcodes: ["ML1"],
    council: "North Lanarkshire",
    travelMinutes: 18,
    localHook:
      "Newarthill's tight residential streets between Bellshill and Motherwell keep us busy with furniture uplifts and renovation waste. It's on the M74 corridor, so we're often here the same day the call comes in.",
    landmarks: ["Newarthill Primary", "Motherwell Road", "Newarthill Cross"],
    services: CORE_SERVICES,
  },
  {
    slug: "carfin",
    name: "Carfin",
    postcodes: ["ML1"],
    council: "North Lanarkshire",
    travelMinutes: 20,
    localHook:
      "Carfin's a compact village with a mix of older terracing and family homes. Clearances during estate sales and renovations are the most common jobs. The Grotto draws visitors from across Scotland, which keeps the area well known.",
    landmarks: ["Carfin Grotto", "Carfin Station", "Newarthill Road"],
    services: CORE_SERVICES,
  },
  {
    slug: "holytown",
    name: "Holytown",
    postcodes: ["ML1"],
    council: "North Lanarkshire",
    travelMinutes: 18,
    localHook:
      "Holytown sits between Bellshill and Motherwell with a good stock of family homes and older terraces: furniture uplifts, end-of-tenancy clearances, and renovation waste are all regular runs through here.",
    landmarks: ["Holytown Church", "Mossend Industrial Estate", "North Road"],
    services: CORE_SERVICES,
  },
  {
    slug: "cleland",
    name: "Cleland",
    postcodes: ["ML1"],
    council: "North Lanarkshire",
    travelMinutes: 24,
    localHook:
      "Cleland's a quiet village outside Wishaw with a mix of estate housing and older semis. We cover it as part of our Motherwell and Wishaw runs. Garden waste and house clearances are the most common jobs out this way.",
    landmarks: ["Cleland Hospital", "Omoa Road", "Cleland Station"],
    services: CORE_SERVICES,
  },
  {
    slug: "overtown",
    name: "Overtown",
    postcodes: ["ML2"],
    council: "South Lanarkshire",
    travelMinutes: 24,
    localHook:
      "Overtown sits between Wishaw and Larkhall. A village of older housing stock where renovation jobs and clearances during property sales are the bread and butter. Easy to batch with Wishaw or Larkhall runs.",
    landmarks: ["Overtown Village", "Clyde Valley", "Waterloo Road"],
    services: CORE_SERVICES,
  },
  {
    slug: "chapelhall",
    name: "Chapelhall",
    postcodes: ["ML6"],
    council: "North Lanarkshire",
    travelMinutes: 25,
    localHook:
      "Chapelhall sits between Airdrie and Shotts, a growing village with newer housing estates alongside older properties. We cover it on Airdrie and Coatbridge runs. Garden waste and bulky-item uplifts come up regularly.",
    landmarks: ["Chapelhall Village", "Calder Road", "Chapelhall Primary"],
    services: CORE_SERVICES,
  },

  // ── COMMUTER BELT ──────────────────────────────────────────────────────────
  {
    slug: "paisley",
    name: "Paisley",
    postcodes: ["PA1", "PA2", "PA3"],
    council: "Renfrewshire",
    travelMinutes: 30,
    localHook:
      "Paisley's a stretch from base but worth the trip for the volume: town-centre tenement clearances, family-housing areas like Foxbar and Glenburn, and commercial waste from the trade estates near the airport.",
    landmarks: ["Paisley Abbey", "Paisley Cross", "St Mirren Park"],
    services: CORE_SERVICES,
  },
  {
    slug: "clydebank",
    name: "Clydebank",
    postcodes: ["G81"],
    council: "West Dunbartonshire",
    travelMinutes: 32,
    localHook:
      "Clydebank jobs usually go in alongside other west-Glasgow runs to keep things efficient. The town's mix of older housing and newer developments at Queens Quay covers a full range: clearances, garden waste, and the occasional commercial fit-out.",
    landmarks: ["Clydebank Town Hall", "Queens Quay", "Dalmuir Park"],
    services: CORE_SERVICES,
  },
  {
    slug: "bishopbriggs",
    name: "Bishopbriggs",
    postcodes: ["G64"],
    council: "East Dunbartonshire",
    travelMinutes: 28,
    localHook:
      "Bishopbriggs is mostly family-home work: clearances during moves, garden waste from larger plots, and the occasional full downsize. The town's straightforward layout makes jobs here efficient.",
    landmarks: ["Bishopbriggs Cross", "Springfield Park", "Bishopbriggs Library"],
    services: CORE_SERVICES,
  },
  {
    slug: "kirkintilloch",
    name: "Kirkintilloch",
    postcodes: ["G66"],
    council: "East Dunbartonshire",
    travelMinutes: 30,
    localHook:
      "Kirkintilloch's older canal-side properties and the modern estates around Lenzie give us a varied job mix. Larger gardens here mean green-waste loads are common, particularly in spring and autumn.",
    landmarks: ["Kirkintilloch Cross", "Forth & Clyde Canal", "Lenzie"],
    services: CORE_SERVICES,
  },
  {
    slug: "cumbernauld",
    name: "Cumbernauld",
    postcodes: ["G67", "G68"],
    council: "North Lanarkshire",
    travelMinutes: 28,
    localHook:
      "Cumbernauld's a spread-out town. We cover the older housing in Kildrum and Seafar as well as the newer estates further out. Industrial-estate trade waste is a regular run.",
    landmarks: ["Cumbernauld Town Centre", "Palacerigg Country Park", "Kildrum"],
    services: COMMERCIAL,
  },
  {
    slug: "carluke",
    name: "Carluke",
    postcodes: ["ML8"],
    council: "South Lanarkshire",
    travelMinutes: 28,
    localHook:
      "Carluke's at the outer edge of our regular run. We batch jobs here with other south-Lanarkshire work to keep travel reasonable. Older stone-built properties with substantial gardens mean larger loads when we do come out.",
    landmarks: ["Carluke Cross", "High Mill", "Castlehill"],
    services: CORE_SERVICES,
  },
  {
    slug: "lanark",
    name: "Lanark",
    postcodes: ["ML11"],
    council: "South Lanarkshire",
    travelMinutes: 32,
    localHook:
      "Lanark is the furthest regular run we make: historic town-centre properties, substantial outlying plots, and the occasional larger landscape clearance. Worth doing as a planned trip rather than a same-day callout.",
    landmarks: ["Lanark Loch", "New Lanark World Heritage Site", "Lanark Racecourse"],
    services: CORE_SERVICES,
  },
];

// ── COMBO HELPERS ────────────────────────────────────────────────────────────
// These build the full list of `/[slug]` pages and parse incoming slugs.

export interface SlugCombo {
  slug: string;        // "waste-removal-blantyre"
  area: Area;
  service: ServicePrefix;
}

// ── COMBO TIER SYSTEM ────────────────────────────────────────────────────────
// Determines which (service × area) combinations get their own combo page.
// The legacy `services` field on each Area is now ignored. This function is
// the single source of truth.
//
// Counts:
//   Core (≤15 min):     8 areas × 8 services = 64 combo pages
//   Extended (16-22):  19 areas × 3 services = 57 combo pages
//   Outer    (>22):    15 areas × 1 service  = 15 combo pages
//   Total: 136 combo pages
//
// Combined with 42 area landing pages + 13 service hub pages, that's ~194
// indexable pages: well above the 150 target, with each one substantively
// unique enough that Google should index it.

const EXTENDED_SERVICES = ["rubbish-removal", "waste-removal", "house-clearance"];
const OUTER_SERVICES = ["rubbish-removal"];

export function getCombosForArea(area: Area): string[] {
  if (area.travelMinutes <= 15) {
    // Core: all 8 services
    return servicePrefixes.map((s) => s.prefix);
  }
  if (area.travelMinutes <= 22) {
    return EXTENDED_SERVICES;
  }
  return OUTER_SERVICES;
}

/**
 * Used by the [slug] route to decide whether to serve a combo page or
 * redirect it to the area landing page. Old URLs that we used to generate
 * but no longer do will return false here.
 */
export function isComboInCurrentTier(area: Area, servicePrefix: string): boolean {
  return getCombosForArea(area).includes(servicePrefix);
}

/**
 * Every valid (service, area) combination as a flat slug.
 * This is what generateStaticParams uses to pre-render all SEO pages.
 * Uses the tier system above. Does NOT use the legacy area.services field.
 */
export function getAllSlugCombos(): SlugCombo[] {
  const combos: SlugCombo[] = [];
  for (const area of areas) {
    for (const servicePrefix of getCombosForArea(area)) {
      const service = servicePrefixes.find((s) => s.prefix === servicePrefix);
      if (!service) continue;
      combos.push({
        slug: `${service.prefix}-${area.slug}`,
        area,
        service,
      });
    }
  }
  return combos;
}

/**
 * Parse an incoming slug like "house-clearance-east-kilbride" back into its
 * service + area. Returns null if no match. We try every service prefix
 * against the start of the slug. Longest match wins so "rubbish-removal-"
 * isn't shadowed by "removal-".
 *
 * NOTE: This returns a combo even if it's NOT in the current tier, so old
 * indexed URLs can still be identified and redirected. The [slug] page
 * checks isComboInCurrentTier() to decide between rendering and redirecting.
 */
export function parseSlug(slug: string): SlugCombo | null {
  return parseSlugWithAreas(slug, areas);
}

/**
 * Like parseSlug but works against any Area array. Use this in pages that
 * merge static areas with DB-added custom areas.
 */
export function parseSlugWithAreas(slug: string, allAreas: Area[]): SlugCombo | null {
  const sortedPrefixes = [...servicePrefixes].sort(
    (a, b) => b.prefix.length - a.prefix.length,
  );
  for (const service of sortedPrefixes) {
    const prefix = `${service.prefix}-`;
    if (slug.startsWith(prefix)) {
      const areaSlug = slug.slice(prefix.length);
      const area = allAreas.find((a) => a.slug === areaSlug);
      if (area) {
        return { slug, area, service };
      }
    }
  }
  return null;
}
