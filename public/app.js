// API Status Check
async function checkAPIStatus() {
    const statusDiv = document.getElementById('api-status');
    
    try {
        // Try Railway backend first
        const response = await fetch('https://photo2profit-backend-production.up.railway.app/health');
        const data = await response.json();
        
        statusDiv.innerHTML = `
            <p>
                <span class="status-indicator online"></span>
                <strong>Backend API:</strong> Online
            </p>
            <p style="margin-top: 10px; color: var(--text-light); font-size: 14px;">
                Last checked: ${new Date(data.timestamp).toLocaleString()}
            </p>
        `;
    } catch (error) {
        statusDiv.innerHTML = `
            <p>
                <span class="status-indicator offline"></span>
                <strong>Backend API:</strong> Initializing...
            </p>
            <p style="margin-top: 10px; color: var(--text-light); font-size: 14px;">
                The backend service may be starting up. Please try again in a moment.
            </p>
        `;
    }
}

// Check Founding Members Count
async function checkFoundingMembers() {
    const countDiv = document.getElementById('founding-count');
    
    try {
        const response = await fetch('https://photo2profit-backend-production.up.railway.app/api/founding-count');
        const data = await response.json();
        
        countDiv.innerHTML = `
            <h3>🚀 Founding Member Program</h3>
            <p>
                <strong>${data.remaining}</strong> of <strong>${data.limit}</strong> founding member spots remaining
            </p>
            <p style="margin-top: 10px;">
                Join now to lock in exclusive lifetime benefits and help shape the future of Photo2Profit!
            </p>
        `;
        
        if (data.remaining > 0) {
            alert(`Great news! There are ${data.remaining} founding member spots remaining. Contact us to secure your spot!`);
        } else {
            alert('Sorry, all founding member spots are filled. Check back for future opportunities!');
        }
    } catch (error) {
        countDiv.innerHTML = `
            <h3>🚀 Founding Member Program</h3>
            <p>Loading availability...</p>
        `;
        alert('Unable to check founding member availability. Please try again later.');
    }
}

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    checkAPIStatus();
    
    // Check API status every 30 seconds
    setInterval(checkAPIStatus, 30000);
});
