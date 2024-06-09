export const bannedMimeTypes = [
  "application/x-msdownload", // for .exe
  "application/x-msdownload", // for .dll
  "application/x-msdos-program", // for .bat
  "application/cmd", // for .cmd
  "application/x-sh", // for .sh
  "application/x-httpd-cgi", // for .cgi
  "application/java-archive", // for .jar
  "application/x-ms-application", // for .app
];

/**
 * Checks if the provided file's MIME type is allowed based on a list of banned MIME types.
 *
 * @param {string} fileType - The file to check.
 * @param {string[]} bannedMimeTypes - List of MIME types that are not allowed.
 * @returns {boolean} - Returns true if the file's MIME type is allowed, false otherwise.
 */
export function isFileAllowed(
  fileType: string,
  bannedMimeTypes: string[]
): boolean {
  return !bannedMimeTypes.includes(fileType);
}

/**
 * Checks if the provided file size is within the allowed limit of 1GB.
 *
 * @param {number} fileSize - The size of the file in bytes.
 * @returns {boolean} - Returns true if the file size is within 1GB, false otherwise.
 */
export function isFileSizeAllowed(fileSize: number): boolean {
  const oneGigabyteInBytes = 1024 * 1024 * 1024; // 1GB in bytes
  return fileSize <= oneGigabyteInBytes;
}
