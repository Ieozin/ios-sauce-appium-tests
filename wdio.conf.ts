export const config: WebdriverIO.Config = {
    // Runner Configuration
    runner: 'local',
    tsConfigPath: './tsconfig.json',
    
    // Service Providers (ex: Sauce Labs)
    user: process.env.SAUCE_USERNAME,
    key: process.env.SAUCE_ACCESS_KEY,
    region: 'us',
    
    // Specify Test Files
    specs: [
        './test/specs/**/*.ts'
    ],
    exclude: [],
    
    // Capabilities
    maxInstances: 10,
    capabilities: [{
         "platformName": "iOS",
         "appium:deviceName": "iPhone Simulator",
         "appium:platformVersion": "17.0",
         "appium:automationName": "XCUITest",
         "appium:app": `${process.cwd()}/app/LojaEBAC-sim.app`,
         "sauce:options": {}
    }],
    
    // Test Configurations
    logLevel: 'info',
    bail: 0,
    waitforTimeout: 10000,
    connectionRetryTimeout: 120000,
    connectionRetryCount: 3,
    
    framework: 'mocha',
    reporters: ['spec'],

    mochaOpts: {
        ui: 'bdd',
        timeout: 60000
    }
};
