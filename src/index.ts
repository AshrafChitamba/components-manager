#! /usr/bin/env node

import { Command } from "commander";
import figlet from "figlet";
import { createFolder } from "./create-folder";

// logging the CLI name
console.log(figlet.textSync("Module Manager"));

// creating an instance of commander command class
const program = new Command();

// CLI details
program
  .name("ModMan")
  .version("1.0.0")
  .description(
    "A CLI to to reduce the building of modules and exporting them."
  );

// 1. Create a folder 
program
  .command("create-folder <folderPath>")
  .description("Creates a new directory and an index file inside it")
  .alias("cf")
  .action((folderPath: string) => createFolder(folderPath));

program.parse(process.argv);
// program options
const options = program.opts();
