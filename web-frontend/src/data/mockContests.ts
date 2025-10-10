import { Contest, ContestSection, FeaturedContest } from '../types/contest';

// Featured Contest
export const featuredContest: FeaturedContest = {
  id: 'hackerrank-build-challenges',
  title: 'Build HackerRank Challenges',
  description: 'An opportunity to join our exclusive expert network',
  featuredDescription: 'An opportunity to join our exclusive expert network',
  status: 'featured',
  type: 'hiring',
  startDate: '2025-10-21',
  endDate: '2025-10-21',
  registrationEndDate: '2025-10-21',
  actionButtonText: 'Register Now',
  actionButtonLink: '/contests/hackerrank-build-challenges',
  isRegistrationOpen: true,
  registrationInfo: 'Registrations open till 21st October',
  logoUrl: '/images/hackerrank-logo.png'
};

// Active Contests
export const activeContests: Contest[] = [
  {
    id: 'project-euler-plus',
    title: 'ProjectEuler+',
    description: 'Open Indefinitely',
    status: 'active',
    type: 'practice',
    endDate: 'Open Indefinitely',
    actionButtonText: 'View Details',
    actionButtonLink: '/contests/project-euler-plus',
    isRegistrationOpen: true,
    difficulty: 'medium',
    tags: ['mathematics', 'algorithms']
  }
];

// Upcoming Contests
export const upcomingContests: Contest[] = [
  {
    id: 'hackerrank-build-challenges-upcoming',
    title: 'Build HackerRank Challenges',
    description: 'Registrations open till 21st October',
    status: 'upcoming',
    type: 'hiring',
    startDate: '2025-10-21',
    endDate: '2025-10-21',
    registrationEndDate: '2025-10-21',
    actionButtonText: 'Register Now',
    actionButtonLink: '/contests/hackerrank-build-challenges-upcoming',
    isRegistrationOpen: true,
    region: 'Global',
    tags: ['hiring', 'challenges']
  },
  {
    id: 'cse-cybersecurity-challenge',
    title: 'CSE Cybersecurity Challenge / Défi du CST s...',
    description: 'Registrations open till 23rd October',
    status: 'upcoming',
    type: 'college',
    startDate: '2025-10-23',
    endDate: '2025-10-23',
    registrationEndDate: '2025-10-23',
    actionButtonText: 'Register Now',
    actionButtonLink: '/contests/cse-cybersecurity-challenge',
    isRegistrationOpen: true,
    region: 'Canada',
    tags: ['cybersecurity', 'college']
  }
];

// Archived Contests
export const archivedContests: Contest[] = [
  {
    id: 'justice-league-1639642697',
    title: 'Justice League 1639642697',
    description: 'Event ended on 16th December 2021',
    status: 'archived',
    type: 'global',
    endDate: '2021-12-16',
    actionButtonText: 'View Challenges',
    actionButtonLink: '/contests/justice-league-1639642697/challenges',
    difficulty: 'hard',
    tags: ['superhero', 'algorithms']
  },
  {
    id: 'hackerrank-hackfest-2020',
    title: 'HackerRank HackFest 2020',
    description: 'Event ended on 29th June 2020',
    status: 'archived',
    type: 'global',
    endDate: '2020-06-29',
    actionButtonText: 'View Challenges',
    actionButtonLink: '/contests/hackerrank-hackfest-2020/challenges',
    difficulty: 'medium',
    tags: ['hackfest', 'algorithms']
  },
  {
    id: 'hack-the-interview-v-us',
    title: 'Hack the Interview V (U.S.)',
    description: 'Event ended on 20th March 2021',
    status: 'archived',
    type: 'hiring',
    endDate: '2021-03-20',
    actionButtonText: 'View Challenges',
    actionButtonLink: '/contests/hack-the-interview-v-us/challenges',
    region: 'U.S.',
    difficulty: 'hard',
    tags: ['interview', 'hiring']
  },
  {
    id: 'hack-the-interview-v-asia',
    title: 'Hack the Interview V (Asia Pacific)',
    description: 'Event ended on 20th March 2021',
    status: 'archived',
    type: 'hiring',
    endDate: '2021-03-20',
    actionButtonText: 'View Challenges',
    actionButtonLink: '/contests/hack-the-interview-v-asia/challenges',
    region: 'Asia Pacific',
    difficulty: 'hard',
    tags: ['interview', 'hiring', 'asia']
  },
  {
    id: 'round1-1615978377',
    title: 'ROUND1 1615978377',
    description: 'Event ended on 18th March 2021',
    status: 'archived',
    type: 'practice',
    endDate: '2021-03-18',
    actionButtonText: 'View Challenges',
    actionButtonLink: '/contests/round1-1615978377/challenges',
    difficulty: 'medium',
    tags: ['practice', 'round1']
  },
  {
    id: 'march-circuits-2021',
    title: 'March Circuits 2021',
    description: 'Event ended on 15th March 2021',
    status: 'archived',
    type: 'global',
    endDate: '2021-03-15',
    actionButtonText: 'View Challenges',
    actionButtonLink: '/contests/march-circuits-2021/challenges',
    difficulty: 'medium',
    tags: ['circuits', 'monthly']
  },
  {
    id: 'hack-the-interview-v-europe',
    title: 'Hack the Interview V (Europe)',
    description: 'Event ended on 20th March 2021',
    status: 'archived',
    type: 'hiring',
    endDate: '2021-03-20',
    actionButtonText: 'View Challenges',
    actionButtonLink: '/contests/hack-the-interview-v-europe/challenges',
    region: 'Europe',
    difficulty: 'hard',
    tags: ['interview', 'hiring', 'europe']
  },
  {
    id: 'february-circuits-2021',
    title: 'February Circuits 2021',
    description: 'Event ended on 15th February 2021',
    status: 'archived',
    type: 'global',
    endDate: '2021-02-15',
    actionButtonText: 'View Challenges',
    actionButtonLink: '/contests/february-circuits-2021/challenges',
    difficulty: 'medium',
    tags: ['circuits', 'monthly']
  }
];

// College Contests
export const collegeContests: Contest[] = [
  {
    id: 'college-contest-1',
    title: 'University Coding Challenge 2025',
    description: 'Event ended on 15th January 2025',
    status: 'archived',
    type: 'college',
    endDate: '2025-01-15',
    actionButtonText: 'View Challenges',
    actionButtonLink: '/contests/college-contest-1/challenges',
    difficulty: 'medium',
    tags: ['university', 'coding']
  },
  {
    id: 'college-contest-2',
    title: 'Student Algorithm Competition',
    description: 'Event ended on 10th January 2025',
    status: 'archived',
    type: 'college',
    endDate: '2025-01-10',
    actionButtonText: 'View Challenges',
    actionButtonLink: '/contests/college-contest-2/challenges',
    difficulty: 'hard',
    tags: ['student', 'algorithms']
  },
  {
    id: 'college-contest-3',
    title: 'Tech University Hackathon',
    description: 'Event ended on 5th January 2025',
    status: 'archived',
    type: 'college',
    endDate: '2025-01-05',
    actionButtonText: 'View Challenges',
    actionButtonLink: '/contests/college-contest-3/challenges',
    difficulty: 'medium',
    tags: ['hackathon', 'tech']
  },
  {
    id: 'college-contest-4',
    title: 'Engineering CodeFest',
    description: 'Event ended on 30th December 2024',
    status: 'archived',
    type: 'college',
    endDate: '2024-12-30',
    actionButtonText: 'View Challenges',
    actionButtonLink: '/contests/college-contest-4/challenges',
    difficulty: 'hard',
    tags: ['engineering', 'codefest']
  },
  {
    id: 'college-contest-5',
    title: 'Computer Science Challenge',
    description: 'Event ended on 25th December 2024',
    status: 'archived',
    type: 'college',
    endDate: '2024-12-25',
    actionButtonText: 'View Challenges',
    actionButtonLink: '/contests/college-contest-5/challenges',
    difficulty: 'medium',
    tags: ['computer-science', 'challenge']
  },
  {
    id: 'college-contest-6',
    title: 'Data Science Competition',
    description: 'Event ended on 20th December 2024',
    status: 'archived',
    type: 'college',
    endDate: '2024-12-20',
    actionButtonText: 'View Challenges',
    actionButtonLink: '/contests/college-contest-6/challenges',
    difficulty: 'hard',
    tags: ['data-science', 'competition']
  },
  {
    id: 'college-contest-7',
    title: 'Web Development Contest',
    description: 'Event ended on 15th December 2024',
    status: 'archived',
    type: 'college',
    endDate: '2024-12-15',
    actionButtonText: 'View Challenges',
    actionButtonLink: '/contests/college-contest-7/challenges',
    difficulty: 'medium',
    tags: ['web-development', 'contest']
  },
  {
    id: 'college-contest-8',
    title: 'AI/ML Innovation Challenge',
    description: 'Event ended on 10th December 2024',
    status: 'archived',
    type: 'college',
    endDate: '2024-12-10',
    actionButtonText: 'View Challenges',
    actionButtonLink: '/contests/college-contest-8/challenges',
    difficulty: 'hard',
    tags: ['ai', 'ml', 'innovation']
  }
];

// Contest Sections
export const contestSections: ContestSection[] = [
  {
    title: 'Active Contests',
    contests: activeContests,
    layout: 'list',
    showViewAll: false
  },
  {
    title: 'Upcoming Contests',
    contests: upcomingContests,
    layout: 'list',
    showViewAll: true,
    viewAllLink: '/contests/upcoming'
  },
  {
    title: 'Archived Contests',
    contests: archivedContests,
    layout: 'grid',
    showViewAll: true,
    viewAllLink: '/contests/archived'
  },
  {
    title: 'College Contests',
    contests: collegeContests,
    layout: 'grid',
    showViewAll: true,
    viewAllLink: '/contests/college'
  }
];
