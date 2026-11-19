import http from 'k6/http';
import { check, sleep } from 'k6';
import { getEnvironment } from '../../config/environments.js';
import { getWorkloadProfile } from '../../config/workload-profiles.js';

const environment = getEnvironment();
const workload = getWorkloadProfile('stress');

export const options = {
  ...workload,

  thresholds: {
    http_req_failed: ['rate<0.01'],
    http_req_duration: ['p(95)<200'],
    checks: ['rate>0.99'],
  },
};

export default function () {
  const response = http.get(`${environment.baseUrl}/api/items`);

  check(response, {
    'status is 200': (res) => res.status === 200,
    'response contains items': (res) => {
      const body = res.json();
      return Array.isArray(body.items) && body.items.length > 0;
    },
  });

  sleep(1);
}
