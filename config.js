const fs = require('fs');
const path = require('path');

const env = process.argv[2]; // get the environment argument

if (!env || (env !== 'local' && env !== 'host')) {
  console.error('Please specify an environment: local or host');
  process.exit(1);
}

const envFile = `.env.${env}`;
const envFilePath = path.resolve(__dirname, 'config', envFile);
const targetEnvFile = path.resolve(__dirname, '.env');

const packageFile = `package.${env}.json`;
const packageFilePath = path.resolve(__dirname, 'config', packageFile);
const targetPackageFile = path.resolve(__dirname, 'package.json');

if (!fs.existsSync(envFilePath)) {
  console.error(`Environment file ${envFilePath} does not exist`);
  process.exit(1);
}

if (!fs.existsSync(packageFilePath)) {
  console.error(`Package file ${packageFilePath} does not exist`);
  process.exit(1);
}

// Copy .env file
fs.copyFileSync(envFilePath, targetEnvFile);
console.log(`Copied ${envFilePath} to .env`);

// Read package.json and package.[env].json
const packageJson = JSON.parse(fs.readFileSync(targetPackageFile, 'utf8'));
const envPackageJson = JSON.parse(fs.readFileSync(packageFilePath, 'utf8'));

// Update scripts section
packageJson.scripts = envPackageJson.scripts;

// Write updated package.json
fs.writeFileSync(targetPackageFile, JSON.stringify(packageJson, null, 2));
console.log(`Updated package.json with scripts from ${packageFilePath}`);
