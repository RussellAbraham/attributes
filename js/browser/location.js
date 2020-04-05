(function () {
    var protocol = window.location.protocol,
        pathname = window.location.pathname,
        hostname = window.location.hostname,
    
        search   = window.location.search,
        port     = window.location.port,
        href     = window.location.href;
    console.log('Location: ', [  
        protocol,
        pathname,
        hostname,
        search,
        port,
        href
    ]);
    log(protocol);
    log(pathname);
    log(hostname);
    log(search);
})();