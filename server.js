/**
 * CUBYN SMP - Node.js Express Backend
 * Minecraft Server Website API
 */

const express = require('express');
const path = require('path');
const fs = require('fs');
const session = require('express-session');
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 3000;

// ========================================
// MIDDLEWARE
// ========================================
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('.'));

// Session configuration
app.use(session({
    secret: 'cubyn-smp-secret-key-2024',
    resave: false,
    saveUninitialized: false,
    cookie: { 
        secure: false,
        maxAge: 24 * 60 * 60 * 1000 // 24 hours
    }
}));

// ========================================
// CONFIGURATION FILE PATH
// ========================================
const CONFIG_FILE = path.join(__dirname, 'config.json');

// ========================================
// AUTHENTICATION MIDDLEWARE
// ========================================
function requireAuth(req, res, next) {
    if (req.session && req.session.authenticated) {
        next();
    } else {
        res.redirect('/login.html');
    }
}

// ========================================
// ROUTES - STATIC PAGES
// ========================================

// Home page
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Admin panel (protected)
app.get('/admin', requireAuth, (req, res) => {
    res.sendFile(path.join(__dirname, 'admin.html'));
});

app.get('/admin.html', requireAuth, (req, res) => {
    res.sendFile(path.join(__dirname, 'admin.html'));
});

// Login page
app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, 'login.html'));
});

app.get('/login.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'login.html'));
});

// ========================================
// API ROUTES - CONFIGURATION
// ========================================

// Get configuration
app.get('/api/config', (req, res) => {
    try {
        const config = JSON.parse(fs.readFileSync(CONFIG_FILE, 'utf8'));
        // Remove sensitive data
        delete config.admin;
        res.json(config);
    } catch (error) {
        res.status(500).json({ error: 'Failed to load configuration' });
    }
});

// Update configuration (admin only)
app.post('/api/config', requireAuth, (req, res) => {
    try {
        const currentConfig = JSON.parse(fs.readFileSync(CONFIG_FILE, 'utf8'));
        const newConfig = req.body;
        
        // Preserve admin credentials
        newConfig.admin = currentConfig.admin;
        
        // Write new configuration
        fs.writeFileSync(CONFIG_FILE, JSON.stringify(newConfig, null, 2));
        
        res.json({ success: true, message: 'Configuration updated successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to update configuration' });
    }
});

// Update server info (admin only)
app.post('/api/config/server', requireAuth, (req, res) => {
    try {
        const config = JSON.parse(fs.readFileSync(CONFIG_FILE, 'utf8'));
        
        if (req.body.name) config.server.name = req.body.name;
        if (req.body.ip) config.server.ip = req.body.ip;
        if (req.body.port) config.server.port = req.body.port;
        if (req.body.description) config.server.description = req.body.description;
        if (req.body.tagline) config.server.tagline = req.body.tagline;
        if (req.body.features) config.server.features = req.body.features;
        
        fs.writeFileSync(CONFIG_FILE, JSON.stringify(config, null, 2));
        
        res.json({ success: true, message: 'Server info updated successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to update server info' });
    }
});

// Update Discord link (admin only)
app.post('/api/config/discord', requireAuth, (req, res) => {
    try {
        const config = JSON.parse(fs.readFileSync(CONFIG_FILE, 'utf8'));
        
        if (req.body.link) config.discord.link = req.body.link;
        
        fs.writeFileSync(CONFIG_FILE, JSON.stringify(config, null, 2));
        
        res.json({ success: true, message: 'Discord link updated successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to update Discord link' });
    }
});

// Update ranks (admin only)
app.post('/api/config/ranks', requireAuth, (req, res) => {
    try {
        const config = JSON.parse(fs.readFileSync(CONFIG_FILE, 'utf8'));
        
        if (req.body.ranks) config.ranks = req.body.ranks;
        
        fs.writeFileSync(CONFIG_FILE, JSON.stringify(config, null, 2));
        
        res.json({ success: true, message: 'Ranks updated successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to update ranks' });
    }
});

// Update specific rank (admin only)
app.post('/api/config/ranks/:index', requireAuth, (req, res) => {
    try {
        const config = JSON.parse(fs.readFileSync(CONFIG_FILE, 'utf8'));
        const index = parseInt(req.params.index);
        
        if (index >= 0 && index < config.ranks.length) {
            if (req.body.name) config.ranks[index].name = req.body.name;
            if (req.body.price) config.ranks[index].price = req.body.price;
            if (req.body.color) config.ranks[index].color = req.body.color;
            if (req.body.perks) config.ranks[index].perks = req.body.perks;
            
            fs.writeFileSync(CONFIG_FILE, JSON.stringify(config, null, 2));
            
            res.json({ success: true, message: 'Rank updated successfully' });
        } else {
            res.status(400).json({ error: 'Invalid rank index' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Failed to update rank' });
    }
});

// ========================================
// API ROUTES - AUTHENTICATION
// ========================================

// Login
app.post('/api/login', (req, res) => {
    try {
        const config = JSON.parse(fs.readFileSync(CONFIG_FILE, 'utf8'));
        const { username, password } = req.body;
        
        if (username === config.admin.username && password === config.admin.password) {
            req.session.authenticated = true;
            req.session.username = username;
            res.json({ success: true, message: 'Login successful' });
        } else {
            res.status(401).json({ error: 'Invalid credentials' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Login failed' });
    }
});

// Logout
app.post('/api/logout', (req, res) => {
    req.session.destroy();
    res.json({ success: true, message: 'Logout successful' });
});

// Check authentication status
app.get('/api/auth/status', (req, res) => {
    res.json({ 
        authenticated: req.session.authenticated || false,
        username: req.session.username || null
    });
});

// ========================================
// API ROUTES - SERVER STATUS
// ========================================

// Get server status (proxy to mcsrvstat.us API)
app.get('/api/server/status', async (req, res) => {
    try {
        const config = JSON.parse(fs.readFileSync(CONFIG_FILE, 'utf8'));
        const { ip, port } = config.server;
        
        const fetch = (await import('node-fetch')).default;
        const response = await fetch(`https://api.mcsrvstat.us/2/${ip}:${port}`);
        const data = await response.json();
        
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch server status' });
    }
});

// ========================================
// ERROR HANDLING
// ========================================

// 404 handler
app.use((req, res) => {
    res.status(404).json({ error: 'Not found' });
});

// Error handler
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Internal server error' });
});

// ========================================
// START SERVER
// ========================================
app.listen(PORT, () => {
    console.log(`
╔══════════════════════════════════════════════════════════════╗
║                                                              ║
║   🎮 CUBYN SMP Server Website                                ║
║                                                              ║
║   Server running on port ${PORT}                              ║
║                                                              ║
║   Local: http://localhost:${PORT}                             ║
║                                                              ║
╚══════════════════════════════════════════════════════════════╝
    `);
});

module.exports = app;
