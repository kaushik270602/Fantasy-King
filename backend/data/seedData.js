const mongoose = require('mongoose');
const Team = require('../models/Team').default.default;
const Player = require('../models/Player').default;
const Schedule = require('../models/Schedule');
require('dotenv').config();

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('MongoDB connected for seeding'))
.catch(err => console.log('MongoDB connection error:', err));

// Team data
const teams = [
  {
    name: 'Chennai Super Kings',
    shortName: 'CSK',
    logo: 'csk-logo.png',
    homeGround: 'MA Chidambaram Stadium, Chennai',
    group: 'A'
  },
  {
    name: 'Delhi Capitals',
    shortName: 'DC',
    logo: 'dc-logo.png',
    homeGround: 'Arun Jaitley Stadium, Delhi',
    group: 'B'
  },
  {
    name: 'Gujarat Titans',
    shortName: 'GT',
    logo: 'gt-logo.png',
    homeGround: 'Narendra Modi Stadium, Ahmedabad',
    group: 'B'
  },
  {
    name: 'Kolkata Knight Riders',
    shortName: 'KKR',
    logo: 'kkr-logo.png',
    homeGround: 'Eden Gardens, Kolkata',
    group: 'A'
  },
  {
    name: 'Lucknow Super Giants',
    shortName: 'LSG',
    logo: 'lsg-logo.png',
    homeGround: 'Ekana Cricket Stadium, Lucknow',
    group: 'A'
  },
  {
    name: 'Mumbai Indians',
    shortName: 'MI',
    logo: 'mi-logo.png',
    homeGround: 'Wankhede Stadium, Mumbai',
    group: 'A'
  },
  {
    name: 'Punjab Kings',
    shortName: 'PBKS',
    logo: 'pbks-logo.png',
    homeGround: 'IS Bindra Stadium, Mohali',
    group: 'B'
  },
  {
    name: 'Rajasthan Royals',
    shortName: 'RR',
    logo: 'rr-logo.png',
    homeGround: 'Sawai Mansingh Stadium, Jaipur',
    group: 'A'
  },
  {
    name: 'Royal Challengers Bengaluru',
    shortName: 'RCB',
    logo: 'rcb-logo.png',
    homeGround: 'M Chinnaswamy Stadium, Bengaluru',
    group: 'B'
  },
  {
    name: 'Sunrisers Hyderabad',
    shortName: 'SRH',
    logo: 'srh-logo.png',
    homeGround: 'Rajiv Gandhi International Stadium, Hyderabad',
    group: 'B'
  }
];

// Schedule data (first few matches)
const scheduleData = [
  {
    matchNumber: 1,
    venue: 'Eden Gardens, Kolkata',
    date: new Date('2025-03-22T19:30:00+05:30'),
    time: '7:30 PM',
    matchType: 'League'
  },
  {
    matchNumber: 2,
    venue: 'Rajiv Gandhi International Stadium, Hyderabad',
    date: new Date('2025-03-23T15:30:00+05:30'),
    time: '3:30 PM',
    matchType: 'League'
  },
  {
    matchNumber: 3,
    venue: 'MA Chidambaram Stadium, Chennai',
    date: new Date('2025-03-23T19:30:00+05:30'),
    time: '7:30 PM',
    matchType: 'League'
  }
];

// Seed data function
const seedData = async () => {
  try {
    // Clear existing data
    await Team.deleteMany({});
    await Player.deleteMany({});
    await Schedule.deleteMany({});
    
    // Insert teams
    const createdTeams = await Team.insertMany(teams);
    console.log('Teams seeded successfully');
    
    // Create schedule with team references
    const schedules = scheduleData.map((match, index) => {
      // For demo, assign teams based on match number
      const team1Index = index % 10;
      const team2Index = (index + 1) % 10;
      
      return {
        ...match,
        team1: createdTeams[team1Index]._id,
        team2: createdTeams[team2Index]._id
      };
    });
    
    await Schedule.insertMany(schedules);
    console.log('Schedule seeded successfully');
    
    // Sample players for each team (just a few for demo)
    for (const team of createdTeams) {
      // Create 5 sample players per team
      const players = [];
      
      for (let i = 1; i <= 5; i++) {
        players.push({
          name: `Player ${i} of ${team.shortName}`,
          team: team._id,
          role: i === 1 ? 'Batsman' : i === 2 ? 'Bowler' : i === 3 ? 'All-Rounder' : 'Wicket-Keeper',
          battingStyle: i % 2 === 0 ? 'Right-handed' : 'Left-handed',
          bowlingStyle: i === 2 ? 'Right-arm fast' : i === 3 ? 'Left-arm spin' : '',
          nationality: i === 5 ? 'International' : 'India',
          price: (i * 50) * 100000, // Random price
          isCaptain: i === 1,
          isViceCaptain: i === 2
        });
      }
      
      await Player.insertMany(players);
    }
    
    console.log('Players seeded successfully');
    
    // Update team captains
    for (const team of createdTeams) {
      const captain = await Player.findOne({ team: team._id, isCaptain: true });
      if (captain) {
        await Team.findByIdAndUpdate(team._id, { captain: captain._id });
      }
    }
    
    console.log('Team captains updated successfully');
    
    console.log('All data seeded successfully');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding data:', error);
    process.exit(1);
  }
};

seedData();
