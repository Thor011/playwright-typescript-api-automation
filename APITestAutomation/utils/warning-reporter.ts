import type { Reporter, TestCase, TestResult } from '@playwright/test/reporter';

/**
 * Custom Playwright Reporter to display warnings/findings in test results
 */
class WarningReporter implements Reporter {
  onTestEnd(test: TestCase, result: TestResult) {
    const annotations = result.annotations;
    
    // Display warnings/findings with color coding
    annotations.forEach(annotation => {
      if (annotation.type === 'critical') {
        console.log(`  🔴 CRITICAL: ${annotation.description}`);
      } else if (annotation.type === 'warning') {
        console.log(`  ⚠️  WARNING: ${annotation.description}`);
      } else if (annotation.type === 'info') {
        console.log(`  ℹ️  INFO: ${annotation.description}`);
      }
    });
  }

  onEnd() {
    console.log('\n📊 Test Warnings Summary\n');
    console.log('Check HTML report for detailed warning breakdown');
  }
}

export default WarningReporter;
