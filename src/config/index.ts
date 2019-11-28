// Use this on production
// import configFileProduction from '../config/files/config.json';

// import configFileProduction from '../config/files/config2.json';
// Using this due to CI error
import configFileProduction from '../config/config.json';
import configFileIEOProduction from './config-ieo.json';
import configTemplateFile from './config-template.json';
import configFileTest from './config-test.json';
// import configFileIEOProduction from './files/config-ieo.json';
// import configFileProduction from './config.json';

let configFile: any;
let configFileIEO: any;

if (process.env.NODE_ENV === 'test') {
    configFile = configFileTest;
}
if (process.env.NODE_ENV === 'production') {
    configFile = configFileProduction;
}
if (process.env.NODE_ENV === 'development') {
    configFile = configFileProduction;
}

configFileIEO = configFileIEOProduction;

export { configFile, configFileIEO, configTemplateFile };
