import fs from "fs";
import path from "path";
import { errorMsg, successMsg } from "./chalk-themes";

export const generateComponent = (
  componentName: string,
  folderName: string
) => {
  try {
    const folderRelativePath = searchFolder(path.resolve(), folderName);
    const componentBoilerPlate = `
      import { Component } from "solid-js";

      export const ${componentName}: Component = () => {
      
      return <div>${componentName}</div>;
      };
    `;

    // if the folder name exists
    if (folderRelativePath) {
      // create an [componentName].ts file inside the created folder
      fs.writeFileSync(
        `${folderRelativePath}/${componentName}.tsx`,
        componentBoilerPlate
      );

      console.log(
        successMsg(
          `+ created a component ${componentName} inside ${folderName}`
        )
      );
    }
  } catch (error) {
    console.log(
      errorMsg(
        `Failded to generate ${componentName} component inside ${folderName}`
      )
    );
  }
};

const searchFolder = (
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
    } else return null;
  }
  return null;
};
