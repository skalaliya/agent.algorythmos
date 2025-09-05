export type AgentStep = {
    kind: "trigger" | "group" | "action";
    title: string;
    subtitle?: string;
    badge?: string;      // e.g. "On", "AI", "LinkedIn"
    items?: AgentStep[]; // only for "group"
  };
  
  export type AgentTemplate = {
    id: string;
    title: string;
    category: "Lead qualifier" | "Social Media Poster" | "Meeting Briefings" | "Meeting Follow-ups" | "Competitor Reports";
    icon?: string; // future
    steps: AgentStep[];
  };
  
  // Seed data (mirror your screenshots)
  export const agentTemplates: AgentTemplate[] = [
    {
      id: "meeting-briefing",
      title: "Meeting briefing generator",
      category: "Meeting Briefings",
      steps: [
        { kind: "trigger", title: "Instant trigger", subtitle: "4 hours before a meeting", badge: "On" },
        {
          kind: "group",
          title: "For each item in",
          subtitle: "Guests",
          items: [
            { kind: "action", title: "Skip internal guests" },
            { kind: "action", title: "Get 10 recent emails", badge: "Gmail" },
            { kind: "action", title: "Look up details of 10 recent meetings", badge: "Calendar" },
            { kind: "action", title: "Look up LinkedIn profile", badge: "LinkedIn" },
          ],
        },
        { kind: "action", title: "Write meeting briefing with AI", badge: "AI" },
        { kind: "action", title: "Email briefing to myself", badge: "Email" },
      ],
    },
    {
      id: "social-promoter",
      title: "Social media promoter",
      category: "Social Media Poster",
      steps: [
        { kind: "trigger", title: "Instant trigger", subtitle: "New YouTube video on channel", badge: "On" },
        {
          kind: "group",
          title: "",
          subtitle: "",
          items: [
            { kind: "action", title: "Write social media post with AI", badge: "AI" },
            { kind: "action", title: "Get video thumbnail", badge: "YouTube" },
            { kind: "action", title: "Get human approval to post" },
            { kind: "action", title: "Post on LinkedIn", badge: "LinkedIn" },
            { kind: "action", title: "Post on X/Twitter", badge: "X" },
            { kind: "action", title: "Post on BlueSky", badge: "Bsky" },
          ],
        },
      ],
    },
    {
      id: "competitor-analyzer",
      title: "Competitor analyzer",
      category: "Competitor Reports",
      steps: [
        { kind: "trigger", title: "Scheduled trigger", subtitle: "Run every last Sunday of the month", badge: "On" },
        { kind: "action", title: "Specify list of competitors", badge: "Table" },
        {
          kind: "group",
          title: "For each item in",
          subtitle: "Competitors",
          items: [
            { kind: "action", title: "Get recent LinkedIn posts", badge: "LinkedIn" },
            { kind: "action", title: "Write report for each competitor", badge: "AI" },
          ],
        },
        { kind: "action", title: "Email report to myself", badge: "Email" },
      ],
    },
    {
      id: "lead-qualifier",
      title: "Lead qualifier",
      category: "Lead qualifier",
      steps: [
        { kind: "trigger", title: "Instant trigger", subtitle: "New demo request received", badge: "On" },
        { kind: "action", title: "Enrich lead from LinkedIn", badge: "LinkedIn" },
        { kind: "action", title: "Score lead with AI", badge: "AI" },
        { kind: "action", title: "Create CRM record", badge: "HubSpot" },
      ],
    },
    {
      id: "meeting-followups",
      title: "Meeting follow-up assistant",
      category: "Meeting Follow-ups",
      steps: [
        { kind: "trigger", title: "Instant trigger", subtitle: "Transcript created", badge: "On" },
        { kind: "action", title: "Should we follow up?", badge: "AI" },
        { kind: "action", title: "Find event", badge: "Calendar" },
        { kind: "action", title: "Send follow up email", badge: "Email" },
      ],
    },
  ];
  
  // helper to group by category
  export const categories = [
    "Lead qualifier",
    "Social Media Poster",
    "Meeting Briefings",
    "Meeting Follow-ups",
    "Competitor Reports",
  ] as const;
  