import { test } from '@playwright/test';

/**
 * Test warning/finding severity levels
 */
export enum WarningSeverity {
  INFO = 'INFO',
  WARNING = 'WARNING',
  CRITICAL = 'CRITICAL'
}

/**
 * Test warning/finding logger
 * Logs security findings, performance issues, and other concerns
 */
export class TestLogger {
  private static warnings: Array<{
    test: string;
    severity: WarningSeverity;
    message: string;
    timestamp: string;
  }> = [];

  /**
   * Log a warning/finding
   */
  static logWarning(severity: WarningSeverity, message: string) {
    const warning = {
      test: test.info().title,
      severity,
      message,
      timestamp: new Date().toISOString()
    };
    
    this.warnings.push(warning);
    
    // Attach to test with custom type AND description for visibility
    test.info().annotations.push({
      type: `${severity.toLowerCase()}-finding`,
      description: `${this.getSeverityIcon(severity)} ${message}`
    });

    // Also add as attachment for HTML report visibility
    test.info().attachments.push({
      name: `${severity} Finding`,
      contentType: 'text/plain',
      body: Buffer.from(`[${severity}] ${message}`)
    });

    // Log to console with color coding
    const prefix = this.getSeverityIcon(severity);
    console.log(`${prefix} [${severity}] ${message}`);
  }

  private static getSeverityIcon(severity: WarningSeverity): string {
    switch (severity) {
      case WarningSeverity.CRITICAL:
        return '🔴 CRITICAL';
      case WarningSeverity.WARNING:
        return '⚠️  WARNING';
      case WarningSeverity.INFO:
        return 'ℹ️  INFO';
      default:
        return '';
    }
  }

  /**
   * Log an informational finding
   */
  static info(message: string) {
    this.logWarning(WarningSeverity.INFO, message);
  }

  /**
   * Log a warning-level finding
   */
  static warning(message: string) {
    this.logWarning(WarningSeverity.WARNING, message);
  }

  /**
   * Log a critical security/bug finding
   */
  static critical(message: string) {
    this.logWarning(WarningSeverity.CRITICAL, message);
  }

  /**
   * Get all warnings
   */
  static getWarnings() {
    return this.warnings;
  }

  /**
   * Get warnings by severity
   */
  static getWarningsBySeverity(severity: WarningSeverity) {
    return this.warnings.filter(w => w.severity === severity);
  }

  /**
   * Clear all warnings (useful for test cleanup)
   */
  static clearWarnings() {
    this.warnings = [];
  }

  /**
   * Get summary report
   */
  static getSummary() {
    const critical = this.getWarningsBySeverity(WarningSeverity.CRITICAL);
    const warnings = this.getWarningsBySeverity(WarningSeverity.WARNING);
    const info = this.getWarningsBySeverity(WarningSeverity.INFO);

    return {
      total: this.warnings.length,
      critical: critical.length,
      warnings: warnings.length,
      info: info.length,
      details: {
        critical,
        warnings,
        info
      }
    };
  }
}
