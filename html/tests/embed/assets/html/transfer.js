/**/
(function (window, document) {
    var iframe, doc;
    
    window.JSCONSOLE = {
      contentWindow: window,
      contentDocument: document,
      console: iframe
    };
  
    if (iframe = document.getElementById('jsconsole')) {
      iframe.style.display = 'block';
    } else {
      iframe = document.createElement('iframe');
  
      if(document.body) {
          document.body.appendChild(iframe);
      }
      else
      {
          document.appendChild(document.createElement('body'));
          document.body.appendChild(iframe);
      }	
      
  
      iframe.id = 'jsconsole';
      iframe.style.display = 'block';
      iframe.style.background = '#fff';
      iframe.style.zIndex = '9999';
      iframe.style.position = 'absolute';
      iframe.style.top = '0px';
      iframe.style.left = '0px';
      iframe.style.width = '100%';
      iframe.style.height = '100%';
      iframe.style.border = '0';
  
      doc = iframe.contentDocument || iframe.contentWindow.document;
  
      doc.open();
      doc.write('<!DOCTYPE html><html><head><title>jsconsole</title><meta id="meta" name="viewport" content="width=device-width; height=device-height; user-scalable=no; initial-scale=1.0" /><link rel="stylesheet" href="./style.css" type="text/css" /></head><body><script src="./plugin.js"></script><script src="./script.js"></script></body></html>');
      doc.close();
      
      iframe.contentWindow.onload = function () {
        this.document.getElementById('exec').focus();
      };
    }
  })(this, document);