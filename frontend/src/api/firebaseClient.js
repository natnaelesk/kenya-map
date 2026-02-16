import {
  collection,
  getDocs,
  getDoc,
  doc,
  query,
  where,
  orderBy,
  addDoc,
  Timestamp,
} from "firebase/firestore";
import { db } from "../firebase/config";

// Helper to convert Firestore data to plain objects
const convertFirestoreData = (doc) => {
  const data = doc.data();
  return {
    id: doc.id,
    ...data,
    // Convert Firestore Timestamps to ISO strings
    created_at: data.created_at?.toDate?.()?.toISOString() || data.created_at,
    updated_at: data.updated_at?.toDate?.()?.toISOString() || data.updated_at,
    start_date: data.start_date?.toDate?.()?.toISOString()?.split('T')[0] || data.start_date,
    expected_completion: data.expected_completion?.toDate?.()?.toISOString()?.split('T')[0] || data.expected_completion,
    actual_completion: data.actual_completion?.toDate?.()?.toISOString()?.split('T')[0] || data.actual_completion,
    date: data.date?.toDate?.()?.toISOString()?.split('T')[0] || data.date,
    last_inspection_date: data.last_inspection_date?.toDate?.()?.toISOString()?.split('T')[0] || data.last_inspection_date,
  };
};

// Core Collections
export const fetchElectionCycles = async () => {
  const q = query(collection(db, "electionCycles"), orderBy("start_year"));
  const snapshot = await getDocs(q);
  return { data: snapshot.docs.map(convertFirestoreData) };
};

export const fetchSectors = async () => {
  const q = query(collection(db, "sectors"), orderBy("name"));
  const snapshot = await getDocs(q);
  return { data: snapshot.docs.map(convertFirestoreData) };
};

export const fetchSubCounties = async () => {
  const q = query(collection(db, "subCounties"), orderBy("name"));
  const snapshot = await getDocs(q);
  const docs = await Promise.all(
    snapshot.docs.map(async (doc) => {
      const data = convertFirestoreData(doc);
      // Fetch wards for each sub-county
      const wardsQuery = query(
        collection(db, "wards"),
        where("sub_county_id", "==", doc.id)
      );
      const wardsSnapshot = await getDocs(wardsQuery);
      data.wards = wardsSnapshot.docs.map(convertFirestoreData);
      return data;
    })
  );
  return { data: docs };
};

export const fetchWards = async (subCountyId) => {
  let q = query(collection(db, "wards"), orderBy("name"));
  if (subCountyId) {
    q = query(
      collection(db, "wards"),
      where("sub_county_id", "==", subCountyId),
      orderBy("name")
    );
  }
  const snapshot = await getDocs(q);
  return { data: snapshot.docs.map(convertFirestoreData) };
};

// Dashboard
export const fetchDashboard = async () => {
  // Fetch all budgets and projects to calculate stats
  const [budgetsSnapshot, projectsSnapshot, expendituresSnapshot, wardsSnapshot, subCountiesSnapshot] = await Promise.all([
    getDocs(collection(db, "budgets")),
    getDocs(collection(db, "projects")),
    getDocs(query(collection(db, "expenditures"), where("requires_citizen_review", "==", true))),
    getDocs(collection(db, "wards")),
    getDocs(collection(db, "subCounties")),
  ]);

  const budgets = budgetsSnapshot.docs.map(convertFirestoreData);
  const projects = projectsSnapshot.docs.map(convertFirestoreData);
  const expenditures = expendituresSnapshot.docs.map(convertFirestoreData);

  const total_budget = budgets.reduce((sum, b) => sum + parseFloat(b.allocated_amount || 0), 0);
  const total_spent = budgets.reduce((sum, b) => sum + parseFloat(b.spent_amount || 0), 0);
  const project_count = projects.length;
  const completed = projects.filter((p) => p.status === "completed").length;
  const flagged = expenditures.length;

  return {
    data: {
      total_budget,
      total_spent,
      project_count,
      completed_projects: completed,
      flagged_expenditures: flagged,
      wards: wardsSnapshot.size,
      sub_counties: subCountiesSnapshot.size,
    },
  };
};

// Funds
export const fetchBudgets = async (params = {}) => {
  let q = query(collection(db, "budgets"), orderBy("financial_year", "desc"));
  
  if (params.election_cycle) {
    q = query(q, where("election_cycle_id", "==", params.election_cycle));
  }
  if (params.sector) {
    q = query(q, where("sector_id", "==", params.sector));
  }
  if (params.ward) {
    q = query(q, where("ward_id", "==", params.ward));
  }

  const snapshot = await getDocs(q);
  return { data: { results: snapshot.docs.map(convertFirestoreData) } };
};

export const fetchProjects = async (params = {}) => {
  let q = query(collection(db, "projects"), orderBy("created_at", "desc"));
  
  if (params.status) {
    q = query(q, where("status", "==", params.status));
  }
  if (params.sector) {
    q = query(q, where("sector_id", "==", params.sector));
  }
  if (params.ward) {
    q = query(q, where("ward_id", "==", params.ward));
  }

  const snapshot = await getDocs(q);
  return { data: { results: snapshot.docs.map(convertFirestoreData) } };
};

export const fetchProject = async (id) => {
  const docRef = doc(db, "projects", id);
  const docSnap = await getDoc(docRef);
  if (!docSnap.exists()) {
    throw new Error("Project not found");
  }
  return { data: convertFirestoreData(docSnap) };
};

export const fetchExpenditures = async (params = {}) => {
  let q = query(collection(db, "expenditures"), orderBy("date", "desc"));
  
  if (params.requires_citizen_review) {
    q = query(q, where("requires_citizen_review", "==", true));
  }
  if (params.project) {
    q = query(q, where("project_id", "==", params.project));
  }

  const snapshot = await getDocs(q);
  return { data: { results: snapshot.docs.map(convertFirestoreData) } };
};

export const fetchFundSourceSummary = async () => {
  const [budgetsSnapshot, projectsSnapshot] = await Promise.all([
    getDocs(collection(db, "budgets")),
    getDocs(collection(db, "projects")),
  ]);
  const budgets = budgetsSnapshot.docs.map(convertFirestoreData);
  const projects = projectsSnapshot.docs.map(convertFirestoreData);
  
  // Group by fund source
  const summary = {};
  budgets.forEach((budget) => {
    const sourceId = budget.fund_source_id;
    if (!summary[sourceId]) {
      summary[sourceId] = {
        id: sourceId,
        fund_source_id: sourceId,
        name: budget.fund_source_name || "Unknown",
        fund_source_name: budget.fund_source_name || "Unknown",
        fund_type: budget.fund_type || "other",
        total_allocated: 0,
        total_spent: 0,
        project_count: 0,
      };
    }
    summary[sourceId].total_allocated += parseFloat(budget.allocated_amount || 0);
    summary[sourceId].total_spent += parseFloat(budget.spent_amount || 0);
  });

  // Count projects per fund source
  projects.forEach((project) => {
    const sourceId = project.fund_source_id;
    if (summary[sourceId]) {
      summary[sourceId].project_count++;
    }
  });

  return { data: Object.values(summary) };
};

export const fetchWardSpending = async () => {
  const snapshot = await getDocs(collection(db, "budgets"));
  const budgets = snapshot.docs.map(convertFirestoreData);
  
  // Group by ward
  const summary = {};
  budgets.forEach((budget) => {
    const wardId = budget.ward_id;
    if (!wardId) return;
    
    if (!summary[wardId]) {
      summary[wardId] = {
        ward_id: wardId,
        ward_name: budget.ward_name || "Unknown",
        total_allocated: 0,
        total_spent: 0,
      };
    }
    summary[wardId].total_allocated += parseFloat(budget.allocated_amount || 0);
    summary[wardId].total_spent += parseFloat(budget.spent_amount || 0);
  });

  return { data: Object.values(summary) };
};

export const fetchYearlySpending = async () => {
  const snapshot = await getDocs(collection(db, "budgets"));
  const budgets = snapshot.docs.map(convertFirestoreData);
  
  // Group by financial year
  const summary = {};
  budgets.forEach((budget) => {
    const year = budget.financial_year;
    if (!summary[year]) {
      summary[year] = {
        year,
        financial_year: year, // Support both field names
        total_allocated: 0,
        total_spent: 0,
      };
    }
    summary[year].total_allocated += parseFloat(budget.allocated_amount || 0);
    summary[year].total_spent += parseFloat(budget.spent_amount || 0);
  });

  return { data: Object.values(summary).sort((a, b) => a.year.localeCompare(b.year)) };
};

export const fetchMegaDams = async () => {
  const snapshot = await getDocs(collection(db, "megaDams"));
  return { data: snapshot.docs.map(convertFirestoreData) };
};

// Officials
export const fetchGovernors = async () => {
  const q = query(collection(db, "governors"), orderBy("election_cycle_start_year"));
  const snapshot = await getDocs(q);
  return { data: snapshot.docs.map(convertFirestoreData) };
};

export const fetchGovernorComparison = async () => {
  const snapshot = await getDocs(collection(db, "governorMetrics"));
  const metrics = snapshot.docs.map(convertFirestoreData);
  
  // Group by governor
  const comparison = {};
  metrics.forEach((metric) => {
    const govId = metric.governor_id;
    if (!comparison[govId]) {
      comparison[govId] = {
        governor_id: govId,
        governor_name: metric.governor_name || "Unknown",
        metrics: [],
      };
    }
    comparison[govId].metrics.push(metric);
  });

  return { data: Object.values(comparison) };
};

export const fetchMPs = async (params = {}) => {
  let q = query(collection(db, "mps"), orderBy("sub_county_name"));
  
  if (params.sub_county) {
    q = query(q, where("sub_county_id", "==", params.sub_county));
  }
  if (params.election_cycle) {
    q = query(q, where("election_cycle_id", "==", params.election_cycle));
  }

  const snapshot = await getDocs(q);
  return { data: { results: snapshot.docs.map(convertFirestoreData) } };
};

export const fetchMPComparison = async () => {
  const snapshot = await getDocs(collection(db, "mps"));
  const mps = snapshot.docs.map(convertFirestoreData);
  
  // Calculate comparison metrics
  return {
    data: mps.map((mp) => ({
      ...mp,
      activities_count: 0, // Will be calculated from activities
    })),
  };
};

export const fetchMPDeepDive = async (id) => {
  const [mpDoc, activitiesSnapshot] = await Promise.all([
    getDoc(doc(db, "mps", id)),
    getDocs(query(collection(db, "mpActivities"), where("mp_id", "==", id), orderBy("date", "desc"))),
  ]);

  if (!mpDoc.exists()) {
    throw new Error("MP not found");
  }

  const mpData = convertFirestoreData(mpDoc);
  mpData.activities = activitiesSnapshot.docs.map(convertFirestoreData);

  return { data: mpData };
};

export const fetchMPActivities = async (params = {}) => {
  let q = query(collection(db, "mpActivities"), orderBy("date", "desc"));
  
  if (params.mp) {
    q = query(q, where("mp_id", "==", params.mp));
  }

  const snapshot = await getDocs(q);
  return { data: { results: snapshot.docs.map(convertFirestoreData) } };
};

// Citizens
export const fetchReviews = async (params = {}) => {
  let q = query(collection(db, "reviews"), orderBy("created_at", "desc"));
  
  if (params.project) {
    q = query(q, where("project_id", "==", params.project));
  }
  if (params.expenditure) {
    q = query(q, where("expenditure_id", "==", params.expenditure));
  }

  const snapshot = await getDocs(q);
  return { data: { results: snapshot.docs.map(convertFirestoreData) } };
};

export const submitReview = async (data) => {
  const reviewData = {
    ...data,
    created_at: Timestamp.now(),
    updated_at: Timestamp.now(),
    is_verified: false,
  };
  const docRef = await addDoc(collection(db, "reviews"), reviewData);
  const docSnap = await getDoc(docRef);
  return { data: convertFirestoreData(docSnap) };
};

export const fetchImpactReports = async (params = {}) => {
  let q = query(collection(db, "impactReports"), orderBy("created_at", "desc"));
  
  if (params.project) {
    q = query(q, where("project_id", "==", params.project));
  }

  const snapshot = await getDocs(q);
  return { data: { results: snapshot.docs.map(convertFirestoreData) } };
};

export const submitImpactReport = async (data) => {
  const reportData = {
    ...data,
    created_at: Timestamp.now(),
  };
  const docRef = await addDoc(collection(db, "impactReports"), reportData);
  const docSnap = await getDoc(docRef);
  return { data: convertFirestoreData(docSnap) };
};

