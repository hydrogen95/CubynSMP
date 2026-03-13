/**
 * CUBYN SMP - Main JavaScript
 * Premium Minecraft Server Website
 */

// ========================================
// CONFIGURATION
// ========================================
const CONFIG = {
    serverIp: 'suffer.srein.xyz',
    serverPort: 25567,
    discordLink: 'https://discord.gg/XaUBr97NUW',
    refreshInterval: 30000 // 30 seconds
};

// ========================================
// RANKS DATA
// ========================================
const RANKS = [
    {
        name: 'VIP',
        price: '₱50',
        color: '#00AA00',
        perks: [
            '2x Homes',
            '10x Concurrent Auctions',
            '/grindstone Command',
            '/disposal Command',
            '/ec Command',
            '/kit Command'
        ]
    },
    {
        name: 'MVP',
        price: '₱100',
        color: '#00AAAA',
        perks: [
            '3x Homes',
            '15x Concurrent Auctions',
            '/cartographytable Command',
            '/stonecutter Command',
            '/disposal Command',
            '/craft Command',
            '/grindstone Command',
            '/kit Command'
        ]
    },
    {
        name: 'ELITE',
        price: '₱150',
        color: '#AA00AA',
        perks: [
            '4x Homes',
            '20x Concurrent Auctions',
            '/craft Command',
            '/ec Command',
            '/disposal Command',
            '/stonecutter Command',
            '/grindstone Command',
            '/repair Command',
            '/anvil Command',
            '/cartographytable Command',
            '/kit Command'
        ]
    },
    {
        name: 'GIANT',
        price: '₱200',
        color: '#FFAA00',
        perks: [
            '5x Homes',
            '25x Concurrent Auctions',
            '/craft Command',
            '/ec Command',
            '/disposal Command',
            '/stonecutter Command',
            '/grindstone Command',
            '/anvil Command',
            '/smithingtable Command',
            '/cartographytable Command',
            '/repair Command',
            '/ptime Command',
            '/kit Command'
        ]
    },
    {
        name: 'TITAN',
        price: '₱400',
        color: '#FF5555',
        perks: [
            '7x Homes',
            '30x Concurrent Auctions',
            '/craft Command',
            '/cartographytable Command',
            '/ec Command',
            '/stonecutter Command',
            '/grindstone Command',
            '/anvil Command',
            '/smithingtable Command',
            '/ptime Command',
            '/pweather Command',
            '/repair Command',
            '/near Command',
            '/kit Command'
        ]
    }
];

// ========================================
// DOM ELEMENTS
// ========================================
const elements = {
    navbar: document.getElementById('navbar'),
    navToggle: document.getElementById('navToggle'),
    navLinks: document.getElementById('navLinks'),
    particles: document.getElementById('particles'),
    serverStatus: document.getElementById('serverStatus'),
    playerCount: document.getElementById('playerCount'),
    statusIndicator: document.getElementById('statusIndicator'),
    statusText: document.getElementById('statusText'),
    onlinePlayers: document.getElementById('onlinePlayers'),
    maxPlayers: document.getElementById('maxPlayers'),
    serverVersion: document.getElementById('serverVersion'),
    ranksGrid: document.getElementById('ranksGrid'),
    copyIp: document.getElementById('copyIp'),
    toast: document.getElementById('toast'),
    toastMessage: document.getElementById('toastMessage')
};

// ========================================
// INITIALIZATION
// ========================================
document.addEventListener('DOMContentLoaded', () => {
    initParticles();
    initNavbar();
    initScrollAnimations();
    renderRanks();
    fetchServerStatus();
    initEventListeners();
    
    // Refresh server status periodically
    setInterval(fetchServerStatus, CONFIG.refreshInterval);
});

// ========================================
// PARTICLES ANIMATION
// ========================================
function initParticles() {
    if (!elements.particles) return;
    
    const particleCount = 25;
    
    for (let i = 0; i < particleCount; i++) {
        createParticle();
    }
}

function createParticle() {
    const particle = document.createElement('div');
    particle.className = 'particle';
    
    const size = Math.random() * 4 + 2;
    const left = Math.random() * 100;
    const delay = Math.random() * 15;
    const duration = Math.random() * 10 + 10;
    
    particle.style.cssText = `
        width: ${size}px;
        height: ${size}px;
        left: ${left}%;
        animation-delay: ${delay}s;
        animation-duration: ${duration}s;
        opacity: ${Math.random() * 0.5 + 0.2};
    `;
    
    elements.particles.appendChild(particle);
}

// ========================================
// NAVBAR
// ========================================
function initNavbar() {
    // Scroll effect
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            elements.navbar.classList.add('scrolled');
        } else {
            elements.navbar.classList.remove('scrolled');
        }
        
        updateActiveNavLink();
    });
    
    // Mobile toggle
    if (elements.navToggle) {
        elements.navToggle.addEventListener('click', () => {
            elements.navToggle.classList.toggle('active');
            elements.navLinks.classList.toggle('active');
        });
    }
    
    // Close mobile menu on link click
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            elements.navToggle.classList.remove('active');
            elements.navLinks.classList.remove('active');
        });
    });
}

function updateActiveNavLink() {
    const sections = document.querySelectorAll('section[id]');
    const scrollPos = window.scrollY + 100;
    
    sections.forEach(section => {
        const top = section.offsetTop;
        const height = section.offsetHeight;
        const id = section.getAttribute('id');
        
        if (scrollPos >= top && scrollPos < top + height) {
            document.querySelectorAll('.nav-link').forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${id}`) {
                    link.classList.add('active');
                }
            });
        }
    });
}

// ========================================
// SCROLL ANIMATIONS
// ========================================
function initScrollAnimations() {
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
            }
        });
    }, observerOptions);
    
    // Add reveal class to elements
    document.querySelectorAll('.section-header, .feature-item, .server-card, .rank-card').forEach(el => {
        el.classList.add('reveal');
        observer.observe(el);
    });
}

// ========================================
// RANKS RENDERING
// ========================================
function renderRanks() {
    if (!elements.ranksGrid) return;
    
    elements.ranksGrid.innerHTML = RANKS.map(rank => `
        <div class="rank-card" style="--card-color: ${rank.color}; --card-glow: ${rank.color}40">
            <div class="rank-glow"></div>
            <div class="rank-header">
                <h3 class="rank-name">${rank.name}</h3>
                <span class="rank-price">${rank.price}</span>
            </div>
            <div class="rank-divider"></div>
            <ul class="rank-perks">
                ${rank.perks.map(perk => `
                    <li><i class="fas fa-check"></i> ${perk}</li>
                `).join('')}
            </ul>
        </div>
    `).join('');
}

// ========================================
// SERVER STATUS
// ========================================
async function fetchServerStatus() {
    try {
        // Using a Minecraft server status API
        const response = await fetch(`https://api.mcsrvstat.us/2/${CONFIG.serverIp}:${CONFIG.serverPort}`);
        const data = await response.json();
        
        updateServerStatus(data);
    } catch (error) {
        console.error('Failed to fetch server status:', error);
        setOfflineStatus();
    }
}

function updateServerStatus(data) {
    const isOnline = data.online;
    
    // Update status indicator
    if (elements.statusIndicator) {
        elements.statusIndicator.className = 'status-indicator' + (isOnline ? ' online' : ' offline');
    }
    
    // Update status text
    if (elements.statusText) {
        elements.statusText.textContent = isOnline ? 'Server Online' : 'Server Offline';
    }
    
    if (elements.serverStatus) {
        elements.serverStatus.textContent = isOnline ? 'Online' : 'Offline';
        elements.serverStatus.style.color = isOnline ? 'var(--success)' : 'var(--error)';
    }
    
    // Update player counts
    if (isOnline) {
        const online = data.players?.online || 0;
        const max = data.players?.max || 0;
        const version = data.version || 'Unknown';
        
        if (elements.playerCount) {
            elements.playerCount.textContent = `${online}/${max}`;
        }
        if (elements.onlinePlayers) {
            elements.onlinePlayers.textContent = online;
        }
        if (elements.maxPlayers) {
            elements.maxPlayers.textContent = max;
        }
        if (elements.serverVersion) {
            elements.serverVersion.textContent = version;
        }
    } else {
        setOfflineStatus();
    }
}

function setOfflineStatus() {
    if (elements.statusIndicator) {
        elements.statusIndicator.className = 'status-indicator offline';
    }
    if (elements.statusText) {
        elements.statusText.textContent = 'Server Offline';
    }
    if (elements.serverStatus) {
        elements.serverStatus.textContent = 'Offline';
        elements.serverStatus.style.color = 'var(--error)';
    }
    if (elements.playerCount) {
        elements.playerCount.textContent = '-/-';
    }
    if (elements.onlinePlayers) {
        elements.onlinePlayers.textContent = '-';
    }
    if (elements.maxPlayers) {
        elements.maxPlayers.textContent = '-';
    }
    if (elements.serverVersion) {
        elements.serverVersion.textContent = '-';
    }
}

// ========================================
// EVENT LISTENERS
// ========================================
function initEventListeners() {
    // Copy IP button
    if (elements.copyIp) {
        elements.copyIp.addEventListener('click', () => {
            const ip = document.getElementById('serverIp').textContent;
            const port = document.getElementById('serverPort').textContent;
            const fullAddress = `${ip}:${port}`;
            
            navigator.clipboard.writeText(fullAddress).then(() => {
                showToast('Server IP copied to clipboard!');
            }).catch(() => {
                showToast('Failed to copy IP', 'error');
            });
        });
    }
}

// ========================================
// TOAST NOTIFICATION
// ========================================
function showToast(message, type = 'success') {
    if (!elements.toast || !elements.toastMessage) return;
    
    elements.toastMessage.textContent = message;
    
    const icon = elements.toast.querySelector('i');
    if (type === 'error') {
        icon.className = 'fas fa-exclamation-circle';
        elements.toast.style.background = 'rgba(255, 23, 68, 0.9)';
    } else {
        icon.className = 'fas fa-check-circle';
        elements.toast.style.background = 'rgba(0, 200, 83, 0.9)';
    }
    
    elements.toast.classList.add('show');
    
    setTimeout(() => {
        elements.toast.classList.remove('show');
    }, 3000);
}

// ========================================
// SMOOTH SCROLL POLYFILL
// ========================================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
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

// ========================================
// PARALLAX EFFECT
// ========================================
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const parallaxElements = document.querySelectorAll('.bg-gradient');
    
    parallaxElements.forEach(el => {
        const speed = 0.5;
        el.style.transform = `translateY(${scrolled * speed}px)`;
    });
});

// ========================================
// TILT EFFECT FOR CARDS
// ========================================
document.addEventListener('mousemove', (e) => {
    const cards = document.querySelectorAll('.rank-card, .server-card, .stat-card');
    
    cards.forEach(card => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        if (x >= 0 && x <= rect.width && y >= 0 && y <= rect.height) {
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            const rotateX = (y - centerY) / 20;
            const rotateY = (centerX - x) / 20;
            
            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-5px)`;
        } else {
            card.style.transform = '';
        }
    });
});

// ========================================
// TYPING EFFECT FOR TAGLINE
// ========================================
function typeWriter(element, text, speed = 100) {
    let i = 0;
    element.textContent = '';
    
    function type() {
        if (i < text.length) {
            element.textContent += text.charAt(i);
            i++;
            setTimeout(type, speed);
        }
    }
    
    type();
}

// Initialize typing effect on page load
window.addEventListener('load', () => {
    const tagline = document.getElementById('tagline');
    if (tagline) {
        const originalText = tagline.textContent;
        typeWriter(tagline, originalText, 80);
    }
});
