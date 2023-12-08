import fs from "fs";
import path from "path";
import { errorMsg, successMsg } from "./chalk-themes";

export const generateComponent = (
  componentName: string,
  folderName: string
) => {
  try {
    const folderRelativePath = searchFolder(path.resolve(), folderName);
    const componentBoilerPlate = `import { Component } from "solid-js";
        \nexport const ${componentName}: Component = () => {
        \nreturn <div>${componentName}</div>;
        \n};
    `;

    // if the folder name exists
    if (folderRelativePath) {
      const componentPath = path.join(
        folderRelativePath,
        `${componentName}.tsx`
      );
      console.log(componentPath);
      // create an [componentName].ts file inside the created folder
      // if the file does not exist
      if (!fs.existsSync(componentPath)) {
        fs.writeFileSync(componentPath, componentBoilerPlate);
        console.log(
          successMsg(
            `+ generated a ${componentName} component inside ${folderName}`
          )
        );

        // if there is no index.ts file inside the folder which already exists
        const indexFilePath = path.join(folderRelativePath, `index.ts`);
        if (!fs.existsSync(indexFilePath)) {
          fs.writeFileSync(
            indexFilePath,
            `// This file exports all your modules \nexport * from '${componentName}'`
          );
          console.log(
            successMsg(`+ created index.ts file inside ${folderName}`)
          );
        }
        // export the created component inside the index.ts file
        else {
          fs.appendFileSync(indexFilePath, `\nexport * from '${componentName}'`);

          console.log(
            successMsg(
              `+ ${componentName} exported inside ${folderName}/index.ts file`
            )
          );
        }
      }
      // otherwise
      else {
        console.log(
          errorMsg(
            `${componentName} component already exist inside ${folderName}`
          )
        );
      }
    }
    // otherwise
    else {
      // use inqure now
    }
  } catch (error) {
    console.log(
      errorMsg(
        `Failed to generate ${componentName} component inside ${folderName}`
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
    }
  }
  return null;
};
