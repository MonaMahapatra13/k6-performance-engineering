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
2. Setup – executes once before the VU execution begins.
3. VU execution – runs the default function or configured scenarios.
4. Teardown – executes once after VU execution completes.

Execution flow:

Init → Setup → VU execution → Teardown

Example:

```javascript
export function setup() {
  console.log('Test setup');
}

export default function () {
  console.log('Executing virtual user iteration');
}

export function teardown() {
  console.log('Test completed');
}