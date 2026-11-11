import { test } from '@playwright/test';
import fs from 'fs';

test.beforeEach(async ({ page }, testInfo) => {
  const logsDir = `test-results/${testInfo.title}`;
  fs.mkdirSync(logsDir, { recursive: true });

  page.on('console', msg => {
    fs.appendFileSync(
      `${logsDir}/console.log`,
      `[${msg.type()}] ${msg.text()}\n`
    );
  });

  page.on('request', request => {
    fs.appendFileSync(
      `${logsDir}/network.log`,
      `REQUEST: ${request.method()} ${request.url()}\n`
    );
  });

  page.on('response', response => {
    fs.appendFileSync(
      `${logsDir}/network.log`,
      `RESPONSE: ${response.status()} ${response.url()}\n`
    );
  });
});