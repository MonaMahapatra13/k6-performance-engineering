# Checks, Assertions and Smoke Testing in k6

## 1. Introduction

Performance testing is not just about generating traffic and measuring response times. A performance test must also validate that the application behaves correctly under the generated workload.

In k6, checks and thresholds help validate functional correctness and performance expectations.

This guide covers:
- HTTP response validation.
- Checks and thresholds.
- Positive and negative test scenarios.
- Custom metrics.
- Smoke testing.
- Failure analysis and debugging.

## 2. Understanding Checks in k6

A check validates whether a specific condition is true during test execution.

Checks are similar to assertions in traditional automation frameworks.

For example, when testing an API, we may want to verify:
- HTTP status code is 200.
- Response body is not empty.
- A required field exists.
- Response data has the expected value.
- Response time is within an acceptable limit.

### Example: Basic HTTP check

    import http from 'k6/http';
    import { check } from 'k6';

    export default function () {
      const response = http.get('http://127.0.0.1:3000/health');

      check(response, {
        'status is 200': (res) => res.status === 200,
        'response body is present': (res) => res.body.length > 0,
      });
    }

The check function evaluates each condition and records whether it passed or failed.

## 3. Checks vs Thresholds

Checks and thresholds serve different purposes.

| Checks | Thresholds |
|---|---|
| Validate individual conditions | Define overall pass/fail criteria |
| Evaluate response correctness | Evaluate aggregated metrics |
| Record pass/fail results | Can fail the complete test |
| Useful for functional validation | Useful for performance SLAs and CI/CD gates |

A check failure does not automatically make the k6 test process exit with a non-zero status.

A threshold breach can cause the test to exit with a non-zero status.

### Example: Combining checks and thresholds

    import http from 'k6/http';
    import { check } from 'k6';

    export const options = {
      vus: 5,
      duration: '30s',

      thresholds: {
        checks: ['rate>0.99'],
        http_req_duration: ['p(95)<200'],
        http_req_failed: ['rate<0.01'],
      },
    };

    export default function () {
      const response = http.get('http://127.0.0.1:3000/health');

      check(response, {
        'status is successful': (res) => res.status === 200,
      });
    }

## 4. Validating API Responses

A strong API performance test should validate more than the HTTP status code.

Consider an API returning:

    {
      "status": "healthy"
    }

We can validate the response structure and content.

### Example: Response body validation

    import http from 'k6/http';
    import { check } from 'k6';

    export default function () {
      const response = http.get('http://127.0.0.1:3000/health');

      const body = response.json();

      check(response, {
        'status code is 200': (res) => res.status === 200,
        'content type is JSON': (res) =>
          res.headers['Content-Type'].includes('application/json'),
        'health status is correct': () => body.status === 'healthy',
      });
    }

Response validation helps identify cases where an API returns a successful HTTP status but incorrect business data.

## 5. Positive and Negative Test Scenarios

### Positive testing

Positive testing verifies that valid requests produce expected responses.

Examples:
- Valid authentication credentials.
- Existing resource identifiers.
- Correct request payloads.
- Successful GET and POST requests.

### Negative testing

Negative testing verifies how the application handles invalid requests.

Examples:
- Missing required parameters.
- Invalid identifiers.
- Malformed JSON.
- Unauthorized requests.
- Unsupported HTTP methods.

### Example: Negative API validation

    import http from 'k6/http';
    import { check } from 'k6';

    export default function () {
      const response = http.get(
        'http://127.0.0.1:3000/invalid-endpoint'
      );

      check(response, {
        'invalid endpoint returns 404': (res) => res.status === 404,
      });
    }

Negative scenarios are important because an application must handle errors correctly under load as well.

## 6. Custom Metrics in k6

k6 provides built-in metrics, but custom metrics allow engineers to measure business-specific or application-specific behaviour.

Common custom metric types:

| Metric type | Purpose |
|---|---|
| Counter | Tracks cumulative values |
| Gauge | Tracks the latest recorded value |
| Rate | Tracks the percentage of successful events |
| Trend | Tracks a distribution of recorded values |

### Example: Custom metrics

    import http from 'k6/http';
    import { check } from 'k6';
    import { Counter, Rate, Trend } from 'k6/metrics';

    const successfulRequests = new Counter('successful_requests');
    const successRate = new Rate('api_success_rate');
    const responseTime = new Trend('api_response_time');

    export default function () {
      const response = http.get('http://127.0.0.1:3000/health');

      const passed = check(response, {
        'status is 200': (res) => res.status === 200,
      });

      successRate.add(passed);
      responseTime.add(response.timings.duration);

      if (passed) {
        successfulRequests.add(1);
      }
    }

Custom metrics can help monitor business operations, transaction outcomes and application-specific performance.

## 7. What Is Smoke Testing?

Smoke testing is a preliminary test that verifies whether the critical functionality of an application is working.

In performance engineering, a smoke test is generally executed with a very small workload before running larger tests.

Its objectives include:
- Confirming application availability.
- Validating critical API endpoints.
- Checking basic response correctness.
- Detecting obvious failures early.
- Ensuring the test environment is ready.

A smoke test is not designed to determine the maximum capacity of an application.

## 8. Designing a Smoke Test

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

## 9. Smoke Testing vs Load Testing

| Smoke testing | Load testing |
|---|---|
| Validates basic application health | Evaluates behaviour under expected workload |
| Uses minimal virtual users | Uses a larger workload |
| Short execution duration | Longer execution duration |
| Detects basic failures | Identifies performance limitations |
| Usually runs before larger tests | Runs after basic validation |

Smoke testing should generally be performed before load, stress, spike or soak testing.

## 10. Analysing Failed Checks

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

## 11. Practical Application in This Portfolio

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

## 12. Best Practices

- Validate response content, not just status codes.
- Keep checks meaningful and specific.
- Use thresholds for measurable performance requirements.
- Avoid unrealistic performance thresholds without a baseline.
- Run smoke tests before larger workloads.
- Use controlled test data.
- Separate functional failures from performance failures.
- Capture execution reports for comparison.
- Never generate uncontrolled traffic against public services.

## 13. Interview Questions

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
