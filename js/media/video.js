console.log('video loaded');

const videos = document.querySelectorAll('[data-video]').forEach(function(video){
	listen(video, {
		'click': function(){
			sourceMP4(this);
		}
	})
});

function listen(target, events){
	for(var event in events){
		target.addEventListener(event, events[event])
	}
}

function sourceMP4(node){
    var file = node.getAttribute('data-sound'); console.log(file);
    var url = 'mp4/' + file + '.mp4'; console.log(url);	
}


  