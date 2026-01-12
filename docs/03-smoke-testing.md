# Smoke Testing with k6

## 1. Introduction

Smoke testing validates critical application functionality and test-environment readiness before larger performance tests.

## 2. What Is Smoke Testing?

Smoke testing is a preliminary test that verifies whether the critical functionality of an application is working.

In performance engineering, a smoke test is generally executed with a very small workload before running larger tests.

Its objectives include:
- Confirming application availability.
- Validating critical API endpoints.
- Checking basic response correctness.
- Detecting obvious failures early.
- Ensuring the test environment is ready.

A smoke test is not designed to determine the maximum capacity of an application.

## 3. Designing a Smoke Test

A typical smoke test uses:
- One virtual user.
- A short execution duration.
- A small number of critical API requests.
- Basic response validation.
- Strict performance thresholds.

### Example: Smoke test

    import http from 'k6/http';
    import { check, sleep } from 'k6';

    export const options = {
      vus: 1,
      duration: '30s',

      thresholds: {
        http_req_failed: ['rate<0.01'],
        http_req_duration: ['p(95)<500'],
        checks: ['rate>0.99'],
      },
    };

    export default function () {
      const response = http.get(
        'http://127.0.0.1:3000/health'
      );

      check(response, {
        'status is 200': (res) => res.status === 200,
        'response body exists': (res) => res.body.length > 0,
      });

      sleep(1);
    }

## 4. Smoke Testing vs Load Testing

| Smoke testing | Load testing |
|---|---|
| Validates basic application health | Evaluates behaviour under expected workload |
| Uses minimal virtual users | Uses a larger workload |
| Short execution duration | Longer execution duration |
| Detects basic failures | Identifies performance limitations |
| Usually runs before larger tests | Runs after basic validation |

Smoke testing should generally be performed before load, stress, spike or soak testing.

## 5. Analysing Failed Checks

When a check fails, investigate the following:

1. HTTP status code.
2. Response body.
3. Response headers.
4. Request payload and parameters.
5. Authentication and authorization.
6. Environment configuration.
7. Application logs.
8. Network and dependency failures.

A failed check does not always indicate a performance bottleneck.

It may indicate:
- Incorrect test data.
- Invalid request construction.
- Authentication issues.
- Application defects.
- Environment instability.

Performance engineers should distinguish functional failures from performance degradation.

## 6. Practical Application in This Portfolio

The portfolio includes a smoke test at:

`tests/smoke/smoke-test.js`

The test validates:
- Successful HTTP responses.
- Non-empty response bodies.
- Response-time expectations.
- Overall check success rate.

The local Node.js mock API is used for controlled testing.

The smoke test was initially executed against the public k6 demo API. The load and stress tests documented separately were executed against the local mock API.

These executions demonstrate test implementation and validation, not production service capacity.

## 7. Best Practices

- Validate response content, not just status codes.
- Keep checks meaningful and specific.
- Use thresholds for measurable performance requirements.
- Avoid unrealistic performance thresholds without a baseline.
- Run smoke tests before larger workloads.
- Use controlled test data.
- Separate functional failures from performance failures.
- Capture execution reports for comparison.
- Never generate uncontrolled traffic against public services.

## 8. Interview Questions

1. What is the difference between a check and a threshold in k6?
2. Does a failed check automatically fail the k6 process?
3. What is the purpose of smoke testing in performance engineering?
4. Why should smoke testing happen before load testing?
5. How do you validate an API response body in k6?
6. What are the different custom metric types in k6?
7. What is the difference between a Counter and a Rate?
8. How do you investigate failed checks?
9. Can an API return HTTP 200 and still fail a functional check?
10. How would you design a smoke test for a microservices application?
11. How do you distinguish a functional failure from a performance issue?
12. Why are thresholds important in CI/CD pipelines?

## Documentation Note

This is a retrospective technical learning guide authored on 19 November 2026.

It documents checks, metrics and smoke-testing concepts. It does not claim that the documented activities were completed in February 2026.
