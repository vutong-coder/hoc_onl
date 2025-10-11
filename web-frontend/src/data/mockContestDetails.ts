import { ContestDetail } from '../types/contestDetail';

export const contestDetails: Record<string, ContestDetail> = {
  'justice-league-1639642697': {
    id: 'justice-league-1639642697',
    title: 'Justice League 1639642697',
    description: 'A superhero-themed coding challenge featuring algorithmic problems inspired by DC Comics characters',
    startDate: '2021-12-10T09:00:00Z',
    endDate: '2021-12-16T17:00:00Z',
    status: 'archived',
    currentRank: undefined,
    totalParticipants: 2847,
    ratingUpdateMessage: 'Ratings will be updated soon, please wait!',
    challenges: [
      {
        id: 'dummy-challenge-test',
        title: 'dummychallengetest',
        successRate: 0.00,
        maxScore: 10,
        difficulty: 'Hard',
        status: 'not_attempted',
        description: 'Test your problem-solving skills with this challenging algorithm problem',
        tags: ['Algorithms', 'Data Structures']
      },
      {
        id: 'fibonacci-v2',
        title: 'Fibonnaci V2.0',
        successRate: 0.00,
        maxScore: 0,
        difficulty: 'Easy',
        status: 'not_attempted',
        description: 'Implement the Fibonacci sequence with optimizations',
        tags: ['Dynamic Programming', 'Mathematics']
      }
    ]
  },
  'college-contest-5': {
    id: 'college-contest-5',
    title: 'Computer Science Challenge',
    description: 'A comprehensive challenge covering fundamental computer science concepts',
    startDate: '2024-12-01T09:00:00Z',
    endDate: '2024-12-25T17:00:00Z',
    status: 'archived',
    currentRank: undefined,
    totalParticipants: 1247,
    ratingUpdateMessage: 'Ratings will be updated soon, please wait!',
    challenges: [
      {
        id: 'dummy-challenge-test',
        title: 'dummychallengetest',
        successRate: 0.00,
        maxScore: 10,
        difficulty: 'Hard',
        status: 'not_attempted',
        description: 'Test your problem-solving skills with this challenging algorithm problem',
        tags: ['Algorithms', 'Data Structures']
      },
      {
        id: 'fibonacci-v2',
        title: 'Fibonnaci V2.0',
        successRate: 0.00,
        maxScore: 0,
        difficulty: 'Easy',
        status: 'not_attempted',
        description: 'Implement the Fibonacci sequence with optimizations',
        tags: ['Dynamic Programming', 'Mathematics']
      }
    ]
  },
  'college-contest-6': {
    id: 'college-contest-6',
    title: 'Data Science Competition',
    description: 'Advanced data analysis and machine learning challenges',
    startDate: '2024-12-01T09:00:00Z',
    endDate: '2024-12-20T17:00:00Z',
    status: 'archived',
    currentRank: 42,
    totalParticipants: 856,
    ratingUpdateMessage: 'Ratings will be updated soon, please wait!',
    challenges: [
      {
        id: 'data-cleaning-challenge',
        title: 'Data Cleaning Master',
        successRate: 23.5,
        maxScore: 50,
        difficulty: 'Medium',
        status: 'solved',
        description: 'Clean and preprocess messy datasets',
        tags: ['Data Cleaning', 'Python', 'Pandas']
      },
      {
        id: 'ml-prediction-model',
        title: 'ML Prediction Model',
        successRate: 15.2,
        maxScore: 75,
        difficulty: 'Hard',
        status: 'attempted',
        description: 'Build a machine learning prediction model',
        tags: ['Machine Learning', 'Scikit-learn', 'Python']
      },
      {
        id: 'statistical-analysis',
        title: 'Statistical Analysis',
        successRate: 67.8,
        maxScore: 25,
        difficulty: 'Easy',
        status: 'solved',
        description: 'Perform comprehensive statistical analysis',
        tags: ['Statistics', 'R', 'Analysis']
      }
    ]
  },
  'college-contest-7': {
    id: 'college-contest-7',
    title: 'Web Development Contest',
    description: 'Full-stack web development challenges',
    startDate: '2024-12-01T09:00:00Z',
    endDate: '2024-12-15T17:00:00Z',
    status: 'archived',
    currentRank: 15,
    totalParticipants: 634,
    ratingUpdateMessage: 'Ratings will be updated soon, please wait!',
    challenges: [
      {
        id: 'responsive-design',
        title: 'Responsive Design Challenge',
        successRate: 45.3,
        maxScore: 30,
        difficulty: 'Medium',
        status: 'solved',
        description: 'Create responsive web layouts',
        tags: ['CSS', 'HTML', 'Responsive Design']
      },
      {
        id: 'api-integration',
        title: 'API Integration Master',
        successRate: 28.7,
        maxScore: 40,
        difficulty: 'Medium',
        status: 'attempted',
        description: 'Integrate multiple APIs in a web application',
        tags: ['JavaScript', 'API', 'REST']
      }
    ]
  },
  'college-contest-8': {
    id: 'college-contest-8',
    title: 'AI/ML Innovation Challenge',
    description: 'Cutting-edge AI and machine learning problems',
    startDate: '2024-12-01T09:00:00Z',
    endDate: '2024-12-10T17:00:00Z',
    status: 'archived',
    currentRank: 8,
    totalParticipants: 423,
    ratingUpdateMessage: 'Ratings will be updated soon, please wait!',
    challenges: [
      {
        id: 'neural-network-design',
        title: 'Neural Network Design',
        successRate: 12.4,
        maxScore: 100,
        difficulty: 'Hard',
        status: 'attempted',
        description: 'Design and implement a custom neural network',
        tags: ['Deep Learning', 'TensorFlow', 'Neural Networks']
      },
      {
        id: 'nlp-sentiment-analysis',
        title: 'NLP Sentiment Analysis',
        successRate: 34.6,
        maxScore: 60,
        difficulty: 'Medium',
        status: 'solved',
        description: 'Build a sentiment analysis model',
        tags: ['NLP', 'Python', 'Machine Learning']
      }
    ]
  }
};
