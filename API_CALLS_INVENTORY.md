# API Calls Inventory - Planning UI Project

**Generated:** 2026-07-01  
**Base URL:** `backendUrl` from `src/components/config.js`

---

## Overview

This document catalogs all API calls across the Planning UI project, organized by component. It includes the HTTP method, endpoint, and functional context.

---

## Components with API Calls

### 1. **ReportingScreen.jsx** ⭐ PRIMARY

**API Count:** 1

| Method | Endpoint                 | Function          | Context                                                                                         |
| ------ | ------------------------ | ----------------- | ----------------------------------------------------------------------------------------------- |
| `GET`  | `/Forecast/GetSummaryV1` | `fetchForecast()` | Fetches forecast summary data for financial reporting; called in `useEffect` on component mount |

**Details:**

- Line 143: `fetch(`${backendUrl}/Forecast/GetSummaryV1`)`
- Response is parsed and hierarchically structured with revenue/expense categories
- Data includes monthly totals and calculations for Gross Profit and Net Profit

---

### 2. **ProjectHoursDetails.jsx** ⭐ HIGHLY ACTIVE

**API Count:** 2

| Method | Endpoint                                                         | Function                 | Context                                                 |
| ------ | ---------------------------------------------------------------- | ------------------------ | ------------------------------------------------------- |
| `GET`  | `/api/Configuration/GetAllConfigValuesByProject/{projectId}`     | `fetchOrgConfig()`       | Fetches configuration settings for organization/project |
| `GET`  | `/Forecast/GetMonthlyDataV1?planID={planId}&planType={planType}` | `fetchAndSetLaborCost()` | Fetches monthly labor cost data for specific plan       |

**Details:**

- Line 385-389: Configuration fetch (currently hardcoded with 'xxxxx')
- Line 452-453: Forecast/labor cost fetch with dynamic plan parameters
- Error handling includes logging and console warnings
- Used for populating employee data, labor costs, and period information

---

### 3. **Dashboard.jsx**

**API Count:** 1

| Method | Endpoint                | Function       | Context                                                |
| ------ | ----------------------- | -------------- | ------------------------------------------------------ |
| `GET`  | `/Orgnization/{userId}` | `loadConfig()` | Fetches user visibility and field access configuration |

**Details:**

- Line 138: `axios.get(`${backendUrl}/Orgnization/${user.userId}`)`
- Includes Bearer token authorization header
- Returns `screens` and `fields` visibility configuration
- Used for role-based access control (RBAC) - Admin role bypasses restrictions

---

### 4. **NewBusiness.jsx** ⭐ HIGHLY ACTIVE

**API Count:** 3+

| Method | Endpoint                        | Function                    | Context                                                      |
| ------ | ------------------------------- | --------------------------- | ------------------------------------------------------------ |
| `GET`  | `/Orgnization/GetAllOrgs`       | `fetchLookupData()`         | Fetches list of all organizations for dropdown               |
| `GET`  | `/Project/GetAccountGroupCodes` | `fetchLookupData()`         | Fetches account group codes for selection                    |
| `GET`  | `/Orgnization/GetAllTemplates`  | `fetchBurdenTemplates()`    | Fetches burden templates for projects                        |
| `GET`  | `/Project/GetProjectPlans`      | `fetchAllBusinessBudgets()` | Fetches all project plans/business budgets for table display |

**Details:**

- Line 214-220: Multiple parallel axios calls using `Promise.all()`
- Line 251-258: Burden templates fetch with error handling and toast notifications
- Line 262-271: Project plans fetch with data validation
- Used for populating lookup dropdowns and displaying saved budgets

---

### 5. **NewBusinessComponent.jsx**

**API Count:** 1

| Method | Endpoint                              | Function              | Context                         |
| ------ | ------------------------------------- | --------------------- | ------------------------------- |
| `GET`  | `/GetAllNewBusinessById/{searchTerm}` | Async search function | Searches for new business by ID |

**Details:**

- Line 106: `axios.get(`${backendUrl}/GetAllNewBusinessById/${term}`)`
- Used in search/autocomplete functionality for existing business records

---

### 6. **ProjectHoursDetails.jsx** (Additional Calls)

**Secondary API Count:** Multiple (via imported modules)

- Imports `EmployeeSchedule` component (likely has API calls)
- Imports `Warning` component (likely has API calls)
- Used for employee data management and validation

---

### 7. **AnalogRate.jsx**

**API Count:** 1

| Method | Endpoint        | Function                      | Context                              |
| ------ | --------------- | ----------------------------- | ------------------------------------ |
| `GET`  | `/api/AnalgsRt` | `fetchNbiRates()` (Commented) | Fetches NBI (Non-Billed Items) rates |

**Details:**

- Line 55-56: Currently commented out
- Likely used for rate configuration UI

---

### 8. **ProjectPlanTable.jsx**

**API Count:** 1

| Method | Endpoint                        | Function                 | Context                              |
| ------ | ------------------------------- | ------------------------ | ------------------------------------ |
| `GET`  | `[Dynamic - varies by context]` | `handleFetchAuditLogs()` | Fetches audit logs for project plans |

**Details:**

- Line 147: `axios.get(...)`
- Used for displaying plan history and audit trail
- Includes error handling with toast notifications

---

### 9. **FinancialReport.jsx**

**API Count:** 1

| Method | Endpoint             | Function          | Context                     |
| ------ | -------------------- | ----------------- | --------------------------- |
| `POST` | `[Dynamic endpoint]` | Report generation | Posts financial report data |

**Details:**

- Line 78: `axios.post(...)`
- Used for generating/exporting financial reports

---

### 10. **Other Components** (Light API Usage)

| Component                        | Status    | Notes                                                   |
| -------------------------------- | --------- | ------------------------------------------------------- |
| **Login.jsx**                    | Commented | Line 76: Login API call commented out                   |
| **ChatBot.jsx**                  | Commented | Line 30: POST call commented (ChatBot feature disabled) |
| **BIReports.jsx**                | Commented | Fetch call commented out                                |
| **Warning.jsx**                  | Commented | Axios GET call for warnings commented                   |
| **ConfigureField.jsx**           | Commented | User fetch API commented                                |
| **Rates.jsx**                    | Commented | Configuration fetch commented                           |
| **ForecastReport.jsx**           | Defined   | API paths defined but usage status unclear              |
| **ForecastPSRReport.jsx**        | Defined   | Multiple API paths defined but commented                |
| **CostFeeOverrideDetails.jsx**   | Partial   | `fetchData()` function exists                           |
| **EmployeeSchedule.jsx**         | Active    | References last fetched employee ID                     |
| **BurdenCostCeilingDetails.jsx** | Partial   | Multiple fetch references                               |
| **DirectCostCeilings.jsx**       | Partial   | Account fetch references                                |
| **HoursCeilings.jsx**            | Partial   | Data fetch function defined                             |
| **EmployeeHoursCeilings.jsx**    | Partial   | Fetch data function exists                              |
| **Fringe.jsx**                   | Partial   | Config fetch defined                                    |
| **HR.jsx**                       | Partial   | Config fetch defined                                    |
| **MassUtilityProject.jsx**       | Partial   | Fetch state tracking                                    |

---

## API Endpoint Summary

### Active Endpoints

```
GET  /Forecast/GetSummaryV1
GET  /Forecast/GetMonthlyDataV1
GET  /api/Configuration/GetAllConfigValuesByProject/{projectId}
GET  /Orgnization/GetAllOrgs
GET  /Orgnization/{userId}
GET  /Project/GetAccountGroupCodes
GET  /Orgnization/GetAllTemplates
GET  /Project/GetProjectPlans
GET  /GetAllNewBusinessById/{id}
GET  /api/AnalgsRt (Commented)
POST /[Various Financial Report endpoints]
```

### Commented/Inactive Endpoints

```
GET  /api/User/login
POST /[ChatBot endpoint]
GET  /api/User
GET  /[Audit logs - dynamic]
GET  /[Warning endpoints]
```

---

## HTTP Methods Used

- **GET** - 12+ endpoints (data retrieval)
- **POST** - 2+ endpoints (data submission/reports)
- **PUT** - Referenced in patterns but not actively used
- **DELETE** - Referenced in patterns but not actively used

---

## Authentication

- **Bearer Token**: Used in Dashboard.jsx for `/Orgnization/{userId}` endpoint
- **Token Location**: `localStorage.getItem("currentUser").token`
- **Authorization Header**: `Authorization: Bearer ${token}`

---

## Error Handling Patterns

| Pattern                 | Components                                     | Approach                        |
| ----------------------- | ---------------------------------------------- | ------------------------------- |
| **try-catch**           | ProjectHoursDetails, NewBusiness, Dashboard    | Basic error logging to console  |
| **toast notifications** | ProjectPlanTable, NewBusiness, FinancialReport | User feedback via toast.error() |
| **console.error()**     | ReportingScreen, ProjectHoursDetails           | Debug logging                   |
| **console.warn()**      | ProjectHoursDetails (config fetch)             | Configuration fetch warnings    |

---

## Loading States

| Component                   | Loading State                    | UI Feedback                              |
| --------------------------- | -------------------------------- | ---------------------------------------- |
| **Dashboard.jsx**           | `loading` state                  | Spinner with "Loading Config..." message |
| **ProjectHoursDetails.jsx** | `isDurationLoading`, `isLoading` | Multiple loading indicators              |
| **NewBusiness.jsx**         | `isSaving`                       | Implicit UI disable during save          |
| **ReportingScreen.jsx**     | `loading`                        | Implicit loading state management        |

---

## Data Caching & Optimization

- **Dashboard.jsx**: Caches visibility configuration per user
- **ProjectHoursDetails.jsx**: `cachedProjectData`, `cachedOrgData` states
- **ReportingScreen.jsx**: Data fetched once on mount (no refresh mechanism visible)

---

## Notable Implementation Details

1. **Token Management**: Token stored in localStorage under `currentUser.token`
2. **Role-Based Access**: Admin role bypasses visibility restrictions
3. **Dynamic Parameters**: Plan ID, Plan Type, Project ID passed as URL parameters
4. **Parallel Requests**: `Promise.all()` used in NewBusiness for concurrent fetches
5. **Configuration**: `backendUrl` imported from centralized `config.js`
6. **Error Resilience**: Fallback to empty visibility object if API fails

---

## Recommendations

1. ✅ **Activate Commented APIs**: Review and activate Login, ChatBot, and Warning APIs
2. ✅ **Standardize Error Handling**: Implement consistent error handling across all components
3. ✅ **Add Loading Indicators**: Missing loading indicators in several components
4. ✅ **Implement Refresh Mechanisms**: Add manual refresh buttons where appropriate
5. ✅ **API Documentation**: Link to backend API documentation for endpoint contracts
6. ✅ **Request/Response Logging**: Add middleware to log all API calls for debugging
7. ✅ **Timeout Configuration**: Add timeout handling for slow API responses

---

## Files with API Calls (Alphabetical)

- [AnalogRate.jsx](src/components/AnalogRate.jsx#L55)
- [BIReports.jsx](src/components/BIReports.jsx#L16)
- [ChatBot.jsx](src/components/ChatBot.jsx#L30)
- [CostFeeOverrideDetails.jsx](src/components/CostFeeOverrideDetails.jsx#L41)
- [Dashboard.jsx](src/pages/Dashboard.jsx#L138)
- [FinancialReport.jsx](src/components/FinancialReport.jsx#L78)
- [NewBusiness.jsx](src/components/NewBusiness.jsx#L214)
- [NewBusinessComponent.jsx](src/components/NewBusinessComponent.jsx#L106)
- [ProjectHoursDetails.jsx](src/components/ProjectHoursDetails.jsx#L385)
- [ProjectPlanTable.jsx](src/components/ProjectPlanTable.jsx#L147)
- [ReportingScreen.jsx](src/components/ReportingScreen.jsx#L143)

---

**Last Updated:** 2026-07-01
