// Story fixtures for the App Builder templates: software projects and releases, design assets
// and marketing campaigns. Story-only; not part of the library build.
import type { ActivityItem, MediaItem, NoteItem, StatusTone } from '../../index';

const DAY = 86_400_000;
/** An ISO timestamp `days` before now (fractions allowed), so relative times read naturally. */
export const daysAgo = (days: number) => new Date(Date.now() - days * DAY).toISOString();
/** A calendar day (`YYYY-MM-DD`) `days` from today. */
export const dayFromNow = (days: number) => {
  const d = new Date(Date.now() + days * DAY);
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
};

// ---------------------------------------------------------------------------------------------
// Software: projects, issues, releases
// ---------------------------------------------------------------------------------------------

export type ProjectStatus = 'on_track' | 'at_risk' | 'off_track' | 'shipped';

export interface Project {
  id: string;
  name: string;
  key: string;
  status: ProjectStatus;
  team: 'Platform' | 'Web' | 'Mobile' | 'Data';
  lead: string;
  openIssues: number;
  progress: number;
  targetDate: string;
  updatedAt: string;
  nextRelease: string | null;
  repo: string;
  description: string;
  labels: string[];
}

export const PROJECT_STATUS_TONES: Record<ProjectStatus, StatusTone> = {
  on_track: 'success',
  at_risk: 'warning',
  off_track: 'danger',
  shipped: 'info',
};
export const PROJECT_STATUS_LABELS: Record<ProjectStatus, string> = {
  on_track: 'On track',
  at_risk: 'At risk',
  off_track: 'Off track',
  shipped: 'Shipped',
};

const PROJECT_SEED: Array<
  [string, string, ProjectStatus, Project['team'], string, number, number, string[]]
> = [
  ['Checkout redesign', 'CHK', 'on_track', 'Web', 'Maya Patel', 14, 0.68, ['payments', 'ux']],
  ['Billing service v2', 'BIL', 'at_risk', 'Platform', 'Jonas Weber', 31, 0.42, ['payments']],
  ['iOS offline mode', 'IOS', 'on_track', 'Mobile', 'Priya Raman', 9, 0.81, ['mobile', 'sync']],
  ['Search relevance', 'SRC', 'off_track', 'Data', 'Liam Chen', 22, 0.27, ['search', 'ml']],
  ['Design tokens rollout', 'TOK', 'shipped', 'Web', 'Sofia Rossi', 0, 1, ['design-system']],
  ['Android widgets', 'AND', 'on_track', 'Mobile', 'Kwame Mensah', 6, 0.55, ['mobile']],
  ['Event pipeline', 'EVT', 'at_risk', 'Data', 'Hana Suzuki', 18, 0.49, ['analytics', 'infra']],
  ['SSO for teams', 'SSO', 'on_track', 'Platform', 'Diego Alvarez', 11, 0.73, ['auth']],
  ['Onboarding checklist', 'ONB', 'shipped', 'Web', 'Emma Larsen', 0, 1, ['growth', 'ux']],
  ['Rate limiter', 'RTL', 'on_track', 'Platform', 'Jonas Weber', 4, 0.88, ['infra']],
  ['Push notifications', 'PSH', 'at_risk', 'Mobile', 'Priya Raman', 15, 0.38, ['mobile']],
  ['Usage dashboards', 'USG', 'on_track', 'Data', 'Liam Chen', 8, 0.61, ['analytics']],
  ['Accessibility audit fixes', 'A11Y', 'on_track', 'Web', 'Maya Patel', 12, 0.57, ['a11y']],
  ['Postgres 17 upgrade', 'PG17', 'off_track', 'Platform', 'Diego Alvarez', 27, 0.19, ['infra']],
  ['In-app feedback', 'FDB', 'shipped', 'Web', 'Emma Larsen', 0, 1, ['growth']],
  ['Forecasting model', 'FCST', 'at_risk', 'Data', 'Hana Suzuki', 13, 0.33, ['ml']],
  ['Tablet layouts', 'TAB', 'on_track', 'Mobile', 'Kwame Mensah', 7, 0.64, ['mobile', 'ux']],
  ['Audit log export', 'AUD', 'on_track', 'Platform', 'Sofia Rossi', 5, 0.76, ['compliance']],
  ['Marketing site CMS', 'CMS', 'at_risk', 'Web', 'Sofia Rossi', 19, 0.45, ['content']],
  ['Feature flag service', 'FLG', 'shipped', 'Platform', 'Jonas Weber', 0, 1, ['infra']],
  ['Image CDN migration', 'CDN', 'on_track', 'Platform', 'Diego Alvarez', 3, 0.9, ['infra']],
  ['Referral program', 'REF', 'off_track', 'Web', 'Emma Larsen', 24, 0.22, ['growth']],
  ['Churn insights', 'CHN', 'on_track', 'Data', 'Liam Chen', 10, 0.52, ['analytics']],
  ['Dark mode polish', 'DRK', 'shipped', 'Mobile', 'Priya Raman', 0, 1, ['ux']],
];

export const PROJECTS: Project[] = PROJECT_SEED.map(
  ([name, key, status, team, lead, openIssues, progress, labels], i) => ({
    id: `prj-${String(i + 1).padStart(3, '0')}`,
    name,
    key,
    status,
    team,
    lead,
    openIssues,
    progress,
    targetDate: dayFromNow(status === 'shipped' ? -(i * 3 + 5) : (i % 7) * 9 + 6),
    updatedAt: daysAgo(i * 0.37 + (i % 3) * 0.9),
    nextRelease: status === 'shipped' ? null : `v${2 + (i % 3)}.${(i * 7) % 10}.0`,
    repo: `https://github.com/acme/${key.toLowerCase()}`,
    description: `${name} for the ${team} team. Tracks the epics, issues and releases needed to ship it, with weekly status updates from ${lead.split(' ')[0]}.`,
    labels,
  })
);

export type IssuePriority = 'urgent' | 'high' | 'medium' | 'low';
export interface Issue {
  id: string;
  title: string;
  priority: IssuePriority;
  assignee: string;
  updatedAt: string;
}
export const ISSUE_PRIORITY_TONES: Record<IssuePriority, StatusTone> = {
  urgent: 'danger',
  high: 'warning',
  medium: 'info',
  low: 'neutral',
};

const ISSUE_TITLES = [
  'Card form loses focus after validation error',
  'Retry webhook delivery with backoff',
  'Totals rounding differs from invoice PDF',
  'Add loading state to the payment step',
  'Migrate saved cards to the new vault',
  'Screen reader skips the order summary',
  'Flaky e2e test on Safari',
];

/** A project's open issues (deterministic per project). */
export function issuesFor(project: Project): Issue[] {
  const count = Math.min(project.openIssues, ISSUE_TITLES.length);
  const people = ['Maya Patel', 'Jonas Weber', 'Liam Chen', 'Hana Suzuki', 'Kwame Mensah'];
  const priorities: IssuePriority[] = ['urgent', 'high', 'medium', 'low'];
  return Array.from({ length: count }, (_, i) => ({
    id: `${project.key}-${120 + i * 7}`,
    title: ISSUE_TITLES[(i + project.name.length) % ISSUE_TITLES.length],
    priority: priorities[(i + project.openIssues) % priorities.length],
    assignee: people[(i + project.key.length) % people.length],
    updatedAt: daysAgo(i * 0.6 + 0.1),
  }));
}

export interface Release {
  id: string;
  version: string;
  name: string;
  status: 'scheduled' | 'in_progress' | 'released' | 'rolled_back';
  project: string;
  owner: { name: string; email: string };
  releaseDate: string;
  createdAt: string;
  updatedAt: string;
  rollout: number;
  issuesClosed: number;
  crashFreeRate: number;
  buildSize: number;
  changelogUrl: string;
  platforms: string[];
  approvers: string[];
  description: string;
}

export const RELEASE_STATUS_TONES: Record<Release['status'], StatusTone> = {
  scheduled: 'info',
  in_progress: 'warning',
  released: 'success',
  rolled_back: 'danger',
};
export const RELEASE_STATUS_LABELS: Record<Release['status'], string> = {
  scheduled: 'Scheduled',
  in_progress: 'Rolling out',
  released: 'Released',
  rolled_back: 'Rolled back',
};

export const RELEASE: Release = {
  id: 'rel_8f2c41d9',
  version: 'v3.4.0',
  name: 'Checkout 3.4',
  status: 'in_progress',
  project: 'Checkout redesign',
  owner: { name: 'Maya Patel', email: 'maya.patel@acme.dev' },
  releaseDate: dayFromNow(2),
  createdAt: daysAgo(12),
  updatedAt: daysAgo(0.08),
  rollout: 0.35,
  issuesClosed: 42,
  crashFreeRate: 0.9971,
  buildSize: 18_400_000,
  changelogUrl: 'https://github.com/acme/checkout/releases/tag/v3.4.0',
  platforms: ['Web', 'iOS', 'Android'],
  approvers: ['Jonas Weber', 'Sofia Rossi'],
  description:
    'Single-page checkout with saved payment methods, inline address validation and a faster payment step. Rolling out to 35% of web traffic; mobile follows after the crash-free rate holds above 99.5% for 48 hours.',
};

export const RELEASE_ACTIVITY: ActivityItem[] = [
  {
    id: 'a1',
    at: daysAgo(0.08),
    actor: { name: 'Maya Patel' },
    text: 'Raised the web rollout from 10% to 35%',
  },
  {
    id: 'a2',
    at: daysAgo(0.9),
    actor: { name: 'Jonas Weber' },
    text: 'Approved the release for production',
  },
  {
    id: 'a3',
    at: daysAgo(1.4),
    actor: { name: 'CI' },
    text: 'Build 3.4.0-rc.3 passed 1,284 checks',
  },
  {
    id: 'a4',
    at: daysAgo(2.2),
    actor: { name: 'Sofia Rossi' },
    text: 'Approved the design review',
  },
  {
    id: 'a5',
    at: daysAgo(3),
    actor: { name: 'Liam Chen' },
    text: 'Closed CHK-148 "Totals rounding differs from invoice PDF"',
  },
  {
    id: 'a6',
    at: daysAgo(5.5),
    actor: { name: 'Maya Patel' },
    text: 'Created the release from milestone "Checkout 3.4"',
  },
];

export const RELEASE_NOTES: NoteItem[] = [
  {
    id: 'n1',
    author: 'Jonas Weber',
    at: daysAgo(0.7),
    body: 'Error rates on the payment step are flat after the 35% bump. Holding here overnight before going to 60%.',
  },
  {
    id: 'n2',
    author: 'Priya Raman',
    at: daysAgo(1.8),
    body: 'iOS build is ready but waiting on App Review. Expect it Thursday.',
  },
];

// ---------------------------------------------------------------------------------------------
// Graphic design: assets with inline SVG thumbnails
// ---------------------------------------------------------------------------------------------

/** An inline SVG placeholder thumbnail as a `data:image/svg+xml` URI. */
function thumbnail(kind: number, from: string, to: string, label: string): string {
  const shapes = [
    // Logo mark: concentric rings
    `<circle cx="160" cy="110" r="58" fill="none" stroke="#fff" stroke-opacity=".9" stroke-width="14"/><circle cx="160" cy="110" r="22" fill="#fff" fill-opacity=".9"/>`,
    // Poster: stacked bars
    `<rect x="70" y="52" width="180" height="22" rx="6" fill="#fff" fill-opacity=".92"/><rect x="70" y="88" width="132" height="14" rx="5" fill="#fff" fill-opacity=".6"/><rect x="70" y="116" width="156" height="14" rx="5" fill="#fff" fill-opacity=".6"/><rect x="70" y="156" width="72" height="24" rx="12" fill="#fff"/>`,
    // Icon set: grid of rounded squares
    `<g fill="#fff" fill-opacity=".88"><rect x="82" y="44" width="40" height="40" rx="10"/><rect x="140" y="44" width="40" height="40" rx="20"/><rect x="198" y="44" width="40" height="40" rx="4"/><rect x="82" y="102" width="40" height="40" rx="20"/><rect x="140" y="102" width="40" height="40" rx="4"/><rect x="198" y="102" width="40" height="40" rx="10"/></g>`,
    // Illustration: hills and sun
    `<circle cx="226" cy="64" r="26" fill="#fff" fill-opacity=".9"/><path d="M0 220 L0 150 Q70 92 140 140 T320 120 L320 220 Z" fill="#fff" fill-opacity=".35"/><path d="M0 220 L0 176 Q90 130 180 168 T320 160 L320 220 Z" fill="#fff" fill-opacity=".6"/>`,
    // Banner: diagonal stripes
    `<g stroke="#fff" stroke-opacity=".45" stroke-width="18"><path d="M-20 200 L120 20"/><path d="M40 220 L200 20"/><path d="M120 240 L280 20"/></g><rect x="96" y="92" width="128" height="36" rx="8" fill="#fff" fill-opacity=".95"/>`,
    // Photo: frame
    `<rect x="60" y="40" width="200" height="140" rx="12" fill="none" stroke="#fff" stroke-opacity=".85" stroke-width="8"/><circle cx="118" cy="88" r="16" fill="#fff" fill-opacity=".85"/><path d="M68 172 L140 118 L184 150 L214 128 L252 172 Z" fill="#fff" fill-opacity=".85"/>`,
  ];
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 220" role="img" aria-label="${label}"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${from}"/><stop offset="1" stop-color="${to}"/></linearGradient></defs><rect width="320" height="220" fill="url(#g)"/>${shapes[kind % shapes.length]}</svg>`;
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
}

export type AssetType = 'logo' | 'poster' | 'icons' | 'illustration' | 'banner' | 'photo';
export type AssetStatus = 'approved' | 'in_review' | 'draft' | 'archived';

export interface Asset {
  id: string;
  name: string;
  type: AssetType;
  status: AssetStatus;
  format: 'SVG' | 'PNG' | 'PDF' | 'JPG' | 'FIG';
  width: number;
  height: number;
  size: number;
  owner: string;
  client: string;
  updatedAt: string;
  thumbnail: string;
  tags: string[];
}

export const ASSET_STATUS_TONES: Record<AssetStatus, StatusTone> = {
  approved: 'success',
  in_review: 'warning',
  draft: 'neutral',
  archived: 'neutral',
};
export const ASSET_TYPE_LABELS: Record<AssetType, string> = {
  logo: 'Logo',
  poster: 'Poster',
  icons: 'Icon set',
  illustration: 'Illustration',
  banner: 'Banner',
  photo: 'Photo',
};

const ASSET_TYPES: AssetType[] = ['logo', 'poster', 'icons', 'illustration', 'banner', 'photo'];
// Dark enough gradients that the white marks keep their contrast in both themes.
const GRADIENTS: Array<[string, string]> = [
  ['#0f766e', '#115e59'],
  ['#4338ca', '#6d28d9'],
  ['#be123c', '#9f1239'],
  ['#b45309', '#c2410c'],
  ['#0369a1', '#1d4ed8'],
  ['#047857', '#0f766e'],
  ['#7c3aed', '#a21caf'],
  ['#334155', '#0f172a'],
];

const ASSET_SEED: Array<[string, string, AssetStatus, Asset['format']]> = [
  ['Northwind logo mark', 'Northwind', 'approved', 'SVG'],
  ['Spring sale poster', 'Bloom & Co', 'in_review', 'PDF'],
  ['Dashboard icon set', 'Acme', 'approved', 'SVG'],
  ['Onboarding hero', 'Acme', 'draft', 'FIG'],
  ['Black Friday banner', 'Bloom & Co', 'approved', 'PNG'],
  ['Team offsite photo', 'Internal', 'approved', 'JPG'],
  ['Halcyon wordmark', 'Halcyon', 'in_review', 'SVG'],
  ['Conference poster', 'DevDays', 'approved', 'PDF'],
  ['Weather icon set', 'Skyline', 'draft', 'SVG'],
  ['Empty state art', 'Acme', 'approved', 'SVG'],
  ['Newsletter header', 'Northwind', 'in_review', 'PNG'],
  ['Product shot: Aero 2', 'Halcyon', 'approved', 'JPG'],
  ['App icon refresh', 'Skyline', 'draft', 'FIG'],
  ['Summer campaign poster', 'Bloom & Co', 'archived', 'PDF'],
  ['Payment icons', 'Acme', 'approved', 'SVG'],
  ['404 illustration', 'Acme', 'in_review', 'SVG'],
  ['Webinar banner', 'DevDays', 'approved', 'PNG'],
  ['Studio portrait', 'Internal', 'archived', 'JPG'],
];

export const ASSETS: Asset[] = ASSET_SEED.map(([name, client, status, format], i) => {
  const type = ASSET_TYPES[i % ASSET_TYPES.length];
  const [from, to] = GRADIENTS[i % GRADIENTS.length];
  const portrait = type === 'poster';
  return {
    id: `ast-${String(i + 1).padStart(3, '0')}`,
    name,
    type,
    status,
    format,
    width: portrait ? 2480 : type === 'banner' ? 1600 : 1920,
    height: portrait ? 3508 : type === 'banner' ? 400 : 1080,
    size: Math.round(48_000 + ((i * 7919) % 23) * 410_000),
    owner: ['Sofia Rossi', 'Emma Larsen', 'Kwame Mensah', 'Hana Suzuki'][i % 4],
    client,
    updatedAt: daysAgo(i * 0.8 + 0.2),
    thumbnail: thumbnail(i, from, to, name),
    tags: [ASSET_TYPE_LABELS[type].toLowerCase(), client.toLowerCase()],
  };
});

export const RELEASE_FILES: MediaItem[] = ASSETS.slice(0, 4).map((a, i) => ({
  id: a.id,
  src: a.thumbnail,
  alt: `${a.name} preview`,
  name: ['checkout-hero.png', 'payment-icons.svg', 'release-notes.pdf', 'saved-cards.fig'][i],
  size: a.size,
}));

// ---------------------------------------------------------------------------------------------
// Marketing: campaigns, KPIs, channels
// ---------------------------------------------------------------------------------------------

export type Channel = 'Search' | 'Social' | 'Email' | 'Display' | 'Affiliate';
export const CHANNELS: Channel[] = ['Search', 'Social', 'Email', 'Display', 'Affiliate'];

export interface CampaignRow {
  id: string;
  name: string;
  channel: Channel;
  status: 'live' | 'paused' | 'ended';
  spend: number;
  conversions: number;
  roas: number;
}

export const CAMPAIGN_STATUS_TONES: Record<CampaignRow['status'], StatusTone> = {
  live: 'success',
  paused: 'warning',
  ended: 'neutral',
};

export const TOP_CAMPAIGNS: CampaignRow[] = [
  {
    id: 'c1',
    name: 'Spring launch',
    channel: 'Search',
    status: 'live',
    spend: 18_420,
    conversions: 1_284,
    roas: 4.6,
  },
  {
    id: 'c2',
    name: 'Retargeting: cart',
    channel: 'Display',
    status: 'live',
    spend: 7_310,
    conversions: 802,
    roas: 5.9,
  },
  {
    id: 'c3',
    name: 'Creator collab',
    channel: 'Social',
    status: 'paused',
    spend: 12_050,
    conversions: 611,
    roas: 2.4,
  },
  {
    id: 'c4',
    name: 'Win-back series',
    channel: 'Email',
    status: 'live',
    spend: 1_980,
    conversions: 457,
    roas: 11.2,
  },
  {
    id: 'c5',
    name: 'Partner bundle',
    channel: 'Affiliate',
    status: 'ended',
    spend: 4_400,
    conversions: 298,
    roas: 3.1,
  },
];

export interface Point {
  date: string;
  value: number;
}

/** Daily conversions for the last `days` days: a weekly rhythm on a gentle upward trend. */
export function conversionSeries(days: number): Point[] {
  return Array.from({ length: days }, (_, i) => {
    const weekday = (i + 2) % 7;
    const weekend = weekday === 5 || weekday === 6 ? -38 : 0;
    const trend = 210 + (i / days) * 90;
    const wobble = Math.sin(i * 1.7) * 14 + Math.cos(i * 0.6) * 9;
    return { date: dayFromNow(i - days + 1), value: Math.round(trend + weekend + wobble) };
  });
}

export const RANGE_DAYS: Record<string, number> = { '7d': 7, '30d': 30, '90d': 90 };

export interface ChannelSpend {
  channel: Channel;
  spend: number;
}

/** Spend by channel for a range, largest first. */
export function channelSpend(days: number): ChannelSpend[] {
  const daily: Record<Channel, number> = {
    Search: 1_020,
    Social: 640,
    Display: 410,
    Affiliate: 190,
    Email: 85,
  };
  return CHANNELS.map((channel) => ({ channel, spend: Math.round(daily[channel] * days) })).sort(
    (a, b) => b.spend - a.spend
  );
}

export interface Kpis {
  spend: number;
  conversions: number;
  cpa: number;
  roas: number;
}

export function kpisFor(days: number): Kpis {
  const series = conversionSeries(days);
  const conversions = series.reduce((sum, p) => sum + p.value, 0);
  const spend = channelSpend(days).reduce((sum, c) => sum + c.spend, 0);
  return { spend, conversions, cpa: spend / conversions, roas: 4.3 };
}

export const MARKETING_ACTIVITY: ActivityItem[] = [
  {
    id: 'm1',
    at: daysAgo(0.05),
    actor: { name: 'Emma Larsen' },
    text: 'Raised the daily budget of "Spring launch" to $650',
  },
  {
    id: 'm2',
    at: daysAgo(0.4),
    actor: { name: 'Kwame Mensah' },
    text: 'Paused "Creator collab" while new creatives are reviewed',
  },
  {
    id: 'm3',
    at: daysAgo(1.1),
    actor: { name: 'Hana Suzuki' },
    text: 'Launched the A/B test "Subject line: urgency vs value"',
  },
  {
    id: 'm4',
    at: daysAgo(2.6),
    actor: { name: 'Emma Larsen' },
    text: 'Ended "Partner bundle" (ROAS 3.1)',
  },
  {
    id: 'm5',
    at: daysAgo(4),
    actor: { name: 'Sofia Rossi' },
    text: 'Uploaded 6 new display banners',
  },
  {
    id: 'm6',
    at: daysAgo(6),
    actor: { name: 'Kwame Mensah' },
    text: 'Connected the Affiliate network account',
  },
];
