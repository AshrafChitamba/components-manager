export const extractFolderName = (folderPath: string) => {
  const folderPathArray = folderPath.split("/");
  const folderName = folderPathArray[folderPathArray.length - 1];

  return folderName;
};
