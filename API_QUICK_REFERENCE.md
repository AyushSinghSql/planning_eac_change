# API Calls Quick Reference Guide

**Project:** Planning UI - FINAXIS LUMINA  
**Last Updated:** 2026-07-01  
**Base URL Config:** `src/components/config.js`

---

## 📊 Quick Stats

| Metric                   | Count |
| ------------------------ | ----- |
| **Total API Calls**      | 15    |
| **Active APIs**          | 12 ✅ |
| **Commented APIs**       | 3 ⚠️  |
| **Authenticated APIs**   | 1 🔐  |
| **Components with APIs** | 11    |

---

## 🟢 ACTIVE API ENDPOINTS

### 1️⃣ ReportingScreen.jsx

```javascript
GET / Forecast / GetSummaryV1;
```

📍 Line 143 | ⚡ High Priority  
**Use:** Financial report data  
**Loading State:** Yes

---

### 2️⃣ ProjectHoursDetails.jsx (Config)

```javascript
GET / api / Configuration / GetAllConfigValuesByProject / { projectId };
```

📍 Line 385 | ⚡ High Priority  
**Use:** Organization configuration  
**Issue:** ⚠️ Hardcoded with 'xxxxx' - needs dynamic projectId  
**Loading State:** Yes

---

### 3️⃣ ProjectHoursDetails.jsx (Labor Costs)

```javascript
GET /Forecast/GetMonthlyDataV1?planID={planId}&planType={apiPlanType}
```

📍 Line 452 | ⚡ High Priority  
**Use:** Monthly labor cost data  
**Parameters:** planID, planType (converts NBBUD → BUD)  
**Loading State:** Yes

---

### 4️⃣ Dashboard.jsx

```javascript
GET / Orgnization / { userId };
```

📍 Line 138 | 🔐 REQUIRES AUTH | ⚡ Critical Priority  
**Use:** User visibility & field access config (RBAC)  
**Auth:** Bearer Token from `localStorage.currentUser.token`  
**Note:** Bypassed for ADMIN role  
**Loading State:** Yes

---

### 5️⃣ NewBusiness.jsx - Organizations

```javascript
GET / Orgnization / GetAllOrgs;
```

📍 Line 214 | 📌 Parallel Request  
**Use:** Organization dropdown population  
**Loading State:** No

---

### 6️⃣ NewBusiness.jsx - Account Groups

```javascript
GET / Project / GetAccountGroupCodes;
```

📍 Line 215 | 📌 Parallel Request  
**Use:** Account group dropdown population  
**Loading State:** No

---

### 7️⃣ NewBusiness.jsx - Burden Templates

```javascript
GET / Orgnization / GetAllTemplates;
```

📍 Line 251 | ✔️ Includes Data Validation  
**Use:** Burden templates for project setup  
**Loading State:** No

---

### 8️⃣ NewBusiness.jsx - Project Plans

```javascript
GET / Project / GetProjectPlans;
```

📍 Line 262 | 📊 Table Data  
**Use:** Display all project plans  
**Loading State:** No

---

### 9️⃣ NewBusinessComponent.jsx

```javascript
GET / GetAllNewBusinessById / { searchTerm };
```

📍 Line 106 | 🔍 Search  
**Use:** Search new business records  
**Loading State:** No

---

### 🔟 ProjectPlanTable.jsx

```javascript
GET[Dynamic];
```

📍 Line 147  
**Use:** Fetch audit logs for plan history  
**Error Handling:** toast.error()  
**Loading State:** No ⚠️ Missing

---

### 1️⃣1️⃣ FinancialReport.jsx

```javascript
POST[Dynamic];
```

📍 Line 78  
**Use:** Generate/submit financial reports  
**Loading State:** No ⚠️ Missing

---

## 🟡 COMMENTED OUT (DISABLED) APIs

### ⚠️ Login.jsx

```javascript
POST / api / User / login;
```

📍 Line 76 | 🔴 CRITICAL - Needed for authentication  
**Action:** ❌ MUST ACTIVATE

---

### ⚠️ AnalogRate.jsx

```javascript
GET / api / AnalgsRt;
```

📍 Line 55 | 🟡 LOW - NBI rates  
**Action:** Review before use

---

### ⚠️ ChatBot.jsx

```javascript
POST [ChatBot endpoint]
```

📍 Line 30 | 🟡 LOW - Feature disabled  
**Action:** Review implementation

---

## 🔐 Authentication

**Method:** Bearer Token  
**Storage:** `localStorage.currentUser.token`  
**Usage:**

```javascript
headers: {
  Authorization: `Bearer ${JSON.parse(localStorage.getItem("currentUser") || "{}").token}`;
}
```

**Used in:**

- Dashboard.jsx - `/Orgnization/{userId}`

---

## 🔧 Error Handling Patterns

### Pattern 1: try-catch + console.error

```javascript
try {
  const response = await fetch(url);
  // process response
} catch (error) {
  console.error("Error:", error);
}
```

✅ Used in: ProjectHoursDetails, NewBusiness, Dashboard

---

### Pattern 2: try-catch + toast.error

```javascript
try {
  const response = await axios.get(url);
  // process response
} catch (error) {
  toast.error(`Error: ${error.message}`);
}
```

✅ Used in: ProjectPlanTable, NewBusiness

---

### Pattern 3: Fallback to defaults

```javascript
try {
  // fetch data
} catch (e) {
  setData([]); // fallback to empty
}
```

✅ Used in: Dashboard visibility, NewBusiness

---

## ⚠️ Known Issues & TODOs

| Issue                       | Component           | Line | Priority    |
| --------------------------- | ------------------- | ---- | ----------- |
| Hardcoded 'xxxxx' projectId | ProjectHoursDetails | 386  | 🔴 HIGH     |
| Missing loading indicator   | ProjectPlanTable    | 147  | 🟡 MEDIUM   |
| Missing loading indicator   | FinancialReport     | 78   | 🟡 MEDIUM   |
| Login API disabled          | Login               | 76   | 🔴 CRITICAL |
| ChatBot API disabled        | ChatBot             | 30   | 🟢 LOW      |
| No timeout handling         | All                 | -    | 🟡 MEDIUM   |
| No request logging          | All                 | -    | 🟡 MEDIUM   |

---

## 📁 Files You Need to Know

| File                        | Purpose                               |
| --------------------------- | ------------------------------------- |
| `API_CALLS_INVENTORY.md`    | Detailed documentation (this folder)  |
| `API_CALLS_INVENTORY.json`  | Machine-readable format (this folder) |
| `APIInventoryDashboard.jsx` | React component to visualize APIs     |
| `src/components/config.js`  | Where `backendUrl` is defined         |

---

## 🚀 How to Use These Files

### 1. **Review APIs in Dashboard**

```bash
# Import and use in a page or debug view
import APIInventoryDashboard from './components/APIInventoryDashboard';
```

### 2. **Access JSON Programmatically**

```javascript
import apiInventory from "./API_CALLS_INVENTORY.json";
console.log(apiInventory.summary.activeAPICalls); // 12
```

### 3. **Search for API Usage**

```bash
# Terminal: Search for all API calls
grep -r "fetch\|axios\.get\|axios\.post" src/components/
```

---

## 🎯 Recommended Next Steps

1. **🔴 URGENT:** Uncomment and fix Login API (needed for app)
2. **🟠 HIGH:** Fix hardcoded 'xxxxx' in ProjectHoursDetails
3. **🟠 HIGH:** Add missing loading indicators
4. **🟡 MEDIUM:** Standardize error handling
5. **🟡 MEDIUM:** Add timeout configuration
6. **🟢 LOW:** Review and document ChatBot/Warning APIs

---

## 📞 API Response Formats

### Financial Data (ReportingScreen)

```json
[
  {
    "id": "40.01",
    "name": "Revenue",
    "type": "group",
    "monthlyTotals": { "2024-01": 5000 },
    "children": [...]
  }
]
```

### Organization Config (Dashboard)

```json
{
  "screens": { "screen1": { "view": true, "edit": false } },
  "fields": { "field1": { "view": true, "edit": true } }
}
```

### Configuration Array (ProjectHoursDetails)

```json
[
  { "name": "escallation_percent", "value": "5" },
  { "name": "escallation_month", "value": "3" }
]
```

---

## 🔗 Related Documentation

- Backend API Documentation: [Link needed]
- Component Architecture: [Link needed]
- State Management: [Link needed]
- Error Handling Guide: [Link needed]

---

**Questions?** Check the detailed `API_CALLS_INVENTORY.md` file or review individual component files.
