# Stress Test Results

## Execution Details

- Date: 19 November 2026
- Environment: Local Node.js mock API
- Endpoint: GET /api/items
- Tool: Grafana k6
- Maximum VUs: 100
- Duration: 10 minutes
- Workload: 20 → 50 → 100 → 0 VUs

## Results

| Metric | Result |
|---|---:|
| Total HTTP requests | 26,886 |
| Throughput | 44.81 requests/sec |
| Checks passed | 53,772 / 53,772 |
| Failed requests | 0% |
| Average response time | 533.99 µs |
| Median response time | 528 µs |
| p90 response time | 801 µs |
| p95 response time | 908 µs |
| Maximum response time | 6.02 ms |

## Threshold Results

| Threshold | Target | Result |
|---|---|---|
| Checks | >99% | Passed |
| HTTP request duration p95 | <200 ms | Passed |
| HTTP request failures | <1% | Passed |

## Observations

- All 53,772 checks passed.
- No failed HTTP requests were recorded.
- The local mock API handled the configured workload up to 100 VUs.
- The observed p95 response time remained below 1 ms.

## Limitations

The test ran against a lightweight API on the same machine as k6.
It does not establish production capacity, a breaking point, or
infrastructure scalability.

A more representative stress test requires a controlled service with
realistic application processing, dependencies, data and infrastructure.
