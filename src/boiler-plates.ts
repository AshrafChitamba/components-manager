// SolidJs boiler-plate
export const solidBoilerPlate = (componentName: string) => {
    return `import { Component } from "solid-js";
        \nexport const ${componentName}: Component = () => {
        \nreturn <div>${componentName}</div>;
        \n};
    `;
};

// ReactJs boiler-plate
export const reactBoilerPlate = (componentName: string) => {
    return `import { FC } from 'react';
        \nexport const ${componentName}: FC = () => {
        \nreturn <div>${componentName}</div>;
        \n};
    `;
};
