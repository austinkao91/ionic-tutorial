angular.module('songhop.services', [])
.factory('User', function() {

  var o = {
    favorites: [],
    newFavorites: 0
  };
  o.addSongToFavorites = function(song) {
    if (!song) return false;
    o.favorites.unshift(song);
    o.newFavorites += 1;
  };
  o.removeSongFromFavorites = function(song, index) {
    if (!song) return false;
    o.favorites.splice(index,1);
  };
  o.favoriteCount = function() {
    return o.newFavorites;
  };
  return o;
})
.factory('Recommendations', function($http, $q, SERVER){
  var media;
  var o = {
    queue: []
  };
  o.playCurrentSong = function() {
    var defer = $q.defer();

    media = new Audio(o.queue[0].preview_url);
    media.addEventListener("loadeddata", function() {
      defer.resolve();
    });

    media.play();
    return defer.promise;
  };

  o.haltAudio = function() {
    if(media) media.pause();
  };

  o.getNextSongs = function() {
    return $http({
      method: 'GET',
      url: SERVER.url + '/recommendations'
    }).success(function(data) {
      o.queue = o.queue.concat(data);
    });
  };
  o.nextSong = function() {
    o.queue.shift();

    o.haltAudio();

    if(o.queue.length <= 3) {
      o.getNextSongs();
    }
  };

  o.init = function() {
    if (o.queue.length === 0) {
      return o.getNextSongs();
    } else {
      return o.playCurrentSong();
    }
  };

  return o;
});
