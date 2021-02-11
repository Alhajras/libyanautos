var vue_det = new Vue({
	el : '#portal-div',
	data : {
		portal : {},
		copyPortal: {},
		viewToBeEdited: {},
		viewOriginal: {},
		newView: {name: ''},
	},
	mounted() {
		this.init(); // -> initialising the vue
	  },

	methods : {
		init : function(event) {
			var that = this;
			$.ajax({
				type : "GET",
				url : "/portal",
				contentType : "application/json",
				success : function(e) {
					that.$data.portal = e;
					that.$data.copyPortal = Object.assign({}, e);
				},
				error : function() {
				}
			});
		},
		
			  reset: function() {
				  var that = this;
				  that.$data.portal =  Object.assign({}, that.$data.copyPortal);
			  },
		saveChanges : function() {
			var self = this;
			if(!this.containsSpecialCharachter(self.$data.portal.name))
			$.ajax({
				type : "POST",
				url : "/portal/update",
				data: JSON.stringify(self.$data.portal),
				contentType : "application/json",
				success : function(e) {
					console.log(self.$data.portal);
					$.notify('Changes have been saved!', {
						position: 'top center',
						  className: 'success'
						});
				
				},
				error : function() {
					$.notify('Changes have not been saved!', {
						position: 'top center',
						  className: 'error'
						});
				}
			});
			else{
				$.notify('Portal name can not have special charachters!', {
					position: 'top center',
					  className: 'error'
					});
				
			}

		},
		
		containsSpecialCharachter : function(string){
			if(string == '')
				return true;
			var format = /[!@# $%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/;
			if(format.test(string)){
			  return true;
			} else {
				return false;
			}
		},
		
		assignViewToBeEdited : function(view) {
			var self = this;
			self.$data.viewOriginal = JSON.parse(JSON.stringify(view));
			self.$data.viewToBeEdited = view;
		},
		
		resetViewToBeEdited : function(view) {
			var self = this;
			self.$data.viewOriginal = JSON.parse(JSON.stringify(view));
			self.$data.viewToBeEdited = view;
		},
		
		saveNewView : function() {
			var self = this;
			if(self.$data.newView.name != '' && !this.containsSpecialCharachter(self.$data.newView.name))
			$.ajax({
				type : "POST",
				url : "/view/new",
				data: JSON.stringify(self.$data.newView),
				contentType : "application/json",
				success : function(e) {
					self.$data.portal.views.push(e);
					$.notify('Changes have been saved!', {
						position: 'top center',
						  className: 'success'
						});
				
				},
				error : function() {
					$.notify('Changes can not be saved!', {
						position: 'top center',
						  className: 'error'
						});
				}
			});
			else {
				$.notify('View\'s name is empty or has special charachter!', {
					position: 'top center',
					  className: 'error'
					});
			}
			self.$data.newView.name = '';
		},
		
		
		
		saveEditedView : function() {
			var self = this;
			$.ajax({
				type : "POST",
				url : "/view/update",
				data: JSON.stringify(self.$data.viewToBeEdited),
				contentType : "application/json",
				success : function(e) {
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

		deleteView : function() {
			var self = this;
			self.$data.viewToBeEdited.deleted = true;
			$.ajax({
				type : "DELETE",
				url : "/view",
				data: JSON.stringify(self.$data.viewToBeEdited),
				contentType : "application/json",
				success : function(e) {
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

	}
})

// triggered when modal is about to be shown
// $('#myDeleteModal').on('show.bs.modal', function(e) {
// console.log('ssdf');
// //get data-id attribute of the clicked element
// var bookId = $(e.relatedTarget).data('book-id');
// console.log(bookId);
// //populate the textbox
// $(e.currentTarget).find('input[name="bookId"]').val(bookId);
// });

