function checkAjax() {
	$.get('/ajax', function(data){
		$('#fillmeh').text(data.name+ " "+data.age);
	});
}