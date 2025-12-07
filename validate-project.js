/**
 * Simple JavaScript validation function for the Hair@Home test project
 * Validates the project structure and configuration files
 */

function validateHairAtHomeProject() {
    console.log("🔍 Starting Hair@Home Project Validation...");
    
    // Project requirements
    const requirements = {
        configFiles: [
            'hugo.toml',
            '_config.yml',
            '.env.example'
        ],
        validationScripts: [
            'comprehensive-validation.py',
            'contrast-validation.py',
            'comprehensive-system-test.sh',
            'final-validation-check.sh'
        ],
        automationFiles: [
            'automation-system-status.sh',
            'beauty-enhanced-workflow.sh',
            'create-beauty-images.sh'
        ],
        themeFiles: [
            'beauty-dark-theme-demo.html',
            'intelligent-color-demo.html',
            'INTELLIGENT-COLOR-SHOWCASE.html'
        ]
    };
    
    // Check if this is running in Node.js environment
    const isNode = typeof process !== 'undefined' && process.versions && process.versions.node;
    
    if (isNode) {
        // Node.js environment - can check file system
        return validateInNode(requirements);
    } else {
        // Browser environment - basic validation only
        return validateInBrowser(requirements);
    }
}

function validateInNode(requirements) {
    const fs = require('fs');
    const path = require('path');
    
    console.log("✅ Running in Node.js environment");
    
    const results = {
        status: 'pass',
        checks: [],
        summary: { total: 0, passed: 0, failed: 0 }
    };
    
    // Validate config files
    results.checks.push(...validateFileGroup('Configuration Files', requirements.configFiles, fs, path));
    
    // Validate validation scripts
    results.checks.push(...validateFileGroup('Validation Scripts', requirements.validationScripts, fs, path));
    
    // Validate automation files
    results.checks.push(...validateFileGroup('Automation Files', requirements.automationFiles, fs, path));
    
    // Validate theme files
    results.checks.push(...validateFileGroup('Theme Files', requirements.themeFiles, fs, path));
    
    // Hugo config specific checks
    const hugoConfigCheck = validateHugoConfig(fs, path);
    results.checks.push(hugoConfigCheck);
    
    // Calculate summary
    results.summary.total = results.checks.length;
    results.summary.passed = results.checks.filter(check => check.status === 'pass').length;
    results.summary.failed = results.checks.length - results.summary.passed;
    
    if (results.summary.failed > 0) {
        results.status = 'fail';
    }
    
    return results;
}

function validateFileGroup(groupName, filePaths, fs, path) {
    const checks = [];
    
    console.log(`\n📄 Validating ${groupName}:`);
    
    filePaths.forEach(filePath => {
        try {
            if (fs.existsSync(filePath)) {
                const stats = fs.statSync(filePath);
                const size = stats.size;
                const lastModified = new Date(stats.mtime).toLocaleString();
                
                console.log(`  ✅ ${filePath} (${size} bytes, modified: ${lastModified})`);
                
                checks.push({
                    name: filePath,
                    status: 'pass',
                    details: `File exists (${size} bytes)`
                });
            } else {
                console.log(`  ❌ ${filePath} - NOT FOUND`);
                
                checks.push({
                    name: filePath,
                    status: 'fail',
                    details: 'File does not exist'
                });
            }
        } catch (error) {
            console.log(`  ❌ ${filePath} - ERROR: ${error.message}`);
            
            checks.push({
                name: filePath,
                status: 'fail',
                details: `Error accessing file: ${error.message}`
            });
        }
    });
    
    return checks;
}

function validateHugoConfig(fs, path) {
    console.log(`\n⚙️ Validating hugo.toml configuration:`);
    
    try {
        if (fs.existsSync('hugo.toml')) {
            const content = fs.readFileSync('hugo.toml', 'utf8');
            
            // Basic checks for required fields
            const checks = [
                { name: 'baseURL', present: content.includes('baseURL') },
                { name: 'title', present: content.includes('title') },
                { name: 'theme', present: content.includes('theme') },
                { name: 'params.description', present: content.includes('description') },
                { name: 'menu.main', present: content.includes('[menu.main]') }
            ];
            
            let allPassed = true;
            checks.forEach(check => {
                if (check.present) {
                    console.log(`  ✅ ${check.name} found`);
                } else {
                    console.log(`  ❌ ${check.name} missing`);
                    allPassed = false;
                }
            });
            
            if (allPassed) {
                console.log('  ✅ Hugo configuration is valid');
                return {
                    name: 'hugo.toml configuration',
                    status: 'pass',
                    details: 'All required fields present'
                };
            } else {
                return {
                    name: 'hugo.toml configuration',
                    status: 'fail',
                    details: 'Some required fields are missing'
                };
            }
        } else {
            console.log('  ❌ hugo.toml not found');
            return {
                name: 'hugo.toml configuration',
                status: 'fail',
                details: 'hugo.toml file does not exist'
            };
        }
    } catch (error) {
        console.log(`  ❌ Error reading hugo.toml: ${error.message}`);
        return {
            name: 'hugo.toml configuration',
            status: 'fail',
            details: `Error reading hugo.toml: ${error.message}`
        };
    }
}

function validateInBrowser(requirements) {
    console.log("⚠️ Running in browser environment - limited validation available");
    
    // In browser, we can only do basic validation without file system access
    return {
        status: 'pass',
        checks: [
            {
                name: 'Basic validation',
                status: 'pass',
                details: 'JavaScript validation function loaded successfully'
            },
            {
                name: 'Environment check',
                status: 'pass',
                details: 'Running in browser environment'
            }
        ],
        summary: { total: 2, passed: 2, failed: 0 }
    };
}

function printValidationReport(results) {
    console.log(`\n📋 VALIDATION REPORT`);
    console.log(`=====================`);
    console.log(`Status: ${results.status.toUpperCase()}`);
    console.log(`Total Checks: ${results.summary.total}`);
    console.log(`Passed: ${results.summary.passed}`);
    console.log(`Failed: ${results.summary.failed}`);
    
    if (results.summary.failed > 0) {
        console.log(`\n❌ Some checks failed. Please review the above output.`);
    } else {
        console.log(`\n🎉 All checks passed! Project is valid.`);
    }
    
    if (results.checks && results.checks.some(check => check.status === 'fail')) {
        const failedChecks = results.checks.filter(check => check.status === 'fail');
        console.log(`\nFailed items:`);
        failedChecks.forEach(failed => {
            console.log(`  • ${failed.name}: ${failed.details}`);
        });
    }
}

// Main execution
if (typeof module !== 'undefined' && module.exports) {
    // Node.js module
    module.exports = {
        validateHairAtHomeProject,
        printValidationReport
    };
} else {
    // Browser global
    window.validateHairAtHomeProject = validateHairAtHomeProject;
    window.printValidationReport = printValidationReport;
}

// If running directly
if (typeof require !== 'undefined' && require.main === module) {
    const results = validateHairAtHomeProject();
    printValidationReport(results);
}