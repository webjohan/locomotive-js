function checkAjax() {
	$.get('/upload', function(data){
		$('#fillmeh').text(data.name+ " "+data.age);
	});
}