var vue_det = new Vue({
	el : '#portal-div',
	data : {
		portal : {},
		copyPortal: {},
		productTypeToBeEdited: {},
		productTypeOriginal: {},
		newProductType: {name: '', description:''},
		productTypes: [],
		productPageIndex:0,
		productTypeMode: true,
		// Product part
		productsList: [],
		productToBeEdited: {},
		productToBeEditedProperties: {},
		productOriginal: {},
		propertiesAvailable: {},
		propertySize : false,
		propertyColor : false,
		resize : null,
		cropMode : false,
		newProduct: {name: '', description:'', type: '',price: 0, likes: 0, productAvailability : 1, images : []},
		defaultImage:'',
		magnifiedImage:'',
		magnifierIsLoaded: false,
		availabilityOptions: [
		      { text: 'Available', value: 'AVAILABLE' },
		      { text: 'Out of stock', value: 'OUT_OF_STOCK' },
		      { text: 'Coming soon', value: 'COMING_SOON' },
		      { text: 'On order', value: 'ON_ORDER' },
		      { text: 'Limited', value: 'LIMITED' }
		    ],
		    
			propertiesOptions: [
			      { text: 'SIZE', value: 'Size' },
			      { text: 'GENDER', value: 'Gender' },
			      { text: 'MATERIAL', value: 'Material' },
			      { text: 'BRAND', value: 'Brand' },
			      { text: 'COLOR', value: 'Color' }
			    ],
			    
		},
	mounted() {
		this.init(); // -> initialising the vue
	  },

	methods : {
		init : function(event) {
			var that = this;			  
			$.ajax({
				type : "GET",
				url : "/product-type/all",
				contentType : "application/json",
				success : function(e) {
					that.$data.productTypes = e;
				},
				error : function() {
				}
			});
		},
		
		updateAvailability : function(value) {
			var that = this;
			that.$data.productToBeEdited.productAvailability = value;
		},
		
		
		changeBetweenListAndTypes: function(productType) {
			 $("body").css("filter", "blur(4px)");
			  var that = this;
			  that.$data.productPageIndex = 0;
			  that.$data.productTypeToBeEdited = productType; 
			  $.ajax({
					type : "GET",
					url : "/product/"+ productType.id + '?pageIndex=' + that.$data.productPageIndex,
					contentType : "application/json",
					success : function(e) {
						 that.$data.productsList = e;
						  $("body").css("filter", "blur(0px)");
						  $("#searchProduct").focus();
					},
					error : function() {
					}
				});
				
			  that.$data.productTypeMode = !that.$data.productTypeMode;
			  that.$data.productTypeToBeEdited = productType;

		  },
		  
		  deleteProductImage: function(imageId) {
			  var that = this;
			  var images = that.$data.productToBeEdited.images;
			  for(var i = images.length - 1; i >= 0; i--) {

				    if(images[i].id == imageId) {
				    	that.$data.productToBeEdited.images.splice(i, 1);
						$.ajax({
							type : "DELETE",
							url : "/product/deleteImage/" + imageId,
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
			  
		  loadMoreProducts: function() {
			  var that = this;
			  that.$data.productPageIndex++;
			  $.ajax({
					type : "GET",
					url : "/product/"+ that.$data.productTypeToBeEdited.id + '?pageIndex=' + that.$data.productPageIndex,
					contentType : "application/json",
					success : function(e) {
						var i;
						for (i = 0; i < e.length; i++) { 
							that.$data.productsList.push(e[i]);
						}
						
					},
					error : function() {
					}
				});
				
			  },
				  
		backToProductType: function() {
				  var that = this;
				  that.$data.productTypeMode = !that.$data.productTypeMode;
			  },
			  
		editProductType: function() {
			  var that = this;
			  document.getElementById(that.$data.productTypeToBeEdited.id).disabled = false;
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
			if(string == '')
				return true;
// var format = /[!@#$%^&*()+\=\[\]{};'"\\|,.<>\/?]+/;
// if(format.test(string)){
// return true;
// } else {
// return false;
// }
			return false;
		},
		
		assignProductTypeToBeEdited : function(productType) {
			var self = this;
			self.$data.productTypeOriginal = JSON.parse(JSON.stringify(productType));
			self.$data.productTypeToBeEdited = productType;
					},
		
		updateProperty : function(key) {
			var self = this;
			var currentValue = document.getElementById('key-'+key).value;
			self.$data.productToBeEdited.properties[key] = currentValue;
		},
		
		assignProductToBeEdited : function(product) {
			var self = this;	
			$("#cropDiv").css("display", "none");
			window.scrollTo(0, 0);
			self.$data.productOriginal = JSON.parse(JSON.stringify(product));
			self.$data.productToBeEdited = product;
			self.$data.magnifierIsLoaded = true;
			if(product.images.length != 0)
			self.$data.magnifiedImage = product.images[0];
			this.isPropertyChecked(); 	
			
			var el = document.getElementById('image_demo');
			
			if(self.$data.resize == null)
			self.$data.resize = new Croppie(el, {
			    enableExif: true,
			    enableOrientation: true,
			    viewport: {
			        width: 480,
			        height: 500,
			        type: 'square'
			    },
			    boundary: {
			        width: 500,
			        height: 550
			    }
			});

			$('#upload_image').on('change', function() {
				$("#cropDiv").css("display", "block");
				var reader = new FileReader();
				reader.onload = function(event){
					self.$data.resize.bind({
					    url: event.target.result
					});
				}
				reader.readAsDataURL(this.files[0]);				
			});
		},
	
		isPropertyChecked : function() {
			var self = this;	
			if (self.$data.productToBeEdited.properties != null)
			for(var i = 0 ; i < self.$data.productToBeEdited.properties.length;  i++){
					if(self.$data.productToBeEdited.properties[i].property.toUpperCase() == 'COLOR')
						self.$data.propertyColor = true;
					if(self.$data.productToBeEdited.properties[i].property.toUpperCase() == 'SIZE')
						self.$data.propertySize = true;			
		        }
		},
		
		toggleProperty : function(property) {
			var self = this;	
			if (self.$data.productToBeEdited.properties != null)
			for(var i = 0 ; i < self.$data.productToBeEdited.properties.length;  i++){
					if(self.$data.productToBeEdited.properties[i].property.toUpperCase() == property)
						self.$data.propertyColor = !self.$data.propertyColor;
					if(self.$data.productToBeEdited.properties[i].property.toUpperCase() == property)
						self.$data.propertySize = !self.$data.propertySize;			
		        }
		},
		
		resetViewToBeEdited : function(view) {
			var self = this;
			self.$data.viewOriginal = JSON.parse(JSON.stringify(view));
			self.$data.viewToBeEdited = view;
		},
		
		searchForProduct : function() {
			var self = this;
			
			var text = $('#searchProduct').val();
			if (text.length)
				{$("body").css("filter", "blur(4px)");
			  $.ajax({
					type : "GET",
					url : "/product/search/"+ self.$data.productTypeToBeEdited.id +"/"+ text,
					contentType : "application/json",
					success : function(e) {
						var i;
						self.$data.productsList= [];
						for (i = 0; i < e.length; i++) { 
							self.$data.productsList.push(e[i]);
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
					self.$data.resize.result({
					      type: 'canvas',
					      size: 'viewport'		
					    	  }).then(function(response){
									$.ajax({
										type : "POST",
										url : "/product/uploadImage/" + self.$data.productToBeEdited.id,
										data: JSON.stringify(response),
										contentType : "application/json",
										success : function(e) {
											$("#cropDiv").css("display", "none");
											self.$data.productToBeEdited.images.push(e);
											$.notify('File is uploaded!', {
												position: 'top center',
												  className: 'success'
												});
											self.$data.defaultImage = response;
										},
										error : function() {
											$.notify('Error in uploading!', {
												position: 'top center',
												  className: 'error'
												});
										}
									});
								    });
				    
				
	
		},
				
		saveNewProductType : function() {
			var self = this;
			if(self.$data.newProductType.name != '' && !this.containsSpecialCharachter(self.$data.newProductType.name))
			$.ajax({
				type : "POST",
				url : "/product-type/new",
				data: JSON.stringify(self.$data.newProductType),
				contentType : "application/json",
				success : function(e) {
					self.$data.productTypes.push(e);
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
			self.$data.newProductType.name = '';
		},
		
		updateProductTypes : function() {
			var self = this;
			$.ajax({
				type : "POST",
				url : "/product-type/updateList",
				data: JSON.stringify(self.$data.productTypes),
				contentType : "application/json",
				success : function(e) {
					self.$data.productTypes = e; 
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
		
		saveNewProduct : function() {
			var self = this;
			self.$data.newProduct.type = self.$data.productTypeToBeEdited;
			if(self.$data.newProduct.name != '' && !this.containsSpecialCharachter(self.$data.newProduct.name))
			$.ajax({
				type : "POST",
				url : "/product/new",
				data: JSON.stringify(self.$data.newProduct),
				contentType : "application/json",
				success : function(e) {
					self.$data.productsList.push(e);
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
			self.$data.newProduct.name = '';
			self.$data.newProduct.description = '';
		},
		
		removeProperty: function(property) {
			var self = this;
			if (self.$data.productToBeEdited.properties != null)
				for(var i = self.$data.productToBeEdited.properties.length - 1; i >= 0; i--){
						if(self.$data.productToBeEdited.properties[i].property.toUpperCase() == property)
								self.$data.productToBeEdited.properties.splice(i, 1);	}
		},
		
		isArrayHasProperty : function(property) {
			var self = this;
			if (self.$data.productToBeEdited.properties != null)
				for(var i = self.$data.productToBeEdited.properties.length - 1; i >= 0; i--){
						if(self.$data.productToBeEdited.properties[i].property.toUpperCase() == property)
							return true;
						
							}
			return false;
		}, 
		
		updateNewProduct : function() {
			var self = this;
			self.$data.productToBeEdited.type = self.$data.productTypeToBeEdited;
			console.log(self.$data.productToBeEdited.properties);
			
			if(!self.$data.propertyColor)
			this.removeProperty('COLOR');
			
			if(!self.$data.propertySize)
				this.removeProperty('SIZE');
			
			if(self.$data.propertyColor && !this.isArrayHasProperty('COLOR'))
				self.$data.productToBeEdited.properties.push({id : -1 , name : 'COLOR', property: 'COLOR'});
				if(self.$data.propertySize  && !this.isArrayHasProperty('SIZE'))
					self.$data.productToBeEdited.properties.push({id : -2 , name : 'SIZE', property :'SIZE'});
			        
			console.log(self.$data.productToBeEdited.properties);
			$.ajax({
				type : "POST",
				url : "/product/update",
				data: JSON.stringify(self.$data.productToBeEdited),
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
			self.$data.newProduct.name = '';
			self.$data.newProduct.description = '';
		},

		deleteProductType : function() {
			var self = this;
			self.$data.productTypeToBeEdited.deleted = true;
			$.ajax({
				type : "DELETE",
				url : "/product-type",
				data: JSON.stringify(self.$data.productTypeToBeEdited),
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
		
		deleteProduct : function() {
			var self = this;
			self.$data.productToBeEdited.deleted = true;
			$.ajax({
				type : "DELETE",
				url : "/product",
				data: JSON.stringify(self.$data.productToBeEdited),
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
 