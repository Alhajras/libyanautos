var vue_det = new Vue({
	el : '#view-div',
	data : {
		portal : {},
		currentLayout: currentLayout,
		currentViewId: currentViewId,
		fontsOptions: [
		      { text: 'serif', value: 'serif' },
		      { text: 'sans_serif', value: 'sans_serif' },
		      { text: 'monospace', value: 'monospace' },
		      { text: 'fantasy', value: 'fantasy' },
		      { text: 'georgia', value: 'georgia' },
		      { text: 'courier_New', value: 'courier_New' },
		      { text: 'arial', value: 'arial' },     
		      { text: 'tajawal', value: 'tajawal' },
		      { text: 'lateef', value: 'lateef' },
		      { text: 'droid_arabic_kufi', value: 'droid_arabic_kufi'},
		    ],
	},
	mounted() {
		var that = this;
		this.init(); // -> initialising the vue
	  },

	methods : {
		init : function(event) {
			var that = this;
			$('#colorpickerHolderPrimary').ColorPicker({
				color : '#' + that.$data.currentLayout.primaryColor,
				flat : true,
				onChange : function(hsb, hex, rgb) {
					$('#colorDropPrimary').css('backgroundColor', '#' + hex);
					that.$data.currentLayout.primaryColor = hex; 
				}
			});
			$('#colorpickerHolderBackgroundColor').ColorPicker({
				color : '#' + that.$data.currentLayout.footerBackgroundColor,
				flat : true,
				onChange : function(hsb, hex, rgb) {
					$('#colorDropBackgroundColor').css('backgroundColor', '#' + hex);
					that.$data.currentLayout.footerBackgroundColor = hex; 
				}
			});
			$('#colorpickerHolderFontColor').ColorPicker({
				color : '#' + that.$data.currentLayout.fontColor,
				flat : true,
				onChange : function(hsb, hex, rgb) {
					$('#fontColor').css('backgroundColor', '#' + hex);
					that.$data.currentLayout.fontColor = hex; 
				}
			});
			$('#colorDropPrimary').css('backgroundColor', '#' + that.$data.currentLayout.primaryColor);
			$('#colorDropBackgroundColor').css('backgroundColor', '#' + that.$data.currentLayout.footerBackgroundColor);
			$('#fontColor').css('backgroundColor', '#' + that.$data.currentLayout.fontColor);
			
// var that = this;
// $.ajax({
// type : "GET",
// url : "/user",
// contentType : "application/json",
// success : function(e) {
// that.$data.user = e;
// that.$data.copyUser = Object.assign({}, e);
// },
// error : function() {
// }
// });
		},
		updateFont : function(font) {
			var that = this;
			that.$data.currentLayout.font.$name = font;
		},
		
		updateSlider : function() {
			var that = this;
			that.$data.currentLayout.fontScale = document.getElementById("myfontSizeRange").value; 
		},
		
		saveChanges : function() {
			var self = this;
			var fontOb = self.$data.currentLayout.font;
			var font = self.$data.currentLayout.font.$name;
			self.$data.currentLayout.font = font;
			$.ajax({
				type : "POST",
				url : "/view/updateLayout/" + currentViewId,
				data: JSON.stringify(self.$data.currentLayout),
				contentType : "application/json",
				success : function(e) {
					self.$data.currentLayout.font = fontOb;
					$.notify('Changes have been saved!', {
						position: 'top center',
						className: 'success'
					});
				
				},
				error : function() {
					$.notify("Changes can not be saved!", "error");
				}
			});
		},
		
		uploadImage : function(index,id) {
			var self = this;
			var file = document.getElementById(id).files[0];
		    
		    var reader = new FileReader();
		    reader.readAsDataURL(file);
		   
		    reader.onload = function () {
				$.ajax({
					type : "POST",
					url : "/view/uploadImage/" + index + "/" + self.$data.currentViewId,
					data: JSON.stringify(reader.result),
					contentType : "application/json",
					success : function(e) {
						$.notify('File is uploaded!', {
							position: 'top center',
							  className: 'success'
							});
// self.$data.defaultImage = reader.result;
						console.log(e);
						if(index == 1)
							self.$data.currentLayout.mainBackGroundImage = e.id;
						else if (index == 2) {
							self.$data.currentLayout.ourStoryImage = e.id;
						}
						else if (index == 3) {
							self.$data.currentLayout.ourMissionImage = e.id;
						}
						else if (index == 4) {
							self.$data.currentLayout.contactImage = e.id;
						}
						else if (index == 5) {
							self.$data.currentLayout.contactMap = e.id;
						}
						else if(index == 6)
							self.$data.currentLayout.slider1Image = e.id;
						else if (index == 7) {
							self.$data.currentLayout.slider2Image = e.id;
						}
						else if (index == 8) {
							self.$data.currentLayout.slider3Image = e.id;
						}
						else if (index == 9) {
							self.$data.currentLayout.logo = e.id;
						}
					},
					error : function() {
						$.notify('Error in uploading!', {
							position: 'top center',
							  className: 'error'
							});
					}
				});
		      };
		      reader.onerror = function (error) {
		        console.log('Error: ', error);
		      };
	
		},
		
	}
})

