import fs from "fs";
import path from "path";

/**
 * 이미지 자산 규칙 테스트 (소스 스캔)
 * - public/img는 webp만 둔다 (PNG·JPG가 돌아오면 배포 용량이 다시 커진다)
 * - 코드는 /img/이름.webp 절대 경로만 쓴다 (img/… 상대 경로는 중첩 라우트에서 깨진다)
 * - 참조한 파일은 실제로 존재해야 한다
 */

const SOURCE_DIRECTORY = path.join(__dirname);
const IMAGE_DIRECTORY = path.join(__dirname, "..", "public", "img");

// 변환 이전부터 파일이 없던 참조. DialogueSystem이 avatar를 쓰지 않아 런타임 영향 없음.
// 이 목록은 줄이기만 한다 (새 항목 추가 금지)
const KNOWN_MISSING_IMAGE_NAMES = ["mc_main.webp", "her_main_happy.webp", "mystery_man.webp"];

const collectSourceFiles = (directory) =>
  fs.readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const fullPath = path.join(directory, entry.name);
    if (entry.isDirectory()) return collectSourceFiles(fullPath);
    const isSource = /\.(js|jsx|json)$/.test(entry.name) && !/\.test\.js$/.test(entry.name);
    return isSource ? [fullPath] : [];
  });

const sourceFiles = collectSourceFiles(SOURCE_DIRECTORY);
const readSource = (filePath) => fs.readFileSync(filePath, "utf-8");

describe("이미지 자산 규칙", () => {
  it("public/img에는 webp만 있다", () => {
    const nonWebpFiles = fs.readdirSync(IMAGE_DIRECTORY).filter((name) => !name.endsWith(".webp"));

    expect(nonWebpFiles).toEqual([]);
  });

  it("코드에서 /img/ 아래 PNG·JPG를 참조하지 않는다", () => {
    const violations = sourceFiles.filter((filePath) =>
      /\/img\/[A-Za-z0-9_]+\.(png|jpe?g)/i.test(readSource(filePath))
    );

    expect(violations).toEqual([]);
  });

  it("img/ 상대 경로를 쓰지 않는다 (항상 /img/ 절대 경로)", () => {
    const violations = sourceFiles.filter((filePath) =>
      /["'(`]img\/[A-Za-z0-9_]+\.[a-z]+/.test(readSource(filePath))
    );

    expect(violations).toEqual([]);
  });

  it("참조한 webp 파일이 실제로 존재한다 (알려진 예외 제외)", () => {
    const referencedNames = new Set(
      sourceFiles.flatMap((filePath) =>
        [...readSource(filePath).matchAll(/\/img\/([A-Za-z0-9_]+\.webp)/g)].map((match) => match[1])
      )
    );
    const missingNames = [...referencedNames].filter(
      (name) =>
        !fs.existsSync(path.join(IMAGE_DIRECTORY, name)) &&
        !KNOWN_MISSING_IMAGE_NAMES.includes(name)
    );

    expect(missingNames).toEqual([]);
  });
});
