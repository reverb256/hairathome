# Hair@Home Project Validation

This JavaScript validation function checks the integrity and completeness of the Hair@Home project files.

## Overview

The `validate-project.js` file contains a comprehensive validation function that checks:

1. **Configuration Files**: Ensures essential configuration files exist
2. **Validation Scripts**: Verifies that Python and shell validation scripts are present
3. **Automation Files**: Checks for automation and workflow scripts
4. **Theme Files**: Validates beauty theme and color showcase files
5. **Hugo Configuration**: Verifies the hugo.toml has all required fields

## Usage

### Command Line
```bash
node validate-project.js
```

### As a Module
```javascript
const { validateHairAtHomeProject, printValidationReport } = require('./validate-project.js');

const results = validateHairAtHomeProject();
printValidationReport(results);
```

### In Browser
```html
<script src="validate-project.js"></script>
<script>
  const results = validateHairAtHomeProject();
  printValidationReport(results);
</script>
```

## Features

- **File Existence Checks**: Verifies all necessary project files are present
- **File Metadata**: Shows file sizes and modification dates
- **Configuration Validation**: Ensures Hugo configuration has required fields
- **Detailed Reporting**: Provides comprehensive validation report
- **Cross-Environment**: Works in both Node.js and browser environments

## Output

The validation generates a report with:
- Total checks performed
- Number of passed/failed checks
- Individual file status
- Specific error details for failed checks

## License

This validation script is part of the Hair@Home project.