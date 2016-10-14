document.addEventListener('deviceready', onDeviceReady, false);

var msg = document.getElementById('msg');

function log(m) {
  msg.innerHTML = msg.innerHTML + '\n' + m;
}

var play = document.getElementById('play');
var stop = document.getElementById('stop');
var playing = false;
var myMedia;

function errorHandler(prefix) {
  return function(err) {
    log(prefix + ':' + err.message);
    console.log(prefix + ':' + err.message);
  }
}


function onDeviceReady() {
  log('working');

  Object.keys(cordova.file).forEach(function (key) {
    if (cordova.file[key]) {
      log('key: ' + key + ': ' + cordova.file[key]);
      window.resolveLocalFileSystemURL(
        cordova.file[key] + 'Music',
        function(dir) {
          var directoryReader = dir.createReader();
          directoryReader.readEntries(
            function(results) {
              results.forEach(entry => log(entry.isDirectory + '  ' + entry.name));
            },
            errorHandler('readentries')
          );
        },
        errorHandler('resolve')
      );
    }
  })

  // window.requestFileSystem(
  //   LocalFileSystem.PERSISTENT,
  //   0,
  //   function onInitFs(fs) {
  //     log('Opened file system: ' + fs.name);
  //     var directoryReader = fs.root.createReader();
  //     directoryReader.readEntries(
  //       function(results) {
  //         results.forEach(entry => log(entry.isDirectory + '  ' + entry.name));
  //       },
  //       errorHandler('readentries')
  //     );
  //     // fs.root.getDirectory(
  //     //   cordova.file.dataDirectory, {
  //     //     create: false,
  //     //     exclusive: false
  //     //   },
  //     //   function getDirSuccess(dirEntry) {
  //     //     var directoryReader = dirEntry.createReader();
  //     //     directoryReader.readEntries(
  //     //       function(results) {
  //     //         results.forEach(entry => log(entry.isDirectory + '  ' + entry.name));
  //     //       },
  //     //       errorHandler('readentries')
  //     //     );
  //     //   },
  //     //   errorHandler('getDirectory')
  //     // );
  //
  //     // myMedia = new Media(
  //     //   fileEntry.toURL(),
  //     //   function mediaSuccess() {
  //     //     log('media success called');
  //     //   },
  //     //   errorHandler('media failure called'),
  //     //   function mediaStatusChange(status) {
  //     //     log('media status change: ' + status);
  //     //   }
  //     // );
  //   },
  //   errorHandler('fs error')
  // );
  play.addEventListener('click', function(ev) {
    if (playing) {
      myMedia.pause();
      play.innerHTML = 'play';
    } else {
      myMedia.play();
      play.innerHTML = 'pause';
    }
    playing = !playing;
  });
  stop.addEventListener('click', function(ev) {
    myMedia.stop();
  });
};
