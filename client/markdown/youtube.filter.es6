function YoutubeFilter() {

    // var _regex = /\((.{11})\)\[(youtube)\]/g;
    var youtube_regexp = /(?:(?:https|http)\:\/\/w{3}\.)(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/ ]{11})/i;

    function replacer(match, p1, offset, string) {

        // if (p2 === 'youtube') {
        // }
        return '<iframe width="560" height="315" src="https://www.youtube.com/embed/' + p1 + '" frameborder="0" allowfullscreen></iframe>';

        // return '<iframe width="560" height="315" src="https://www.youtube.com/embed/' + p1 + '" frameborder="0" allowfullscreen>';

        // var processedContent = string.replace(_regex, matchStr);

        // return processedContent;
    }

    function filter(md) {
        if (!md || md.length < 2) return md;

        md = md.replace(youtube_regexp, replacer);

        return md;
    }

    return function(md) {
        return filter(md);
    }
}

YoutubeFilter.$inject = [];
angular.module('app').filter('youtube', YoutubeFilter);
