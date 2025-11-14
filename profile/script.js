// Load user profile from localStorage
function loadProfile() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    const token = localStorage.getItem('authToken');
    
    if (!currentUser || !token) {
        // No user logged in or no valid token, redirect to login
        alert('Please login to view your profile');
        window.location.href = '../login.html';
        return;
    }
    
    // Display user information
    document.getElementById('userName').textContent = `${currentUser.fname} ${currentUser.lname}`;
    document.getElementById('userEmail').textContent = currentUser.email;
    document.getElementById('firstName').textContent = currentUser.fname;
    document.getElementById('lastName').textContent = currentUser.lname;
    document.getElementById('emailDisplay').textContent = currentUser.email;
    
    // Format and display member since date
    if (currentUser.createdAt) {
        const date = new Date(currentUser.createdAt);
        const formattedDate = date.toLocaleDateString('en-US', { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
        });
        document.getElementById('memberSince').textContent = formattedDate;
    }
}

// Logout function
function logout() {
    if (confirm('Are you sure you want to logout?')) {
        localStorage.removeItem('currentUser');
        localStorage.removeItem('authToken');
        alert('Logged out successfully!');
        window.location.href = '../login.html';
    }
}

// Edit profile function
function editProfile() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (!currentUser) return;
    
    document.getElementById('editFname').value = currentUser.fname;
    document.getElementById('editLname').value = currentUser.lname;
    document.getElementById('editEmail').value = currentUser.email;
    document.getElementById('editModal').style.display = 'block';
}

// Close edit modal
function closeEditModal() {
    document.getElementById('editModal').style.display = 'none';
}

// Handle edit form submission
document.getElementById('editForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    const users = JSON.parse(localStorage.getItem('users')) || [];
    
    // Update user data
    currentUser.fname = document.getElementById('editFname').value;
    currentUser.lname = document.getElementById('editLname').value;
    currentUser.email = document.getElementById('editEmail').value;
    
    // Update in users array
    const userIndex = users.findIndex(u => u.email === currentUser.email);
    if (userIndex !== -1) {
        users[userIndex] = { ...users[userIndex], ...currentUser };
        localStorage.setItem('users', JSON.stringify(users));
    }
    
    localStorage.setItem('currentUser', JSON.stringify(currentUser));
    closeEditModal();
    loadProfile();
    alert('Profile updated successfully!');
});

// Close modal when clicking outside
window.onclick = function(event) {
    const modal = document.getElementById('editModal');
    if (event.target == modal) {
        closeEditModal();
    }
}

// Initialize profile on page load
loadProfile();

