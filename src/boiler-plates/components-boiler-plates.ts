// SolidJs boiler-plate
export const solidBoilerPlate = (componentName: string) => {
  return `import { Component } from "solid-js";
        \nexport const ${componentName}: Component = () => {\n\treturn (\n\t\t<div>${componentName}</div>\n\t);\n};
    `;
};

// ReactJs boiler-plate
export const reactBoilerPlate = (componentName: string) => {
  return `import { FC } from 'react';
       \nexport const ${componentName}: FC = () => {\n\treturn (\n\t\t<div>${componentName}</div>\n\t);\n};
    `;
};

// ReactJs boiler-plate
export const reactNativeBoilerPlate = (componentName: string) => {
  return `import { View, Text } from 'react-native';
        \nexport const ${componentName} = () => {\n\treturn (\n\t\t<View>\n\t\t\t<Text>${componentName}</Text>\n\t\t</View>\n\t);\n};
    `;
};
