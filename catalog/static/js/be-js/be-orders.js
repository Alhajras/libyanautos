var vue_det = new Vue({
	el : '#order-div',
	data : {
		portal : {},
		copyPortal: {},
		orderTypeToBeEdited: {},
		orderTypeOriginal: {},
		newOrderType: {name: '', description:''},
		orders: [],
		orderPageIndex:0,
		orderTypeMode: true,
		// Order part
		ordersList: [],
		orderToBeEdited: {},
		orderToBeEditedProperties: {},
		orderOriginal: {},
		propertiesAvailable: {},
		newOrder: {name: '', description:'', type: '',price: 0, likes: 0, orderAvailability : 1},
		defaultImage:'',
		magnifiedImage:'',
		magnifierIsLoaded: false,
		newOrderImages : [],
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
					that.getAllOrders();
					that.checkingNewOrders();
				},
				error : function() {
				}
			});
		},
		getDateFormat (dateInMilli){
			return  new Date(dateInMilli).toLocaleString(); 
		},
		
		updateAvailability : function(value) {
			var that = this;
			that.$data.orderToBeEdited.orderAvailability = value;
		},
		
		checkingNewOrders : function(){
			var that = this;
			  $.ajax({
					type : "GET",
					url : "/order/"+ that.$data.portal.views[0].id + '?pageIndex=' + that.$data.orderPageIndex,
					contentType : "application/json",
					success : function(e) {
						 that.$data.ordersList = e;
						  $("body").css("filter", "blur(0px)");
						  $("#searchOrder").focus();
					},
					error : function() {
					},
					complete: function() {
						setTimeout(that.checkingNewOrders, 30000);
					}
				});
		},
		
		getAllOrders: function() {
			 $("body").css("filter", "blur(4px)");
				var that = this;				
			  that.$data.orderPageIndex = 0;

			  $.ajax({
					type : "GET",
					url : "/order/"+ that.$data.portal.views[0].id + '?pageIndex=' + that.$data.orderPageIndex,
					contentType : "application/json",
					success : function(e) {
						 that.$data.ordersList = e;
						  $("body").css("filter", "blur(0px)");
						  $("#searchOrder").focus();
					},
					error : function() {
					}
				});
		  },
		  
		  deleteOrderImage: function(imageId) {
			  var that = this;
			  var images = that.$data.orderToBeEdited.images;
			  for(var i = images.length - 1; i >= 0; i--) {

				    if(images[i].id == imageId) {
				    	that.$data.orderToBeEdited.images.splice(i, 1);
						$.ajax({
							type : "DELETE",
							url : "/order/deleteImage/" + imageId,
							contentType : "application/json",
							success : function(e) {
								$.notify('Image is deleted!', {
									position: 'top center',
									  className: 'success'
									});
							
							},
							error : function() {
								$.notify('Error!!', {
									position: 'top center',
									  className: 'error'
									});
							}
						});	
				    }
				}
			  },
			  
		  loadMoreOrders: function() {
			  var that = this;
			  that.$data.orderPageIndex++;
			  $.ajax({
					type : "GET",
					url : "/order/"+ that.$data.orderTypeToBeEdited.id + '?pageIndex=' + that.$data.orderPageIndex,
					contentType : "application/json",
					success : function(e) {
						var i;
						for (i = 0; i < e.length; i++) { 
							that.$data.ordersList.push(e[i]);
						}
						
					},
					error : function() {
					}
				});
				
			  },
				  
		backToOrderType: function() {
				  var that = this;
				  that.$data.orderTypeMode = !that.$data.orderTypeMode;
			  },
			  
		editOrderType: function() {
			  var that = this;
			  document.getElementById(that.$data.orderTypeToBeEdited.id).disabled = false;
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
			var format = /[!@# $%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/;
			if(format.test(string)){
			  return true;
			} else {
				return false;
			}
		},
			
		assignOrderToBeEdited : function(order) {
			var self = this;	
			window.scrollTo(0, 0);
			self.$data.orderOriginal = JSON.parse(JSON.stringify(order));
			self.$data.orderToBeEdited = order;
			self.$data.magnifierIsLoaded = true;
			$.ajax({
					type : "GET",
					url : "/order/fetchProducts/" + order.id,
					contentType : "application/json",
					success : function(e) {
						self.$data.newOrderImages = e;
					},
					error : function() {

					}
				});
					},
		
		getAmount  : function(productId) {
			var self = this;	
			for (var i = 0; i < self.$data.orderToBeEdited.productInfos.length; i++) {
				if(self.$data.orderToBeEdited.productInfos[i].productId == productId){
					return self.$data.orderToBeEdited.productInfos[i].amount;
				}
			}
			
		},
		
		resetViewToBeEdited : function(view) {
			var self = this;
			self.$data.viewOriginal = JSON.parse(JSON.stringify(view));
			self.$data.viewToBeEdited = view;
		},
		
		searchForOrder : function() {
			var self = this;
			
			var text = $('#searchOrder').val();
			if (text.length)
				{$("body").css("filter", "blur(4px)");
			  $.ajax({
					type : "GET",
					url : "/order/search/"+ self.$data.portal.views[0].id +"/"+ text,
					contentType : "application/json",
					success : function(e) {
						var i;
						self.$data.ordersList= [];
						for (i = 0; i < e.length; i++) { 
							self.$data.ordersList.push(e[i]);
						}
						$("body").css("filter", "blur(0px)");
					},
					error : function() {
						$("body").css("filter", "blur(0px)");
					}
				});}
		},
		
		uploadImage : function() {
			var self = this;
			var file = document.getElementById('imageInput').files[0];
		    
		    var reader = new FileReader();
		    reader.readAsDataURL(file);
		   
		    reader.onload = function () {
				$.ajax({
					type : "POST",
					url : "/order/uploadImage/" + self.$data.orderToBeEdited.id,
					data: JSON.stringify(reader.result),
					contentType : "application/json",
					success : function(e) {
						$.notify('File is uploaded!', {
							position: 'top center',
							  className: 'success'
							});
						self.$data.defaultImage = reader.result;
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
				
		saveNewOrderType : function() {
			var self = this;
			if(self.$data.newOrderType.name != '' && !this.containsSpecialCharachter(self.$data.newOrderType.name))
			$.ajax({
				type : "POST",
				url : "/order-type/new",
				data: JSON.stringify(self.$data.newOrderType),
				contentType : "application/json",
				success : function(e) {
					self.$data.orders.push(e);
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
			self.$data.newOrderType.name = '';
		},
		
		updateOrder : function() {
			var self = this;
			$.ajax({
				type : "POST",
				url : "/order/update",
				data: JSON.stringify(self.$data.orderToBeEdited),
				contentType : "application/json",
				success : function(e) {
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
		},
		
		saveNewOrder : function() {
			var self = this;
			console.log(self.$data.orderTypeToBeEdited);
			self.$data.newOrder.type = self.$data.orderTypeToBeEdited;
			if(self.$data.newOrder.name != '' && !this.containsSpecialCharachter(self.$data.newOrder.name))
			$.ajax({
				type : "POST",
				url : "/order/new",
				data: JSON.stringify(self.$data.newOrder),
				contentType : "application/json",
				success : function(e) {
					self.$data.ordersList.push(e);
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
			self.$data.newOrder.name = '';
			self.$data.newOrder.description = '';
		},
		
		updateNewOrder : function() {
			var self = this;
			console.log(self.$data.orderToBeEdited);
			self.$data.orderToBeEdited.type = self.$data.orderTypeToBeEdited;
			$.ajax({
				type : "POST",
				url : "/order/update",
				data: JSON.stringify(self.$data.orderToBeEdited),
				contentType : "application/json",
				success : function(e) {
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
			self.$data.newOrder.name = '';
			self.$data.newOrder.description = '';
		},

		deleteOrderType : function() {
			var self = this;
			self.$data.orderTypeToBeEdited.deleted = true;
			$.ajax({
				type : "DELETE",
				url : "/order-type",
				data: JSON.stringify(self.$data.orderTypeToBeEdited),
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
		
		closeOrder : function() {
			var self = this;
			self.$data.orderToBeEdited.closed = true;
			$.ajax({
				type : "DELETE",
				url : "/order",
				data: JSON.stringify(self.$data.orderToBeEdited),
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

