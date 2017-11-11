const electron = require('electron')
const url = require('url')
const path = require('path')

const {app, BrowserWindow, Menu, ipcMain} = electron

let mainwindow
let addwindow

app.on('ready', function () {
  mainwindow = new BrowserWindow({
    title: app.getName()
  })
  mainwindow.loadURL(url.format({
    pathname: path.join(__dirname, 'mainwindow.html'),
    protocol: 'file:',
    slashes: true
  }))
  mainwindow.on('closed', () => {
    app.quit()
  })
  // Build menu from template
  const mainMenu = Menu.buildFromTemplate(mainMenuTemplate)

  // Insert menu
  Menu.setApplicationMenu(mainMenu)
})

const mainMenuTemplate = [
  {
    label: 'File',
    submenu: [
      {
        label: 'Add Item',
        accelerator: process.platform === 'darwin' ? 'Command+N' : 'Ctrl+N',
        click () {
          createAddWindow()
        }
      },
      {
        label: 'Clear Items',
        accelerator: process.platform === 'darwin' ? 'Command+D' : 'Ctrl+D',
        click() {
          mainwindow.webContents.send('item:clear')
        }
      }
      // {
      //   label: 'Quit',
      //   accelerator: process.platform === 'darwin' ? 'Command+Q' : 'Ctrl+Q',
      //   click () {
      //     app.quit()
      //   }
      // }
    ]
  }
]

if (process.platform === 'darwin') {
  mainMenuTemplate.unshift({
    label: app.getName(),
    submenu: [
      {role: 'about'},
      {type: 'separator'},
      {role: 'services', submenu: []},
      {type: 'separator'},
      {role: 'hide'},
      {role: 'hideothers'},
      {role: 'unhide'},
      {type: 'separator'},
      {role: 'quit'}
    ]
  })
}

if (process.env.NODE_ENV !== 'production') {
  mainMenuTemplate.push({
    label: 'Developer Tools',
    submenu: [
      {
        label: 'Toggle Dev Tools',
        accelerator: process.platform === 'darwin' ? 'Command+I' : 'Ctrl+I',
        click (item, focusedwindow) {
          focusedwindow.toggleDevTools()
        }
      },
      {
        role: 'reload'
      }
    ]
  })
}

const createAddWindow = () => {
  addwindow = new BrowserWindow({
    width: 300,
    height: 200,
    title: 'Add Shopping List Item'
  })
  addwindow.loadURL(url.format({
    pathname: path.join(__dirname, 'addwindow.html'),
    protocol: 'file:',
    slashes: true
  }))
  addwindow.on('close', () => {
    addwindow = null
  })
}

ipcMain.on('item:add', function(e, item) {
  mainwindow.webContents.send('item:add', item)
  addwindow.close()
})
