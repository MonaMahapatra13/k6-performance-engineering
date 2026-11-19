# k6 Fundamentals

## 1. Introduction to k6

Grafana k6 is an open-source performance testing tool used to evaluate application performance, reliability and scalability.

It allows performance engineers to:
- Simulate concurrent virtual users.
- Generate controlled workloads.
- Measure application response times.
- Identify performance bottlenecks.
- Validate performance requirements using thresholds.

k6 test scripts are primarily written in JavaScript.

## 2. k6 Execution Lifecycle

A k6 test follows four main stages:

1. Init context – imports modules and prepares test configuration.
2. Setup – executes once before VU execution begins.
3. VU execution – runs the default function or configured scenarios.
4. Teardown – executes once after VU execution completes.

Execution flow:

Init → Setup → VU execution → Teardown

Example:

    export function setup() {
      console.log('Test setup');
    }

    export default function () {
      console.log('Executing virtual user iteration');
    }

    export function teardown() {
      console.log('Test completed');
    }

## 3. Virtual Users and Iterations

A Virtual User (VU) represents a simulated user executing a test script.

An iteration is one complete execution of the VU's default function.

For example:
- 10 VUs represent 10 concurrent virtual users.
- Each VU executes iterations independently.
- Each iteration can contain multiple HTTP requests.
- Iteration duration influences the achievable request rate.

Important distinction:

VUs represent concurrent script executors, not necessarily real human users.

## 4. Scenarios and Executors

Scenarios define how workloads are executed.

Common k6 executors:

| Executor | Purpose |
|---|---|
| constant-vus | Maintains a fixed number of VUs |
| ramping-vus | Gradually increases or decreases VUs |
| constant-arrival-rate | Maintains a fixed iteration arrival rate |
| ramping-arrival-rate | Changes iteration arrival rate over time |
| shared-iterations | Distributes a fixed number of iterations across VUs |

### Example: Constant VUs

    export const options = {
      scenarios: {
        steady_load: {
          executor: 'constant-vus',
          vus: 10,
          duration: '2m',
        },
      },
    };

### Example: Ramping VUs

    export const options = {
      stages: [
        { duration: '2m', target: 10 },
        { duration: '5m', target: 10 },
        { duration: '2m', target: 0 },
      ],
    };

Choose an executor based on whether the test models concurrent users or a target iteration arrival rate.

## 5. How k6 Generates Load

In a VU-based test, each VU repeatedly executes its script.

The actual request rate depends on:

- Number of active VUs.
- Iteration duration.
- Application response time.
- Network latency.
- Think time and sleep intervals.
- Number of requests per iteration.

Increasing VUs does not guarantee a proportional increase in throughput.

A slow application can increase iteration duration and reduce the number of iterations completed per second.

## 6. Protocol-Level vs Browser-Level Testing

### Protocol-level testing

Sends requests directly to application endpoints, such as HTTP APIs.

Advantages:
- Lower resource consumption.
- Supports high concurrency.
- Provides detailed request and response metrics.
- Suitable for API and backend load testing.

### Browser-level testing

Evaluates user journeys through an actual browser.

It can measure:
- Page navigation.
- Frontend rendering.
- User interactions.
- Browser-side performance.

Browser testing consumes more resources than protocol-level testing.

Use protocol-level testing for backend capacity analysis and browser testing when frontend experience is the objective.

## 7. Checks, Metrics and Thresholds

### Checks

Checks validate individual conditions during execution.

Example:

    import http from 'k6/http';
    import { check } from 'k6';

    export default function () {
      const response = http.get('http://127.0.0.1:3000/health');

      check(response, {
        'status is 200': (res) => res.status === 200,
        'response contains healthy status': (res) =>
          res.json('status') === 'healthy',
      });
    }

### Metrics

Metrics collect performance measurements during execution.

Important built-in metrics:

| Metric | Description |
|---|---|
| http_req_duration | Total HTTP request duration |
| http_req_failed | Failed HTTP request rate |
| http_reqs | Total HTTP requests |
| iterations | Completed iterations |
| vus | Active virtual users |
| vus_max | Maximum available VUs |

### Thresholds

Thresholds define pass/fail criteria for a test.

Example:

    export const options = {
      thresholds: {
        http_req_duration: ['p(95)<200'],
        http_req_failed: ['rate<0.01'],
        checks: ['rate>0.99'],
      },
    };

A check failure does not automatically fail the entire test.

A breached threshold can cause k6 to exit with a non-zero status, making thresholds useful in CI/CD pipelines.

## 8. Understanding Percentiles

Percentiles help evaluate response-time distribution.

- p50: Median response time.
- p90: 90% of requests completed within this time.
- p95: 95% of requests completed within this time.
- p99: 99% of requests completed within this time.

Example:

If p95 response time is 200 ms, 95% of measured requests completed within 200 ms, while the remaining 5% took longer.

Average response time alone can hide slow requests and poor user experience.

## 9. Practical Portfolio Application

This portfolio demonstrates the following concepts:

- Reusable workload profiles.
- Environment-based configuration.
- A local Node.js mock API.
- Smoke testing.
- Load testing.
- Stress testing.
- Threshold-based validation.
- Execution reports and performance analysis.

The current local mock API results demonstrate test execution and workload configuration, not production capacity.

## 10. Interview Questions

1. What is the difference between a VU and an iteration?
2. How does ramping-vus differ from constant-arrival-rate?
3. Why might throughput stop increasing as VUs increase?
4. What is the difference between a check and a threshold?
5. Why are percentiles more useful than average response time?
6. When would you choose protocol-level testing over browser testing?
7. What factors influence requests per second?
8. Why is a local mock API insufficient for production capacity claims?
9. What happens when a k6 threshold is breached?
10. How would you choose the right executor for a performance test?

## Documentation Note

This is a retrospective technical learning guide authored on 19 November 2026.

It documents k6 fundamentals and concepts relevant to performance engineering. It is not evidence that these activities were completed in January 2026.
