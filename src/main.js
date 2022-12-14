// Electron側の初期設定
const electron = require('electron');
const app = electron.app;
const BrowserWindow = electron.BrowserWindow;
let mainWindow;

// アプリを閉じた時にquit
app.on('window-all-closed', function() {
  app.quit();
});

// アプリ起動後の処理
app.on('ready', function() {
  var subpy = require('child_process').spawn('python',['./server.py']);
  var rq = require('request-promise');
  var mainAddr = 'http://127.0.0.1:8080/player.html?mode=live';

  var openWindow = function() {
    mainWindow = new BrowserWindow({
    width: 1600, 
    height: 900,
    webPreferences: { webSecurity: false },
    autoHideMenuBar: true
     });
    mainWindow.setSimpleFullScreen(true)
    mainWindow.loadURL(mainAddr);

    // 終了処理
    mainWindow.on('closed', function() {
      mainWindow = null;
      subpy.kill('SIGINT');
    });
  };

  var startUp = function() {
    rq(mainAddr)
      .then(function(htmlString) {
        console.log('server started');
        openWindow();
      })
      .catch(function(err) {
        startUp();
      });
  };

  startUp();
});

