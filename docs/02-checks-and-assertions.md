# Checks, Assertions and API Validation in k6

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

