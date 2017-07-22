$(document).ready(function()
{
	var audio = $('audio');
	var selected;

	$('#load').click(function(){
		$.ajax(
		{
			url: '/streams/show',
			type: 'POST',
			data : { magnament : $('#magnament').val() }
		})
			.done(function (canciones) 
			{
				let ul = $('.lista-canciones');
				ul.empty();
				canciones.forEach((cancion) => {
				let li = $(`<li class="cancion" id="${cancion.id}">${cancion.name}</li>`);
				
				li
					.on('click', cancion, play)
					.appendTo(ul);
				});
			})

			.fail(() => alert("Error al cargar"));
	});

	function play(event)
	{
		if(selected) selected.className = 'cancion';

		this.className = 'cancion selected';
		selected = this;

		audio[0].pause();
		audio.attr('src', '/streams/stream/' + event.data.id);
		audio[0].play();
	}
});

/*
$(() => {
	
	var audio = $('audio');
	var selected;

	function cargarCanciones()
	{
		$.ajax(
		{
			url: '/canciones',
		}).done((canciones) => {
			let ul = $('.lista-canciones');
			ul.empty();
			canciones.forEach((cancion) => {
				let li = $('<li class="cancion">'+ cancion.nombre +'</li>');
				
				li
					.on('click', cancion, play)
					.appendTo(ul);
			});
		}).fail(() => alert("Error al cargar"));
	}

	function play(evento)
	{
		if(selected) selected.className = 'cancion';

		this.className = 'cancion selected';
		selected = this;

		audio[0].pause();
		audio.attr('src', '/canciones/' + evento.data.nombre);
		audio[0].play();
	}

	cargarCanciones();
});
*/