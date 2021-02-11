
var vue_det = new Vue({
	el : '#frontend-div',
	data : {
		currentProduct: {
			 id:'',
			 images:[{id:1}],
			 color: '',
			 name: '',
    		 description: '',
    		 created_at: '',
    		 type: '',
    		 distance: '',
    		 location: '',
    		 fuel : '',
    		 production_year : '',
    		 brand: '',
    		 price: '',
		},
		productToBeViewedId : productToBeViewedId,
		sortingMethod: 'DEFAULT',
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

		},
		
		showProduct : function(productId) {
			var that = this;
			var productAmount = {key : productId, frequency : 0};
			that.$data.currentSize = '';
			that.$data.currentColor = '';
			that.$data.numberOfItemsOrderd.push(productAmount);	
			that.$data.loadBufferFlag  = true;
			$.ajax({
				type : "GET",
				url : "/product/fetch/" + productId,
				contentType : "application/json",
				success : function(e) {
					that.$data.currentProduct = e;
					 if(!that.isPropertyAvailable('SIZE'))
						 $( "#propertySize" ).css( "display", "none" );
					 
					 if(!that.isPropertyAvailable('COLOR'))
						 $( "#propertyColor" ).css( "display", "none" );
					 
					that.$data.loadBufferFlag  = false;


				},
				error : function() {
					console.log('ERROR: Product can not be fetched');
				}
			});
		},


		assignSortingMethod: function(input) {
		  var that = this;
		  that.$data.sortingMethod = input;
		},

	}
})
