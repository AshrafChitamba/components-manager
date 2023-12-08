import fs from "fs";
import path from "path";
import { errorMsg, successMsg, neutralMsg } from "./chalk-themes";
import { select, confirm, input } from "@inquirer/prompts";
import {
  reactBoilerPlate,
  reactNativeBoilerPlate,
  solidBoilerPlate,
} from "./boiler-plates";
import { createFolder } from "./create-folder";
import { capitalizeText, searchFolder } from "./utils";

type Frameworks = "solid" | "react" | "reactnative";

export const createModel = async (
  componentName: string,
  folderName: string
) => {
  try {
    // search for the folder first
    const folderRelativePath = searchFolder(path.resolve(), folderName);
    const finalComponentName = capitalizeText(componentName);

    // if the folder name exists
    if (folderRelativePath) {
      // Prompt the user to choose the type of framework
      const framework: Frameworks = await select({
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
          {
            name: "ReactNative",
            value: "reactnative",
          },
        ],
      });

      const componentPath = path.join(
        folderRelativePath,
        `${finalComponentName}.${framework === "react" ? "jsx" : "tsx"}`
      );

      // component boiler plate
      const boilerPlate =
        framework === "solid"
          ? solidBoilerPlate(finalComponentName)
          : framework === "react"
          ? reactBoilerPlate(finalComponentName)
          : reactNativeBoilerPlate(finalComponentName);

      // create an [componentName].ts file inside the created folder
      // if the file does not exist
      if (!fs.existsSync(componentPath)) {
        fs.writeFileSync(componentPath, boilerPlate);

        console.log(
          successMsg(
            `+ generated a ${finalComponentName} component inside ${folderName}`
          )
        );

        // if there is no index.ts file inside the folder which already exists
        const indexFilePath = path.join(folderRelativePath, `index.ts`);
        if (!fs.existsSync(indexFilePath)) {
          fs.writeFileSync(
            indexFilePath,
            `// This file exports all your modules \nexport * from '${finalComponentName}'`
          );
          console.log(
            successMsg(`+ created index.ts file inside ${folderName}`)
          );
        }
        // export the created component inside the index.ts file
        else {
          fs.appendFileSync(
            indexFilePath,
            `\nexport * from '${finalComponentName}'`
          );

          console.log(
            successMsg(
              `+ ${finalComponentName} component exported inside ${folderName}/index.ts file`
            )
          );
        }
      }
      // otherwise
      else {
        console.log(
          errorMsg(
            `${finalComponentName} component already exist inside ${folderName}`
          )
        );
        const overide = await confirm({
          message: neutralMsg("Do you want to overide it?"),
          default: false,
        });
        if (overide) {
          fs.writeFileSync(componentPath, boilerPlate);

          console.log(
            successMsg(
              `+ Overriden ${finalComponentName} component inside ${folderName}`
            )
          );
        }
      }
    }
    // otherwise
    else {
      // ask the user to create the folder inside the root directory or specified one
      console.log(
        errorMsg(`${folderName} folder doesn't exist in your project`)
      );
      const createInRoot = await confirm({
        message: neutralMsg("Do you want to create it in the root Dir?"),
        default: true,
      });
      if (!createInRoot) {
        const folderPath = await input({
          message: neutralMsg("Provide a path to create the folder: "),
        });
        createFolder(`${folderPath}/${folderName}`);
        createModel(finalComponentName, folderName);
      } else {
        createFolder(folderName);
        createModel(finalComponentName, folderName);
      }
    }
  } catch (error) {
    console.log(
      errorMsg(
        `Failed to generate ${capitalizeText(
          componentName
        )} component inside ${folderName}`
      )
    );
  }
};
