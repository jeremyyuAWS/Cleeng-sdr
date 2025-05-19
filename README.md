## 🔑 Cleeng Integration Requirements for Jazon 3.0 App

### 1. **Lead Enrichment + Research via Apollo.io**

* Sync account lists from **Apollo** to Lyzr via Apollo API.
* Automate research for enriched lead profiles (e.g., industry, job titles, funding status).
* Use this to drive **personalized messaging**.

### 2. **Automated Outreach (Email + LinkedIn)**

* Build an AI workflow that:

  * Sends **personalized email sequences** (HubSpot/Salesforce-integrated).
  * Automates **LinkedIn messaging and connection requests** with guardrails (e.g., MCP model).
* Include A/B testing for subject lines, tone, and CTA optimization.

### 3. **CRM Integration (HubSpot + Salesforce)**

* Two-way sync of lead status, enriched metadata, campaign performance.
* Ensure AI agents can **write to CRM fields** (e.g., lead score, engagement).

### 4. **Agentic Workflow Customization**

* Modular agents for:

  * **ICP generation**
  * **Email creation**
  * **LinkedIn outreach**
  * **Analytics**
* Each agent should be configurable for different campaign objectives.

### 5. **Customer-Facing Chatbot Integration**

* Optional: integrate a **site chatbot** to:

  * Qualify inbound visitors
  * Route to proper SDR or campaign
  * Use **voice or text** options based on user context
* Tie chatbot engagement into CRM enrichment

### 6. **Human-in-the-Loop + Responsible AI**

* Add override controls and real-time monitoring of AI decisions.
* Ability to redact sensitive data before CRM logging.
* Enable notifications for SDRs to jump into conversations manually.

### 7. **Personalization at Scale**

* Use AI to mimic Cleeng’s existing sales reps' voice and tone.
* Allow persona configuration (e.g., Jason SDR, Jason Light) with image, bio, voice options.

### 8. **Security + OAuth**

* Integrate via secure **OAuth tokens** for LinkedIn, HubSpot, Salesforce.
* Ensure **data remains owned by Cleeng**, not Lyzr.

---

## 🛠 Suggested Jazon 3.0 App Updates for Cleeng

| Component                       | Description                                          |
| ------------------------------- | ---------------------------------------------------- |
| `/agents/apolloSync.ts`         | API logic for Apollo enrichment and sync             |
| `/agents/linkedinBot.ts`        | Simulated agent for LinkedIn outreach with MCP model |
| `/agents/emailBot.ts`           | Email sequence generator + A/B testing logic         |
| `/components/CRMBridge.tsx`     | HubSpot/Salesforce integration layer                 |
| `/components/PersonaConfig.tsx` | UI to configure SDR persona (voice, tone, image)     |
| `/components/ChatSupport.tsx`   | Inbound chatbot with escalation support              |
| `/utils/oauth.ts`               | OAuth helper for LinkedIn + HubSpot + Salesforce     |

---

Would you like a revised PRD or README.md with these modules mapped into the Jazon 3.0 folder structure, ready to push to GitHub?
