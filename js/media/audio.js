console.log('audio loaded');

const sounds = document.querySelectorAll('[data-sound]').forEach(function(sound){
	listen(sound, {
		'click': function(){
			sourceMP3(this);
		}
	})
});

function listen(target, events){
	for(var event in events){
		target.addEventListener(event, events[event])
	}
}


function sourceMP3(node){
    var file = node.getAttribute('data-sound'); console.log(file);
    var url = 'mp3/' + file + '.mp3'; console.log(url);	
}
