import fs from "fs";
import path from "path";
import { errorMsg, successMsg } from "./chalk-themes";

export const createFolder = (folderPath: string) => {
  const pathArray = folderPath.split("/");
  const folderName = pathArray[pathArray.length - 1];
  const folderRelativePath = path.resolve() + path.join(folderPath);

  try {
    // if the relative folder path does not exist
    const indexFilePath = path.join(folderRelativePath, `index.ts`);

    if (!fs.existsSync(folderRelativePath)) {
      // create the folder
      fs.mkdirSync(folderRelativePath);

      // create an index.ts file inside the created folder
      fs.writeFileSync(
        indexFilePath,
        "// This file exports all your modules"
      );

      console.log(successMsg(`+ created folder named ${folderName}`));
      console.log(successMsg(`+ created index.ts file inside ${folderName}`));
    }
    // otherwise
    else {
      // if there is no index.ts file inside the folder which already exists
      if (!fs.existsSync(indexFilePath)) {
        fs.writeFileSync(
          indexFilePath,
          "// This file exports all your modules"
        );
        console.log(successMsg(`+ created index.ts file inside ${folderName}`));
      }

      console.log(
        errorMsg(
          `${folderName} folder already exists on path ${folderPath}`
        )
      );
    }
  } catch (error) {
    console.log(
      errorMsg(`Failed to create folder ${folderName} path ${folderPath}`)
    );
  }
};
