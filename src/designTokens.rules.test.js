import fs from "fs";
import path from "path";

import baseline from "./designTokens.baseline.json";

/**
 * 하드코딩 색 규칙: 소스의 rgb·rgba·hex 색 개수는 파일별 기준치 이하 (줄이기만 허용)
 * 소스 스캔 방식 (src/styles 제외, 기준치 파일: src/designTokens.baseline.json)
 */

const SOURCE_DIRECTORY = path.join(__dirname);
const REPOSITORY_SOURCE_PREFIX = "src";
const TOKEN_DIRECTORY_NAME = "styles";

// 색 패턴 2개: rgb·rgba 함수, hex (#126 같은 이슈 번호는 제외)
const COLOR_PATTERN = /rgba?\([^)]*\)|#[0-9a-fA-F]{3,8}\b/g;
const ISSUE_NUMBER_PATTERN = /^#\d{1,3}$/;

const collectSourceFiles = (directory) =>
  fs.readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const fullPath = path.join(directory, entry.name);
    if (entry.isDirectory()) {
      return entry.name === TOKEN_DIRECTORY_NAME && directory === SOURCE_DIRECTORY
        ? []
        : collectSourceFiles(fullPath);
    }
    const isSource = /\.(js|jsx)$/.test(entry.name) && !/\.test\.jsx?$/.test(entry.name);
    return isSource ? [fullPath] : [];
  });

const toRepositoryPath = (filePath) =>
  [REPOSITORY_SOURCE_PREFIX, ...path.relative(SOURCE_DIRECTORY, filePath).split(path.sep)].join(
    "/"
  );

const countHardcodedColors = (filePath) =>
  (fs.readFileSync(filePath, "utf-8").match(COLOR_PATTERN) || []).filter(
    (match) => !ISSUE_NUMBER_PATTERN.test(match)
  ).length;

const colorCountByPath = Object.fromEntries(
  collectSourceFiles(SOURCE_DIRECTORY)
    .map((filePath) => [toRepositoryPath(filePath), countHardcodedColors(filePath)])
    .filter(([, count]) => count > 0)
    .sort(([a], [b]) => (a < b ? -1 : 1))
);

describe("하드코딩 색 규칙", () => {
  it("기준치에 없는 파일은 하드코딩 색 0개", () => {
    const violations = Object.entries(colorCountByPath)
      .filter(([filePath]) => !(filePath in baseline))
      .map(([filePath, count]) => `${filePath}: ${count}개 (토큰을 쓰세요)`);

    expect(violations).toEqual([]);
  });

  it("기준치에 있는 파일은 개수가 기준치 이하", () => {
    const violations = Object.entries(baseline)
      .filter(([filePath, limit]) => (colorCountByPath[filePath] || 0) > limit)
      .map(
        ([filePath, limit]) =>
          `${filePath}: ${colorCountByPath[filePath]}개 > 기준치 ${limit}개 (토큰을 쓰세요)`
      );

    expect(violations).toEqual([]);
  });

  it("기준치보다 줄어든 파일이 있으면 기준치를 갱신하라는 실패 메시지", () => {
    const staleEntries = Object.entries(baseline)
      .filter(([filePath, limit]) => (colorCountByPath[filePath] || 0) < limit)
      .map(
        ([filePath, limit]) =>
          `${filePath}: 기준치 ${limit}개 > 실제 ${colorCountByPath[filePath] || 0}개. src/designTokens.baseline.json 의 숫자를 낮추세요 (0개면 항목 삭제)`
      );

    expect(staleEntries).toEqual([]);
  });
});
