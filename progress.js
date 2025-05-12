// progress.js - Progress tracking functionality

// This file handles progress tracking functionality
// In a real application, you would use server-side storage
// This is a simplified client-side version for demonstration purposes

// Initialize progress tracking from localStorage
function initProgress() {
    // Check if user is logged in
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    if (!isLoggedIn) return;
    
    // Load progress data
    loadProgressData();
    
    // Set up event listeners
    const addGoalBtn = document.querySelector('.add-goal-btn');
    if (addGoalBtn) {
        addGoalBtn.addEventListener('click', showAddGoalForm);
    }
}

// Load progress data from localStorage
function loadProgressData() {
    const username = localStorage.getItem('username');
    
    // Get journal entries to calculate stats
    const entriesKey = `entries_${username}`;
    let entries = JSON.parse(localStorage.getItem(entriesKey)) || [];
    
    // Update stats
    updateStats(entries);
    
    // Update activity graph
    updateActivityGraph(entries);
    
    // Load and display goals
    loadGoals();
    
    // Update achievements
    updateAchievements(entries);
}

// Update statistics based on entries
function updateStats(entries) {
    // Update total entries stat
    const totalEntriesElement = document.querySelector('.stat-card:nth-child(1) .stat-value');
    if (totalEntriesElement) {
        totalEntriesElement.textContent = entries.length;
    }
    
    // Calculate streak
    let streak = calculateStreak(entries);
    const streakElement = document.querySelector('.stat-card:nth-child(2) .stat-value');
    if (streakElement) {
        streakElement.textContent = streak + (streak === 1 ? ' DAY' : ' DAYS');
    }
    
    // Calculate completion rate
    // For this demo, we'll use a placeholder calculation
    const completionRate = Math.min(Math.round((entries.length / 15) * 100), 100);
    const completionElement = document.querySelector('.stat-card:nth-child(3) .stat-value');
    if (completionElement) {
        completionElement.textContent = completionRate + '%';
    }
}

// Calculate current streak of consecutive daily entries
function calculateStreak(entries) {
    if (entries.length === 0) return 0;
    
    // Sort entries by date (newest first)
    entries.sort((a, b) => new Date(b.date) - new Date(a.date));
    
    // Get today's date (end of day)
    const today = new Date();
    today.setHours(23, 59, 59, 999);
    
    // Check if there's an entry for today
    const latestEntryDate = new Date(entries[0].date);
    const latestEntryDay = new Date(latestEntryDate.getFullYear(), latestEntryDate.getMonth(), latestEntryDate.getDate());
    const todayDay = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    
    // If no entry today, streak is 0
    if (latestEntryDay.getTime() !== todayDay.getTime()) {
        return 0;
    }
    
    // Count consecutive days with entries
    let streak = 1;
    let currentDate = todayDay;
    
    for (let i = 1; i < entries.length; i++) {
        // Get date of previous day
        const previousDay = new Date(currentDate);
        previousDay.setDate(previousDay.getDate() - 1);
        
        // Get date of the entry
        const entryDate = new Date(entries[i].date);
        const entryDay = new Date(entryDate.getFullYear(), entryDate.getMonth(), entryDate.getDate());
        
        // If the entry is from the previous day, increment streak
        if (entryDay.getTime() === previousDay.getTime()) {
            streak++;
            currentDate = previousDay;
        } else {
            // Break in the streak
            break;
        }
    }
    
    return streak;
}

// Update activity graph based on entries
function updateActivityGraph(entries) {
    // In a real application, this would update a chart library
    // For this demo, we'll just update our mock chart
    
    // Generate data for the last 7 days
    const today = new Date();
    const last7Days = [];
    
    for (let i = 6; i >= 0; i--) {
        const date = new Date(today);
        date.setDate(date.getDate() - i);
        
        // Count entries for this day
        const dayEntries = entries.filter(entry => {
            const entryDate = new Date(entry.date);
            return entryDate.getFullYear() === date.getFullYear() &&
                   entryDate.getMonth() === date.getMonth() &&
                   entryDate.getDate() === date.getDate();
        });
        
        // Add to array
        last7Days.push({
            date: date,
            count: dayEntries.length
        });
    }
    
    // Find maximum count for scaling
    const maxCount = Math.max(...last7Days.map(day => day.count), 1);
    
    // Update bars
    const bars = document.querySelectorAll('.bar');
    if (bars.length === 7) {
        last7Days.forEach((day, index) => {
            // Calculate percentage height (minimum 10%)
            const heightPercentage = day.count > 0 ? 
                Math.max(20, (day.count / maxCount) * 100) : 10;
            
            bars[index].style.height = `${heightPercentage}%`;
        });
    }
    
    // Update x-axis labels
    const xAxisLabels = document.querySelectorAll('.x-axis span');
    if (xAxisLabels.length === 7) {
        last7Days.forEach((day, index) => {
            const month = day.date.toLocaleString('en-US', { month: 'short' });
            const dayOfMonth = day.date.getDate();
            xAxisLabels[index].textContent = `${month} ${dayOfMonth}`;
        });
    }
}

// Load goals from localStorage
function loadGoals() {
    const username = localStorage.getItem('username');
    const goalsKey = `goals_${username}`;
    let goals = JSON.parse(localStorage.getItem(goalsKey));
    
    // If no goals exist yet, create default ones
    if (!goals) {
        goals = [
            {
                title: 'DAILY JOURNAL ENTRY',
                current: 24,
                target: 30,
                progress: 80
            },
            {
                title: 'STRATEGY DEVELOPMENT',
                current: 6,
                target: 10,
                progress: 60
            },
            {
                title: 'PERFORMANCE ANALYSIS',
                current: 9,
                target: 20,
                progress: 45
            }
        ];
        
        localStorage.setItem(goalsKey, JSON.stringify(goals));
    }
    
    // Display goals
    const goalsContainer = document.querySelector('.goals-container');
    if (!goalsContainer) return;
    
    // Clear existing goals
    goalsContainer.innerHTML = '';
    
    // Add goal cards
    goals.forEach(goal => {
        const goalCard = createGoalCard(goal);
        goalsContainer.appendChild(goalCard);
    });
}

// Create a goal card element
function createGoalCard(goal) {
    const card = document.createElement('div');
    card.className = 'goal-card';
    
    const title = document.createElement('h3');
    title.textContent = goal.title;
    
    const progressBar = document.createElement('div');
    progressBar.className = 'progress-bar';
    
    const progress = document.createElement('div');
    progress.className = 'progress';
    progress.style.width = `${goal.progress}%`;
    
    const stats = document.createElement('div');
    stats.className = 'goal-stats';
    
    const progressText = document.createElement('span');
    progressText.textContent = `${goal.progress}% COMPLETE`;
    
    const targetText = document.createElement('span');
    targetText.textContent = `TARGET: ${goal.target}`;
    
    stats.appendChild(progressText);
    stats.appendChild(targetText);
    
    progressBar.appendChild(progress);
    
    card.appendChild(title);
    card.appendChild(progressBar);
    card.appendChild(stats);
    
    return card;
}

// Show form to add a new goal
function showAddGoalForm() {
    // In a real application, this would display a modal with a form
    // For this demo, we'll just show an alert
    alert('Add goal functionality would be implemented here.');
}

// Update achievements based on entries and goals
function updateAchievements(entries) {
    // Check if user has earned any achievements
    const achievements = [
        {
            name: 'FIRST ENTRY',
            description: 'Created your first journal entry',
            condition: entries.length >= 1,
            icon: '🌟'
        },
        {
            name: '5 DAY STREAK',
            description: 'Logged entries for 5 consecutive days',
            condition: calculateStreak(entries) >= 5,
            icon: '🔥'
        },
        {
            name: 'DEDICATED WRITER',
            description: 'Created 20 journal entries',
            condition: entries.length >= 20,
            icon: '📚'
        },
        {
            name: 'STRATEGIST',
            description: 'Developed 10 unique strategies',
            condition: entries.filter(entry => entry.tags.includes('Strategy')).length >= 10,
            icon: '🧠'
        },
        {
            name: 'PERFORMANCE MASTER',
            description: 'Completed 15 performance analyses',
            condition: entries.filter(entry => entry.tags.includes('Improvement')).length >= 15,
            icon: '⚡'
        },
        {
            name: 'PERFECTIONIST',
            description: 'Maintained a 30-day streak',
            condition: calculateStreak(entries) >= 30,
            icon: '💯'
        }
    ];
    
    // Update badge icons based on achievements
    const badgeIcons = document.querySelectorAll('.badge-icon');
    if (badgeIcons.length === achievements.length) {
        achievements.forEach((achievement, index) => {
            if (achievement.condition) {
                badgeIcons[index].classList.add('unlocked');
            } else {
                badgeIcons[index].classList.remove('unlocked');
            }
        });
    }
}

// Initialize progress tracking on page load
document.addEventListener('DOMContentLoaded', function() {
    initProgress();
});