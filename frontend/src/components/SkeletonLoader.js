import React from 'react';
import './SkeletonLoader.css';

// Skeleton for match cards
export const MatchCardSkeleton = () => (
  <div className="skeleton-card match-card-skeleton">
    <div className="skeleton-line skeleton-title"></div>
    <div className="skeleton-line skeleton-subtitle"></div>
    <div className="skeleton-line skeleton-text short"></div>
    <div className="skeleton-line skeleton-text"></div>
  </div>
);

// Skeleton for team cards
export const TeamCardSkeleton = () => (
  <div className="skeleton-card team-card-skeleton">
    <div className="skeleton-circle"></div>
    <div className="skeleton-line skeleton-title"></div>
    <div className="skeleton-line skeleton-text short"></div>
  </div>
);

// Skeleton for player cards
export const PlayerCardSkeleton = () => (
  <div className="skeleton-card player-card-skeleton">
    <div className="skeleton-circle small"></div>
    <div className="skeleton-line skeleton-title"></div>
    <div className="skeleton-line skeleton-text short"></div>
    <div className="skeleton-line skeleton-text"></div>
  </div>
);

// Generic skeleton loader
export const SkeletonLoader = ({ count = 3, component: Component = MatchCardSkeleton }) => (
  <div className="skeleton-container">
    {Array.from({ length: count }, (_, index) => (
      <Component key={index} />
    ))}
  </div>
);

export default SkeletonLoader;
