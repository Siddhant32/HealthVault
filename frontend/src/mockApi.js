export const DEMO_CREDENTIALS = {
  email: "demo@healthvault.local",
  password: "HealthVault123!",
};

export const DEMO_TOKEN = "healthvault-demo-session";

const USER_KEY = "healthvault-demo-user";
const PROFILE_KEY = "healthvault-demo-profile";
const RECORDS_KEY = "healthvault-demo-records";
const LINKS_KEY = "healthvault-demo-links";

const initialUser = {
  _id: "demo-user",
  id: "demo-user",
  name: "Demo User",
  email: DEMO_CREDENTIALS.email,
};

const initialProfile = {
  userId: "demo-user",
  bloodGroup: "",
  height: { value: 0, unit: "cm" },
  weight: { value: 0, unit: "kg" },
  allergies: [],
  medicalConditions: [],
  medications: [],
  emergencyContact: {},
  doctors: [],
};

const demoDoctors = [
  {
    _id: "demo-doctor-1",
    name: "Dr. Demo Sharma",
    specialty: "General Physician",
    clinicName: "Demo Health Clinic",
    address: "Demo Road, Virar West",
    city: "Virar",
    experienceYears: 5,
    consultationFee: 400,
  },
  {
    _id: "demo-doctor-2",
    name: "Dr. Demo Patel",
    specialty: "Dermatologist",
    clinicName: "Demo Skin Clinic",
    address: "Demo Market, Virar East",
    city: "Virar",
    experienceYears: 7,
    consultationFee: 600,
  },
  {
    _id: "demo-doctor-3",
    name: "Dr. Demo Mehta",
    specialty: "Cardiologist",
    clinicName: "Demo Heart Centre",
    address: "Demo Avenue, Mumbai",
    city: "Mumbai",
    experienceYears: 10,
    consultationFee: 800,
  },
];

function readStore(key, initialValue) {
  const stored = localStorage.getItem(key);
  if (stored === null) {
    localStorage.setItem(key, JSON.stringify(initialValue));
    return initialValue;
  }

  return JSON.parse(stored);
}

function writeStore(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
  return value;
}

function bodyOf(config) {
  return typeof config.data === "string"
    ? JSON.parse(config.data || "{}")
    : config.data || {};
}

function response(config, data, status = 200) {
  return {
    data,
    status,
    statusText: status === 200 ? "OK" : "Created",
    headers: {},
    config,
    request: null,
  };
}

function fail(config, status, message) {
  const error = new Error(message);
  error.config = config;
  error.response = {
    data: { message },
    status,
    statusText: status === 503 ? "Service Unavailable" : "Not Found",
    headers: {},
    config,
    request: null,
  };
  return Promise.reject(error);
}

export async function mockApiAdapter(config) {
  const url = new URL(config.url || "", config.baseURL);
  const path = url.pathname.replace(/^\/api(?=\/|$)/, "") || "/";
  const method = (config.method || "get").toUpperCase();
  const body = bodyOf(config);

  if (method === "GET" && path === "/profile") {
    return response(config, {
      user: readStore(USER_KEY, initialUser),
      profile: readStore(PROFILE_KEY, initialProfile),
    });
  }

  if (method === "PUT" && path === "/profile/user") {
    const user = writeStore(USER_KEY, {
      ...readStore(USER_KEY, initialUser),
      ...body,
    });
    return response(config, user);
  }

  if (method === "PUT" && path === "/profile") {
    const profile = writeStore(PROFILE_KEY, {
      ...readStore(PROFILE_KEY, initialProfile),
      ...body,
      userId: "demo-user",
    });
    return response(config, profile);
  }

  if (method === "GET" && path === "/records") {
    return response(config, readStore(RECORDS_KEY, []));
  }

  if (method === "POST" && path === "/records") {
    const records = readStore(RECORDS_KEY, []);
    const record = {
      ...body,
      _id: `demo-record-${Date.now()}`,
      userId: "demo-user",
      createdAt: new Date().toISOString(),
    };
    writeStore(RECORDS_KEY, [record, ...records]);
    return response(config, record, 201);
  }

  const recordMatch = path.match(/^\/records\/([^/]+)$/);
  if (method === "DELETE" && recordMatch) {
    const records = readStore(RECORDS_KEY, []).filter(
      (record) => record._id !== recordMatch[1],
    );
    writeStore(RECORDS_KEY, records);
    return response(config, { message: "Record deleted" });
  }

  if (method === "GET" && path === "/doctors") {
    const params = config.params || {};
    const search = String(params.search || "").trim().toLowerCase();
    const specialty = String(params.specialty || "").trim().toLowerCase();
    const doctors = demoDoctors.filter((doctor) => {
      const matchesSearch =
        !search ||
        [doctor.name, doctor.clinicName, doctor.address, doctor.city, doctor.specialty]
          .some((value) => value.toLowerCase().includes(search));
      const matchesSpecialty =
        !specialty || doctor.specialty.toLowerCase().includes(specialty);
      return matchesSearch && matchesSpecialty;
    });
    return response(config, { doctors });
  }

  if (method === "POST" && path === "/share/create") {
    const links = readStore(LINKS_KEY, []);
    const token = `demo-share-${Date.now()}`;
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000).toISOString();
    writeStore(LINKS_KEY, [
      { _id: token, token, expiresAt, revoked: false, accessCount: 0 },
      ...links,
    ]);
    return response(config, {
      url: `${window.location.origin}/doctor/${token}`,
      expiresAt,
    });
  }

  if (method === "GET" && path === "/share/my-links") {
    return response(config, readStore(LINKS_KEY, []));
  }

  const shareDeleteMatch = path.match(/^\/share\/([^/]+)$/);
  if (method === "DELETE" && shareDeleteMatch) {
    const links = readStore(LINKS_KEY, []).map((link) =>
      link._id === shareDeleteMatch[1] ? { ...link, revoked: true } : link,
    );
    writeStore(LINKS_KEY, links);
    return response(config, { message: "Share link revoked" });
  }

  const shareViewMatch = path.match(/^\/share\/view\/([^/]+)$/);
  if (method === "GET" && shareViewMatch) {
    const links = readStore(LINKS_KEY, []);
    const link = links.find(
      (item) =>
        item.token === shareViewMatch[1] &&
        !item.revoked &&
        new Date(item.expiresAt) > new Date(),
    );

    if (!link) {
      return fail(config, 404, "Link expired or invalid");
    }

    writeStore(
      LINKS_KEY,
      links.map((item) =>
        item._id === link._id
          ? { ...item, accessCount: item.accessCount + 1 }
          : item,
      ),
    );
    return response(config, {
      user: readStore(USER_KEY, initialUser),
      profile: readStore(PROFILE_KEY, initialProfile),
      records: readStore(RECORDS_KEY, []),
    });
  }

  if (method === "POST" && path === "/copilot") {
    return fail(config, 503, "AI Copilot is unavailable in demo mode.");
  }

  return fail(config, 404, "This endpoint is unavailable in demo mode.");
}
