export const workloadProfiles = {
  smoke: {
    vus: 1,
    duration: '30s',
  },

  load: {
    stages: [
      { duration: '2m', target: 10 },
      { duration: '5m', target: 10 },
      { duration: '2m', target: 0 },
    ],
  },

  stress: {
    stages: [
      { duration: '2m', target: 20 },
      { duration: '3m', target: 50 },
      { duration: '3m', target: 100 },
      { duration: '2m', target: 0 },
    ],
  },

  spike: {
    stages: [
      { duration: '10s', target: 5 },
      { duration: '10s', target: 100 },
      { duration: '30s', target: 100 },
      { duration: '10s', target: 0 },
    ],
  },

  soak: {
    stages: [
      { duration: '2m', target: 10 },
      { duration: '30m', target: 10 },
      { duration: '2m', target: 0 },
    ],
  },
};

export function getWorkloadProfile(profileName) {
  const profile = workloadProfiles[profileName];

  if (!profile) {
    throw new Error(`Unknown workload profile: ${profileName}`);
  }

  return profile;
}
