var vue_det = new Vue({
	el : '#profile-div',
	data : {
		portal : {},
		userName : '',
		email : '',
		phoneNumber : '',
		user : {},
		copyUser: {},
		passwordStrength : 0,
		currentPassword: '',
		currentPasswordRetype : '',
		hasNumber: false,
		hasSmallLetter: false,
		hasCapitalLetter: false,
		moreThanEightDigits: false,
		hasCharachter: false,
		displayProgreeBar: 'none', 
	},
	mounted() {
		this.init(); // -> initialising the vue
	  },

	methods : {
		init : function(event) {
			var that = this;
			$.ajax({
				type : "GET",
				url : "/user",
				contentType : "application/json",
				success : function(e) {
					that.$data.user = e;
					that.$data.copyUser = Object.assign({}, e);
				},
				error : function() {
				}
			});
		},
		someHandler : function() { 
			var self = this;
			if(!self.$data.hasNumber && !isNaN(self.$data.currentPassword)){
				self.$data.hasNumber = true;
				self.$data.passwordStrength = self.$data.passwordStrength + 20;
			}
			
			if(!self.$data.hasSmallLetter && isNaN(self.$data.currentPassword) && self.$data.currentPassword.toUpperCase() != self.$data.currentPassword){
				self.$data.hasSmallLetter = true;
				self.$data.passwordStrength = self.$data.passwordStrength + 20;
			}
			
			if(!self.$data.hasCapitalLetter && isNaN(self.$data.currentPassword) && self.$data.currentPassword.toUpperCase() == self.$data.currentPassword){
				self.$data.hasCapitalLetter = true;
				self.$data.passwordStrength = self.$data.passwordStrength + 20;
			}
			var format = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/;
			if(!self.$data.hasCharachter && format.test(self.$data.currentPassword)){
				self.$data.hasCharachter = true;
				self.$data.passwordStrength = self.$data.passwordStrength + 20;
			}
			
			if(!self.$data.moreThanEightDigits && self.$data.currentPassword.length >= 8){
				self.$data.moreThanEightDigits = true;
				self.$data.passwordStrength = self.$data.passwordStrength + 20;
			}
			
			if(self.$data.currentPassword == ''){
				self.$data.passwordStrength = 0;
				self.$data.hasNumber= false;
				self.$data.hasSmallLetter= false;
				self.$data.hasCapitalLetter= false;
				self.$data.moreThanEightDigits= false;
				self.$data.hasCharachter= false;
			}
			
			if(self.$data.moreThanEightDigits && self.$data.currentPassword.length < 8 ){
				self.$data.moreThanEightDigits = false;
				self.$data.passwordStrength = self.$data.passwordStrength - 20;
			}
		},
		enableChangePassword : function() { 
			var self = this;
			if(self.$data.displayProgreeBar == 'none')
				self.$data.displayProgreeBar= 'inline'; 
			   else 
				   self.$data.displayProgreeBar= 'none'; 
			document.getElementById("password-input").disabled = $('#toggle-trigger').is(':checked');
			document.getElementById("re-password-input").disabled = $('#toggle-trigger').is(':checked');
			},
			
			  reset: function() {
				  var that = this;
				  that.$data.user =  Object.assign({}, that.$data.copyUser);
			  },
		saveChanges : function() {
			var self = this;
			$.ajax({
				type : "POST",
				url : "/user/update",
				data: JSON.stringify(self.$data.user),
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
		
		changePassword : function() {
			var self = this;
			if(!$('#toggle-trigger').is(':checked'))return;
			if(self.$data.currentPasswordRetype != self.$data.currentPassword){
				$.notify('The passwords do not match!', {
					position: 'top center',
					  className: 'error'
					});
				return;}
			
			if(self.$data.currentPassword == ''){
				$.notify('The password can not be empty!', {
					position: 'top center',
					  className: 'error'
					});
				return;}
			
			$.ajax({
				type : "POST",
				url : "/user/update/password",
				data: JSON.stringify(self.$data.currentPassword),
				contentType : "application/json",
				success : function(e) {
					$.notify('Password has been changed!', {
						position: 'top center',
						  className: 'success'
						});
				
				},
				error : function() {
					$.notify("Password failed to change!", "error");
				}
			});

		},
		

	}
})

