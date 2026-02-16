// Script to populate Firebase with dummy data
import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc, Timestamp } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDcPVoBA1AGJZih9KYfi6OAcwRFuisQudc",
  authDomain: "hawkeye-cb7ea.firebaseapp.com",
  projectId: "hawkeye-cb7ea",
  storageBucket: "hawkeye-cb7ea.firebasestorage.app",
  messagingSenderId: "781787360581",
  appId: "1:781787360581:web:09f73fe9691c3137fae22c",
  measurementId: "G-V00X8QYQ92"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Helper to add documents
const addDocuments = async (collectionName, documents) => {
  const refs = [];
  for (const doc of documents) {
    const ref = await addDoc(collection(db, collectionName), doc);
    refs.push({ id: ref.id, ...doc });
    console.log(`Added ${collectionName}: ${doc.name || doc.title || doc.id}`);
  }
  return refs;
};

const populateData = async () => {
  console.log("🚀 Starting Firebase population...\n");

  // 1. Election Cycles
  console.log("1. Adding Election Cycles...");
  const cycles = await addDocuments("electionCycles", [
    { name: "2013-2017", start_year: 2013, end_year: 2017, is_current: false },
    { name: "2017-2022", start_year: 2017, end_year: 2022, is_current: false },
    { name: "2022-Present", start_year: 2022, end_year: 2027, is_current: true },
  ]);

  // 2. Sub-Counties
  console.log("\n2. Adding Sub-Counties...");
  const subCounties = await addDocuments("subCounties", [
    { name: "Wajir North", code: "025" },
    { name: "Wajir East", code: "026" },
    { name: "Wajir South", code: "027" },
    { name: "Wajir West", code: "028" },
    { name: "Tarbaj", code: "029" },
    { name: "Eldas", code: "030" },
  ]);

  // 3. Wards
  console.log("\n3. Adding Wards...");
  const wards = [];
  const wardData = [
    { subCounty: "Wajir North", wards: ["Griftu", "Habaswein", "Sarba", "Hadado"] },
    { subCounty: "Wajir East", wards: ["Wajir North", "Wajir West", "Eldas", "Tarbaj"] },
    { subCounty: "Wajir South", wards: ["Buna", "Dabas", "Ganyure", "Wagalla"] },
    { subCounty: "Wajir West", wards: ["Bute", "Korondile", "Lafey", "Wajir Bor"] },
    { subCounty: "Tarbaj", wards: ["Arbajahan", "Elben", "Sarman", "Tarbaj"] },
    { subCounty: "Eldas", wards: ["Dekaharia", "Eldas", "Elwak North", "Elwak South"] },
  ];

  for (const { subCounty, wards: wardNames } of wardData) {
    const subCountyRef = subCounties.find((sc) => sc.name === subCounty);
    if (subCountyRef) {
      for (const wardName of wardNames) {
        const wardRef = await addDoc(collection(db, "wards"), {
          name: wardName,
          sub_county_id: subCountyRef.id,
          sub_county_name: subCounty,
          population: Math.floor(Math.random() * 50000) + 10000,
          latitude: 1.7 + Math.random() * 0.3,
          longitude: 40.0 + Math.random() * 0.5,
        });
        wards.push({ id: wardRef.id, name: wardName, sub_county_id: subCountyRef.id });
      }
    }
  }

  // 4. Sectors
  console.log("\n4. Adding Sectors...");
  const sectors = await addDocuments("sectors", [
    { name: "Health", description: "Healthcare services and infrastructure", icon: "health" },
    { name: "Education", description: "Schools and educational facilities", icon: "education" },
    { name: "Water", description: "Water supply and sanitation", icon: "water" },
    { name: "Roads", description: "Road infrastructure and maintenance", icon: "roads" },
    { name: "Agriculture", description: "Agricultural development programs", icon: "agriculture" },
    { name: "Energy", description: "Energy and power infrastructure", icon: "energy" },
  ]);

  // 5. Fund Sources
  console.log("\n5. Adding Fund Sources...");
  const fundSources = await addDocuments("fundSources", [
    { name: "County Government", fund_type: "county", description: "County government budget" },
    { name: "NG-CDF", fund_type: "ngcdf", description: "National Government Constituency Development Fund" },
    { name: "KURA", fund_type: "kura", description: "Kenya Urban Roads Authority" },
    { name: "KeRRA", fund_type: "kerra", description: "Kenya Rural Roads Authority" },
    { name: "National Government", fund_type: "national", description: "National government funding" },
    { name: "Donor Funded", fund_type: "donor", description: "International donor funding" },
  ]);

  // 6. Governors
  console.log("\n6. Adding Governors...");
  const governors = [];
  for (let i = 0; i < cycles.length; i++) {
    const cycle = cycles[i];
    const govRef = await addDoc(collection(db, "governors"), {
      name: `Governor ${cycle.name.split('-')[0]}`,
      photo_url: "",
      party: i % 2 === 0 ? "Jubilee" : "ODM",
      election_cycle_id: cycle.id,
      election_cycle_name: cycle.name,
      election_cycle_start_year: cycle.start_year,
      votes_received: Math.floor(Math.random() * 100000) + 50000,
      manifesto_summary: "Focus on development, healthcare, and education",
    });
    governors.push({ id: govRef.id, election_cycle_id: cycle.id });
  }

  // 7. MPs
  console.log("\n7. Adding MPs...");
  const mps = [];
  const currentCycle = cycles.find((c) => c.is_current);
  for (const subCounty of subCounties) {
    const mpRef = await addDoc(collection(db, "mps"), {
      name: `Hon. ${subCounty.name} MP`,
      photo_url: "",
      party: Math.random() > 0.5 ? "Jubilee" : "ODM",
      sub_county_id: subCounty.id,
      sub_county_name: subCounty.name,
      election_cycle_id: currentCycle.id,
      election_cycle_name: currentCycle.name,
      votes_received: Math.floor(Math.random() * 50000) + 20000,
      is_current: true,
    });
    mps.push({ id: mpRef.id, sub_county_id: subCounty.id });
  }

  // 8. Budgets
  console.log("\n8. Adding Budgets...");
  const financialYears = ["2020/2021", "2021/2022", "2022/2023", "2023/2024"];
  for (const year of financialYears) {
    for (let i = 0; i < 20; i++) {
      const ward = wards[Math.floor(Math.random() * wards.length)];
      const sector = sectors[Math.floor(Math.random() * sectors.length)];
      const fundSource = fundSources[Math.floor(Math.random() * fundSources.length)];
      const cycle = cycles[Math.floor(Math.random() * cycles.length)];

      const allocated = Math.random() * 50000000 + 10000000;
      const spent = allocated * (0.6 + Math.random() * 0.3);

      await addDoc(collection(db, "budgets"), {
        financial_year: year,
        election_cycle_id: cycle.id,
        election_cycle_name: cycle.name,
        ward_id: ward.id,
        ward_name: ward.name,
        sub_county_id: ward.sub_county_id,
        sector_id: sector.id,
        sector_name: sector.name,
        fund_source_id: fundSource.id,
        fund_source_name: fundSource.name,
        allocated_amount: allocated,
        disbursed_amount: allocated * 0.9,
        spent_amount: spent,
      });
    }
  }

  // 9. Projects
  console.log("\n9. Adding Projects...");
  const projectNames = [
    "Wajir Hospital Expansion",
    "Primary School Construction",
    "Water Well Drilling Project",
    "Road Tarmacking Initiative",
    "Agricultural Training Center",
    "Solar Power Installation",
    "Market Construction",
    "Dispensary Upgrade",
  ];

  const statuses = ["planned", "ongoing", "completed", "stalled"];
  const projects = [];

  for (let i = 0; i < 50; i++) {
    const ward = wards[Math.floor(Math.random() * wards.length)];
    const sector = sectors[Math.floor(Math.random() * sectors.length)];
    const fundSource = fundSources[Math.floor(Math.random() * fundSources.length)];
    const cycle = cycles[Math.floor(Math.random() * cycles.length)];
    const status = statuses[Math.floor(Math.random() * statuses.length)];

    const contractAmount = Math.random() * 100000000 + 5000000;
    const amountPaid = contractAmount * (status === "completed" ? 0.95 : Math.random() * 0.7);

    const projectRef = await addDoc(collection(db, "projects"), {
      name: `${projectNames[i % projectNames.length]} - ${ward.name}`,
      description: `Development project in ${ward.name} focusing on ${sector.name.toLowerCase()}`,
      sector_id: sector.id,
      sector_name: sector.name,
      ward_id: ward.id,
      ward_name: ward.name,
      sub_county_id: ward.sub_county_id,
      fund_source_id: fundSource.id,
      fund_source_name: fundSource.name,
      election_cycle_id: cycle.id,
      election_cycle_name: cycle.name,
      contractor: `Contractor ${i + 1} Ltd`,
      contract_amount: contractAmount,
      amount_paid: amountPaid,
      status,
      start_date: Timestamp.fromDate(new Date(2022 + Math.floor(Math.random() * 2), Math.floor(Math.random() * 12), 1)),
      expected_completion: Timestamp.fromDate(new Date(2024 + Math.floor(Math.random() * 2), Math.floor(Math.random() * 12), 1)),
      actual_completion: status === "completed" ? Timestamp.fromDate(new Date(2023 + Math.floor(Math.random() * 2), Math.floor(Math.random() * 12), 1)) : null,
      completion_percentage: status === "completed" ? 100 : Math.floor(Math.random() * 80),
      beneficiaries_count: Math.floor(Math.random() * 10000) + 1000,
      latitude: 1.7 + Math.random() * 0.3,
      longitude: 40.0 + Math.random() * 0.5,
      created_at: Timestamp.now(),
      updated_at: Timestamp.now(),
    });
    projects.push({ id: projectRef.id, ward_id: ward.id });
  }

  // 10. Mega Dams
  console.log("\n10. Adding Mega Dams...");
  const damNames = ["Bute Dam", "Korondile Dam", "Lafey Dam", "Wajir Bor Dam"];
  for (let i = 0; i < 4; i++) {
    const project = projects[Math.floor(Math.random() * projects.length)];
    await addDoc(collection(db, "megaDams"), {
      project_id: project.id,
      dam_name: damNames[i],
      capacity_litres: Math.floor(Math.random() * 50000000) + 10000000,
      water_catchment_area: `${Math.floor(Math.random() * 50) + 10} km²`,
      communities_served: `${Math.floor(Math.random() * 10) + 5} communities`,
      current_water_level_pct: Math.floor(Math.random() * 100),
      is_functional: Math.random() > 0.3,
      last_inspection_date: Timestamp.fromDate(new Date(2024, Math.floor(Math.random() * 12), 1)),
    });
  }

  // 11. Expenditures
  console.log("\n11. Adding Expenditures...");
  for (let i = 0; i < 100; i++) {
    const project = projects[Math.floor(Math.random() * projects.length)];
    const amount = Math.random() * 5000000 + 100000;
    const requiresReview = amount >= 1000000;

    await addDoc(collection(db, "expenditures"), {
      project_id: project.id,
      description: `Payment for ${project.name} - Phase ${i + 1}`,
      amount,
      date: Timestamp.fromDate(new Date(2023, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1)),
      payee: `Vendor ${i + 1}`,
      payment_reference: `REF-${Date.now()}-${i}`,
      ward_id: project.ward_id,
      requires_citizen_review: requiresReview,
      created_at: Timestamp.now(),
    });
  }

  // 12. MP Activities
  console.log("\n12. Adding MP Activities...");
  const activityTypes = ["constituency_visit", "wedding_attended", "parliament_session", "fundraiser", "public_event"];
  for (const mp of mps) {
    for (let i = 0; i < 10; i++) {
      await addDoc(collection(db, "mpActivities"), {
        mp_id: mp.id,
        activity_type: activityTypes[Math.floor(Math.random() * activityTypes.length)],
        title: `Activity ${i + 1} for ${mp.sub_county_id}`,
        description: `Description of activity ${i + 1}`,
        date: Timestamp.fromDate(new Date(2023, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1)),
        location: `Location ${i + 1}`,
        source_url: "",
      });
    }
  }

  // 13. Governor Metrics
  console.log("\n13. Adding Governor Metrics...");
  for (const gov of governors) {
    const metrics = [
      { name: "Total Budget Allocated", value: Math.random() * 5000000000 + 1000000000, unit: "KES" },
      { name: "Projects Completed", value: Math.floor(Math.random() * 100) + 50, unit: "projects" },
      { name: "Roads Constructed", value: Math.floor(Math.random() * 500) + 100, unit: "km" },
    ];
    for (const metric of metrics) {
      await addDoc(collection(db, "governorMetrics"), {
        governor_id: gov.id,
        governor_name: `Governor ${gov.election_cycle_id}`,
        metric_name: metric.name,
        value: metric.value,
        unit: metric.unit,
        year: 2023,
      });
    }
  }

  // 14. Reviews
  console.log("\n14. Adding Reviews...");
  for (let i = 0; i < 30; i++) {
    const project = projects[Math.floor(Math.random() * projects.length)];
    await addDoc(collection(db, "reviews"), {
      project_id: project.id,
      author_name: `Citizen ${i + 1}`,
      ward_id: project.ward_id,
      rating: Math.floor(Math.random() * 5) + 1,
      comment: `Review comment ${i + 1} about the project`,
      is_verified: Math.random() > 0.5,
      created_at: Timestamp.now(),
      updated_at: Timestamp.now(),
    });
  }

  // 15. Impact Reports
  console.log("\n15. Adding Impact Reports...");
  for (let i = 0; i < 20; i++) {
    const project = projects[Math.floor(Math.random() * projects.length)];
    await addDoc(collection(db, "impactReports"), {
      project_id: project.id,
      reporter_name: `Reporter ${i + 1}`,
      ward_id: project.ward_id,
      impact_description: `Impact description ${i + 1}`,
      before_situation: `Before situation ${i + 1}`,
      after_situation: `After situation ${i + 1}`,
      people_affected: Math.floor(Math.random() * 5000) + 100,
      is_positive: Math.random() > 0.2,
      photo_url: "",
      created_at: Timestamp.now(),
    });
  }

  console.log("\n✅ Firebase population completed successfully!");
  console.log(`\nSummary:`);
  console.log(`- Election Cycles: ${cycles.length}`);
  console.log(`- Sub-Counties: ${subCounties.length}`);
  console.log(`- Wards: ${wards.length}`);
  console.log(`- Sectors: ${sectors.length}`);
  console.log(`- Fund Sources: ${fundSources.length}`);
  console.log(`- Governors: ${governors.length}`);
  console.log(`- MPs: ${mps.length}`);
  console.log(`- Projects: ${projects.length}`);
  console.log(`- Budgets: ${financialYears.length * 20}`);
  console.log(`- Mega Dams: 4`);
  console.log(`- Expenditures: 100`);
  console.log(`- MP Activities: ${mps.length * 10}`);
  console.log(`- Reviews: 30`);
  console.log(`- Impact Reports: 20`);
};

populateData()
  .then(() => {
    console.log("\n🎉 All done! Your Firebase database is now populated.");
    process.exit(0);
  })
  .catch((error) => {
    console.error("❌ Error populating Firebase:", error);
    process.exit(1);
  });

