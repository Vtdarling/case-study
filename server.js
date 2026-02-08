const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const Faq = require('./models/Faq');

require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// The environment provides the key at runtime
const apiKey = process.env.GEMINI_API_KEY || "";

// Middleware
app.use(express.json());
app.use(express.static('public'));

const FAQ_SEED = [
    {
        question: "What are my daily responsibilities?",
        keywords: ["daily", "responsibilities", "tasks", "role"],
        answer: "Your manager will share day-to-day tasks based on your role. Start with assigned tickets and team priorities.",
        category: "Basic"
    },
    {
        question: "What is my role and designation?",
        keywords: ["role", "designation", "title", "position"],
        answer: "Your role and designation are listed in your offer letter and HR portal. Ask HR if you need clarification.",
        category: "Basic"
    },
    {
        question: "Who is my reporting manager or mentor?",
        keywords: ["manager", "mentor", "reporting", "lead"],
        answer: "Your reporting manager is listed in your onboarding email and HR portal. Ask HR if you are unsure.",
        category: "Basic"
    },
    {
        question: "How do I set up my development environment (tools, IDEs, repositories)?",
        keywords: ["setup", "development", "environment", "tools", "ide", "repositories"],
        answer: "Follow the team onboarding checklist and repo README. IT can help with installs and access.",
        category: "Basic"
    },
    {
        question: "What is the process for logging attendance, leaves, and timesheets?",
        keywords: ["attendance", "leave", "timesheet", "logging"],
        answer: "Log attendance and timesheets in the HR portal. Leave requests require manager approval.",
        category: "Basic"
    },
    {
        question: "What are the office timings and leave policies?",
        keywords: ["office", "timings", "leave", "policy", "hours"],
        answer: "Office hours and leave policies are in the HR portal and your offer letter. Check with HR for updates.",
        category: "Basic"
    },
    {
        question: "How does communication happen here (Slack, Teams, email)?",
        keywords: ["communication", "slack", "teams", "email"],
        answer: "Day-to-day chat is on Slack or Teams, and formal updates go via email. Follow your team channel norms.",
        category: "Basic"
    },
    {
        question: "What is the probation period and evaluation criteria?",
        keywords: ["probation", "evaluation", "criteria", "review"],
        answer: "Probation details are in your offer letter. Reviews focus on performance, learning, and team collaboration.",
        category: "Basic"
    },
    {
        question: "What is the probation period and confirmation process?",
        keywords: ["probation", "confirmation", "process", "review"],
        answer: "The probation length is in your offer letter. Confirmation happens after a review with your manager.",
        category: "Basic"
    },
    {
        question: "How do I access internal portals, VPN, or project documentation?",
        keywords: ["portal", "vpn", "documentation", "access"],
        answer: "Access is granted via IT onboarding. Use your company account to sign in and request permissions.",
        category: "Basic"
    },
    {
        question: "How do I access email, VPN, and internal portals?",
        keywords: ["email", "vpn", "portal", "access", "login"],
        answer: "Use your company credentials and follow the IT onboarding guide. Submit an access request if needed.",
        category: "Basic"
    },
    {
        question: "How do I set up my laptop and required software?",
        keywords: ["laptop", "setup", "software", "install"],
        answer: "IT provides a setup checklist and required software list. Raise a ticket if you need help.",
        category: "Basic"
    },
    {
        question: "What is the dress code or WFH policy?",
        keywords: ["dress", "code", "wfh", "remote", "policy"],
        answer: "Dress code details are in the HR portal. WFH policy depends on your team and role.",
        category: "Basic"
    },
    {
        question: "Which project will I be assigned to, and what is its scope?",
        keywords: ["project", "assigned", "scope"],
        answer: "Your manager will confirm the project and scope during onboarding. You will receive a brief and goals.",
        category: "Intermediate"
    },
    {
        question: "Which project/team will I be assigned to?",
        keywords: ["project", "team", "assigned", "allocation"],
        answer: "Your manager will confirm your project and team during onboarding. You will receive the allocation details.",
        category: "Intermediate"
    },
    {
        question: "What technologies, frameworks, or stacks are used in my team?",
        keywords: ["technologies", "frameworks", "stack", "tools"],
        answer: "Team stacks are listed in the project README and onboarding docs. Ask your lead for the current tech list.",
        category: "Intermediate"
    },
    {
        question: "What technologies or frameworks are used in my project?",
        keywords: ["technologies", "frameworks", "stack", "project"],
        answer: "The project README and onboarding docs list the tech stack. Confirm with your team lead if needed.",
        category: "Intermediate"
    },
    {
        question: "How do I access repositories, servers, and documentation?",
        keywords: ["repositories", "servers", "documentation", "access"],
        answer: "Access is granted through IT or your team lead. Use the project onboarding guide to request permissions.",
        category: "Intermediate"
    },
    {
        question: "Are there coding standards or best practices I should follow?",
        keywords: ["coding", "standards", "best", "practices", "style"],
        answer: "Yes, follow the team style guide and linting rules. Use the existing codebase patterns.",
        category: "Intermediate"
    },
    {
        question: "How does the Git workflow (branching, pull requests, CI/CD) work here?",
        keywords: ["git", "workflow", "branching", "pull", "request", "cicd"],
        answer: "Use feature branches, open pull requests, and pass CI checks. The exact steps are in the repo CONTRIBUTING file.",
        category: "Intermediate"
    },
    {
        question: "What is the process for submitting code (Git workflow, CI/CD)?",
        keywords: ["submit", "code", "git", "workflow", "cicd"],
        answer: "Create a feature branch, open a PR, and pass CI checks. Follow the repo contribution guide.",
        category: "Intermediate"
    },
    {
        question: "What is the escalation process if I face blockers?",
        keywords: ["escalation", "blocker", "help"],
        answer: "Raise blockers in your daily standup or team channel. Escalate to your lead if it is urgent.",
        category: "Intermediate"
    },
    {
        question: "Who should I contact if I face blockers?",
        keywords: ["blockers", "contact", "help", "lead"],
        answer: "Start with your team lead or mentor. Escalate to your manager if the blocker is urgent.",
        category: "Intermediate"
    },
    {
        question: "How do I raise bugs or issues in the project?",
        keywords: ["bugs", "issues", "tracker", "jira"],
        answer: "Create a ticket in the team tracker with steps to reproduce. Link relevant logs or screenshots.",
        category: "Intermediate"
    },
    {
        question: "How do I raise bugs or track tasks (Jira, Trello, etc.)?",
        keywords: ["bugs", "tasks", "jira", "trello", "tracker"],
        answer: "Log a ticket in the team tool with clear details and priority. Follow the workflow in your project board.",
        category: "Intermediate"
    },
    {
        question: "How are deadlines and deliverables communicated?",
        keywords: ["deadlines", "deliverables", "communication", "planning"],
        answer: "Deadlines are shared in sprint planning and tracked in the project board. Clarify with your lead if needed.",
        category: "Intermediate"
    },
    {
        question: "Are there regular sprint meetings, stand-ups, or retrospectives?",
        keywords: ["sprint", "standup", "retro", "meetings"],
        answer: "Most teams run daily standups and sprint ceremonies. Check your team calendar for schedules.",
        category: "Intermediate"
    },
    {
        question: "Is there a training program for freshers?",
        keywords: ["training", "freshers", "program", "onboarding"],
        answer: "Yes, freshers typically have an onboarding or training plan. Details are shared by HR and your manager.",
        category: "Advanced"
    },
    {
        question: "Are certifications or courses supported by the company?",
        keywords: ["certifications", "courses", "training", "support"],
        answer: "Many teams support role-relevant certifications. Check the learning portal for approved programs.",
        category: "Advanced"
    },
    {
        question: "What are the opportunities for training, certifications, or skill development?",
        keywords: ["training", "certifications", "skills", "learning"],
        answer: "You can request training through the learning portal. Many teams support certifications aligned to your role.",
        category: "Advanced"
    },
    {
        question: "How can I explore different domains (e.g., switch from backend to data science)?",
        keywords: ["domains", "switch", "backend", "data", "science"],
        answer: "Discuss your interests with your manager and HR. Internal mobility options are reviewed during career planning.",
        category: "Advanced"
    },
    {
        question: "What is the career path for developers, testers, analysts, or architects here?",
        keywords: ["career", "path", "developers", "testers", "analysts", "architects"],
        answer: "Career paths are outlined in the HR portal. Your manager can explain level expectations and growth steps.",
        category: "Advanced"
    },
    {
        question: "How is performance measured beyond coding (soft skills, teamwork, innovation)?",
        keywords: ["performance", "soft", "skills", "teamwork", "innovation"],
        answer: "Performance reviews cover delivery, quality, collaboration, and initiative. Feedback is collected across teams.",
        category: "Advanced"
    },
    {
        question: "How is performance evaluated beyond coding?",
        keywords: ["performance", "evaluation", "soft", "skills", "collaboration"],
        answer: "Reviews cover delivery, quality, teamwork, and initiative. Feedback is gathered from peers and leads.",
        category: "Advanced"
    },
    {
        question: "How do promotions and appraisals work?",
        keywords: ["promotions", "appraisals", "rating", "review"],
        answer: "Promotions are based on performance and role readiness. Cycles and criteria are shared by HR each year.",
        category: "Advanced"
    },
    {
        question: "Are there mentorship programs or buddy systems?",
        keywords: ["mentorship", "buddy", "program", "support"],
        answer: "Many teams assign a mentor or buddy during onboarding. Ask HR if one is not assigned.",
        category: "Advanced"
    },
    {
        question: "Are there opportunities to contribute to open-source or company R&D projects?",
        keywords: ["open-source", "rd", "research", "projects"],
        answer: "Yes, some teams support open-source and R&D work. Check with your manager for available programs.",
        category: "Advanced"
    },
    {
        question: "How do I get involved in hackathons, innovation labs, or cross-team initiatives?",
        keywords: ["hackathon", "innovation", "labs", "cross-team"],
        answer: "Watch for internal announcements and sign up when events open. Managers can sponsor participation.",
        category: "Advanced"
    },
    {
        question: "How does the company adopt new technologies (AI, cloud, DevOps)?",
        keywords: ["new", "technologies", "ai", "cloud", "devops"],
        answer: "New tech is evaluated via pilots and architecture reviews. Standards are published by the engineering group.",
        category: "Strategic"
    },
    {
        question: "What are the coding standards and security policies (API keys, env variables)?",
        keywords: ["coding", "standards", "security", "api", "keys", "env"],
        answer: "Follow the team style guide and security checklist. Never commit secrets and use approved vaults.",
        category: "Strategic"
    },
    {
        question: "What are the security policies around API keys, environment variables, and deployments?",
        keywords: ["security", "api", "keys", "environment", "deployments"],
        answer: "Store secrets in approved vaults and never commit them. Follow the security checklist for deployments.",
        category: "Strategic"
    },
    {
        question: "How does the company handle scalability and performance optimization in projects?",
        keywords: ["scalability", "performance", "optimization"],
        answer: "Teams use profiling, load testing, and architecture reviews. Performance goals are defined per project.",
        category: "Strategic"
    },
    {
        question: "How does the company handle scalability and performance optimization?",
        keywords: ["scalability", "performance", "optimization", "reliability"],
        answer: "Teams use profiling, load tests, and architecture reviews. Targets are defined per project.",
        category: "Strategic"
    },
    {
        question: "What is the roadmap for the product or platform I’m working on?",
        keywords: ["roadmap", "product", "platform"],
        answer: "Roadmaps are shared in project kickoff and team meetings. Ask your lead for the latest plan.",
        category: "Strategic"
    },
    {
        question: "How does the company encourage innovation and leadership among freshers?",
        keywords: ["innovation", "leadership", "freshers"],
        answer: "There are mentorship programs and innovation initiatives. Participation is encouraged through team goals.",
        category: "Strategic"
    },
    {
        question: "What are the expectations for client communication or stakeholder management?",
        keywords: ["client", "communication", "stakeholder", "management"],
        answer: "Be clear, timely, and professional in updates. Follow your project communication plan.",
        category: "Strategic"
    },
    {
        question: "How do I align my personal growth with the company’s vision?",
        keywords: ["growth", "vision", "goals", "development"],
        answer: "Set goals with your manager and revisit them regularly. Use the learning portal to build needed skills.",
        category: "Strategic"
    },
    {
        question: "How do client interactions and stakeholder management work?",
        keywords: ["client", "stakeholder", "communication", "management"],
        answer: "Follow the project communication plan and keep updates clear and timely. Escalate risks early.",
        category: "Leadership"
    },
    {
        question: "What are the expectations for leadership roles in the future?",
        keywords: ["leadership", "expectations", "roles", "future"],
        answer: "Leadership expectations focus on ownership, mentoring, and delivery. Discuss a growth plan with your manager.",
        category: "Leadership"
    },
    {
        question: "What are the long-term opportunities for moving into management or architecture roles?",
        keywords: ["long-term", "management", "architecture", "opportunities"],
        answer: "There are leadership and technical tracks. You can plan a path with your manager and HR.",
        category: "Leadership"
    },
    {
        question: "How do I build visibility and credibility within the organization?",
        keywords: ["visibility", "credibility", "organization", "reputation"],
        answer: "Deliver consistently, document your work, and share updates in the right forums. Seek feedback regularly.",
        category: "Leadership"
    }
];

// Simple synonym expansion for keyword matching
const SYNONYM_MAP = {
    leave: ['holiday', 'vacation', 'timeoff', 'pto'],
    holiday: ['leave', 'vacation', 'timeoff', 'pto'],
    vacation: ['leave', 'holiday', 'timeoff', 'pto'],
    pto: ['leave', 'holiday', 'vacation', 'timeoff'],
    wfh: ['remote', 'home', 'telework', 'workfromhome'],
    remote: ['wfh', 'home', 'telework', 'workfromhome'],
    home: ['wfh', 'remote', 'telework', 'workfromhome'],
    helpdesk: ['support', 'it', 'tech'],
    support: ['helpdesk', 'it', 'tech'],
    laptop: ['device', 'computer', 'pc'],
    laptoprepair: ['device', 'computer', 'pc'],
    hr: ['humanresources', 'peopleops'],
    payroll: ['salary', 'compensation', 'pay'],
    salary: ['payroll', 'compensation', 'pay'],
    reimbursement: ['expense', 'refund', 'claim']
};

function normalizeToken(token) {
    return token.replace(/[^a-z0-9]/gi, '').toLowerCase();
}

function buildSearchTerms(message) {
    const rawWords = message.split(/\s+/).map(normalizeToken).filter(Boolean);
    const expanded = new Set();

    for (const word of rawWords) {
        expanded.add(word);
        const synonyms = SYNONYM_MAP[word];
        if (synonyms) {
            for (const synonym of synonyms) {
                expanded.add(synonym);
            }
        }
    }

    return Array.from(expanded);
}

async function seedDatabase() {
    try {
        const ops = FAQ_SEED.map((faq) => ({
            updateOne: {
                filter: { question: faq.question },
                update: { $set: faq },
                upsert: true
            }
        }));

        const result = await Faq.bulkWrite(ops, { ordered: false });
        const upserts = result.upsertedCount || 0;
        const modified = result.modifiedCount || 0;
        console.log(`FAQ seed completed. Upserts: ${upserts}, modified: ${modified}`);
    } catch (error) {
        console.error('Seed Error:', error);
    }
}

// Database Connection
const MONGO_URI = process.env.MONGO_URI;
if (!MONGO_URI) {
    console.error('DB Connection Error: MONGO_URI is not set');
} else {
    mongoose.connect(MONGO_URI)
        .then(async () => {
            console.log('MongoDB Connected');
            await seedDatabase();
        })
        .catch(err => console.error('DB Connection Error:', err));
}

/**
 * Exponential Backoff for API calls (MANDATORY per requirements)
 */
async function fetchWithRetry(url, options, retries = 5, backoff = 1000) {
    try {
        if (!apiKey) {
            throw new Error('Missing GEMINI_API_KEY');
        }
        const response = await fetch(url, options);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        return await response.json();
    } catch (error) {
        if (retries <= 0) throw error;
        await new Promise(resolve => setTimeout(resolve, backoff));
        return fetchWithRetry(url, options, retries - 1, backoff * 2);
    }
}

/**
 * Main Chat Logic: Hybrid Dynamic Response
 */
app.post('/api/chat', async (req, res) => {
    const { message } = req.body;

    try {
        // 1. SEARCH: Find relevant documents in MongoDB (Simple Keyword Search)
        // This acts as the "Truth" for the LLM
        const searchTerms = buildSearchTerms(message);
        const relevantDocs = await Faq.find({ keywords: { $in: searchTerms } }).limit(3);
        
        // 2. CONTEXT: Format the data for Gemini
        const context = relevantDocs.length > 0 
            ? relevantDocs.map(d => `Topic: ${d.question}\nAnswer: ${d.answer}`).join('\n\n')
            : "No specific internal document found for this query.";

        // 3. GENERATE: Call Gemini to create a dynamic response
        const systemPrompt = `
            You are 'iColleague', a helpful and professional Virtual Assistant for our company.
            Your personality: Dynamic, polite, and efficient.
            
            INTERNAL COMPANY KNOWLEDGE:
            ${context}

            INSTRUCTIONS:
            - If the knowledge base has the answer, rephrase it naturally for the user.
            - If the knowledge base does not have the answer, use your general knowledge but add a disclaimer that they should verify with HR or IT.
            - Always provide dynamic, conversational answers. Do not just copy-paste.
            - Format your response with emojis where appropriate.
            - Keep responses short and clear (1-3 sentences).
        `;

        const payload = {
            contents: [{ parts: [{ text: message }] }],
            systemInstruction: { parts: [{ text: systemPrompt }] }
        };

        const result = await fetchWithRetry(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${apiKey}`,
            {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            }
        );

        const aiText = result.candidates?.[0]?.content?.parts?.[0]?.text || "I'm sorry, I'm having trouble thinking right now.";

        res.json({ answer: aiText });

    } catch (error) {
        console.error("Server Error:", error);
        res.status(500).json({ 
            answer: "System Error: I am currently unable to process your request. Please try again or contact support." 
        });
    }
});

app.listen(PORT, () => console.log(`iColleague Active: http://localhost:${PORT}`));