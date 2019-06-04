const electron = require('electron');
const path = require('path');
const url = require('url');
const { app, BrowserWindow, Menu, ipcMain } = electron;

// Set environment
process.env.NODE_ENV = 'production';

let mainWindow;
let addWindow;

// Listen for the app to be ready
app.on('ready', function() {
  // Craete new window
  mainWindow = new BrowserWindow({
    webPreferences: { nodeIntegration: true }
  });
  // Load the html file into window
  mainWindow.loadURL(
    url.format({
      pathname: path.join(__dirname, 'mainWindow.html'),
      protocol: 'file:',
      slashes: true
    })
  );

  // Quit app when closed
  mainWindow.on('closed', function() {
    app.quit();
  });

  // Build the menu from template
  const mainMenu = Menu.buildFromTemplate(mainMenuTemplate);

  // Insert menu
  Menu.setApplicationMenu(mainMenu);
});

// Handle Create Item Window
function createAddWindow() {
  // Craete new window
  addWindow = new BrowserWindow({
    width: 300,
    height: 200,
    title: 'Add Shopping Lisst Item',
    webPreferences: { nodeIntegration: true }
  });
  // Load the html file into window
  addWindow.loadURL(
    url.format({
      pathname: path.join(__dirname, 'addWindow.html'),
      protocol: 'file:',
      slashes: true
    })
  );

  addWindow.on('close', function() {
    addWindow = null;
  });
  // Build the menu from template
  const mainMenu = Menu.buildFromTemplate(mainMenuTemplate);

  // Insert menu
  Menu.setApplicationMenu(mainMenu);
}

// Catch item:add
ipcMain.on('item:add', function(e, item) {
  mainWindow.webContents.send('item:add', item);
  addWindow.close();
});

// Craete Menu template
const mainMenuTemplate = [
  {
    label: 'File',
    submenu: [
      {
        label: 'Add Item',
        click() {
          createAddWindow();
        }
      },
      {
        label: 'Clear Items',
        click() {
          mainWindow.webContents.send('item:clear');
        }
      },
      {
        label: 'Quit',
        accelerator: process.platform == 'darwin' ? 'Cmd+Q' : 'Ctrl+Q',
        click() {
          app.quit();
        }
      }
    ]
  }
];

// If MAC add empty object to menu
if (process.platform === 'darwin') {
  mainMenuTemplate.unshift({});
}

// Add developer tools items if not in production
if (process.env.NODE_ENV !== 'production') {
  mainMenuTemplate.push({
    label: 'Developer Tools',
    submenu: [
      {
        label: 'Toggle DevTools',
        accelerator: process.platform == 'darwin' ? 'Cmd+I' : 'Ctrl+I',
        click(item, focusedWindow) {
          focusedWindow.toggleDevTools();
        }
      },
      {
        role: 'reload'
      }
    ]
  });
}
