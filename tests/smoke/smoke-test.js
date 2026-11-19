import http from "k6/http";
import { check, sleep } from "k6";
import { getEnvironment } from "../../config/environments.js";

const environment = getEnvironment();

export const options = {
  vus: 1,
  duration: "30s",

  thresholds: {
    http_req_failed: ["rate<0.01"],
    http_req_duration: ["p(95)<500"],
    checks: ["rate>0.99"],
  },
};

export default function () {
  const response = http.get(`${environment.baseUrl}/public/crocodiles/`);

  check(response, {
    "status is 200": (res) => res.status === 200,
    "response has a body": (res) => res.body && res.body.length > 0,
    "response time is below 1 second": (res) => res.timings.duration < 1000,
  });

  sleep(1);
}
