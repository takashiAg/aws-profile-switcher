#!/usr/bin/env node
const fs = require("fs").promises;
const inquirer = require("inquirer");

const homeDir = process.env.HOME;
const configDir = `${homeDir}/.aws-profile-switch/`;

const getProfileNames = (configText) => {
  const regexp = /\[profile ?(.+)?\]/g;
  let match;
  const profileNames = [];
  while ((match = regexp.exec(configText)) !== null) {
    profileNames.push(match[1]);
  }
  return profileNames;
};

const main = async () => {
  console.log("AWS-cli profile switcher");
  const config = await fs.readFile(`${homeDir}/.aws/config`, "utf-8");
  const profileNames = getProfileNames(config);

  const profileChoice = [
    {
      type: "list",
      name: "profile",
      message: "Choose a profile",
      choices: profileNames,
      default: process.env.AWS_PROFILE || "default",
    },
  ];
  const { profile } = await inquirer.prompt(profileChoice);

  if (!fs.lstat(configDir)) fs.mkdir(configDir);

  fs.writeFile(`${configDir}/config.json`, JSON.stringify({ profile }));
};

main();
