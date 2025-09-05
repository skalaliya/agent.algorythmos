// Minimal shape; expand as you need
export type TemplateStep = {
  id: number;
  title: string;
  summary?: string;
  integrationIcon?: string; // e.g. "hubspot", "linkedin", "openai", "gmail", "slack"
};

export type Template = {
  slug: string;
  title: string;
  subtitle?: string;
  integrations: string[];   // ["hubspot","linkedin","openai","gmail","slack"]
  summary: string;
  steps: TemplateStep[];
  heroImage?: string;       // optional static image path
};

export const TEMPLATES: Template[] = [
  {
    slug: "demo-request-qualifier-hubspot",
    title: "Demo Request Qualifier",
    subtitle:
      "Automatically qualify sales demo requests based on prospect info and AI analysis.",
    integrations: ["hubspot", "linkedin", "openai", "gmail", "slack"],
    summary:
      "Analyze form submissions, pull LinkedIn & website context, classify with AI, then auto-reply or escalate.",
    heroImage: "/templates/demo-qualifier-hero.png",
    steps: [
      { id: 1, title: "New demo request received" },
      { id: 2, title: "Get the requestor's LinkedIn profile" },
      { id: 3, title: "Get contents from requestor's company website" },
      { id: 4, title: "Classify the lead with AI" },
      { id: 6, title: "Reply with scheduling link" }
    ]
  },
  {
    slug: "social-media-poster",
    title: "Social Media Poster",
    subtitle:
      "Automatically create and post social media content from YouTube videos.",
    integrations: ["youtube", "openai", "linkedin", "twitter", "slack"],
    summary:
      "Monitor YouTube channel for new videos, extract summaries with AI, create social posts, and publish across platforms.",
    heroImage: "/templates/social-poster-hero.png",
    steps: [
      { id: 1, title: "New YouTube video on channel" },
      { id: 2, title: "Extract video summary" },
      { id: 3, title: "Create social media posts" },
      { id: 4, title: "Post to LinkedIn & Twitter" }
    ]
  },
  {
    slug: "meeting-briefings",
    title: "Meeting Briefings",
    subtitle:
      "Generate comprehensive meeting briefings with attendee context and agenda.",
    integrations: ["calendar", "linkedin", "openai", "slack", "gmail"],
    summary:
      "Monitor calendar for upcoming meetings, gather attendee LinkedIn profiles, generate AI-powered briefings, and share via Slack.",
    heroImage: "/templates/meeting-briefings-hero.png",
    steps: [
      { id: 1, title: "4 hours before a meeting" },
      { id: 2, title: "Get attendee LinkedIn profiles" },
      { id: 3, title: "Generate briefing with AI" },
      { id: 4, title: "Send to Slack" }
    ]
  },
  {
    slug: "meeting-follow-ups",
    title: "Meeting Follow-ups",
    subtitle:
      "Automatically follow up after meetings with personalized next steps.",
    integrations: ["calendar", "openai", "gmail", "slack", "crm"],
    summary:
      "Process meeting transcripts, determine follow-up needs, generate personalized emails, and schedule next steps.",
    heroImage: "/templates/meeting-followups-hero.png",
    steps: [
      { id: 1, title: "Transcript created" },
      { id: 2, title: "Should we follow up?" },
      { id: 3, title: "End run if no follow-up needed" },
      { id: 4, title: "Find event and send follow-up" }
    ]
  },
  {
    slug: "competitor-reports",
    title: "Competitor Reports",
    subtitle:
      "Weekly automated competitor analysis and reporting.",
    integrations: ["linkedin", "openai", "gmail", "slack", "notion"],
    summary:
      "Monitor competitor LinkedIn activity, analyze trends with AI, generate comprehensive reports, and distribute to team.",
    heroImage: "/templates/competitor-reports-hero.png",
    steps: [
      { id: 1, title: "Weekly schedule trigger" },
      { id: 2, title: "Get recent LinkedIn posts" },
      { id: 3, title: "Write report for each competitor" },
      { id: 4, title: "Email report to myself" }
    ]
  }
];