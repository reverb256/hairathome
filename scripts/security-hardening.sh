#!/bin/bash

# Security Hardening Script for Hair at Home
# Implements OWASP Top 10 and ISO 27001 controls

set -euo pipefail

# Configuration
PROJECT_NAME="hairathome"
DOMAIN="hairathome.ca"
LOG_FILE="/var/log/security-hardening.log"
BACKUP_DIR="/opt/backups/security"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Logging function
log() {
    echo "$(date '+%Y-%m-%d %H:%M:%S') - $1" | tee -a "$LOG_FILE"
}

# Function to check if running as root
check_root() {
    if [[ $EUID -ne 0 ]]; then
        echo -e "${RED}This script must be run as root${NC}"
        exit 1
    fi
}

# Function to create backup
create_backup() {
    log "Creating backup of current configuration"
    mkdir -p "$BACKUP_DIR"
    tar -czf "$BACKUP_DIR/config-$(date +%Y%m%d-%H%M%S).tar.gz" \
        /etc/nginx/nginx.conf \
        /etc/ssl/certs/ \
        /etc/ssl/private/ \
        /var/www/ 2>/dev/null || true
}

# Function to set file permissions
set_permissions() {
    log "Setting secure file permissions"
    
    # Web root permissions
    find /var/www/$PROJECT_NAME -type f -exec chmod 644 {} \;
    find /var/www/$PROJECT_NAME -type d -exec chmod 755 {} \;
    
    # Configuration files
    chmod 600 /etc/ssl/private/*
    chmod 644 /etc/ssl/certs/*
    chmod 644 /etc/nginx/conf.d/*.conf
    
    # Remove world-writable permissions
    find /var/www/$PROJECT_NAME -perm /002 -type f -exec chmod o-w {} \;
    find /var/www/$PROJECT_NAME -perm /002 -type d -exec chmod o-w {} \;
    
    # Set proper ownership
    chown -R www-data:www-data /var/www/$PROJECT_NAME
}

# Function to install security updates
install_security_updates() {
    log "Installing security updates"
    apt-get update
    apt-get upgrade -y
    apt-get install -y \
        fail2ban \
        ufw \
        certbot \
        python3-certbot-nginx \
        unattended-upgrades \
        rkhunter \
        chkrootkit
}

# Function to configure firewall
configure_firewall() {
    log "Configuring UFW firewall"
    
    # Reset firewall rules
    ufw --force reset
    
    # Default policies
    ufw default deny incoming
    ufw default allow outgoing
    
    # Allow SSH (with rate limiting)
    ufw limit ssh
    
    # Allow HTTP and HTTPS
    ufw allow 80/tcp
    ufw allow 443/tcp
    
    # Enable firewall
    ufw --force enable
    
    log "Firewall configured successfully"
}

# Function to configure fail2ban
configure_fail2ban() {
    log "Configuring fail2ban"
    
    cat > /etc/fail2ban/jail.local << EOF
[DEFAULT]
bantime = 3600
findtime = 600
maxretry = 3
backend = systemd

[sshd]
enabled = true
port = ssh
logpath = %(sshd_log)s
maxretry = 3
bantime = 3600

[nginx-http-auth]
enabled = true
port = http,https
logpath = /var/log/nginx/error.log

[nginx-limit-req]
enabled = true
port = http,https
logpath = /var/log/nginx/error.log

[nginx-botsearch]
enabled = true
port = http,https
logpath = /var/log/nginx/access.log
maxretry = 2
EOF
    
    systemctl enable fail2ban
    systemctl restart fail2ban
    
    log "fail2ban configured successfully"
}

# Function to configure automatic security updates
configure_auto_updates() {
    log "Configuring automatic security updates"
    
    cat > /etc/apt/apt.conf.d/50unattended-upgrades << EOF
Unattended-Upgrade::Allowed-Origins {
    "\${distro_id}:\${distro_codename}";
    "\${distro_id}:\${distro_codename}-security";
    "\${distro_id}ESMApps:\${distro_codename}-apps-security";
    "\${distro_id}ESM:\${distro_codename}-infra-security";
};

Unattended-Upgrade::DevRelease "false";
Unattended-Upgrade::Remove-Unused-Dependencies "true";
Unattended-Upgrade::Automatic-Reboot "false";
EOF
    
    cat > /etc/apt/apt.conf.d/20auto-upgrades << EOF
APT::Periodic::Update-Package-Lists "1";
APT::Periodic::Download-Upgradeable-Packages "1";
APT::Periodic::AutocleanInterval "7";
APT::Periodic::Unattended-Upgrade "1";
EOF
    
    systemctl enable unattended-upgrades
    systemctl restart unattended-upgrades
    
    log "Automatic security updates configured"
}

# Function to secure SSH
secure_ssh() {
    log "Securing SSH configuration"
    
    # Backup original SSH config
    cp /etc/ssh/sshd_config /etc/ssh/sshd_config.backup
    
    # Apply SSH hardening
    sed -i 's/#PermitRootLogin yes/PermitRootLogin no/' /etc/ssh/sshd_config
    sed -i 's/#PasswordAuthentication yes/PasswordAuthentication no/' /etc/ssh/sshd_config
    sed -i 's/#PermitEmptyPasswords no/PermitEmptyPasswords no/' /etc/ssh/sshd_config
    sed -i 's/#X11Forwarding yes/X11Forwarding no/' /etc/ssh/sshd_config
    sed -i 's/#MaxAuthTries 6/MaxAuthTries 3/' /etc/ssh/sshd_config
    sed -i 's/#ClientAliveInterval 0/ClientAliveInterval 300/' /etc/ssh/sshd_config
    sed -i 's/#ClientAliveCountMax 3/ClientAliveCountMax 2/' /etc/ssh/sshd_config
    
    # Add additional security settings
    cat >> /etc/ssh/sshd_config << EOF

# Security hardening
Protocol 2
HostKey /etc/ssh/ssh_host_ed25519_key
HostKey /etc/ssh/ssh_host_rsa_key
KexAlgorithms curve25519-sha256@libssh.org,diffie-hellman-group16-sha512,diffie-hellman-group18-sha512,diffie-hellman-group-exchange-sha256
Ciphers chacha20-poly1305@openssh.com,aes256-gcm@openssh.com,aes128-gcm@openssh.com,aes256-ctr,aes192-ctr,aes128-ctr
MACs umac-128-etm@openssh.com,hmac-sha2-256-etm@openssh.com,hmac-sha2-512-etm@openssh.com,umac-128@openssh.com,hmac-sha2-256,hmac-sha2-512
IgnoreRhosts yes
LoginGraceTime 30
StrictModes yes
EOF
    
    systemctl restart ssh
    
    log "SSH secured successfully"
}

# Function to configure system security
configure_system_security() {
    log "Configuring system security"
    
    # Disable unused filesystems
    echo "install cramfs /bin/true" >> /etc/modprobe.d/disable-filesystems.conf
    echo "install freevxfs /bin/true" >> /etc/modprobe.d/disable-filesystems.conf
    echo "install jffs2 /bin/true" >> /etc/modprobe.d/disable-filesystems.conf
    echo "install hfs /bin/true" >> /etc/modprobe.d/disable-filesystems.conf
    echo "install hfsplus /bin/true" >> /etc/modprobe.d/disable-filesystems.conf
    echo "install squashfs /bin/true" >> /etc/modprobe.d/disable-filesystems.conf
    echo "install udf /bin/true" >> /etc/modprobe.d/disable-filesystems.conf
    
    # Network security
    echo "net.ipv4.ip_forward = 0" >> /etc/sysctl.conf
    echo "net.ipv4.conf.all.send_redirects = 0" >> /etc/sysctl.conf
    echo "net.ipv4.conf.default.send_redirects = 0" >> /etc/sysctl.conf
    echo "net.ipv4.conf.all.accept_source_route = 0" >> /etc/sysctl.conf
    echo "net.ipv4.conf.default.accept_source_route = 0" >> /etc/sysctl.conf
    echo "net.ipv4.conf.all.accept_redirects = 0" >> /etc/sysctl.conf
    echo "net.ipv4.conf.default.accept_redirects = 0" >> /etc/sysctl.conf
    echo "net.ipv4.conf.all.secure_redirects = 0" >> /etc/sysctl.conf
    echo "net.ipv4.conf.default.secure_redirects = 0" >> /etc/sysctl.conf
    echo "net.ipv4.conf.all.rp_filter = 1" >> /etc/sysctl.conf
    echo "net.ipv4.conf.default.rp_filter = 1" >> /etc/sysctl.conf
    echo "net.ipv4.tcp_syncookies = 1" >> /etc/sysctl.conf
    echo "net.ipv4.tcp_max_syn_backlog = 2048" >> /etc/sysctl.conf
    echo "net.ipv4.tcp_synack_retries = 2" >> /etc/sysctl.conf
    echo "net.ipv4.tcp_syn_retries = 5" >> /etc/sysctl.conf
    
    # Apply sysctl settings
    sysctl -p
    
    log "System security configured"
}

# Function to setup log monitoring
setup_log_monitoring() {
    log "Setting up log monitoring"
    
    # Create logrotate configuration
    cat > /etc/logrotate.d/$PROJECT_NAME << EOF
/var/log/nginx/$PROJECT_NAME_*.log {
    daily
    missingok
    rotate 52
    compress
    delaycompress
    notifempty
    create 644 www-data www-data
    postrotate
        systemctl reload nginx
    endscript
}
EOF
    
    # Setup security log monitoring
    cat > /etc/cron.daily/security-monitor << EOF
#!/bin/bash
# Daily security monitoring script

# Check for suspicious login attempts
grep "Failed password" /var/log/auth.log | tail -20 > /var/log/security-auth.log

# Check for web attacks
grep -E "(sqlmap|nmap|nikto|/admin|/wp-admin)" /var/log/nginx/access.log | tail -20 > /var/log/security-web.log

# Check for file changes
find /var/www/$PROJECT_NAME -type f -mtime -1 > /var/log/security-files.log

# Run rootkit detection
rkhunter --check --skip-keypress --report-warnings-only > /var/log/security-rkhunter.log
EOF
    
    chmod +x /etc/cron.daily/security-monitor
    
    log "Log monitoring configured"
}

# Function to generate SSL certificates
setup_ssl() {
    log "Setting up SSL certificates"
    
    # Generate strong Diffie-Hellman parameters
    openssl dhparam -out /etc/ssl/dhparam.pem 2048
    
    # Obtain SSL certificate from Let's Encrypt
    certbot --nginx -d $DOMAIN -d www.$DOMAIN --non-interactive --agree-tos --email admin@$DOMAIN
    
    # Setup auto-renewal
    echo "0 12 * * * /usr/bin/certbot renew --quiet" | crontab -
    
    log "SSL certificates configured"
}

# Function to deploy security configurations
deploy_security_configs() {
    log "Deploying security configurations"
    
    # Copy Nginx security configuration
    cp /mnt/sentry-nfs/projects/hairathome/config/nginx-security.conf /etc/nginx/sites-available/$PROJECT_NAME
    
    # Enable the site
    ln -sf /etc/nginx/sites-available/$PROJECT_NAME /etc/nginx/sites-enabled/
    
    # Remove default site
    rm -f /etc/nginx/sites-enabled/default
    
    # Test Nginx configuration
    nginx -t
    
    # Restart Nginx
    systemctl restart nginx
    
    log "Security configurations deployed"
}

# Function to run security scans
run_security_scans() {
    log "Running security scans"
    
    # Rootkit detection
    rkhunter --check --skip-keypress --report-warnings-only
    
    # Check for open ports
    nmap -sT -O localhost
    
    # Check file permissions
    find /var/www/$PROJECT_NAME -type f -perm /002 -ls
    
    log "Security scans completed"
}

# Function to generate security report
generate_security_report() {
    log "Generating security report"
    
    REPORT_FILE="/var/log/security-report-$(date +%Y%m%d-%H%M%S).txt"
    
    cat > "$REPORT_FILE" << EOF
Security Hardening Report for $PROJECT_NAME
Generated on: $(date)

=== System Information ===
OS: $(lsb_release -d | cut -f2)
Kernel: $(uname -r)
Uptime: $(uptime -p)

=== Security Status ===
Firewall Status: $(ufw status)
Fail2ban Status: $(systemctl is-active fail2ban)
SSL Certificate: $(openssl x509 -in /etc/letsencrypt/live/$DOMAIN/cert.pem -noout -dates)

=== Open Ports ===
$(nmap -sT -O localhost)

=== Recent Security Events ===
Failed Logins (last 24h):
$(grep "$(date '+%b %d')" /var/log/auth.log | grep "Failed password" | wc -l)

Web Attacks (last 24h):
$(grep "$(date '+%d/%b/%Y')" /var/log/nginx/access.log | grep -E "(sqlmap|nmap|nikto)" | wc -l)

=== Recommendations ===
1. Continue monitoring security logs
2. Regularly update system packages
3. Conduct periodic security assessments
4. Review and update security policies
5. Implement security awareness training

EOF
    
    log "Security report generated: $REPORT_FILE"
}

# Main execution function
main() {
    log "Starting security hardening for $PROJECT_NAME"
    
    check_root
    create_backup
    install_security_updates
    configure_firewall
    configure_fail2ban
    configure_auto_updates
    secure_ssh
    configure_system_security
    set_permissions
    setup_log_monitoring
    setup_ssl
    deploy_security_configs
    run_security_scans
    generate_security_report
    
    log "Security hardening completed successfully"
    echo -e "${GREEN}Security hardening completed successfully!${NC}"
    echo -e "${BLUE}Check the security report at: /var/log/security-report-*.txt${NC}"
}

# Execute main function
main "$@"