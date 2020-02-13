export default function getFileName(filename) {
    const reg = /^.+\./g;
    const content = filename.match(reg)[0];
    return content.slice(0, content.length - 1);
}