'use client';

import Link from 'next/link';
import { useState } from 'react';

export default function Hero() {
  const [activeAgent, setActiveAgent] = useState('Lead qualifier');

  const agentTemplates = {
    'Lead qualifier': {
      title: 'Lead qualifier',
      steps: [
        { label: 'Instant trigger • New demo request received', type: 'Trigger', icon: '⚡', color: 'emerald' },
        { label: 'Enrich lead from LinkedIn', type: 'LinkedIn', icon: '2', color: 'gray' },
        { label: 'Score lead with AI', type: 'AI', icon: '3', color: 'gray' },
        { label: 'Create CRM record', type: 'HubSpot', icon: '4', color: 'gray' },
      ]
    },
    'Social Media Poster': {
      title: 'Social Media Poster',
      steps: [
        { label: 'Instant trigger • New YouTube video on channel', type: 'Trigger', icon: '⚡', color: 'emerald' },
        { label: 'Extract video summary', type: 'AI', icon: '2', color: 'gray' },
        { label: 'Create social media posts', type: 'AI', icon: '3', color: 'gray' },
        { label: 'Post to LinkedIn & Twitter', type: 'Social', icon: '4', color: 'gray' },
      ]
    },
    'Meeting Briefings': {
      title: 'Meeting Briefings',
      steps: [
        { label: 'Instant trigger • 4 hours before a meeting', type: 'Trigger', icon: '⚡', color: 'emerald' },
        { label: 'Get attendee LinkedIn profiles', type: 'LinkedIn', icon: '2', color: 'gray' },
        { label: 'Generate briefing with AI', type: 'AI', icon: '3', color: 'gray' },
        { label: 'Send to Slack', type: 'Slack', icon: '4', color: 'gray' },
      ]
    },
    'Meeting Follow-ups': {
      title: 'Meeting Follow-ups',
      steps: [
        { label: 'Instant trigger • Transcript created', type: 'Trigger', icon: '⚡', color: 'emerald' },
        { label: 'Should we follow up?', type: 'Decision', icon: '⭐', color: 'blue' },
        { label: 'End run if 2 • Send follow up email is no', type: 'Rule', icon: '3', color: 'green' },
        { label: 'Find event', type: 'Calendar', icon: '📅', color: 'blue' },
      ]
    },
    'Competitor Reports': {
      title: 'Competitor Reports',
      steps: [
        { label: 'Instant trigger • Weekly schedule', type: 'Trigger', icon: '⚡', color: 'emerald' },
        { label: 'Get recent LinkedIn posts', type: 'LinkedIn', icon: '2', color: 'gray' },
        { label: 'Write report for each competitor', type: 'AI', icon: '3', color: 'gray' },
        { label: 'Email report to myself', type: 'Email', icon: '4', color: 'gray' },
      ]
    }
  };

  const currentTemplate = agentTemplates[activeAgent as keyof typeof agentTemplates];

  // Helper function to map agent names to template slugs
  const getTemplateSlug = (agentName: string): string => {
    const slugMap: Record<string, string> = {
      'Lead qualifier': 'demo-request-qualifier-hubspot',
      'Social Media Poster': 'social-media-poster',
      'Meeting Briefings': 'meeting-briefings',
      'Meeting Follow-ups': 'meeting-follow-ups',
      'Competitor Reports': 'competitor-reports'
    };
    return slugMap[agentName] || 'demo-request-qualifier-hubspot';
  };
  return (
    <section className="bg-canvas border-b border-white/5">
      <div className="mx-auto max-w-7xl px-4 pb-16 pt-20 sm:px-6 lg:px-8 lg:pb-24 lg:pt-28">
        {/* Main Headline */}
        <h1 className="mx-auto max-w-4xl text-center text-4xl font-extrabold leading-tight text-white sm:text-5xl md:text-6xl">
          The easiest way for{' '}
          <span className="bg-gradient-to-r from-primary via-accent to-deep bg-clip-text text-transparent">
            everyone
          </span>{' '}
          to build AI agents
        </h1>
        
        {/* Subheadline */}
        <p className="mx-auto mt-6 max-w-2xl text-center text-lg text-white/70">
          Create powerful AI teams for your whole business with Algorythmos. Queue, schedule, and
          track jobs end-to-end—start in minutes, scale with confidence.
        </p>

        {/* Agent Templates Section */}
        <div className="mx-auto mt-12 max-w-6xl">
          <h2 className="mb-8 text-center text-3xl font-bold text-white">
            Start with ready-made agents
          </h2>
          
          {/* Agent Type Chips */}
          <div className="mb-8 flex flex-wrap justify-center gap-2">
            {['Lead qualifier', 'Social Media Poster', 'Meeting Briefings', 'Meeting Follow-ups', 'Competitor Reports'].map(
              (type) => (
                <button
                  key={type}
                  onClick={() => setActiveAgent(type)}
                  className={`rounded-xl border px-4 py-2 text-sm font-medium transition ${
                    activeAgent === type
                      ? 'border-white bg-white/10 text-white'
                      : 'border-white/10 bg-white/[0.03] text-white/80 hover:bg-white/[0.06]'
                  }`}
                >
                  {type}
                </button>
              )
            )}
          </div>

          {/* Dynamic Agent Template */}
          <div className="mx-auto max-w-2xl rounded-3xl border border-white/10 bg-white/[0.02] p-6">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-xl font-semibold text-white/90">{currentTemplate.title}</h3>
              <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/70">
                Template
              </span>
            </div>

            {/* Workflow Steps */}
            <div className="space-y-3 rounded-2xl bg-white/[0.02] p-4">
              {currentTemplate.steps.map((step, index) => {
                const isTrigger = step.type === 'Trigger';
                const colorClasses = {
                  emerald: 'border-emerald-300/20 bg-emerald-300/10 text-emerald-100',
                  gray: 'border-white/10 bg-white/[0.03] text-white/90',
                  blue: 'border-blue-300/20 bg-blue-300/10 text-blue-100',
                  green: 'border-green-300/20 bg-green-300/10 text-green-100',
                };
                const bgClasses = {
                  emerald: 'bg-emerald-500',
                  gray: 'bg-gray-500',
                  blue: 'bg-blue-500',
                  green: 'bg-green-500',
                };

                return (
                  <div
                    key={index}
                    className={`flex items-center justify-between rounded-xl border px-4 py-3 ${
                      isTrigger ? 'rounded-xl' : 'rounded-lg'
                    } ${colorClasses[step.color as keyof typeof colorClasses]}`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`h-6 w-6 rounded-full flex items-center justify-center ${
                        bgClasses[step.color as keyof typeof bgClasses]
                      }`}>
                        <span className="text-xs text-white">{step.icon}</span>
                      </div>
                      <span className={`font-medium ${isTrigger ? 'font-semibold' : ''}`}>
                        {step.label}
                      </span>
                    </div>
                    {isTrigger ? (
                      <span className="rounded-full bg-emerald-500/20 px-3 py-1 text-xs font-medium text-emerald-200">
                        On
                      </span>
                    ) : (
                      <span className="rounded-full border border-white/10 bg-white/[0.05] px-2 py-1 text-xs text-white/70">
                        {step.type}
                      </span>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Action Buttons */}
            <div className="mt-6 flex gap-3">
              <Link
                href={`/templates/${getTemplateSlug(activeAgent)}`}
                className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-white/90 hover:bg-white/10 transition"
              >
                Show template
              </Link>
              <Link
                href={`/workflows/new?template=${getTemplateSlug(activeAgent)}`}
                className="rounded-xl px-4 py-2 text-sm font-semibold text-white transition hover:opacity-90"
                style={{ background: "linear-gradient(90deg,#6D00FF 0%,#7658E7 50%,#3715E0 100%)" }}
              >
                Try this agent
              </Link>
            </div>
          </div>
        </div>

        {/* CTA Buttons */}
        <div className="mx-auto mt-8 flex max-w-md items-center justify-center gap-4">
          <Link
            href="/signup"
            className="rounded-2xl bg-gradient-to-r from-primary to-accent px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:opacity-90"
          >
            Start for free
          </Link>
          <Link
            href="/docs"
            className="rounded-2xl border border-white/10 bg-white/[0.03] px-6 py-3 text-sm font-semibold text-white/90 transition hover:bg-white/[0.06]"
          >
            Explore features
          </Link>
        </div>


      </div>
    </section>
  );
}