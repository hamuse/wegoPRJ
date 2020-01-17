var write = write||{}
write=(()=>{
	let context, js;
	let writevue,reviewjs;
	let init=()=>{
		context = $.ctx()
		js = $.js()
		writevue=js+'/review/vue/write_vue.js'
		reviewjs = js +'/review/reviewjs/review.js'
	}
	let onCreate=()=>{
		init();
		$.when(
			$.getScript(writevue),
			$.getScript(reviewjs)
		).done(()=>{
			setContentView()
			
		}).fail(()=>{

		})
	}
	let setContentView=()=>{		
		$('#reviewbody').html(write_vue.write())
		write()
	}

	let write=()=>{
		$(window).unbind('scroll');

		var uploadFiles = [];
		
		$("#drop").on('dragenter', function(e) { //드래그 요소가 들어왔을떄
			$(this).addClass('drag-over');
		}).on('dragleave', function(e) { //드래그 요소가 나갔을때
			$(this).removeClass('drag-over');
		}).on('dragover', function(e) {
			e.stopPropagation();
			e.preventDefault();
		}).on('drop', function(e) { //드래그한 항목을 떨어뜨렸을때
			e.preventDefault();
			$(this).removeClass('drag-over');
			var files = e.originalEvent.dataTransfer.files; //드래그&드랍 항목
			for(var i = 0; i < files.length; i++) {
			var file = files[i];
			var size = uploadFiles.push(file); //업로드 목록에 추가
				preview(file, size - 1); //미리보기 만들기
			}

			$('#writebtn').click(e=>{
			e.preventDefault();
			alert('글쓰기')
			let json = {
  				title : $('#form_write input[name="title"]').val(),
				content : $('#form_write textarea[name="content"]').val(),
				boardtype:'review'
			}
			$.ajax({
				url:context+'/review/write',
				type:'POST',
				data:JSON.stringify(json),
				dataType:'json',
				contentType:'application/json',
				success:d=>{
				let formData = new FormData()
				formData.append('uploadFile',file)
				$.ajax({
					url: context+'/review/fileupload',
					data : formData,
					type : 'POST',
					contentType : false,
					processData: false,
					success : d=> {
						alert("완료");
					}
				})
					review.onCreate()
				},
				error:e=>{
					alert(' write ajax실패')
				}
			})
		})

		function preview(file, idx) {
			var reader = new FileReader();
			reader.onload = (function(f, idx) {
			return function(e) {
			var div = `<div class="thumb" style="width:100px; height:80px"> <div class="close" data-idx=${idx}>X</div> 
				<img src=${e.target.result} style="width:50px; height:50px" /> </div>`;
			$(div).appendTo('#thumbnails')
			};
			})(file, idx);
			reader.readAsDataURL(file);
		}
	
	});
		$("#thumbnails").on("click", ".close", function(e) {
		var $target = $(e.target);
		var idx = $target.attr('data-idx');
		uploadFiles[idx].upload = 'disable'; //삭제된 항목은 업로드하지 않기 위해 플래그 생성
		$target.parent().remove(); //프리뷰 삭제
		});



	}

	





	return{onCreate}

})();