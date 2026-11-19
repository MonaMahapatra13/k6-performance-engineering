# Load Test Results

## Execution Details

- Date: 19 November 2026
- Environment: Local mock API
- Endpoint: GET /api/items
- Tool: Grafana k6
- Maximum VUs: 10
- Duration: 9 minutes
- Workload: 2m ramp-up, 5m steady state, 2m ramp-down

## Results

| Metric | Result |
|---|---:|
| Total HTTP requests | 4,256 |
| Request throughput | 7.88 req/s |
| Checks passed | 8,512 / 8,512 |
| Failed requests | 0% |
| Average response time | 703.99 µs |
| Median response time | 718 µs |
| p90 response time | 819 µs |
| p95 response time | 870 µs |
| Maximum response time | 1.84 ms |

## Threshold Results

| Threshold | Target | Result |
|---|---|---|
| Checks | >99% | Passed |
| HTTP request duration p95 | <200 ms | Passed |
| HTTP request failures | <1% | Passed |

## Observations

- All 8,512 checks passed.
- No failed HTTP requests were recorded.
- The p95 response time remained below the configured threshold.
- The local mock API completed the nine-minute workload without errors.

## Limitations

This test measures a lightweight API running locally on the same machine as k6.
The results are a development baseline and must not be interpreted as production
capacity or infrastructure scalability measurements.
