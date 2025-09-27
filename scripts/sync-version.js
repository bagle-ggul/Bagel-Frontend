#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const VERSION_YML_PATH = path.join(__dirname, '..', 'version.yml');
const VERSION_JS_PATH = path.join(__dirname, '..', 'src', 'constants', 'version.js');

function parseVersionYml() {
  try {
    const content = fs.readFileSync(VERSION_YML_PATH, 'utf8');
    const versionMatch = content.match(/^version:\s*["']?([0-9]+\.[0-9]+\.[0-9]+)["']?/m);

    if (!versionMatch) {
      console.error('❌ version.yml에서 버전 정보를 찾을 수 없습니다.');
      process.exit(1);
    }

    return versionMatch[1];
  } catch (error) {
    console.error('❌ version.yml 파일을 읽을 수 없습니다:', error.message);
    process.exit(1);
  }
}

function generateVersionFile(version) {
  const constantsDir = path.dirname(VERSION_JS_PATH);

  if (!fs.existsSync(constantsDir)) {
    fs.mkdirSync(constantsDir, { recursive: true });
  }

  const content = `export const APP_VERSION = '${version}';\n`;

  fs.writeFileSync(VERSION_JS_PATH, content, 'utf8');
  console.log(`✅ src/constants/version.js 파일에 버전 ${version} 생성 완료`);
}

const version = parseVersionYml();
console.log(`📦 version.yml에서 감지된 버전: ${version}`);
generateVersionFile(version);