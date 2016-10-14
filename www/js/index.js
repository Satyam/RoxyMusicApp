$(function() {
  var $msg = $('#msg');

  function log(text) {
    $msg.html($msg.html() + text + '\n');
  }

  var $play = $('#play');
  var $stop = $('#stop');
  var playing = false;
  var myMedia;

  function errorHandler(prefix) {
    return function(err) {
      log(prefix + ':' + err.message);
      console.log(prefix + ':' + err.message);
    };
  }
  var entries = [];

  function entryReader(dir, key) {
    var directoryReader = dir.createReader();
    directoryReader.readEntries(
      function(results) {
        results.forEach(function(fileEntry) {
          if (fileEntry.isFile) {
            log(key + ' / ' + fileEntry.fullPath);
            entries.push(fileEntry);
            if (!myMedia) {
              playMusic(fileEntry);
            }
          }
        });
      },
      errorHandler('readentries')
    );
  }

  function playMusic(fileEntry) {
    $play.prop("disabled", false);
    $stop.prop("disabled", false);
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
  }
  $play.click(function() {
    if (playing) {
      myMedia.pause();
      $play.html('play');
    } else {
      myMedia.play();
      $play.html('pause');
    }
    playing = !playing;
  });
  $stop.click(function() {
    myMedia.stop();
  });

  log('about to add event listener');

  document.addEventListener(
    'deviceready',
    function onDeviceReady() {
      log('deviceready');
      if (window.sqlitePlugin) {
        window.sqlitePlugin.echoTest(
          function() {
            log('ECHO test OK');
          },
          function(error) {
            log('Echo test ' + error);
          }
        );
        window.sqlitePlugin.selfTest(
          function() {
            log('SELF test OK');
          },
          function(error) {
            log('Self test ' + error);
          }
        );
      } else log('sqlitePlugin not found');
      Object.keys(cordova.file).forEach(function(key) {
        if (cordova.file[key]) {
          log('key: ' + key + ': ' + cordova.file[key] + 'Music');
          window.resolveLocalFileSystemURL(
            cordova.file[key] + 'Music',
            function(dir) {
              entryReader(dir, key);
            },
            entryReader,
            errorHandler('resolve')
          );
        }
      });

    },
    false
  );
});
