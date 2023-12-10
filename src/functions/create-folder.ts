import fs from "fs";
import path from "path";
import { errorMsg, neutralMsg, successMsg } from "../chalk-themes";
import { confirm } from "@inquirer/prompts";

export const createFolder = async (folderPath: string) => {
  const joinedFolderPath = path.join(`/${folderPath}`);
  const folderPathArray = folderPath.split("/");
  const folderName = folderPathArray[folderPathArray.length - 1];
  const folderRelativePath = path.join(path.resolve(), joinedFolderPath);

  try {
    // if the relative folder path does not exist
    const indexFilePath = path.join(folderRelativePath, `index.ts`);

    if (!fs.existsSync(folderRelativePath)) {
      // create the folder
      fs.mkdirSync(folderRelativePath);
      console.log(
        successMsg(
          `+ created folder named ${folderName} path: ${folderRelativePath}`
        )
      );
      // create an index.ts file inside the created folder
      fs.writeFileSync(indexFilePath, "// This file exports all your modules");
      console.log(successMsg(`+ created index.ts file inside ${folderName}`));
    }
    // otherwise
    else {
      // if there is no index.ts file inside the folder which already exists
      console.log(
        errorMsg(
          `${folderName} folder already exists on path: ${folderRelativePath}`
        )
      );
      if (!fs.existsSync(indexFilePath)) {
        const createIndex = await confirm({
          message: neutralMsg(
            "Do you want to create an index.ts file inside it?"
          ),
          default: false,
        });

        if (createIndex) {
          fs.writeFileSync(
            indexFilePath,
            "// This file exports all your modules"
          );
          console.log(
            successMsg(`+ created index.ts file inside ${folderName}`)
          );
        }
      }
    }
  } catch (error) {
    console.log(
      errorMsg(
        `Failed to create folder ${folderName} path: ${folderRelativePath}`
      )
    );
  }
};
