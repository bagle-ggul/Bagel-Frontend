const toKebabCase = (propertyName) =>
  propertyName.replace(/[A-Z]/g, (letter) => `-${letter.toLowerCase()}`);

// 중첩 객체(hover 등)는 제외하고 값이 있는 속성만 CSS 선언으로 변환
const toDeclarations = (styles) =>
  Object.entries(styles)
    .filter(([, value]) => value !== null && typeof value !== "object")
    .map(([propertyName, value]) => `${toKebabCase(propertyName)}: ${value};`)
    .join(" ");

/**
 * 스타일 객체 > CSS 문자열 (camelCase 속성은 kebab-case로, 중첩 hover는 &:hover 블록으로)
 * theme.js의 componentStyles처럼 JS 객체로 둔 스타일을 styled-components에 주입할 때 쓴다.
 * camelCase를 그대로 내보내면 브라우저가 무효 CSS로 버려 레이아웃이 통째로 사라진다.
 *
 * @param {Object} [styleObject]
 * @returns {string}
 */
export const toCss = (styleObject) => {
  if (!styleObject) {
    return "";
  }
  const { hover, ...baseStyles } = styleObject;
  const hoverBlock = hover ? ` &:hover { ${toDeclarations(hover)} }` : "";
  return `${toDeclarations(baseStyles)}${hoverBlock}`;
};
