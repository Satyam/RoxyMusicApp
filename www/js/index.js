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


  window.resolveLocalFileSystemURL(
    "file:///android_asset/music.mp3",
    function onResolved(f) {
      log('resolved music', f);
    },
    errorHandler('resolve error')
  );
  window.resolveLocalFileSystemURL(
    "file:///android_asset/config.xml",
    function onResolved(f) {
      log('resolved config', f);
    },
    errorHandler('resolve error')
  );
  window.requestFileSystem(
    LocalFileSystem.PERSISTENT,
    0,
    function onInitFs(fs) {
      log('Opened file system: ' + fs.name);
      var dirReader = fs.root.createReader();
      var entries = [];

      // Call the reader.readEntries() until no more results are returned.
      var readEntries = function() {
        dirReader.readEntries(
          function(results) {
            if (!results.length) {
              log(entries.sort());
            } else {
              results.forEach(entry => log(entry.isDirectory + '  ' + entry.name));
              readEntries();
            }
          },
          errorHandler('readentries')
        );
      };

      readEntries(); // Start reading dirs.
      fs.root.getFile(
        'music.mp3', {
          create: false,
          exclusive: true
        },
        function(fileEntry) {
          log('name: ' + fileEntry.name);
          log('fullPath: ' + fileEntry.fullPath);
          log('url: ' + fileEntry.toURL());
          myMedia = new Media(
            fileEntry.toURL(),
            function mediaSuccess() {
              log('media success called');
            },
            errorHandler('media failure called'),
            function mediaStatusChange(status) {
              log('media status change: ' + status);
            }
          );
        },
        errorHandler('get file error')
      );
    },
    errorHandler('fs error')
  );
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
