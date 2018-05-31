$(document).ready(function()
{
	var menu = $('#menu')
	var audio = $('audio')
	var li

	$('#search').click(function(event)
	{
		event.preventDefault()

		$.ajax(
		{
			url: '/streams/search',
			type: 'POST',
			data : { search : $('#name').val() },
			dataType:'json',
			beforeSend : load
		})
			.done(function (values) 
			{
				unload()
				insert(values, 'search')
			})

			.fail(function()
			{
				unload()
				showError('No Results')
			})
	})

	$('#home').click(function(event) 
	{
		event.preventDefault()
		clear()
	})

	$('#name').keyup(function(event)
	{
		if(event.keyCode == 13)
			$('#search').trigger('click')
	})

	audio.on('playing', function()
	{
		unload()
	})

	audio.on('waiting', function()
	{
		load('li')
	})

	audio.on('ended',function() 
	{
		li = li.next()
		if(li)
			li.trigger('click')
	})

	function show(event)
	{
		event.preventDefault()
		$.ajax(
		{
			url: '/streams/show',
			type: 'POST',
			data : { url : $(this).attr('href') },
			beforeSend : load
		})
			.done(function (values) 
			{
				unload()
				insert(values, 'show')
			})

			.fail(function()
			{
				unload()
				showError('No Results')
			})
	}

	function play(event)
	{
		$('.active ').removeClass('active')
		li = $(this)
		li.addClass('active')
		audio[0].pause()
		audio.attr('src', '/streams/stream/' + event.data.id)
		audio[0].play()
	}

	function insert(values, type)
	{
		values.forEach(function(value)
		{
			var a = $('<a class="list-group-item list-group-item-action">')
			a.text(value.name)
			
			if(type === 'search')
			{
				a.attr('href', value.url)
				a.click(show)
			}

			else if(type === 'show')
			{
				a.attr('id', value.id)
				a.click(value, play)
			}
			menu.append(a)
		})
	}

	function clear()
	{
		menu.empty()
	}

	function load(type)
	{
		if(type !== 'li')
			clear()

		var div = $('<div class="spinner">')
		for (var i = 1; i < 6; i++) 
		{
			var rect = $('<div>')
			rect.addClass('rect' + i)
			div.append(rect)
		}

		if(type === 'li')
			li.append(div)

		else
			menu.append(div)
	}

	function unload() 
	{
		$('.spinner').remove()
	}

	function showError(text)
	{
		var div = $('<div class="alert alert-info" role="alert">')
		div.text(text)
		menu.append(div)
	}
});