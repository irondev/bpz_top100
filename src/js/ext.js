(function(d, s, id) {
    var js, fjs = d.getElementsByTagName(s)[0];
    if (d.getElementById(id)) {return;}
    js = d.createElement(s);
    js.id = id;
    js.src = "//connect.facebook.net/fr_FR/all.js#xfbml=1";
    fjs.parentNode.insertBefore(js, fjs);
}(document, 'script', 'facebook-jssdk'));
window.twttr = (function(d, s, id) {
    var js, fjs = d.getElementsByTagName(s)[0],
        t = window.twttr || {};
    if (d.getElementById(id)) {return t;}
    js = d.createElement(s);
    js.id = id;
    js.src = "https://platform.twitter.com/widgets.js";
    fjs.parentNode.insertBefore(js, fjs);
    t._e = [];
    t.ready = function(f) {
        t._e.push(f);
    };
    return t;
}(document, "script", "twitter-wjs"));
(function() {
    var po = document.createElement('script');
    po.type = 'text/javascript';
    po.async = true;
    po.src = 'https://apis.google.com/js/plusone.js';
    var s = document.getElementsByTagName('script')[0];
    s.parentNode.insertBefore(po, s);
})();
(function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
    (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();
    a=s.createElement(o),
    m=s.getElementsByTagName(o)[0];
    a.async=1;
    a.src=g;
    m.parentNode.insertBefore(a,m);
})(window,document,'script','//www.google-analytics.com/analytics.js','ga');
ga('create', 'UA-47284909-1', 'thebackpackerz.com');
ga('send', 'pageview');
(function() {

  var _fbq = window._fbq || (window._fbq = []);

  if (!_fbq.loaded) {

    var fbds = document.createElement('script');

    fbds.async = true;

    fbds.src = '//connect.facebook.net/en_US/fbds.js';

    var s = document.getElementsByTagName('script')[0];

    s.parentNode.insertBefore(fbds, s);

    _fbq.loaded = true;

  }

})();

window._fbq = window._fbq || [];

window._fbq.push(['track', '6030419604741', {'value':'0.00','currency':'EUR'}]);
