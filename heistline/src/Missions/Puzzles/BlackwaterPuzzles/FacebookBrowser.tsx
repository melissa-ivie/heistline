import { useState } from 'react';
import styles from './ContaminationReportStyles.module.css';

// Import profile images from snipped fb pics folder
import bettyCaterProfile from '../../../assets/snipped fb pics/betty.png';
import brianWalkerProfile from '../../../assets/snipped fb pics/brian.png';
import carolProfile from '../../../assets/snipped fb pics/carol.png';
import davidJonesCover from '../../../assets/snipped fb pics/david backround pic.png';
import davidJonesProfile from '../../../assets/snipped fb pics/david pic.png';
import emmaProfile from '../../../assets/snipped fb pics/emma.png';
import flowerPost from '../../../assets/snipped fb pics/flower post .png';
import karenJonesCover from '../../../assets/snipped fb pics/flowers pic .png';
import forestPost from '../../../assets/snipped fb pics/forest pic.jpg';
import judyJohnsonProfile from '../../../assets/snipped fb pics/judy johnson.png';
import karenJonesProfile from '../../../assets/snipped fb pics/karen jones.png';
import karenWeddingPost from '../../../assets/snipped fb pics/karen wedding pic .png';
import lilacPost from '../../../assets/snipped fb pics/lilac post.png';
import michaelWhiteProfile from '../../../assets/snipped fb pics/micheal white.png';
import mittensPost from '../../../assets/snipped fb pics/mittens pic .png';
import nickProfile from '../../../assets/snipped fb pics/nick jones.png';
import richardProfile from '../../../assets/snipped fb pics/richard .png';
import susanJonesProfile from '../../../assets/snipped fb pics/susan.png';
import timProfile from '../../../assets/snipped fb pics/tim jones .png';
import walkPost from '../../../assets/snipped fb pics/walk post.jpg';
import williamBrownProfile from '../../../assets/snipped fb pics/willam.png';

// Map profile IDs to their images
const profileImages: Record<string, string> = {
  'david-jones': davidJonesProfile,
  'karen-jones': karenJonesProfile,
  'susan-jones': susanJonesProfile,
  'michael-white': michaelWhiteProfile,
  'judy-johnson': judyJohnsonProfile,
  'carol-nelson': carolProfile,
  'carol-davis': carolProfile,
  'brian-walker': brianWalkerProfile,
  'betty-carter': bettyCaterProfile,
  'william-brown': williamBrownProfile,
  'richard-davis': richardProfile,
  'emma-jones': emmaProfile,
  'nick-jones': nickProfile,
  'tim-jones': timProfile
};

// Cover images
const coverImages: Record<string, string> = {
  'david-jones': davidJonesCover,
  'karen-jones': karenJonesCover
};

// Post images
const postImages: Record<string, string> = {
  'dj-1': mittensPost,
  'dj-2': forestPost,
  'kj-1': karenWeddingPost,
  'jj-1': flowerPost,
  'sj-1': lilacPost,
  'cn-1': walkPost
};

// Profile photo placeholders - using initials (fallback)
const getInitials = (name: string) => {
  return name.split(' ').map(n => n[0]).join('').toUpperCase();
};

// Facebook profile data
interface FacebookProfile {
  id: string;
  name: string;
  coverColor: string;
  bio: string[];
  joinedDate: string;
  posts: FacebookPost[];
  friends: string[];
  family?: FamilyMember[];
  about?: AboutInfo;
}

interface FacebookPost {
  id: string;
  content: string;
  image?: string;
  imageColor?: string;
  time: string;
  reactions: number;
  comments: PostComment[];
}

interface PostComment {
  author: string;
  text: string;
}

interface FamilyMember {
  name: string;
  relation: string;
  id: string;
}

interface AboutInfo {
  overview?: string[];
  workEducation?: { title: string; subtitle?: string }[];
  placesLived?: { place: string; type: string }[];
  contact?: { type: string; value: string }[];
  family?: FamilyMember[];
  details?: string[];
  lifeEvents?: { year: string; event: string }[];
}

// Profile data for all characters
const profiles: Record<string, FacebookProfile> = {
  'david-jones': {
    id: 'david-jones',
    name: 'David Jones',
    coverColor: '#3a5a40',
    bio: [
      'Works at Nexacore Industries',
      '🏠 Lives in Springfield',
      '💑 Married to Susan Jones',
      '📅 Joined Facebook since December 2009'
    ],
    joinedDate: 'December 2009',
    posts: [
      {
        id: 'dj-1',
        content: 'First and best ever pet, Mittens finally learning how to stop jumping on the counter! 😊',
        imageColor: '#8fbc8f',
        time: '2 hrs',
        reactions: 56,
        comments: [
          { author: 'Sarah Jones', text: 'Good boy, Mittens! 😊' },
          { author: 'Karen Jones', text: "That's great! Mittens looks so adorable! 🐱" }
        ]
      },
      {
        id: 'dj-2',
        content: 'Took a walk in the woods this morning and spotted a few deer. Peaceful start to the day.',
        imageColor: '#228b22',
        time: 'April 20',
        reactions: 44,
        comments: []
      }
    ],
    friends: ['karen-jones', 'michael-white', 'judy-johnson', 'carol-nelson', 'brian-walker', 'betty-carter', 'william-brown', 'susan-jones'],
    family: [
      { name: 'Susan Jones', relation: 'Spouse', id: 'susan-jones' },
      { name: 'Karen Jones', relation: 'Mother', id: 'karen-jones' },
      { name: 'Tim Jones', relation: 'Son', id: 'tim-jones' },
      { name: 'Nick Jones', relation: 'Son', id: 'nick-jones' },
      { name: 'Emma Jones', relation: 'Daughter', id: 'emma-jones' }
    ],
    about: {
      overview: [
        'Works at Nexacore Industries',
        'Studied Environmental Science at Springfield University',
        'Lives in Springfield',
        'From Blackwater Township',
        'Married to Susan Jones'
      ],
      workEducation: [
        { title: 'R&D Analyst at Nexacore Industries', subtitle: '2015 - Present' },
        { title: 'Environmental Consultant', subtitle: '2005 - 2015' },
        { title: 'Springfield University', subtitle: 'B.S. Environmental Science, 2003' }
      ],
      placesLived: [
        { place: 'Springfield', type: 'Current city' },
        { place: 'Blackwater Township', type: 'Hometown' }
      ],
      contact: [
        { type: 'Email', value: 'david.jones@nexacore.net' },
        { type: 'Phone', value: '(555) 123-4567' }
      ],
      family: [
        { name: 'Susan Jones', relation: 'Spouse', id: 'susan-jones' },
        { name: 'Karen Jones', relation: 'Mother', id: 'karen-jones' },
        { name: 'Tim Jones', relation: 'Son', id: 'tim-jones' },
        { name: 'Nick Jones', relation: 'Son', id: 'nick-jones' },
        { name: 'Emma Jones', relation: 'Daughter', id: 'emma-jones' }
      ],
      details: [
        'Nickname: Dave',
        'Favorite quotes: "Nature does not hurry, yet everything is accomplished."'
      ],
      lifeEvents: [
        { year: '2009', event: 'Joined Facebook' },
        { year: '2003', event: 'Graduated from Springfield University' },
        { year: '1980', event: 'Born in Blackwater Township' }
      ]
    }
  },
  'karen-jones': {
    id: 'karen-jones',
    name: 'Karen Jones',
    coverColor: '#dda0dd',
    bio: [
      'Lives in Springfield | Married to Richard Jones | Retired',
      '📅 Joined Facebook since September 2008'
    ],
    joinedDate: 'September 2008',
    posts: [
      {
        id: 'kj-1',
        content: 'Happy 49th anniversary to my wonderful husband, John! 💕\nHard to believe this was 1975. Where have the years gone?\nStill my best friend and forever love. Here\'s to many more years together! 🎉 #Anniversary #1975',
        imageColor: '#f5f5dc',
        time: '5 hours',
        reactions: 156,
        comments: [
          { author: 'Richard Jones', text: "Love you, Karen. Can't believe's been 49! 💕" }
        ]
      }
    ],
    friends: ['david-jones', 'susan-jones', 'judy-johnson', 'richard-davis', 'michael-white', 'william-brown', 'betty-carter', 'carol-nelson', 'brian-walker'],
    family: [
      { name: 'Richard Jones', relation: 'Spouse', id: 'john-smith' },
      { name: 'David Jones', relation: 'Son', id: 'david-jones' }
    ],
    about: {
      overview: [
        'Retired Teacher',
        'Lives in Springfield',
        'Married to Richard Jones',
        'Mother of David Jones'
      ],
      workEducation: [
        { title: 'Retired Elementary School Teacher', subtitle: 'Springfield Elementary, 1970 - 2005' },
        { title: 'State Teachers College', subtitle: 'B.A. Education, 1969' }
      ],
      placesLived: [
        { place: 'Springfield', type: 'Current city' },
        { place: 'Riverside', type: 'Hometown' }
      ],
      contact: [
        { type: 'Email', value: 'karen.jones@email.com' }
      ],
      family: [
        { name: 'John Smith', relation: 'Spouse', id: 'john-smith' },
        { name: 'David Jones', relation: 'Son', id: 'david-jones' },
        { name: 'Susan Jones', relation: 'Daughter-in-law', id: 'susan-jones' }
      ],
      details: [
        'Maiden name: Watson',
        'Favorite pet: Mittens (cat)',
        'High school graduation: 1998'
      ],
      lifeEvents: [
        { year: '2008', event: 'Joined Facebook' },
        { year: '2005', event: 'Retired from teaching' },
        { year: '1975', event: 'Married Richard Jones' },
        { year: '1969', event: 'Graduated from State Teachers College' }
      ]
    }
  },
  'susan-jones': {
    id: 'susan-jones',
    name: 'Susan Jones',
    coverColor: '#87ceeb',
    bio: [
      'Loving wife and mother | Garden enthusiast',
      '🏠 Lives in Springfield',
      '💑 Married to David Jones'
    ],
    joinedDate: 'January 2010',
    posts: [
      {
        id: 'sj-1',
        content: 'Beautiful day in the garden! The roses are blooming wonderfully this year. 🌹',
        imageColor: '#ff69b4',
        time: '1 day ago',
        reactions: 34,
        comments: [
          { author: 'Karen Jones', text: 'Gorgeous! You have such a green thumb! 💚' }
        ]
      }
    ],
    friends: ['david-jones', 'karen-jones', 'judy-johnson', 'carol-nelson', 'betty-carter'],
    about: {
      overview: [
        'Homemaker',
        'Lives in Springfield',
        'Married to David Jones'
      ],
      workEducation: [
        { title: 'Homemaker', subtitle: 'Full-time' },
        { title: 'Springfield Community College', subtitle: 'Associates Degree, 1982' }
      ],
      placesLived: [
        { place: 'Springfield', type: 'Current city' },
        { place: 'Riverside', type: 'Hometown' }
      ],
      family: [
        { name: 'David Jones', relation: 'Spouse', id: 'david-jones' },
        { name: 'Karen Jones', relation: 'Mother-in-law', id: 'karen-jones' },
        { name: 'Tim Jones', relation: 'Son', id: 'tim-jones' },
        { name: 'Nick Jones', relation: 'Son', id: 'nick-jones' },
        { name: 'Emma Jones', relation: 'Daughter', id: 'emma-jones' }
      ],
      details: [
        'Interests: Gardening, cooking, family time',
        'Proud mother of 3'
      ],
      lifeEvents: [
        { year: '2010', event: 'Joined Facebook' },
        { year: '2005', event: 'Married David Jones' },
        { year: '2002', event: 'Graduated from Springfield Community College' }
      ]
    }
  },
  'michael-white': {
    id: 'michael-white',
    name: 'Michael White',
    coverColor: '#4682b4',
    bio: [
      'Retired banker | Golf enthusiast',
      '🏠 Lives in Springfield'
    ],
    joinedDate: 'March 2010',
    posts: [
      {
        id: 'mw-1',
        content: 'Great round of golf today! Shot my best score in years. Never too old to improve! ⛳',
        time: '3 days ago',
        reactions: 28,
        comments: []
      }
    ],
    friends: ['david-jones', 'brian-walker', 'william-brown', 'richard-davis'],
    about: {
      overview: [
        'Retired Banker',
        'Lives in Springfield',
        'Widower'
      ],
      workEducation: [
        { title: 'Retired Branch Manager at First National Bank', subtitle: '1975 - 2012' },
        { title: 'State University', subtitle: 'B.S. Finance, 1974' }
      ],
      placesLived: [
        { place: 'Springfield', type: 'Current city' },
        { place: 'Riverside', type: 'Hometown' }
      ],
      details: [
        'Interests: Golf, fishing, woodworking',
        'Favorite quote: "The best investment is in yourself."'
      ],
      lifeEvents: [
        { year: '2012', event: 'Retired from First National Bank' },
        { year: '2010', event: 'Joined Facebook' },
        { year: '1974', event: 'Graduated from State University' }
      ]
    }
  },
  'judy-johnson': {
    id: 'judy-johnson',
    name: 'Judy Johnson',
    coverColor: '#deb887',
    bio: [
      'Retired | Loves gardening and bird watching',
      '🏠 Lives in Springfield',
      '💑 Married to Robert Johnson'
    ],
    joinedDate: 'January 2010',
    posts: [
      {
        id: 'jj-1',
        content: 'Spent the afternoon planting some new flowers in the garden. A sunny day in spring time bloom! 😊🌸',
        imageColor: '#98fb98',
        time: 'April 21',
        reactions: 44,
        comments: [
          { author: 'David Jones', text: 'Fran tried some lotus 🌺' },
          { author: 'Karen Jones', text: "That's beautiful! On the date of trees 🌳" }
        ]
      }
    ],
    friends: ['david-jones', 'karen-jones', 'susan-jones', 'carol-nelson', 'betty-carter'],
    about: {
      overview: [
        'Retired Librarian',
        'Lives in Springfield',
        'Married to Robert Johnson'
      ],
      workEducation: [
        { title: 'Head Librarian at Springfield Public Library', subtitle: '1978 - 2015' },
        { title: 'State University', subtitle: 'M.L.S. Library Science, 1977' }
      ],
      placesLived: [
        { place: 'Springfield', type: 'Current city' },
        { place: 'Oakville', type: 'Hometown' }
      ],
      family: [
        { name: 'Robert Johnson', relation: 'Spouse', id: 'robert-johnson' }
      ],
      details: [
        'Interests: Gardening, bird watching, reading',
        'Favorite book: Pride and Prejudice'
      ],
      lifeEvents: [
        { year: '2015', event: 'Retired from Springfield Public Library' },
        { year: '2010', event: 'Joined Facebook' },
        { year: '1980', event: 'Married Robert Johnson' }
      ]
    }
  },
  'carol-nelson': {
    id: 'carol-nelson',
    name: 'Carol Nelson',
    coverColor: '#f0e68c',
    bio: [
      'Retired groundskeeper | Proud horses and grandfather',
      '🏠 Lives in Springfield',
      '💑 Married to Sallymyspouse',
      '📅 Joined Facebook since January 2010'
    ],
    joinedDate: 'January 2010',
    posts: [
      {
        id: 'cn-1',
        content: 'Another beautiful picture for the park today! 🌳',
        imageColor: '#90ee90',
        time: '2 April 29',
        reactions: 46,
        comments: [
          { author: 'Sarid Jones', text: 'Mittens! Mittens beans gah sp at 🐱' },
          { author: 'Karen Jones', text: 'That tag she can work actidemiise parks!' }
        ]
      }
    ],
    friends: ['david-jones', 'judy-johnson', 'brian-walker', 'betty-carter'],
    about: {
      overview: [
        'Retired Groundskeeper',
        'Lives in Springfield',
        'Married to Sally Nelson'
      ],
      workEducation: [
        { title: 'Head Groundskeeper at Springfield Parks', subtitle: '1982 - 2018' },
        { title: 'Springfield Vocational School', subtitle: 'Horticulture Certificate, 1981' }
      ],
      placesLived: [
        { place: 'Springfield', type: 'Current city' },
        { place: 'Springfield', type: 'Hometown' }
      ],
      family: [
        { name: 'Sally Nelson', relation: 'Spouse', id: 'sally-nelson' }
      ],
      details: [
        'Interests: Nature walks, photography, grandchildren',
        'Proud grandfather of 4'
      ],
      lifeEvents: [
        { year: '2018', event: 'Retired from Springfield Parks' },
        { year: '2010', event: 'Joined Facebook' },
        { year: '1983', event: 'Married Sally' }
      ]
    }
  },
  'brian-walker': {
    id: 'brian-walker',
    name: 'Brian Walker',
    coverColor: '#20b2aa',
    bio: [
      'Retired guy | Writing books, gardening, brian sfaafen',
      '🏠 Lives in Springfield',
      '💑 Married to Sallymyjones',
      '📅 Joined Facebook since January 2010'
    ],
    joinedDate: 'January 2010',
    posts: [
      {
        id: 'bw-1',
        content: 'Statigannreation (Eewsad for the park today)! 🌲',
        imageColor: '#2e8b57',
        time: '2 April 29',
        reactions: 56,
        comments: [
          { author: 'Sarad Jones', text: 'Naking on thermoses the fiuit! 😊' },
          { author: 'Karen Jones', text: 'Shane! bregse on that write xany deer 🦌' }
        ]
      }
    ],
    friends: ['david-jones', 'michael-white', 'carol-nelson', 'william-brown'],
    about: {
      overview: [
        'Retired Writer',
        'Lives in Springfield',
        'Married to Margaret Walker'
      ],
      workEducation: [
        { title: 'Freelance Writer and Author', subtitle: '1985 - 2020' },
        { title: 'Springfield University', subtitle: 'B.A. English Literature, 1984' }
      ],
      placesLived: [
        { place: 'Springfield', type: 'Current city' },
        { place: 'Boston', type: 'Previous city' }
      ],
      family: [
        { name: 'Margaret Walker', relation: 'Spouse', id: 'margaret-walker' }
      ],
      details: [
        'Interests: Writing, gardening, hiking',
        'Published 3 novels and numerous short stories'
      ],
      lifeEvents: [
        { year: '2020', event: 'Published final novel' },
        { year: '2010', event: 'Joined Facebook' },
        { year: '1988', event: 'Married Margaret' }
      ]
    }
  },
  'betty-carter': {
    id: 'betty-carter',
    name: 'Betty Carter',
    coverColor: '#ffc0cb',
    bio: [
      'Retired nurse | Grandmother',
      '🏠 Lives in Springfield'
    ],
    joinedDate: 'February 2011',
    posts: [
      {
        id: 'bc-1',
        content: 'Baking cookies with the grandkids today! Nothing better than family time. 🍪❤️',
        time: '1 week ago',
        reactions: 67,
        comments: []
      }
    ],
    friends: ['david-jones', 'karen-jones', 'judy-johnson', 'carol-nelson'],
    about: {
      overview: [
        'Retired Nurse',
        'Lives in Springfield',
        'Grandmother of 6',
        'Widow'
      ],
      workEducation: [
        { title: 'Registered Nurse at Springfield General Hospital', subtitle: '1972 - 2010' },
        { title: 'Springfield School of Nursing', subtitle: 'R.N. Certification, 1971' }
      ],
      placesLived: [
        { place: 'Springfield', type: 'Current city' },
        { place: 'Meadowbrook', type: 'Hometown' }
      ],
      details: [
        'Interests: Baking, knitting, spending time with grandchildren',
        'Proud grandmother of 6 wonderful grandkids'
      ],
      lifeEvents: [
        { year: '2011', event: 'Joined Facebook' },
        { year: '2010', event: 'Retired from Springfield General Hospital' },
        { year: '1975', event: 'Married Harold Carter' }
      ]
    }
  },
  'william-brown': {
    id: 'william-brown',
    name: 'William Brown',
    coverColor: '#8b4513',
    bio: [
      'Retired attorney | Fishing enthusiast',
      '🏠 Lives in Springfield'
    ],
    joinedDate: 'April 2010',
    posts: [
      {
        id: 'wb-1',
        content: 'Spent the day at the lake today. Caught some nice fish! 🎣',
        time: 'Yesterday',
        reactions: 23,
        comments: []
      }
    ],
    friends: ['david-jones', 'michael-white', 'brian-walker', 'richard-davis'],
    about: {
      overview: [
        'Retired Attorney',
        'Lives in Springfield',
        'Married to Dorothy Brown'
      ],
      workEducation: [
        { title: 'Senior Partner at Brown & Associates Law Firm', subtitle: '1980 - 2015' },
        { title: 'State Law School', subtitle: 'J.D., 1979' }
      ],
      placesLived: [
        { place: 'Springfield', type: 'Current city' },
        { place: 'Capital City', type: 'Previous city' }
      ],
      family: [
        { name: 'Dorothy Brown', relation: 'Spouse', id: 'dorothy-brown' }
      ],
      details: [
        'Interests: Fishing, woodworking, classic cars',
        'Volunteer at the local legal aid clinic'
      ],
      lifeEvents: [
        { year: '2015', event: 'Retired from law practice' },
        { year: '2010', event: 'Joined Facebook' },
        { year: '1982', event: 'Married Dorothy' }
      ]
    }
  },
  'richard-davis': {
    id: 'richard-davis',
    name: 'Richard Davis',
    coverColor: '#696969',
    bio: [
      'Retired electrician',
      '🏠 Lives in Springfield'
    ],
    joinedDate: 'May 2010',
    posts: [],
    friends: ['karen-jones', 'michael-white', 'william-brown'],
    about: {
      overview: [
        'Retired Electrician',
        'Lives in Springfield',
        'Married to Patricia Davis'
      ],
      workEducation: [
        { title: 'Master Electrician at Springfield Electric Co.', subtitle: '1975 - 2012' },
        { title: 'Springfield Trade School', subtitle: 'Electrical Certificate, 1974' }
      ],
      placesLived: [
        { place: 'Springfield', type: 'Current city' },
        { place: 'Springfield', type: 'Hometown' }
      ],
      family: [
        { name: 'Patricia Davis', relation: 'Spouse', id: 'patricia-davis' }
      ],
      details: [
        'Interests: Model trains, home improvement, gardening',
        'Father of 2, grandfather of 3'
      ],
      lifeEvents: [
        { year: '2012', event: 'Retired from Springfield Electric' },
        { year: '2010', event: 'Joined Facebook' },
        { year: '1978', event: 'Married Patricia' }
      ]
    }
  }
};

// Color generator for profile pics
const profileColors: Record<string, string> = {
  'david-jones': '#4a7c59',
  'karen-jones': '#c9a0dc',
  'susan-jones': '#7eb8da',
  'michael-white': '#5f9ea0',
  'judy-johnson': '#daa520',
  'carol-nelson': '#9acd32',
  'brian-walker': '#20b2aa',
  'betty-carter': '#db7093',
  'william-brown': '#8b7355',
  'richard-davis': '#778899',
  'tim-jones': '#6b8e23',
  'nick-jones': '#4682b4',
  'emma-jones': '#da70d6',
  'john-smith': '#708090'
};

interface FacebookBrowserProps {
  isOpen: boolean;
  onClose: () => void;
}

type TabType = 'timeline' | 'about' | 'friends' | 'photos';
type AboutTabType = 'overview' | 'work' | 'places' | 'contact' | 'family' | 'details' | 'life-events';

export default function FacebookBrowser({ isOpen, onClose }: FacebookBrowserProps) {
  const [currentProfileId, setCurrentProfileId] = useState('david-jones');
  const [activeTab, setActiveTab] = useState<TabType>('timeline');
  const [aboutTab, setAboutTab] = useState<AboutTabType>('overview');
  const [navigationHistory, setNavigationHistory] = useState<string[]>(['david-jones']);

  if (!isOpen) return null;

  const profile = profiles[currentProfileId];
  if (!profile) return null;

  const navigateToProfile = (profileId: string) => {
    if (profiles[profileId]) {
      setNavigationHistory(prev => [...prev, profileId]);
      setCurrentProfileId(profileId);
      setActiveTab('timeline');
      setAboutTab('overview');
    }
  };

  const goBack = () => {
    if (navigationHistory.length > 1) {
      const newHistory = [...navigationHistory];
      newHistory.pop();
      const previousProfile = newHistory[newHistory.length - 1];
      setNavigationHistory(newHistory);
      setCurrentProfileId(previousProfile);
      setActiveTab('timeline');
    }
  };

  const renderProfilePic = (profileId: string, size: number = 40) => {
    const name = profiles[profileId]?.name || profileId.replace('-', ' ');
    const color = profileColors[profileId] || '#999';
    const image = profileImages[profileId];

    if (image) {
      return (
        <img
          src={image}
          alt={name}
          style={{
            width: size,
            height: size,
            borderRadius: '50%',
            objectFit: 'cover',
            flexShrink: 0
          }}
        />
      );
    }

    return (
      <div
        style={{
          width: size,
          height: size,
          borderRadius: '50%',
          background: color,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#fff',
          fontWeight: 'bold',
          fontSize: size * 0.4,
          flexShrink: 0
        }}
      >
        {getInitials(name)}
      </div>
    );
  };

  const renderTimeline = () => (
    <div className={styles.fbProfileBody}>
      <div className={styles.fbMainColumn}>
        {/* Intro Card */}
        <div className={styles.fbCard}>
          <div className={styles.fbIntro}>
            {profile.bio.map((item, idx) => (
              <div key={idx} className={styles.fbIntroItem}>
                <span className={styles.fbIntroIcon}>
                  {item.startsWith('🏠') || item.startsWith('💑') || item.startsWith('📅') ? '' : '📌'}
                </span>
                <span>{item}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Posts */}
        {profile.posts.map(post => (
          <div key={post.id} className={styles.fbPost}>
            <div className={styles.fbPostHeader}>
              {renderProfilePic(profile.id)}
              <div className={styles.fbPostMeta}>
                <div className={styles.fbPostAuthor}>{profile.name}</div>
                <div className={styles.fbPostTime}>{post.time} · 🌐</div>
              </div>
            </div>
            <div className={styles.fbPostContent}>{post.content}</div>
            {(postImages[post.id] || post.imageColor) && (
              postImages[post.id] ? (
                <img
                  src={postImages[post.id]}
                  alt="Post"
                  className={styles.fbPostImage}
                  style={{
                    width: '100%',
                    height: 'auto',
                    maxHeight: 400,
                    objectFit: 'cover'
                  }}
                />
              ) : (
                <div
                  className={styles.fbPostImage}
                  style={{
                    background: post.imageColor,
                    height: 250,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#fff',
                    fontSize: 14
                  }}
                >
                  [Photo]
                </div>
              )
            )}
            <div className={styles.fbPostStats}>
              <div className={styles.fbReactions}>
                <span>👍❤️</span>
                <span>{post.reactions}</span>
              </div>
              <span>{post.comments.length} Comments</span>
            </div>
            <div className={styles.fbPostActions}>
              <div className={styles.fbPostAction}>👍 Like</div>
              <div className={styles.fbPostAction}>💬 Comment</div>
              <div className={styles.fbPostAction}>↗️ Share</div>
            </div>
            {post.comments.length > 0 && (
              <div className={styles.fbComments}>
                {post.comments.map((comment, idx) => {
                  const commentAuthorId = comment.author.toLowerCase().replace(' ', '-');
                  return (
                    <div key={idx} className={styles.fbComment}>
                      {renderProfilePic(commentAuthorId, 32)}
                      <div>
                        <div className={styles.fbCommentBubble}>
                          <div
                            className={styles.fbCommentAuthor}
                            onClick={() => profiles[commentAuthorId] && navigateToProfile(commentAuthorId)}
                          >
                            {comment.author}
                          </div>
                          <div className={styles.fbCommentText}>{comment.text}</div>
                        </div>
                        <div className={styles.fbCommentActions}>
                          <span className={styles.fbCommentAction}>Like</span>
                          <span className={styles.fbCommentAction}>Reply</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Sidebar - Friends */}
      <div className={styles.fbSidebar}>
        <div className={styles.fbCard}>
          <div className={styles.fbCardHeader}>
            Friends
            <span>{profile.friends.length} ({Math.floor(profile.friends.length * 0.7)} Mutual)</span>
          </div>
          <div className={styles.fbCardContent}>
            <div className={styles.fbFriendsGrid}>
              {profile.friends.slice(0, 9).map(friendId => {
                const friend = profiles[friendId];
                if (!friend) return null;
                const friendImage = profileImages[friendId];
                return (
                  <div
                    key={friendId}
                    className={styles.fbFriendCard}
                    onClick={() => navigateToProfile(friendId)}
                  >
                    {friendImage ? (
                      <img
                        src={friendImage}
                        alt={friend.name}
                        className={styles.fbFriendPhoto}
                        style={{
                          objectFit: 'cover'
                        }}
                      />
                    ) : (
                      <div
                        className={styles.fbFriendPhoto}
                        style={{
                          background: profileColors[friendId] || '#ccc',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: '#fff',
                          fontWeight: 'bold',
                          fontSize: 24
                        }}
                      >
                        {getInitials(friend.name)}
                      </div>
                    )}
                    <div className={styles.fbFriendName}>{friend.name}</div>
                  </div>
                );
              })}
            </div>
            <div className={styles.fbSeeAll}>See All Friends</div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderAbout = () => {
    const about = profile.about;
    if (!about) return <div className={styles.fbLoginRequired}><h3>No information available</h3></div>;

    const renderAboutContent = () => {
      switch (aboutTab) {
        case 'overview':
          return (
            <div className={styles.fbAboutSection}>
              <div className={styles.fbAboutSectionTitle}>Overview</div>
              {about.overview?.map((item, idx) => (
                <div key={idx} className={styles.fbAboutItem}>
                  <span className={styles.fbAboutItemIcon}>📌</span>
                  <div className={styles.fbAboutItemContent}>
                    <div className={styles.fbAboutItemValue}>{item}</div>
                  </div>
                </div>
              ))}
            </div>
          );
        case 'work':
          return (
            <div className={styles.fbAboutSection}>
              <div className={styles.fbAboutSectionTitle}>Work and Education</div>
              {about.workEducation?.map((item, idx) => (
                <div key={idx} className={styles.fbAboutItem}>
                  <span className={styles.fbAboutItemIcon}>{idx < 2 ? '💼' : '🎓'}</span>
                  <div className={styles.fbAboutItemContent}>
                    <div className={styles.fbAboutItemValue}>{item.title}</div>
                    {item.subtitle && <div className={styles.fbAboutItemLabel}>{item.subtitle}</div>}
                  </div>
                </div>
              ))}
            </div>
          );
        case 'places':
          return (
            <div className={styles.fbAboutSection}>
              <div className={styles.fbAboutSectionTitle}>Places Lived</div>
              {about.placesLived?.map((item, idx) => (
                <div key={idx} className={styles.fbAboutItem}>
                  <span className={styles.fbAboutItemIcon}>📍</span>
                  <div className={styles.fbAboutItemContent}>
                    <div className={styles.fbAboutItemValue}>{item.place}</div>
                    <div className={styles.fbAboutItemLabel}>{item.type}</div>
                  </div>
                </div>
              ))}
            </div>
          );
        case 'contact':
          return (
            <div className={styles.fbAboutSection}>
              <div className={styles.fbAboutSectionTitle}>Contact and Basic Info</div>
              {about.contact?.map((item, idx) => (
                <div key={idx} className={styles.fbAboutItem}>
                  <span className={styles.fbAboutItemIcon}>{item.type === 'Email' ? '📧' : '📱'}</span>
                  <div className={styles.fbAboutItemContent}>
                    <div className={styles.fbAboutItemLabel}>{item.type}</div>
                    <div className={styles.fbAboutItemValue}>{item.value}</div>
                  </div>
                </div>
              ))}
            </div>
          );
        case 'family':
          return (
            <div className={styles.fbAboutSection}>
              <div className={styles.fbAboutSectionTitle}>Family and Relationships</div>
              {about.family?.map((member, idx) => (
                <div
                  key={idx}
                  className={styles.fbFamilyMember}
                  onClick={() => profiles[member.id] && navigateToProfile(member.id)}
                >
                  {renderProfilePic(member.id, 48)}
                  <div className={styles.fbFamilyInfo}>
                    <div className={styles.fbFamilyName}>{member.name}</div>
                    <div className={styles.fbFamilyRelation}>{member.relation}</div>
                  </div>
                </div>
              ))}
            </div>
          );
        case 'details':
          return (
            <div className={styles.fbAboutSection}>
              <div className={styles.fbAboutSectionTitle}>Details About You</div>
              {about.details?.map((item, idx) => (
                <div key={idx} className={styles.fbAboutItem}>
                  <span className={styles.fbAboutItemIcon}>ℹ️</span>
                  <div className={styles.fbAboutItemContent}>
                    <div className={styles.fbAboutItemValue}>{item}</div>
                  </div>
                </div>
              ))}
            </div>
          );
        case 'life-events':
          return (
            <div className={styles.fbAboutSection}>
              <div className={styles.fbAboutSectionTitle}>Life Events</div>
              {about.lifeEvents?.map((item, idx) => (
                <div key={idx} className={styles.fbAboutItem}>
                  <span className={styles.fbAboutItemIcon}>📅</span>
                  <div className={styles.fbAboutItemContent}>
                    <div className={styles.fbAboutItemValue}>{item.event}</div>
                    <div className={styles.fbAboutItemLabel}>{item.year}</div>
                  </div>
                </div>
              ))}
            </div>
          );
        default:
          return null;
      }
    };

    return (
      <div className={styles.fbAboutContainer}>
        <div className={styles.fbAboutSidebar}>
          <div
            className={`${styles.fbAboutTab} ${aboutTab === 'overview' ? styles.active : ''}`}
            onClick={() => setAboutTab('overview')}
          >
            <span className={styles.fbAboutTabIcon}>📋</span>
            Overview
          </div>
          <div
            className={`${styles.fbAboutTab} ${aboutTab === 'work' ? styles.active : ''}`}
            onClick={() => setAboutTab('work')}
          >
            <span className={styles.fbAboutTabIcon}>💼</span>
            Work and Education
          </div>
          <div
            className={`${styles.fbAboutTab} ${aboutTab === 'places' ? styles.active : ''}`}
            onClick={() => setAboutTab('places')}
          >
            <span className={styles.fbAboutTabIcon}>📍</span>
            Places Lived
          </div>
          <div
            className={`${styles.fbAboutTab} ${aboutTab === 'contact' ? styles.active : ''}`}
            onClick={() => setAboutTab('contact')}
          >
            <span className={styles.fbAboutTabIcon}>📧</span>
            Contact and Basic Info
          </div>
          <div
            className={`${styles.fbAboutTab} ${aboutTab === 'family' ? styles.active : ''}`}
            onClick={() => setAboutTab('family')}
          >
            <span className={styles.fbAboutTabIcon}>👨‍👩‍👧‍👦</span>
            Family and Relationships
          </div>
          <div
            className={`${styles.fbAboutTab} ${aboutTab === 'details' ? styles.active : ''}`}
            onClick={() => setAboutTab('details')}
          >
            <span className={styles.fbAboutTabIcon}>ℹ️</span>
            Details About You
          </div>
          <div
            className={`${styles.fbAboutTab} ${aboutTab === 'life-events' ? styles.active : ''}`}
            onClick={() => setAboutTab('life-events')}
          >
            <span className={styles.fbAboutTabIcon}>⭐</span>
            Life Events
          </div>
        </div>
        <div className={styles.fbAboutContent}>
          {renderAboutContent()}
        </div>
      </div>
    );
  };

  const renderLoginRequired = (section: string) => (
    <div className={styles.fbLoginRequired}>
      <h3>🔒 Login Required</h3>
      <p>You must be logged in to view {section}.</p>
    </div>
  );

  const renderContent = () => {
    switch (activeTab) {
      case 'timeline':
        return renderTimeline();
      case 'about':
        return renderAbout();
      case 'friends':
        return renderLoginRequired('Friends');
      case 'photos':
        return renderLoginRequired('Photos');
      default:
        return renderTimeline();
    }
  };

  return (
    <div className={styles.facebookWindowContainer}>
      <div className={styles.facebookWindow}>
        {/* Window Chrome */}
        <div className={styles.windowChrome}>
          <span className={`${styles.windowDot} ${styles.close}`} onClick={onClose}></span>
          <span className={`${styles.windowDot} ${styles.minimize}`}></span>
          <span className={`${styles.windowDot} ${styles.maximize}`}></span>
          <span className={styles.windowTitle}>Facebook - {profile.name}</span>
        </div>

        <div className={styles.facebookWindowContent}>
          {/* Facebook Navbar */}
          <div className={styles.fbNavbar}>
            <span className={styles.fbLogo}>f</span>
            <input
              type="text"
              className={styles.fbSearchBar}
              placeholder={`Search for ${profile.name}`}
              readOnly
              value={profile.name}
            />
            <div className={styles.fbNavIcons}>
              <div className={styles.fbNavIcon}>🏠</div>
              <div className={styles.fbNavIcon}>📺</div>
              <div className={styles.fbNavIcon}>🔔</div>
            </div>
          </div>

          {/* Back button if not on David Jones */}
          {navigationHistory.length > 1 && (
            <div className={styles.fbBackBtn} onClick={goBack}>
              ← Back
            </div>
          )}

          {/* Profile Header */}
          <div className={styles.fbProfileHeader}>
            <div
              className={styles.fbCoverPhoto}
              style={{
                backgroundColor: profile.coverColor,
                backgroundImage: coverImages[profile.id] ? `url(${coverImages[profile.id]})` : undefined,
                backgroundSize: 'cover',
                backgroundPosition: 'center'
              }}
            />
            <div className={styles.fbProfileInfo}>
              {renderProfilePic(profile.id, 120)}
              <div className={styles.fbProfileName}>
                <h1>{profile.name}</h1>
              </div>
              <div className={styles.fbProfileActions}>
                <button className={styles.fbEditProfileBtn}>
                  ✏️ Edit Profile
                </button>
              </div>
            </div>
          </div>

          {/* Profile Tabs */}
          <div className={styles.fbProfileTabs}>
            <div
              className={`${styles.fbTab} ${activeTab === 'timeline' ? styles.active : ''}`}
              onClick={() => setActiveTab('timeline')}
            >
              Timeline
            </div>
            <div
              className={`${styles.fbTab} ${activeTab === 'about' ? styles.active : ''}`}
              onClick={() => setActiveTab('about')}
            >
              About
            </div>
            <div
              className={`${styles.fbTab} ${activeTab === 'friends' ? styles.active : ''}`}
              onClick={() => setActiveTab('friends')}
            >
              Friends
            </div>
            <div
              className={`${styles.fbTab} ${activeTab === 'photos' ? styles.active : ''}`}
              onClick={() => setActiveTab('photos')}
            >
              Photos
            </div>
            <div className={styles.fbTab}>More ▼</div>
          </div>

          {/* Content */}
          {renderContent()}
        </div>
      </div>
    </div>
  );
}
