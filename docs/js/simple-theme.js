// Simple theme toggle test
console.log('Script loaded');

// Test immediate execution
const themeToggle = document.getElementById('theme-toggle');
const html = document.documentElement;

console.log('Elements found:', !!themeToggle, !!html);

if (themeToggle && html) {
    const savedTheme = localStorage.getItem('theme');
    const currentTheme = savedTheme || 'dark';
    
    html.setAttribute('data-theme', currentTheme);
    console.log('Theme set to:', currentTheme);
    
    // Update button
    const icon = themeToggle.querySelector('i');
    const text = themeToggle.querySelector('span');
    
    if (currentTheme === 'dark') {
        icon.className = 'fas fa-moon';
        text.textContent = 'Light';
    } else {
        icon.className = 'fas fa-sun';
        text.textContent = 'Dark';
    }
    
    console.log('Button updated:', icon.className, text.textContent);
    
    // Add click handler
    try {
        themeToggle.addEventListener('click', (e) => {
            console.log('Click event fired!', e);
            const newTheme = html.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
            html.setAttribute('data-theme', newTheme);
            localStorage.setItem('theme', newTheme);
            
            if (newTheme === 'dark') {
                icon.className = 'fas fa-moon';
                text.textContent = 'Light';
            } else {
                icon.className = 'fas fa-sun';
                text.textContent = 'Dark';
            }
            
            console.log('Theme toggled to:', newTheme);
        });
        console.log('Click handler added successfully');
    } catch (error) {
        console.error('Error adding click handler:', error);
    }
} else {
    console.log('Elements not found');
}