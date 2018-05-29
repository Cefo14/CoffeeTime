$(document).ready(function()
{
	var menu = $('#menu')
	var audio = $('audio');

	$('#search').click(function(){
		$.ajax(
		{
			url: '/streams/search',
			type: 'POST',
			data : { search : $('#name').val() }
		})
			.done(function (values) 
			{
				menu.empty()

				values.forEach(function(value)
				{
					var a = $('<a class="list-group-item list-group-item-action"></a>')
					a.text(value.name)
					a.attr('href', value.url)
					a.click(show)
					menu.append(a)
				})

			})

			.fail(function(){
				throw "Error";
			})
	})

	$('#home').click(function (e) 
	{
		menu.empty()
    })

	function show(event)
	{
		event.preventDefault()
		menu.empty()

		$.ajax(
		{
			url: '/streams/show',
			type: 'POST',
			data : { url : $(this).attr('href') }
		})
			.done(function (values) 
			{
				menu.empty()

				values.forEach(function(value)
				{
					var a = $('<a class="list-group-item list-group-item-action"></a>')
					a.text(value.name)
					a.attr('id', value.id)
					a.click(value, play)
					menu.append(a)
				})

			})

			.fail(function(){
				throw "Error";
			})
	}

	function play(event)
	{
		$('.active ').removeClass('active')
		
		this.className += ' active'
		audio[0].pause();
		audio.attr('src', '/streams/stream/' + event.data.id);
		audio[0].play();
	}

	audio.on('ended',function() {
		var src = audio.attr('src');
		var id = parseInt(src.split('/')[3]);
		audio.attr('src', '/streams/stream/' + (++id));
		audio[0].play();
	});
});