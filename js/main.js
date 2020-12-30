$(document).ready(function() {
	if(window.location.href.indexOf('index') > -1) {	
		$('.bxslider').bxSlider({
			mode: 'fade',
			captions: true,
			slideWidth: 1200,
			responsive: true
		});
	}	
	//Post
	if(window.location.href.indexOf('index') > -1) {
		var posts = [
		{
			title: 'Prueba de título 1',
			date: moment().format("MMMM do YYYY"),
			content: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum." 
		},
		{
			title: 'Prueba de título 2',
			date: moment().format("MMMM do YYYY"),
			content: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum."
		},
		{
			title: 'Prueba de título 3',
			date: moment().format("MMMM do YYYY"),
			content: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum."
		},
		{
			title: 'Prueba de título 4',
			date: moment().format("MMMM do YYYY"),
			content: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum."
		},];

		posts.forEach((item, index) => {
			var post = `<article class="post">
						<h2>${item.title}</h2>
						<span class="date">${item.date}</span>
						<p>
							${item.content}
						</p>
						<a href="#" class="button-more">Leer más</a>
					</article>`
					//$("#posts").append(post);
		});
	}
	var tema = $("#theme");
	var oscuro = $("#to-dark");
	var claro = $("#to-clear");
	var azul = $("#to-blue");
	oscuro.click(function() {
		tema.attr("href", "css/dark.css");
	});
	claro.click(function() {
		tema.attr("href", "css/clear.css");		
	});
	azul.click(function() {
		tema.attr("href", "css/blue.css");
	});

	$(".subir").click(function(e) {
		e.preventDefault();
		$("html, body").animate({
			scrollTop: 0
		}, 500);
		return false;
	});
	if(window.location.href.indexOf('about') > -1) {
		$("#acordeon").accordion();
	}
});