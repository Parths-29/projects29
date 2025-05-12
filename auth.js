// auth.js - Authentication handling script

// This file handles user authentication across the site
// In a real application, you would use secure server-side authentication
// This is a simplified client-side version for demonstration purposes

// Check if the user is logged in
function checkAuth() {
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    const loginStatusElement = document.getElementById('loginStatus');
    
    if (isLoggedIn) {
        // Update login button to show user is logged in
        if (loginStatusElement) {
            loginStatusElement.textContent = 'LOGOUT';
            loginStatusElement.href = '#';
            loginStatusElement.addEventListener('click', logout);
        }
        
        // Show content that requires authentication
        const loginRequiredElements = document.querySelectorAll('.login-required');
        loginRequiredElements.forEach(element => {
            element.style.display = 'none';
        });
        
        // Show journal content if on journal page
        const journalContent = document.getElementById('journalContent');
        if (journalContent) {
            journalContent.style.display = 'block';
        }
        
        // Show progress content if on progress page
        const progressContent = document.getElementById('progressContent');
        if (progressContent) {
            progressContent.style.display = 'block';
        }
    } else {
        // Update login button to show login option
        if (loginStatusElement) {
            loginStatusElement.textContent = 'LOGIN';
            loginStatusElement.href = 'login.html';
            // Remove any logout event listeners
            loginStatusElement.removeEventListener('click', logout);
        }
    }
}

// Handle login form submission
function handleLogin(event) {
    event.preventDefault();
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    
    // In a real application, you would validate credentials with a server
    // For this demo, we'll just check if fields are filled
    if (username && password) {
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('username', username);
        
        // Redirect to home page
        window.location.href = 'index.html';
    } else {
        alert('Please enter both username and password.');
    }
}

// Handle sign up form submission
function handleSignup(event) {
    event.preventDefault();
    const username = document.getElementById('username').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    const terms = document.getElementById('terms').checked;
    
    // Validate input
    if (!username || !email || !password || !confirmPassword) {
        alert('Please fill in all fields.');
        return;
    }
    
    if (password !== confirmPassword) {
        alert('Passwords do not match.');
        return;
    }
    
    if (!terms) {
        alert('You must agree to the Terms of Service.');
        return;
    }
    
    // In a real application, you would send this data to a server
    // For this demo, we'll just store in localStorage
    localStorage.setItem('isLoggedIn', 'true');
    localStorage.setItem('username', username);
    localStorage.setItem('email', email);
    
    // Redirect to home page
    window.location.href = 'index.html';
}

// Handle logout
function logout(event) {
    if (event) event.preventDefault();
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('username');
    
    // Redirect to home page
    window.location.href = 'index.html';
}

// Initialize auth check on page load
document.addEventListener('DOMContentLoaded', function() {
    checkAuth();
    
    // Attach event listeners to forms if they exist
    const loginForm = document.querySelector('.login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }
    
    const signupForm = document.querySelector('.signup-form');
    if (signupForm) {
        signupForm.addEventListener('submit', handleSignup);
    }
});

// journal.js - Journal page functionality

// This file handles journal entry creation and management
// In a real application, you would use server-side storage
// This is a simplified client-side version for demonstration purposes

// Initialize journal entries from localStorage
function initJournal() {
    // Check if user is logged in
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    if (!isLoggedIn) return;
    
    // Load existing entries
    loadEntries();
    
    // Set up event listeners
    const entryForm = document.getElementById('entryForm');
    if (entryForm) {
        entryForm.addEventListener('submit', saveEntry);
    }
    
    // Set up search and filter functionality
    const searchInput = document.getElementById('searchEntries');
    if (searchInput) {
        searchInput.addEventListener('input', filterEntries);
    }
    
    const filterTags = document.getElementById('filterTags');
    if (filterTags) {
        filterTags.addEventListener('change', filterEntries);
    }
    
    const sortEntries = document.getElementById('sortEntries');
    if (sortEntries) {
        sortEntries.addEventListener('change', filterEntries);
    }
}

// Load journal entries from localStorage
function loadEntries() {
    const entriesContainer = document.getElementById('entriesContainer');
    if (!entriesContainer) return;
    
    // Clear existing entries
    entriesContainer.innerHTML = '';
    
    // Get entries from localStorage
    const username = localStorage.getItem('username');
    const entriesKey = `entries_${username}`;
    let entries = JSON.parse(localStorage.getItem(entriesKey)) || [];
    
    // If no entries, show placeholder text
    if (entries.length === 0) {
        entriesContainer.innerHTML = '<p class="no-entries">No journal entries yet. Create your first entry above!</p>';
        return;
    }
    
    // Sort entries by date (newest first by default)
    entries.sort((a, b) => new Date(b.date) - new Date(a.date));
    
    // Create and append entry cards
    entries.forEach((entry, index) => {
        const entryCard = createEntryCard(entry, index);
        entriesContainer.appendChild(entryCard);
    });
}

// Create an entry card element
function createEntryCard(entry, index) {
    const card = document.createElement('div');
    card.className = 'entry-card';
    card.dataset.index = index;
    
    const header = document.createElement('div');
    header.className = 'entry-header';
    
    const title = document.createElement('h3');
    title.textContent = entry.title;
    
    const date = document.createElement('span');
    date.className = 'entry-date';
    date.textContent = formatDate(entry.date);
    
    header.appendChild(title);
    header.appendChild(date);
    
    const tags = document.createElement('div');
    tags.className = 'entry-tags';
    
    entry.tags.forEach(tag => {
        const tagSpan = document.createElement('span');
        tagSpan.className = 'tag';
        tagSpan.textContent = tag;
        tags.appendChild(tagSpan);
    });
    
    const preview = document.createElement('div');
    preview.className = 'entry-preview';
    preview.textContent = entry.content.substring(0, 100) + (entry.content.length > 100 ? '...' : '');
    
    const actions = document.createElement('div');
    actions.className = 'entry-actions';
    
    const viewBtn = document.createElement('button');
    viewBtn.className = 'action-button view';
    viewBtn.textContent = 'VIEW';
    viewBtn.addEventListener('click', () => viewEntry(index));
    
    const editBtn = document.createElement('button');
    editBtn.className = 'action-button edit';
    editBtn.textContent = 'EDIT';
    editBtn.addEventListener('click', () => editEntry(index));
    
    const deleteBtn = document.createElement('button');
    deleteBtn.className = 'action-button delete';
    deleteBtn.textContent = 'DELETE';
    deleteBtn.addEventListener('click', () => deleteEntry(index));
    
    actions.appendChild(viewBtn);
    actions.appendChild(editBtn);
    actions.appendChild(deleteBtn);
    
    card.appendChild(header);
    card.appendChild(tags);
    card.appendChild(preview);
    card.appendChild(actions);
    
    return card;
}

// Format date to readable string
function formatDate(dateString) {
    const date = new Date(dateString);
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return date.toLocaleDateString('en-US', options);
}

// Save a new journal entry
function saveEntry(event) {
    event.preventDefault();
    
    const title = document.getElementById('entryTitle').value;
    const content = document.getElementById('entryContent').value;
    
    // Get selected tags
    const tagCheckboxes = document.querySelectorAll('input[name="tag"]:checked');
    const tags = Array.from(tagCheckboxes).map(cb => cb.value);
    
    // Create entry object
    const entry = {
        title,
        content,
        tags,
        date: new Date().toISOString()
    };
    
    // Save to localStorage
    const username = localStorage.getItem('username');
    const entriesKey = `entries_${username}`;
    let entries = JSON.parse(localStorage.getItem(entriesKey)) || [];
    entries.push(entry);
    localStorage.setItem(entriesKey, JSON.stringify(entries));
    
    // Reset form
    document.getElementById('entryForm').reset();
    
    // Reload entries
    loadEntries();
    
    // Show success message
    alert('Entry saved successfully!');
}

// View a single entry (would typically open a modal or new page)
function viewEntry(index) {
    const username = localStorage.getItem('username');
    const entriesKey = `entries_${username}`;
    let entries = JSON.parse(localStorage.getItem(entriesKey)) || [];
    const entry = entries[index];
    
    // In a real application, this would open a modal or navigate to a detailed view
    alert(`Title: ${entry.title}\nDate: ${formatDate(entry.date)}\n\n${entry.content}`);
}

// Edit an entry
function editEntry(index) {
    const username = localStorage.getItem('username');
    const entriesKey = `entries_${username}`;
    let entries = JSON.parse(localStorage.getItem(entriesKey)) || [];
    const entry = entries[index];
    
    // In a real application, this would populate a form for editing
    // For this demo, we'll just show an alert
    alert('Edit functionality would be implemented here.');
}

// Delete an entry
function deleteEntry(index) {
    if (!confirm('Are you sure you want to delete this entry?')) return;
    
    const username = localStorage.getItem('username');
    const entriesKey = `entries_${username}`;
    let entries = JSON.parse(localStorage.getItem(entriesKey)) || [];
    
    // Remove entry at index
    entries.splice(index, 1);
    
    // Save updated entries
    localStorage.setItem(entriesKey, JSON.stringify(entries));
    
    // Reload entries
    loadEntries();
}

// Filter entries based on search and tag filter
function filterEntries() {
    const searchTerm = document.getElementById('searchEntries').value.toLowerCase();
    const tagFilter = document.getElementById('filterTags').value;
    const sortOrder = document.getElementById('sortEntries').value;
    
    const username = localStorage.getItem('username');
    const entriesKey = `entries_${username}`;
    let entries = JSON.parse(localStorage.getItem(entriesKey)) || [];
    
    // Filter entries
    let filteredEntries = entries.filter(entry => {
        const matchesSearch = entry.title.toLowerCase().includes(searchTerm) || 
                             entry.content.toLowerCase().includes(searchTerm);
        
        const matchesTag = tagFilter === '' || entry.tags.includes(tagFilter);
        
        return matchesSearch && matchesTag;
    });
    
    // Sort entries
    if (sortOrder === 'newest') {
        filteredEntries.sort((a, b) => new Date(b.date) - new Date(a.date));
    } else {
        filteredEntries.sort((a, b) => new Date(a.date) - new Date(b.date));
    }
    
    // Clear existing entries
    const entriesContainer = document.getElementById('entriesContainer');
    entriesContainer.innerHTML = '';
    
    // If no entries match filters, show message
    if (filteredEntries.length === 0) {
        entriesContainer.innerHTML = '<p class="no-entries">No entries match your filters.</p>';
        return;
    }
    
    // Create and append entry cards
    filteredEntries.forEach((entry, index) => {
        const entryCard = createEntryCard(entry, index);
        entriesContainer.appendChild(entryCard);
    });
}

// Initialize journal on page load
document.addEventListener('DOMContentLoaded', function() {
    initJournal();
});