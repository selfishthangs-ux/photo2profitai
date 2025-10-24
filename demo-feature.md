# Sample Feature Demo

This is a test file created to demonstrate the Copilot agent workflow and validate our repository setup.

## Purpose

This file tests:
- ✅ Branch naming conventions (`copilot/test/sample-feature-demo`)
- ✅ File creation and commit process
- ✅ PR template application
- ✅ CI/CD pipeline execution
- ✅ Code quality checks
- ✅ Security scanning
- ✅ Agent validation workflow

## Sample Code Snippets

### Python Example (for future testing)
```python
def calculate_profit_margin(cost_price, selling_price):
    """Calculate profit margin percentage."""
    if cost_price <= 0:
        raise ValueError("Cost price must be positive")
    
    profit = selling_price - cost_price
    margin = (profit / cost_price) * 100
    return round(margin, 2)

# Example usage
cost = 10.00
price = 15.00
margin = calculate_profit_margin(cost, price)
print(f"Profit margin: {margin}%")
```

### JavaScript Example (for future testing)
```javascript
/**
 * Calculate profit margin percentage
 * @param {number} costPrice - The cost price of the item
 * @param {number} sellingPrice - The selling price of the item
 * @returns {number} Profit margin as a percentage
 */
function calculateProfitMargin(costPrice, sellingPrice) {
    if (costPrice <= 0) {
        throw new Error('Cost price must be positive');
    }
    
    const profit = sellingPrice - costPrice;
    const margin = (profit / costPrice) * 100;
    return Math.round(margin * 100) / 100;
}

// Example usage
const cost = 10.00;
const price = 15.00;
const margin = calculateProfitMargin(cost, price);
console.log(`Profit margin: ${margin}%`);
```

## Test Checklist

This demo validates:
- [x] Copilot agent branch naming convention
- [x] File creation with proper content
- [x] No secrets or credentials included
- [x] Documentation is clear and helpful
- [x] Code examples follow best practices
- [x] Commit message follows conventional format

## Notes

This is a demonstration file created by the Copilot coding agent to test the repository setup and automation workflows. It should be safe to merge as it only adds documentation and example code without affecting any production systems.

---

*Created as part of Copilot agent setup validation - October 2025*