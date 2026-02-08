const mongoose = require('mongoose');
const Faq = require('./models/Faq');

const MONGO_URI = 'mongodb://localhost:27017/icolleague_db';

const expandedPolicies = [
  // --- HR CATEGORY ---
  {
    question: "What are the different types of leave available?",
    keywords: ["leave", "sick", "casual", "paternity", "maternity", "bereavement", "vacation"],
    answer: "We offer 15 days of Annual Leave, 10 days of Sick Leave, 5 days of Casual Leave, and 26 weeks of Maternity Leave. Paternity leave is 2 weeks.",
    category: "HR"
  },
  {
    question: "How long is the employee probation period?",
    keywords: ["probation", "notice period", "permanent", "confirm"],
    answer: "The standard probation period is 6 months. A performance review will be conducted in the 5th month for confirmation.",
    category: "HR"
  },
  {
    question: "What is the policy on workplace harassment?",
    keywords: ["harassment", "bullying", "complaint", "posh", "safety", "conduct"],
    answer: "The company has a zero-tolerance policy for harassment. Any grievances can be reported anonymously via the 'Ethics Portal' or directly to the HR Head.",
    category: "HR"
  },

  // --- IT & SECURITY ---
  {
    question: "What should I do if I lose my company laptop?",
    keywords: ["lost", "stolen", "laptop", "missing", "macbook", "hardware"],
    answer: "Immediately report a lost device to the IT Asset Team and the Security Desk. We will initiate a remote wipe to protect company data.",
    category: "IT"
  },
  {
    question: "Are we allowed to install personal software on work machines?",
    keywords: ["software", "install", "download", "admin", "games", "apps"],
    answer: "Only software from the 'Company App Catalog' is permitted. Unauthorized software is a security risk and may be automatically uninstalled.",
    category: "IT"
  },
  {
    question: "What is the password renewal policy?",
    keywords: ["password", "reset", "expire", "login", "security"],
    answer: "System passwords must be changed every 90 days. They must be at least 12 characters long and include a mix of symbols and numbers.",
    category: "IT"
  },

  // --- FINANCE & EXPENSES ---
  {
    question: "When is the monthly salary credited?",
    keywords: ["salary", "pay", "money", "credit", "payroll", "payslip"],
    answer: "Salaries are processed and credited on the last working day of every month.",
    category: "Finance"
  },
  {
    question: "How do I claim reimbursement for travel expenses?",
    keywords: ["expense", "claim", "money back", "travel", "cab", "hotel", "bill"],
    answer: "Submit your digital receipts through the 'Expensify' portal. Claims must be submitted within 30 days of the expenditure.",
    category: "Finance"
  },
  {
    question: "What is the daily meal allowance during business travel?",
    keywords: ["food", "meal", "allowance", "dinner", "budget", "travel"],
    answer: "The daily meal allowance for domestic travel is $50 and for international travel is $80. Alcohol is not reimbursable.",
    category: "Finance"
  },

  // --- OFFICE & GENERAL ---
  {
    question: "What are the visitor entry rules?",
    keywords: ["visitor", "guest", "friend", "family", "entry", "lobby"],
    answer: "All visitors must be pre-registered in the 'Visitor Management System'. They must wear a 'Guest' badge at all times and be escorted by an employee.",
    category: "General"
  },
  {
    question: "Is there a smoking or vaping zone?",
    keywords: ["smoke", "vape", "cigarette", "smoking area"],
    answer: "Smoking and vaping are strictly prohibited inside the building. Designated smoking zones are located at the North Gate parking lot.",
    category: "General"
  },
  {
    question: "How can I book a conference room?",
    keywords: ["meeting", "room", "book", "schedule", "conference", "cabin"],
    answer: "Rooms can be booked via the Outlook Calendar. Please clear the room 5 minutes before your time ends for the next group.",
    category: "General"
  },
  {
    question: "What is the referral bonus for new hires?",
    keywords: ["refer", "hiring", "bonus", "friend", "job", "recruitment"],
    answer: "We offer a $1,000 referral bonus if your recommended candidate completes 3 months of service.",
    category: "General"
  }
];

async function seed() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("Connected to MongoDB...");
    
    await Faq.deleteMany({});
    console.log("Cleared old policies...");
    
    await Faq.insertMany(expandedPolicies);
    console.log(`Successfully added ${expandedPolicies.length} new policies!`);
    
    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

seed();