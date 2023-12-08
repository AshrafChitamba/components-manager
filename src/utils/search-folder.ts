import path from "path";
import fs from "fs";

// recursively search for the folder name
export const searchFolder = (
  startPath: string,
  targetFolder: string
): string | null => {
  const files = fs.readdirSync(startPath);

  for (const file of files) {
    const filePath = path.join(startPath, file);
    const isDirectory = fs.statSync(filePath).isDirectory();

    if (isDirectory) {
      if (file === targetFolder) {
        return filePath;
      } else {
        const result = searchFolder(filePath, targetFolder);
        if (result) {
          return result;
        }
      }
    }
  }
  return null;
};
