
var vue_det = new Vue({
	el : '#frontend-contact-div',
	data : {
		currentProduct: {
			 id:'',
			 name:'',
			 deleted:'',
			 type:'',
			 description:'',
			 productAvailability:'',
			 price:'',
			 discount:0,
			 images:[{id:1}]
		},
		wishList : [], 
		totalCost: 0,
		wishListIsLoaded: false,
		wishListCounter: wishListCounter,
		viewId: viewId,
		loadBufferFlag: false,
		sortingMethod: 'DEFAULT',
		minPrice: 0, 
		maxPrice: 0,
		numberOfItemsOrderd : [],
		newOrder : {
			customerName : '',
			closed : false,
			description : '',
			bill : '',
			discount : 0,
			orderTime : '' ,
			customerNumber : '',
			customerAddress : '',
			products : [],
			viewId : ''}
	},
	computed: {
		  classObject: function () {
		    return true
		  }
		},
	mounted() {
		this.init(); // -> initialising the vue
	  },

	methods : {
		init : function(event) {
			var that = this;
			that.showProduct(3);
			that.initJquery();
		},
		
		initJquery : function() {
			$('.js-addwish-b2').on('click', function(e) {
				e.preventDefault();
			});

			$('.js-addwish-b2').each(
					function() {
						var nameProduct = $(this).parent().parent().find(
								'.js-name-b2').html();
						$(this).on('click', function() {
			if ($(this).hasClass('js-addedwish-b2')) {
										swal(nameProduct,
												"is added from wishlist !",
												"success");
//										$(this).removeClass('js-addedwish-b2');
									} else {
										swal(nameProduct, "is added to wishlist !",
												"success");
//										$(this).addClass('js-addedwish-b2');
									}
									// 						$(this).off('click');
								});
					});

			$('.js-addwish-detail').each(
					function() {
						var nameProduct = $(this).parent().parent().parent().find(
								'.js-name-detail').html();

						$(this).on('click', function() {
							swal(nameProduct, "is added to wishlist !", "success");

							$(this).addClass('js-addedwish-detail');
							$(this).off('click');
						});
					});

			/*---------------------------------------------*/

			$('.js-addcart-detail').each(
					function() {
						var nameProduct = $(this).parent().parent().parent()
								.parent().find('.js-name-detail').html();
						$(this).on('click', function() {
							swal(nameProduct, "is added to cart !", "success");
						});
					});
		},
		
		showProduct : function(productId) {
			var that = this;
			var productAmount = {key : productId, frequency : 0};
			that.$data.numberOfItemsOrderd.push(productAmount);	
			that.$data.loadBufferFlag  = true;
			$.ajax({
				type : "GET",
				url : "/product/fetch/" + productId,
				contentType : "application/json",
				success : function(e) {
					that.$data.currentProduct = e;
					that.$data.loadBufferFlag  = false;
				},
				error : function() {
					console.log('ERROR: Product can not be fetched');
				}
			});
		},
		
		amountOfOrderdProduct : function(product) {
			var that = this;
			for (var i = 0; i < that.$data.numberOfItemsOrderd.length; i++) {
				if(that.$data.numberOfItemsOrderd[i].key == product.id)
					return that.$data.numberOfItemsOrderd[i].frequency;
			}
			var productAmount = {key : product.id, frequency : 0};
			that.$data.numberOfItemsOrderd.push(productAmount);	
			return 0;
		},
		
		increaseNumberOfOrder : function(product) {
			var that = this;
			for (var i = 0; i < that.$data.numberOfItemsOrderd.length; i++) {
				if(that.$data.numberOfItemsOrderd[i].key == product.id)
					 that.$data.numberOfItemsOrderd[i].frequency++;
			}
			that.calculateTheTotalPrice();
		},
		
		decreaseNumberOfOrder : function(product) {
			var that = this;
			for (var i = 0; i < that.$data.numberOfItemsOrderd.length; i++) {
				if(that.$data.numberOfItemsOrderd[i].key == product.id && that.$data.numberOfItemsOrderd[i].frequency > 0)
					 that.$data.numberOfItemsOrderd[i].frequency--;
			}
			that.calculateTheTotalPrice();
		},
		
		assignSortingMethod: function(input) {
		  var that = this;
		  that.$data.sortingMethod = input;
		},
		
		fetchWishList: function(sessionCookie) {
			var that = this;
			console.log(sessionCookie);
			$.ajax({
				type : "GET",
				url : "/product/wishList/all/" + sessionCookie,
				contentType : "application/json",
				success : function(e) {
					that.$data.wishList = e;
					that.$data.wishListIsLoaded = true; 
					that.calculateTheTotalPrice();
					that.$data.wishListCounter = e.length; 
					console.log(e);

				},
				error : function() {
					console.log('ERROR: WishList can not be fetched');
				}
			});
		},
	
		calculateTheTotalPrice: function() {
			var that = this;
			that.$data.totalCost = 0;
			for (var i = 0; i < that.$data.wishList.length; i++) {
				for (var j = 0; j < that.$data.numberOfItemsOrderd.length; j++) {
					if(that.$data.wishList[i].id == that.$data.numberOfItemsOrderd[j].key)
					that.$data.totalCost += that.$data.wishList[i].price * that.$data.numberOfItemsOrderd[j].frequency; 
				}
			}
		},
		
		addToWishList: function(productId, sessionCookie) {
			var that = this;		
//			for (var i = 0; i < that.$data.wishList.length; i++) {
//				if(that.$data.wishList[i].id == productId){
//					that.removeProductFromWishList(productId, sessionCookie);
//				return}
//			}
			$.ajax({
				type : "POST",
				url : "/product/wishList/" + productId + "/" + sessionCookie,
				contentType : "application/json",
				success : function(e) {
						that.$data.wishList.push(e);	
						that.$data.wishListCounter++;
				},
				error : function() {
					console.log('ERROR: Product can not be added');
				}
			});
		},	
		
		sendOrder : function() {
			var self = this;
			self.$data.newOrder.products = self.$data.newOrder.wishList;
			self.$data.newOrder.viewId = self.$data.viewId;
			$.ajax({
				type : "POST",
				url : "/order/new",
				data: JSON.stringify(self.$data.newOrder),
				contentType : "application/json",
				success : function(e) {

				},
				error : function() {

				}
			});
		},
		
		searchForProduct : function() {
			var self = this;
			var text = $('#searchProduct').val();
			location.replace("?search=" + text);
//			if (text.length)
//				{$("body").css("filter", "blur(4px)");
//			  $.ajax({
//					type : "GET",
//					url : "/search/product/"+ self.$data.viewId +"/"+ text,
//					contentType : "application/json",
//					success : function(e) {
//						var i;
//						self.$data.productsList= [];
//						for (i = 0; i < e.length; i++) { 
//							self.$data.productsList.push(e[i]);
//						}
//						$("body").css("filter", "blur(0px)");
//					},
//					error : function() {
//						$("body").css("filter", "blur(0px)");
//					}
//				});}
		},
		
		isNewProduct: function(product) {
			var today = new Date();  
			var secondsDiff = ( ((Date.parse(today)) - (Date.parse(product)))/1000);
			var daysDiff = secondsDiff / 86400;
			return daysDiff < 30 ? true : false;
		},

		clearWishList: function(sessionCookie) {
			var that = this;
			$.ajax({
				type : "DELETE",
				url : "/product/clearWishList/" + sessionCookie,
				contentType : "application/json",
				success : function(e) {
					that.$data.wishList = [];
						that.$data.wishListCounter = 0;
						that.calculateTheTotalPrice();
				},
				error : function() {
					console.log('ERROR: Product can not be DELETED');
				}
			});
			},
			
			isInWishList: function(product){
				for( var i = 0; i < that.$data.wishList.length; i++){ 
					   if ( that.$data.wishList[i].id === product.id) {
						   return true;
					   }
					}
				return false;
			},
		
		removeProductFromWishList: function(productId, sessionCookie) {
			var that = this;
			$.ajax({
				type : "DELETE",
				url : "/product/wishList/" + productId + "/" + sessionCookie,
				contentType : "application/json",
				success : function(e) {
					for( var i = 0; i < that.$data.wishList.length; i++){ 
						   if ( that.$data.wishList[i].id === productId) {
							   that.$data.wishList.splice(i, 1); 
						   }
						}
					    that.calculateTheTotalPrice();
						that.$data.wishListCounter--;
				},
				error : function() {
					console.log('ERROR: Product can not be DELETED');
				}
			});
		},	
	}
})
