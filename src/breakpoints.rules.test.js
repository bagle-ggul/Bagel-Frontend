import fs from "fs";
import path from "path";

import { breakpoints } from "./styles/theme";

/**
 * 반응형 기준점 규칙: 공용 기준점(theme.breakpoints) 값을 미디어 쿼리에 숫자로 직접 쓰지 않음
 * 소스 스캔 방식 (src/styles 제외) > media.mobile·media.tablet 등 헬퍼 사용
 */

const SOURCE_DIRECTORY = path.join(__dirname);
const TOKEN_DIRECTORY_NAME = "styles";

// 공용 기준점 값을 그대로 적은 미디어 쿼리 (예: @media (max-width: 480px))
const SHARED_BREAKPOINT_VALUES = Object.values(breakpoints).join("|");
const RAW_SHARED_BREAKPOINT_PATTERN = new RegExp(
  `@media \\((max|min)-width: (${SHARED_BREAKPOINT_VALUES})\\)`,
  "g"
);

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

describe("반응형 기준점 규칙", () => {
  it("공용 기준점 값을 미디어 쿼리에 직접 쓰지 않는다", () => {
    const violations = collectSourceFiles(SOURCE_DIRECTORY).flatMap((filePath) =>
      (fs.readFileSync(filePath, "utf-8").match(RAW_SHARED_BREAKPOINT_PATTERN) || []).map(
        (query) =>
          `${path.relative(SOURCE_DIRECTORY, filePath)}: ${query} (styles/theme 의 media 사용)`
      )
    );

    expect(violations).toEqual([]);
  });
});
