// services/pointsCalculationService.js
/**
 * Calculate fantasy points for a player based on their performance
 * @param {Object} performance - Player's performance data
 * @returns {Number} - Fantasy points
 */
exports.calculatePlayerPoints = (performance) => {
    let points = 0;
    
    // Batting points
    points += performance.runs; // 1 point per run
    points += performance.fours * 1; // 1 additional point per four
    points += performance.sixes * 2; // 2 additional points per six
    
    // Milestone bonus
    if (performance.runs >= 50 && performance.runs < 100) {
      points += 8; // Bonus for half-century
    } else if (performance.runs >= 100) {
      points += 16; // Bonus for century
    }
    
    // Duck penalty (only for batsmen, wicket-keepers, and all-rounders)
    if (performance.runs === 0 && performance.ballsFaced > 0) {
      points -= 2; // Penalty for duck
    }
    
    // Bowling points
    points += performance.wickets * 25; // 25 points per wicket
    points += performance.maidens * 8; // 8 points per maiden over
    
    // Milestone bonus
    if (performance.wickets >= 4 && performance.wickets < 5) {
      points += 8; // Bonus for 4-wicket haul
    } else if (performance.wickets >= 5) {
      points += 16; // Bonus for 5-wicket haul
    }
    
    // Fielding points
    points += performance.catches * 8; // 8 points per catch
    points += performance.stumpings * 12; // 12 points per stumping
    points += performance.runOuts * 6; // 6 points per run out
    
    return points;
  };
  
  /**
   * Update player performance with calculated fantasy points
   * @param {Object} performance - Player performance document
   */
  exports.updatePlayerPerformancePoints = async (performance) => {
    const points = this.calculatePlayerPoints(performance);
    performance.fantasyPoints = points;
    await performance.save();
    return points;
  };
  