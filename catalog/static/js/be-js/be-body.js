var vue_det = new Vue({
	el : '#side-menu-div',
	data : {
		portal : {},
		viewId : viewId,
		unNoticedOrders : 0,
		unNoticedOrdersHistory : 0,
		refreshedPage : false
		},
	mounted() {
		this.init(); // -> initialising the vue
		this.checkingNewOrders();
	  },

	methods : {
		init : function(event) {
			var that = this;
			that.$data.refreshedPage = true;
			$.ajax({
				type : "GET",
				url : "/portal",
				contentType : "application/json",
				success : function(e) {
					that.$data.portal = e;
					that.checkingNewOrders();
				},
				error : function() {
				}
			});
		},
		
		checkingNewOrders : function(){
			var that = this;
			  $.ajax({
					type : "GET",
					url : "/order/unNoticedOrders/"+ viewId,
					contentType : "application/json",
					success : function(e) {
						that.$data.unNoticedOrders = e;
						if(!that.$data.refreshedPage  && e != 0 && e > that.$data.unNoticedOrdersHistory)
						{
							that.playSound('/sounds/slow-spring-board');
						that.$data.unNoticedOrdersHistory = e;
						}
						that.$data.refreshedPage = false;
					},
					error : function() {
					},
					complete: function() {
						setTimeout(that.checkingNewOrders, 3000);
					}
				});
		},
		
	      playSound : function(filename){
	        var mp3Source = '<source src="' + filename + '.mp3" type="audio/mpeg">';
	        var oggSource = '<source src="' + filename + '.ogg" type="audio/ogg">';
	        var embedSource = '<embed hidden="true" autostart="true" loop="false" src="' + filename +'.mp3">';
	        document.getElementById("sound").innerHTML='<audio autoplay="autoplay">' + mp3Source + oggSource + embedSource + '</audio>';
	      },
		

	}
})

