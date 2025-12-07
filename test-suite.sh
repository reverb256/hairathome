#!/bin/bash

# Comprehensive Hair@Home Website Testing Suite
# Tests across multiple k3s nodes with detailed metrics

NODES=("forge" "nexus" "sentry")
BASE_URL="https://reverb256.github.io/hairathome"
RESULTS_DIR="/tmp/hairathome-test-results"
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")

# Create results directory
mkdir -p "$RESULTS_DIR"

echo "=== Hair@Home Comprehensive Testing Suite ==="
echo "Testing URL: $BASE_URL"
echo "Timestamp: $TIMESTAMP"
echo "Nodes: ${NODES[*]}"
echo "============================================="

# Function to run tests from a specific node
run_tests_from_node() {
    local node=$1
    local node_results="$RESULTS_DIR/node_${node}_${TIMESTAMP}"
    mkdir -p "$node_results"
    
    echo "Running tests from node: $node"
    
    # Basic connectivity test
    echo "1. Connectivity Test" > "$node_results/connectivity.txt"
    kubectl exec -n default "$node" -- curl -s -o /dev/null -w "%{http_code}\n" "$BASE_URL" >> "$node_results/connectivity.txt" 2>&1
    
    # Load time test
    echo "2. Load Time Test" > "$node_results/load_time.txt"
    kubectl exec -n default "$node" -- curl -s -o /dev/null -w "Time: %{time_total}s, DNS: %{time_namelookup}s, Connect: %{time_connect}s\n" "$BASE_URL" >> "$node_results/load_time.txt" 2>&1
    
    # Header analysis
    echo "3. Security Headers" > "$node_results/headers.txt"
    kubectl exec -n default "$node" -- curl -s -I "$BASE_URL" >> "$node_results/headers.txt" 2>&1
    
    # Content size
    echo "4. Content Size" > "$node_results/content_size.txt"
    kubectl exec -n default "$node" -- curl -s "$BASE_URL" | wc -c >> "$node_results/content_size.txt" 2>&1
    
    # SSL/TLS test
    echo "5. SSL/TLS Test" > "$node_results/ssl.txt"
    kubectl exec -n default "$node" -- timeout 10 openssl s_client -connect reverb256.github.io:443 -servername reverb256.github.io < /dev/null 2>/dev/null | grep -E "(Protocol|Cipher|Verification)" >> "$node_results/ssl.txt" || echo "SSL test failed" >> "$node_results/ssl.txt"
    
    # DNS resolution test
    echo "6. DNS Resolution" > "$node_results/dns.txt"
    kubectl exec -n default "$node" -- nslookup reverb256.github.io >> "$node_results/dns.txt" 2>&1
    
    # Trace route
    echo "7. Network Path" > "$node_results/trace.txt"
    kubectl exec -n default "$node" -- timeout 15 traceroute -n reverb256.github.io 2>/dev/null | head -10 >> "$node_results/trace.txt" || echo "Trace route failed" >> "$node_results/trace.txt"
}

# Function to run performance tests
run_performance_tests() {
    echo "=== Performance Testing ==="
    
    for node in "${NODES[@]}"; do
        echo "Running performance tests from $node..."
        
        # Concurrent connections test
        kubectl exec -n default "$node" -- bash -c "
            for i in {1..10}; do
                start_time=\$(date +%s%N)
                curl -s '$BASE_URL' > /dev/null
                end_time=\$(date +%s%N)
                echo \"\$(( (\$end_time - \$start_time) / 1000000 ))ms\"
            done
        " > "$RESULTS_DIR/perf_${node}_${TIMESTAMP}.txt" 2>&1 &
    done
    
    wait
}

# Function to test responsive design
run_responsive_tests() {
    echo "=== Responsive Design Testing ==="
    
    # Test different user agents
    declare -A USER_AGENTS=(
        ["desktop"]="Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"
        ["mobile"]="Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15"
        ["tablet"]="Mozilla/5.0 (iPad; CPU OS 17_0 like Mac OS X) AppleWebKit/605.1.15"
    )
    
    for device in "${!USER_AGENTS[@]}"; do
        echo "Testing $device view..."
        for node in "${NODES[@]}"; do
            kubectl exec -n default "$node" -- curl -s -H "User-Agent: ${USER_AGENTS[$device]}" "$BASE_URL" > "$RESULTS_DIR/${device}_${node}_${TIMESTAMP}.html" 2>&1 &
        done
    done
    
    wait
}

# Function to test accessibility
run_accessibility_tests() {
    echo "=== Accessibility Testing ==="
    
    for node in "${NODES[@]}"; do
        echo "Testing accessibility from $node..."
        
        # Check for alt text, semantic HTML, ARIA labels
        kubectl exec -n default "$node" -- curl -s "$BASE_URL" | grep -E "(alt=|aria-|role=|<nav|<main|<header|<footer)" > "$RESULTS_DIR/accessibility_${node}_${TIMESTAMP}.txt" 2>&1 &
        
        # Check for proper heading structure
        kubectl exec -n default "$node" -- curl -s "$BASE_URL" | grep -E "<h[1-6]" > "$RESULTS_DIR/headings_${node}_${TIMESTAMP}.txt" 2>&1 &
    done
    
    wait
}

# Function to test forms and interactions
run_form_tests() {
    echo "=== Form Testing ==="
    
    for node in "${NODES[@]}"; do
        echo "Testing forms from $node..."
        
        # Test booking form endpoint
        kubectl exec -n default "$node" -- curl -s -X POST -H "Content-Type: application/x-www-form-urlencoded" -d "name=Test&email=test@example.com&phone=2045550123" "$BASE_URL" > "$RESULTS_DIR/form_test_${node}_${TIMESTAMP}.txt" 2>&1 &
        
        # Test form validation
        kubectl exec -n default "$node" -- curl -s "$BASE_URL" | grep -E "(required|pattern|minlength|maxlength)" > "$RESULTS_DIR/form_validation_${node}_${TIMESTAMP}.txt" 2>&1 &
    done
    
    wait
}

# Function to test dark mode functionality
run_dark_mode_tests() {
    echo "=== Dark Mode Testing ==="
    
    for node in "${NODES[@]}"; do
        echo "Testing dark mode from $node..."
        
        # Check for dark mode CSS and JavaScript
        kubectl exec -n default "$node" -- curl -s "$BASE_URL" | grep -E "(dark:|dark-mode|theme-toggle)" > "$RESULTS_DIR/darkmode_${node}_${TIMESTAMP}.txt" 2>&1 &
        
        # Test prefers-color-scheme
        kubectl exec -n default "$node" -- curl -s -H "Sec-CH-Prefers-Color-Scheme: dark" "$BASE_URL" > "$RESULTS_DIR/darkmode_pref_${node}_${TIMESTAMP}.html" 2>&1 &
    done
    
    wait
}

# Function to generate comprehensive report
generate_report() {
    echo "=== Generating Comprehensive Report ==="
    
    REPORT_FILE="$RESULTS_DIR/comprehensive_report_${TIMESTAMP}.md"
    
    cat > "$REPORT_FILE" << EOF
# Hair@Home Website Comprehensive Testing Report

**Test Date:** $(date)
**Base URL:** $BASE_URL
**Test Nodes:** ${NODES[*]}

## Executive Summary

EOF

    # Calculate average load times
    echo "### Performance Metrics" >> "$REPORT_FILE"
    echo "" >> "$REPORT_FILE"
    
    for node in "${NODES[@]}"; do
        if [ -f "$RESULTS_DIR/perf_${node}_${TIMESTAMP}.txt" ]; then
            echo "#### $node Performance:" >> "$REPORT_FILE"
            avg_time=$(kubectl exec -n default "$node" -- cat "$RESULTS_DIR/perf_${node}_${TIMESTAMP}.txt" 2>/dev/null | awk '{sum+=$1} END {print sum/NR}' 2>/dev/null || echo "N/A")
            echo "- Average Load Time: ${avg_time}ms" >> "$REPORT_FILE"
            echo "" >> "$REPORT_FILE"
        fi
    done
    
    # Security analysis
    echo "### Security Analysis" >> "$REPORT_FILE"
    echo "" >> "$REPORT_FILE"
    
    for node in "${NODES[@]}"; do
        if [ -f "$RESULTS_DIR/node_${node}_${TIMESTAMP}/headers.txt" ]; then
            echo "#### $node Security Headers:" >> "$REPORT_FILE"
            kubectl exec -n default "$node" -- cat "$RESULTS_DIR/node_${node}_${TIMESTAMP}/headers.txt" 2>/dev/null | grep -i -E "(strict-transport-security|content-security-policy|x-frame-options|x-content-type-options)" >> "$REPORT_FILE" 2>/dev/null || echo "- No security headers detected" >> "$REPORT_FILE"
            echo "" >> "$REPORT_FILE"
        fi
    done
    
    # Accessibility summary
    echo "### Accessibility Compliance" >> "$REPORT_FILE"
    echo "" >> "$REPORT_FILE"
    
    for node in "${NODES[@]}"; do
        if [ -f "$RESULTS_DIR/accessibility_${node}_${TIMESTAMP}.txt" ]; then
            alt_count=$(kubectl exec -n default "$node" -- cat "$RESULTS_DIR/accessibility_${node}_${TIMESTAMP}.txt" 2>/dev/null | grep -c "alt=" || echo "0")
            aria_count=$(kubectl exec -n default "$node" -- cat "$RESULTS_DIR/accessibility_${node}_${TIMESTAMP}.txt" 2>/dev/null | grep -c "aria-" || echo "0")
            echo "#### $node Accessibility:" >> "$REPORT_FILE"
            echo "- Alt text attributes: $alt_count" >> "$REPORT_FILE"
            echo "- ARIA attributes: $aria_count" >> "$REPORT_FILE"
            echo "" >> "$REPORT_FILE"
        fi
    done
    
    # Connectivity summary
    echo "### Connectivity Analysis" >> "$REPORT_FILE"
    echo "" >> "$REPORT_FILE"
    
    for node in "${NODES[@]}"; do
        if [ -f "$RESULTS_DIR/node_${node}_${TIMESTAMP}/connectivity.txt" ]; then
            status=$(kubectl exec -n default "$node" -- tail -1 "$RESULTS_DIR/node_${node}_${TIMESTAMP}/connectivity.txt" 2>/dev/null || echo "Unknown")
            echo "#### $node Status:" >> "$REPORT_FILE"
            echo "- HTTP Status: $status" >> "$REPORT_FILE"
            echo "" >> "$REPORT_FILE"
        fi
    done
    
    echo "## Recommendations" >> "$REPORT_FILE"
    echo "" >> "$REPORT_FILE"
    echo "1. **Performance:** Optimize image loading and implement better caching strategies" >> "$REPORT_FILE"
    echo "2. **Security:** Implement Content Security Policy and additional security headers" >> "$REPORT_FILE"
    echo "3. **Accessibility:** Add more ARIA labels and ensure proper semantic HTML structure" >> "$REPORT_FILE"
    echo "4. **Dark Mode:** Ensure consistent dark mode implementation across all pages" >> "$REPORT_FILE"
    echo "5. **Forms:** Implement proper form validation and error handling" >> "$REPORT_FILE"
    
    echo "Report generated: $REPORT_FILE"
}

# Main execution
main() {
    # Run basic connectivity tests from all nodes
    for node in "${NODES[@]}"; do
        run_tests_from_node "$node" &
    done
    wait
    
    # Run specialized tests
    run_performance_tests
    run_responsive_tests
    run_accessibility_tests
    run_form_tests
    run_dark_mode_tests
    
    # Generate comprehensive report
    generate_report
    
    echo "=== Testing Complete ==="
    echo "Results saved to: $RESULTS_DIR"
    echo "Comprehensive report: $RESULTS_DIR/comprehensive_report_${TIMESTAMP}.md"
}

# Execute main function
main