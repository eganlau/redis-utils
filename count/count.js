#!/usr/bin/env node

/* eslint no-console: "off" */

const Redis = require('ioredis');
const { argv } = require('yargs')
  .boolean('t')
  .default('h', '127.0.0.1')
  .default('p', 6379)
  .default('a', '')
  .default('t', false)
  .default('n', 1)
  .default('pattern', '*');

const host = argv.h;
const port = argv.p;
const auth = argv.a;
const tls = argv.t;
const db = argv.n;
const { pattern } = argv;

let roundCount = 0;
let keysCount = 0;
const startTime = new Date();

let redisConfig = {
  host: host,
  port: port,
  password: auth,
  db: db
}

if (tls === true) (
  redisConfig.tls = {}
)

const redis = new Redis(redisConfig);

// Start scanning
const stream = redis.scanStream({
  match: pattern,
  count: 10000
});

console.log(`\n*********** START SCANNING FOR PATTERN ${pattern} ***********`);

stream.on('data', (resultKeys) => {
  roundCount += 1;
  console.log(`\nFound ${resultKeys.length} keys on this round. Round count: ${roundCount}`);
  keysCount += resultKeys.length;
});
stream.on('end', () => {
  console.log('\n*********** SCAN FINISHED ***********');

  // Stop timer
  const executionTimeMs = new Date() - startTime;
  const executionTimeStr = millisecondsToStr(executionTimeMs);

  // Summary
  console.log(`\nNumber of rounds: ${roundCount}`);
  console.log(`Number of keys found: ${keysCount}`);
  console.info(`Execution time: ${executionTimeStr}`);
  process.exit();
});

function millisecondsToStr(milliseconds) {
  function numberEnding(number) {
    return (number > 1) ? 's' : '';
  }

  let temp = Math.floor(milliseconds / 1000);

  const hours = Math.floor((temp %= 86400) / 3600);
  if (hours) {
    return `${hours} hour${numberEnding(hours)}`;
  }
  const minutes = Math.floor((temp %= 3600) / 60);
  if (minutes) {
    return `${minutes} minute${numberEnding(minutes)}`;
  }
  const seconds = temp % 60;
  if (seconds) {
    return `${seconds} second${numberEnding(seconds)}`;
  }
  return 'Less than a second';
}
