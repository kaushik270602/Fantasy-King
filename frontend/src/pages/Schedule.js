import React, { useState, useEffect } from 'react';
import axios from 'axios';
import MatchCard from '../components/MatchCard';
import { SkeletonLoader, MatchCardSkeleton } from '../components/SkeletonLoader';
import './Schedule.css';

const Schedule = () => {
  const [allMatches, setAllMatches] = useState([]);
  const [filteredMatches, setFilteredMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    const fetchMatches = async () => {
      try {
        const response = await axios.get('/api/schedule');
        setAllMatches(response.data);
        setFilteredMatches(response.data);
        setLoading(false); // Set to false when data is loaded
      } catch (error) {
        console.error('Error fetching data:', error);
        setLoading(false);
      }
    };
    
    fetchMatches();
  }, []);

  useEffect(() => {
    // Apply filtering logic when filter changes
    setLoading(true);
    
    let filtered = [];
    if (filter === 'all') {
      filtered = allMatches;
    } else if (filter === 'upcoming') { // Lowercase to match button value
      filtered = allMatches.filter(match => match.status === 'Upcoming'); // Keep capitalized if that's how it is in your database
    } else if (filter === 'playoffs') {
      filtered = allMatches.filter(match => match.matchType !== 'Normal' );
    }
    
    setFilteredMatches(filtered);
    setLoading(false);
  }, [filter, allMatches]);

  const handleFilterChange = (newFilter) => {
    setFilter(newFilter);
  };

  if (loading) {
    return (
      <div className="schedule-container">
        <h1>IPL 2025 Schedule</h1>
        <div className="filter-buttons">
          <button className="filter-btn active">All</button>
          <button className="filter-btn">Upcoming</button>
          <button className="filter-btn">Playoffs</button>
        </div>
        <SkeletonLoader count={6} component={MatchCardSkeleton} />
      </div>
    );
  }

  return (
    <div className="schedule-container">
      <h1>IPL 2025 Schedule</h1>
      
      <div className="filter-buttons">
        <button 
          className={`filter-btn ${filter === 'all' ? 'active' : ''}`} 
          onClick={() => handleFilterChange('all')}
        >
          All Matches
        </button>
        <button 
          className={`filter-btn ${filter === 'upcoming' ? 'active' : ''}`} 
          onClick={() => handleFilterChange('upcoming')}
        >
          Upcoming Matches
        </button>
        <button 
          className={`filter-btn ${filter === 'playoffs' ? 'active' : ''}`} 
          onClick={() => handleFilterChange('playoffs')}
        >
          Playoffs
        </button>
      </div>
      
      <div className="matches-grid">
        {filteredMatches.length > 0 ? (
          filteredMatches.map(match => (
            <MatchCard key={match._id} match={match} />
          ))
        ) : (
          <div className="no-matches">No matches found for this filter</div>
        )}
      </div>
    </div>
  );
};

export default Schedule;
