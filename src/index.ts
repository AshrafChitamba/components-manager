#! /usr/bin/env node

import { Command } from "commander";
import figlet from "figlet";
import { createFolder } from "./create-folder";
import { generateComponent } from "./generate-component";
import { createModel } from "./create-model";

// logging the CLI name
console.log(figlet.textSync("Components Manager"));

// creating an instance of commander command class
const program = new Command();

// CLI details
program
  .name("CompMan")
  .version("1.0.0")
  .description(
    "A CLI to to reduce the building of modules and exporting them."
  );

// 1. Create a folder
program
  .command("create-folder <folderPath>")
  .description("\nCreates a new directory and an index file inside it")
  .alias("cf")
  .action((folderPath: string) => createFolder(folderPath));

// 2. Create a component either react or solidjs
program
  .command("generate-component <componentName> <folderName>")
  .description(
    "Generates a component module and exports it inside the index file"
  )
  .option(
    "-t, --template [template]",
    "\nTemplate can either be ReactjS(react) or SolisJs(solid)"
  )
  .alias("gc")
  .action((componentName: string, folderName: string) => {
    generateComponent(componentName, folderName);
  });

// 3. Create a model or schema either a type or an interface
program
  .command("create-model <modelName> <folderName>")
  .description(
    "\nCreates a model either a type or an interface and exports it inside the index file"
  )
  .option(
    "-m, --model [model]",
    "Model can either be type or interface"
  )
  .alias("cm")
  .action((componentName: string, folderName: string) => {
    createModel(componentName, folderName);
  });

// parce the process arguments to the commander program
program.parse(process.argv);

// program options
const options = program.opts();
