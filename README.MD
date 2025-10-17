# BackOnTrack: Conversational State Manager 💬

## Project Overview

BackOnTrack is a sophisticated web application designed to manage and enhance human-AI conversation. By tracking discussion highlight outlines, managing conversational branches, and ensuring information is delivered in short, context-aware chunks, the system aims to keep the dialogue focused, structured, and user-centric, mimicking a natural human discussion flow.

---

## Technology Stack (Software Requirements - SR)

The project uses popular, free, and easy-to-use frameworks, ensuring a modern, responsive application across web and mobile devices.

| Area | Recommended Framework/Library | Rationale and Implementation Notes |
|------|------------------------------|-----------------------------------|
| **Frontend Framework** | Vue.js 3 (Composition API) | Easy to learn, highly performant, excellent for building complex, reactive user interfaces like the Outline Sidebar. |
| **State Management** | Pinia | The official, lightweight store for Vue. Essential for managing the global state of the conversation, including active branches and all Highlights. |
| **Styling & Responsiveness** | Tailwind CSS | Utility-first approach for rapid development of a modern, responsive UI. Ensures excellent look and feel across devices. |
| **Backend (Web Server)** | Express.js | Provides a robust REST API layer for handling conversation logic, state transitions, and managing communication with the external AI service. |
| **Database (Data Storage)** | MongoDB (with Mongoose) | Flexible NoSQL solution ideal for storing nested, branching, and dynamic data structures like conversation trees and editable Highlight lists. MongoDB Atlas offers a generous free tier. |
| **AI Service** | Anthropic Claude API | Powers the conversational AI with Claude Sonnet models. Handles response generation, verification discussions, and highlight management. Requires API key configuration via environment variables. |
| **AI SDK** | @anthropic-ai/sdk | Official Anthropic SDK for Node.js to integrate Claude API with the Express backend. |
| **API Communication** | Axios (Frontend) | Standard HTTP client for making API calls from the Vue app to the Express backend. |

---

## Functional Requirements (FR)

### FR1: Main Chat Interface (Conversational AI)

The chat must facilitate a human-like dialogue flow by being brief and structure-driven.

| ID | Requirement | Implementation Detail |
|----|-------------|----------------------|
| **FR1.1** | Always Short | AI response text must be extremely concise (max 2-3 sentences), enforced by the Express backend to deliver information in human-digestible chunks. |
| **FR1.2** | Outline-Driven | AI responses offer the user to continue the discussion, based on the next item in the planned list of Response Highlights, ensuring the conversation advances systematically. |
| **FR1.3** | Verification Step | The AI's first response must be a short verification prompt (placeholder), not part of the actual answer (e.g., "Is this a question about the biology of the woodchuck animal?"). BackOnTrack stays in a verification state until the user's confirmation (e.g., "Yes"). Each user reply in this state is analyzed to determine whether understanding is verified or further clarification is needed. |
| **FR1.4** | Response in stages | After the verification state is confirmed, the AI is called again with the clarified intent. The resulting answer is stored and divided into stages. These stages are then revealed one by one. Each stage is summarized as a Highlight in the outline, with the first stage set to Current. |
| **FR1.5** | Highlight Tracking | The system tracks and stores the status of all Highlights (shown/planned) within the current discussion branch. Each highlight is stored with info (a comma separated text list) that must be sufficient for the AI to reconstruct the response message at that stage. |
| **FR1.6** | Dynamic Update | The BackOnTrack backend uses AI to decide if due to the user exchange any future highlights need to be modified, remarked on or deleted, and if any new highlights will be needed. |
| **FR1.7** | Response Restoration | The BackOnTrack backend uses AI to reconstruct each new response from the highlight and its info, according to the original request highlights. The info section of each highlight should store information neeed for the response reconstruction. |

### FR2: Branching and State Persistence

The system must intelligently manage deviations from the main discussion path and ensure continuity.

| ID | Requirement | Implementation Detail |
|----|-------------|----------------------|
| **FR2.1** | Branch Detection | The system must detect when a user's discussion intentionally or accidentally moves away from the current topic, moving off into a branch. When such a detour is detected by the AI's analysis, a new branch is created automatically, and its first Highlight is set to the inferred new main topic. |
| **FR2.2** | Track Storage | Upon branch detection, the system stores the Original Track highlights and their remarks, along with the status of each corresponding response stage (shown / planned). |
| **FR2.3** | Back Tracking & Resume | When a discussion is resumed on a previous branch, the AI must summarize the last part of that track and formulate a response that clearly indicates the next un-discussed Highlight, effectively allowing the user to resume the conversation where it was cut off. |
| **FR2.4** | Branch ending and AI Reminder | BackOnTrack, using AI, detects if the branch has been resolved and politely gives the option to resume a previous branch. Resolved branches are marked as such. |
| **FR2.5** | Detailed Offline Info | If detailed information is needed, the AI should provide that information in a new tab, formatted in HTML and preferably with links to sources. |

### FR3: Outline Sidebar (Vue Component)

This component provides the user with the structural map of the conversation.

| ID | Requirement | Implementation Detail |
|----|-------------|----------------------|
| **FR3.1** | Outline Content | A sidebar that shows an outline of all nested discussion branches, each with the discussion Highlights, including those not yet discussed. Each discussion branch begins with the user request, modified according to the verification discussion, and then the response and continued chat, each with its highlights. The highlight remarks (with information that lets the request and response stages to be reconstructed or created) are hidden from the user, and shown when hovering on the highlight headline text. |
| **FR3.2** | Collapsible Tree | Implemented as a collapsible tree structure using Vue components, reflecting the conversational hierarchy of branches, each with the requests and response and in each of those the highlights. |
| **FR3.2.1** | Branch Node Collapse | Each new discussion (stemming from AI analysis detecting a detour from the main topic) opens a branch node automatically. The branch's first Highlight is the new main topic. All highlights in each branch can be collapsed. |
| **FR3.2.2** | User Request Highlight | The main topic of each branch should be the first to be discussed in the discussion stages, and should be the first highlight for that branch. |
| **FR3.2.3** | AI Response Structure | For each branch, in response to the user's input, the AI goes through two steps of discussion iterations: |
| **FR3.2.3.1** | verification step | a. Verification and clarification discussion of the user's intent. The step ends when the user is satisfied with BackOnTrack's understanding. | 
| **FR3.2.3.2** | response stages | b. An ongoing reply discussion, where the response is presented in stages, advancing from one stage to the next, jumping to different stages, or even going offline, with the ability to continue where we left off, upon the user's request, and BackOnTrack's reminders. |
| **FR3.2.3.2.** | Verification Highlights | Shows the Highlight(s) of the user's request, as modified and inferred from verification step (FR1.3). |
| **FR3.2.3.2** | Response Highlights | The main list of Highlights (the Answer Blueprint) planned for the conversation, clearly showing which have been discussed (✓) which are planned, and which is currently being discussed. |
| **FR3.2.3.3** | Current Location Marker | The currently being discussed Highlight must be clearly and distinctly marked (e.g., distinct color, font size, bold text). |

---

## Software Requirements (SR) and Data Structure

### SR4: Data Structure (MongoDB/Mongoose)

| ID | Model | Key Fields/Properties | Rationale |
|----|-------|----------------------|-----------|
| **SR4.1** | Conversation | `id`, `startDate`, `activeBranchId`, `branchHistory` (array of Branch objects) | Root container for the entire discussion history. |
| **SR4.2** | Branch | `id`, `name`, `parentBranchId` (null for main), `messages` (array of Message objects), `highlights` (array of Highlight objects) | Stores the complete state of a discussion track (main or side). |
| **SR4.3** | Highlight | `id`, `text` (The headline/summary), `direction` (Request, Response), `status` (Planned, Discussed, Current), `info` (array of objects used to reconstruct the response stage), `orderIndex` | Represents a single discussion point, shown only on the sidebar and used for reconstructing the conversation, and branching. |
| **SR4.4** | Message | `id`, `sender` (User/AI), `content` (the short chat text), `highlightRefId` (link to the Highlight being discussed), `timestamp` | Stores the raw, human-facing chat history. |

### SR5: Backend Logic (Express.js)

| ID | Requirement | Action Triggered |
|----|-------------|-----------------|
| **SR5.1** | AI Context API | User Message → Express sends the AI a payload with the full current state (Branch state, next planned Highlight, etc.) to inform its response generation. |
| **SR5.2** | Ephemeral Storage | User Request → 1. Stores the AI's understanding of the user's request. 2. Stores the highlights of the user's request according to this understanding. |
| **SR5.3** | Alternative Search | Verification Stage Express sends AI requesta for alternative interpretations of the user's request and feeds that context to the AI for the verification hint. |
| **SR5.4** | Topic Feedback | (verification step) Express handles the API calls to validate modify or add highlights of the user's request according to the results of the verification step. In this API call it also should receive an answer whether verification is seemingly completed (handed over to the user to decide). |
| **SR5.5** | Topic Advance | Express handles the API calls to AI to reconstruct the next stage from the user's updated request and the requested step's highlight. |
| **SR5.6** | Topic Detection | Express handles the API call to AI to verify if we are still on topic or in a new branch. |

---

## Vue/Frontend Implementation Notes

The Vue application will rely heavily on the Pinia store to manage the global state of the conversation.

- **Pinia Store**: Will hold the full Conversation object, allowing components like `ChatWindow.vue` and `OutlineSidebar.vue` to reactively display the current state without prop drilling.
- **OutlineSidebar.vue**: This is the most complex component, utilizing a recursive or nested component structure to render the multi-level Highlights and Branches as a clean, responsive tree view.
- **Responsiveness**: Tailwind's breakpoint utilities will ensure the sidebar is visible on desktop but collapsible or hidden behind a menu icon on mobile for optimal screen usage.
