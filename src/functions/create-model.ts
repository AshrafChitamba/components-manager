import fs from "fs";
import path from "path";
import { errorMsg, successMsg, neutralMsg } from "../chalk-themes";
import { select, confirm, input } from "@inquirer/prompts";
import { interfaceBoilerPlate, typeBoilerPlate } from "../boiler-plates";
import { createFolder } from "./create-folder";
import { capitalizeText, searchFolder } from "../utils";

type Model = "type" | "interface";

export const createModel = async (modelName: string, folderName: string) => {
  try {
    // search for the folder first
    const folderRelativePath = searchFolder(path.resolve(), folderName);
    const finalModelName = capitalizeText(modelName);
    
    // if the folder name exists
    if (folderRelativePath) {
      // Prompt the user to choose the type of model
      const model: Model = await select({
        message: neutralMsg("Select the model type"),
        choices: [
          {
            name: "Type",
            value: "type",
          },
          {
            name: "Interface",
            value: "interface",
          },
        ],
      });

      const modelPath = path.join(folderRelativePath, `${finalModelName}.ts`);

      // model boiler plate
      const boilerPlate =
        model === "type"
          ? typeBoilerPlate(finalModelName)
          : interfaceBoilerPlate(finalModelName);

      // create an [modelName].ts file inside the folderName
      // if the file does not exist
      if (!fs.existsSync(modelPath)) {
        fs.writeFileSync(modelPath, boilerPlate);

        console.log(
          successMsg(
            `+ generated a ${finalModelName} ${model} inside ${folderName}`
          )
        );

        // if there is no index.ts file inside the folder which already exists
        const indexFilePath = path.join(folderRelativePath, `index.ts`);
        if (!fs.existsSync(indexFilePath)) {
          fs.writeFileSync(
            indexFilePath,
            `// This file exports all your modules \nexport * from './${finalModelName}'`
          );
          console.log(
            successMsg(`+ created index.ts file inside ${folderName}`)
          );
        }
        // export the created model inside the index.ts file
        else {
          fs.appendFileSync(
            indexFilePath,
            `\nexport * from './${finalModelName}'`
          );

          console.log(
            successMsg(
              `+ ${finalModelName} ${model} exported inside ${folderName}/index.ts file`
            )
          );
        }
      }
      // otherwise
      else {
        console.log(
          errorMsg(
            `${finalModelName} ${model} already exist inside ${folderName}`
          )
        );
        const overide = await confirm({
          message: neutralMsg("Do you want to overide it?"),
          default: false,
        });
        if (overide) {
          fs.writeFileSync(modelPath, boilerPlate);

          console.log(
            successMsg(
              `+ Overriden ${finalModelName} ${model} inside ${folderName}`
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
        createModel(finalModelName, folderName);
      } else {
        createFolder(folderName);
        createModel(finalModelName, folderName);
      }
    }
  } catch (error) {
    console.log(
      errorMsg(
        `Failed to create ${capitalizeText(
          modelName
        )} model inside ${folderName}`
      )
    );
  }
};
