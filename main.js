// Importing necessary modules
const electron = require("electron");
const { globalShortcut } = require("electron");
const { app, BrowserWindow, ipcMain } = electron;
const path = require("path");
const fs = require("fs");
const yaml = require("js-yaml");

// Creating the window instance
let win;

// Application function that creates a new browser window with specific properties
function App() {
  win = new BrowserWindow({
    icon: path.join(__dirname, "assets/png/logo_256.ico"), // Application icon
    width: 900, // Initial window width
    height: 700, // Initial window height
    minWidth: 900, // Minimum window width
    minHeight: 700, // Minimum window height
    maxWidth: 900, // Maximum window width
    maxHeight: 700, // Maximum window height
    useContentSize: false,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      enableRemoteModule: true,
      preload: path.join(__dirname, "preload.js"), // Preload script
    },
  });

  // Hide default menu bar
  win.setMenuBarVisibility(false);

  // Load HTML file into the window
  win.loadFile(path.join(__dirname, "index.html"));
}

// When the application is ready, create a new window
app.on("ready", () => {
  App();
});

// Function to log events in renderer console
function logRenderer(args) {
  console.log(args);
  win.webContents.send("fromMainLog", args); 
}

// Registering global shortcuts to disable certain functionality when the window is in focus
app.on("browser-window-focus", function () {
  // List of disabled shortcuts
  const shortcuts = ["CommandOrControl+R", "CommandOrControl+Z", "CommandOrControl+Shift+Z", "CommandOrControl+Shift+R", "F5", "F11", "CommandOrControl+M", "CommandOrControl+Q", "CommandOrControl+W"];
  
  // Disable each shortcut and log the event
  shortcuts.forEach(shortcut => {
    globalShortcut.register(shortcut, () => {
      logRenderer(`${shortcut} is pressed: Shortcut Disabled`);
    });
  });
});

// Unregister the global shortcuts when the window is not in focus
app.on("browser-window-blur", function () {
  globalShortcut.unregisterAll();
});

// Function to log renderer events and send data back to renderer process
function logRenderer(args) {
  console.log(args);
  win.webContents.send("fromMainLog", args);
}

// Listen for "toMain" event from renderer process, log the data received, perform calculations and send back results
ipcMain.on("toMain", async (event, args) => {
  // Log the event and data received
  logRenderer(`toMain event triggered. Received data.`);
  logRenderer(args);

  // Calculate output values based on received data
  const outputValues = calculateOutputValues(args);
  logRenderer(`Sending data to renderer with fromMain.`);
  logRenderer(outputValues);

  // Send calculated data back to renderer process
  win.webContents.send("fromMain", outputValues);
});

/**
 * Function that calculates output values. This is a generic implementation and
 * the specific calculations performed within this function can be adapted
 * according to the specific needs of your application.
 * */
function calculateOutputValues(inputData) {
  logRenderer(`calculateOutputValues function called.`);
  
  // Checking for undefined or NaN input data, if found, log the error and return '-'
  for (const key in inputData) {
    if (inputData.hasOwnProperty(key) && (inputData[key] === undefined || Number.isNaN(inputData[key]))) {
      logRenderer(`Invalid input data: ${key} is ${Number.isNaN(inputData[key]) ? "NaN" : "undefined"}.`);
      const output1String = `$ -`;
      const output2String = `- hrs.`;
      const output3String = `$ -`;
      return { output1String, output2String, output3String };
    }
  }

  // Get configuration data from YAML file
  const configData = getConfigData();

  // Getting external parameters from the configuration
  const external1 = configData["external1"];
  const external2 = configData["external2"];

  // Perform calculations for output3, output2, and output1
  const output3 = calculateOutput3(inputData, external2);
  const output2 = calculateOutput2(inputData, external1);
  const output1 = calculateOutput1(output3, output2);

  // Formatting the results and returning them
  const output1String = `$ ${Math.round(output1)},-`;
  const output2String = `${String(Math.round(output2 * 10) / 10)} hrs.`;
  const output3String = `$ ${Math.round(output3)},-`;

  return { output1String, output2String, output3String };
}

// Function to calculate the output3
function calculateOutput3(inputData, external2) {
  // Calculate the values for different scenarios
  const valueScenario1 = (inputData.baseValue * external2.scenario1 * inputData.percentageOne) / 100;
  const valueScenario2 = (inputData.baseValue * external2.scenario2 * inputData.percentageTwo) / 100;
  const valueScenario3 = (inputData.baseValue * external2.scenario3 * inputData.percentageThree) / 100;

  // Sum the scenario values and return as output3
  var output3 = valueScenario1 + valueScenario2 + valueScenario3;
  return output3;
}

// Function to calculate the output2
function calculateOutput2(inputData, external1) {
  // Get the value corresponding to selected radio option
  const sampleRadioValue = external1[inputData.sampleRadioValues];
  // Get the value from the slider
  const sliderValue = inputData.sliderValue;

  // Sum the above two values and return as output2
  var output2 = sampleRadioValue + sliderValue;
  return output2;
}

// Function to calculate the output1
function calculateOutput1(output3, output2) {
  // Divide output3 by output2 and return as output1
  var output1 = output3 / output2;
  return output1;
}

// Function to load configuration data from a YAML file
function getConfigData() {
  // Path to the configuration file
  const configPath = path.join(__dirname, "config.yml");
  // Read the file content
  const rawData = fs.readFileSync(configPath, "utf8");
  // Parse the YAML data to a JS object
  const config = yaml.load(rawData);
  return config;
}
