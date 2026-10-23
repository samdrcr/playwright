# HW7 — Task Board Test Stack

**Student:** 范權榮 (111210557)  
**Department:** 國立金門大學 資訊工程學系四年級

## Project Overview

This project is a lightweight, full-stack Task Board application designed from the ground up to demonstrate a strict three-layer testing architecture. To minimize external dependencies and demonstrate a deep understanding of core network protocols, the backend is built entirely using Python's standard library (`http.server`), while the frontend utilizes vanilla JavaScript, HTML, and CSS.

The application allows users to submit tasks through a web interface, which are then processed by the custom HTTP server and stored in memory.

## Project Structure

```text
├── core.py                   # Pure business logic and data structures
├── server.py                 # Custom Python HTTP and API server
├── index.html                # Frontend UI markup
├── styles.css                # UI styling
├── app.js                    # Client-side API integration and DOM manipulation
├── package.json              # NPM scripts and project dependencies
├── playwright.config.mjs     # Configuration for E2E headless browser testing
└── tests/
    ├── unit/
    │   └── test_core.py      # Layer 1: Isolated function testing
    ├── system/
    │   └── test_api.py       # Layer 2: API boundary and HTTP testing
    └── e2e/
        └── report.spec.mjs   # Layer 3: Automated UI and browser flow testing
```

## Test Matrix & Architecture

The testing strategy is divided into three distinct scopes, each verifying a different boundary of the application without overlapping responsibilities.

| Scope                        | Tool                   | Evidence                    |
| :--------------------------- | :--------------------- | :-------------------------- |
| **Server rules** (Unit Test) | Python `unittest`      | `tests/unit/test_core.py`   |
| **Web API** (System Test)    | HTTP server + `urllib` | `tests/system/test_api.py`  |
| **Browser flow** (E2E Test)  | Playwright Chromium    | `tests/e2e/report.spec.mjs` |

### 1. Unit Testing (Server-Side Logic)

**Goal:** Verify the business rules and data manipulation in total isolation.

- **Implementation:** We utilize Python's built-in `unittest` framework to directly import the functions from `core.py`.
- **Coverage:** This layer tests operations such as `add_task` and `clear_tasks`. It intentionally bypasses the network layer to ensure that edge cases (like rejecting tasks with empty titles) are handled correctly at the application's core. Execution is instantaneous since no ports are bound and no sockets are opened.

### 2. System Testing (Web API Integration)

**Goal:** Verify the contract between the client and the server over the HTTP protocol.

- **Implementation:** This layer dynamically spawns an instance of our `HTTPServer` on a background thread utilizing an ephemeral, OS-assigned port (Port `0`) to prevent port collision.
- **Coverage:** Python's `urllib.request` is used to fire actual HTTP `GET` and `POST` requests at the local server. The tests assert that the server correctly parses JSON payloads, routes the requests to the right internal functions, and returns the appropriate HTTP status codes (`200 OK`, `201 Created`, `400 Bad Request`) along with valid JSON responses.

### 3. End-to-End Testing (Browser Flow)

**Goal:** Verify the application exactly as a real user would interact with it.

- **Implementation:** We use `@playwright/test` running a headless Chromium browser. The `playwright.config.mjs` is set up to automatically launch `server.py` on a designated port (4183) before the test suite begins.
- **Coverage:** The test script navigates to the root URL, locates the DOM elements (`#title-input`, `#submit-btn`), simulates human keyboard typing and mouse clicks, and asserts that the JavaScript `fetch` calls complete successfully and the new task is visually rendered in the `.task-card` list.

## Setup & Execution Guide

Ensure you have **Node.js** and **Python 3** installed on your system.

**1. Install project dependencies:**
This installs Playwright and prepares the testing environment.

```bash
npm install
```

**2. Download browser binaries:**
This fetches the headless Chromium engine required for the E2E tests.

```bash
npx playwright install chromium
```

**3. Run the complete test suite:**
This single command sequentially triggers all three testing layers defined in `package.json`.

```bash
npm run test:all
```

## Viewing the Test Report

Playwright is configured with the HTML reporter. Upon the completion of the E2E tests, it generates a comprehensive, interactive dashboard detailing execution times, test steps, and DOM states.

To open the report in your default web browser, run:

```bash
npx playwright show-report
```

_Press `Ctrl + C` in your terminal to close the report server when finished._
