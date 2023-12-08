import fs from "fs";
import path from "path";
import { errorMsg, successMsg, neutralMsg } from "./chalk-themes";
import { select, confirm } from "@inquirer/prompts";
import { reactBoilerPlate, solidBoilerPlate } from "./boiler-plates";

export const generateComponent = async (
  componentName: string,
  folderName: string
) => {
  try {
    // search for the folder first
    const folderRelativePath = searchFolder(path.resolve(), folderName);

    // if the folder name exists
    if (folderRelativePath) {
      // Prompt the user to choose the type of framework
      const framework: "solid" | "react" = await select({
        message: neutralMsg("Select a component framework"),
        choices: [
          {
            name: "ReactJs",
            value: "react",
          },
          {
            name: "SolidJs",
            value: "solid",
          },
        ],
      });

      const componentPath = path.join(
        folderRelativePath,
        `${componentName}.${framework === "react" ? "jsx" : "tsx"}`
      );
      // component boiler plate
      const boilerPlate =
        framework === "solid"
          ? solidBoilerPlate(componentName)
          : reactBoilerPlate(componentName);

      // create an [componentName].ts file inside the created folder
      // if the file does not exist
      if (!fs.existsSync(componentPath)) {
        fs.writeFileSync(componentPath, boilerPlate);

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
          fs.appendFileSync(
            indexFilePath,
            `\nexport * from '${componentName}'`
          );

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
        const overide = await confirm({
          message: neutralMsg("Do you want to overide it?"),
          default: false,
        });
          
        if (overide) {
          fs.writeFileSync(componentPath, boilerPlate);

          console.log(
            successMsg(`+ Overriden ${componentName} component inside ${folderName}`)
          );
        }
      }
    }
    // otherwise
    else {
      // ask the user to create the folder inside the root directory or specified one
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
