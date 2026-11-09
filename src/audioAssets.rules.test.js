import fs from "fs";
import path from "path";

/**
 * 오디오 자산 규칙: public/audio는 AAC(.m4a)만, 코드는 /audio/이름.m4a만, 참조 파일은 실제 존재
 * 영상 트랙이 든 MP4를 .mp3로 두면 배포 용량이 수 배로 커진다 (#126)
 */

const AUDIO_DIRECTORY = path.join(__dirname, "..", "public", "audio");

const collectSourceFiles = (directory) =>
  fs.readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const fullPath = path.join(directory, entry.name);
    if (entry.isDirectory()) return collectSourceFiles(fullPath);
    const isSource = /\.(js|jsx|json)$/.test(entry.name) && !/\.test\.js$/.test(entry.name);
    return isSource ? [fullPath] : [];
  });

const sourceFiles = collectSourceFiles(__dirname);
const readSource = (filePath) => fs.readFileSync(filePath, "utf-8");

describe("오디오 자산 규칙", () => {
  it("public/audio에는 .m4a만 있다", () => {
    const nonAacFiles = fs.readdirSync(AUDIO_DIRECTORY).filter((name) => !name.endsWith(".m4a"));

    expect(nonAacFiles).toEqual([]);
  });

  it("코드에서 /audio/ 아래 .m4a 외 형식을 참조하지 않는다", () => {
    const violations = sourceFiles.filter((filePath) =>
      /\/audio\/[A-Za-z0-9_-]+\.(mp3|wav|ogg|mp4)/i.test(readSource(filePath))
    );

    expect(violations).toEqual([]);
  });

  it("참조한 오디오 파일이 실제로 존재한다", () => {
    const referencedNames = new Set(
      sourceFiles.flatMap((filePath) =>
        [...readSource(filePath).matchAll(/\/audio\/([A-Za-z0-9_-]+\.m4a)/g)].map(
          (match) => match[1]
        )
      )
    );
    const missingNames = [...referencedNames].filter(
      (name) => !fs.existsSync(path.join(AUDIO_DIRECTORY, name))
    );

    expect(missingNames).toEqual([]);
  });
});
