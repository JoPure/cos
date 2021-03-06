/**
 * 简单是WEB国际化
 * @param {Object} win
 * @param {Object} doc
 */
(function(win, doc, $) {
	"use strict";
	win.i18N = {
		defaultLang: 'en',
		cookievalid: 86400000, //1 day (1000*60*60*24)
		text: {},
		resPath: '',
		init: function(resPath, lang) {
			var self = this;
			self.setLang(lang, false);
			self.resPath = resPath;
			return this;
		},
		extractLang: function(kvl) {
			var lang;
			for (var i in kvl) {
				var kv = kvl[i].split('=');
				if (kv[0] === 'lang')
					lang = kv[1].length > 2 ? kv[1].charAt(0) + kv[1].charAt(1) : kv[1];
			}
			return lang;
		},
		getUrlLang: function() {
			if (window.location.search.length < 2)
				return undefined;
			return this.extractLang(window.location.search.substring(1).split('&'));
		},
		getCookieLang: function() {
			return this.extractLang(document.cookie.split('; '));
		},
		getLang: function() {
			if (typeof this.lang !== 'string') {
				if (typeof(this.lang = this.getUrlLang()) === 'string');
				else if (typeof(this.lang = this.getCookieLang()) === 'string');
				else if (typeof(this.lang = navigator.language) === 'string');
				else if (typeof(this.lang = navigator.userLanguage) === 'string');
				else this.lang = this.defaultLang;
				if (this.lang.length > 2)
					this.lang = this.lang.charAt(0) + this.lang.charAt(1);
			}
			return this.lang;
		},
		setLang: function(lang, cook) {
			this.lang = lang;
			if (cook) {
				var wl = window.location,
					now = new Date(),
					time = now.getTime();
				time += this.cookievalid;
				now.setTime(time);
				document.cookie = 'lang=' + lang + ';path=' + wl.pathname + ';domain=' + wl.host + ';expires=' + now.toGMTString();
			}
			return this;
		},
		load: function() {
			var self = this,
				lang = this.getLang();
			//			$.getJSON(this.resPath + lang + '.json', function(data) {
			//				self.put(lang, data).t();
			//			});
			$.ajax({
				type: "get",
				async: false, // 同步
				url: this.resPath + lang + '.json?v='+ new Date().getTime(),
				contentType: "application/json; charset=utf-8",
				dataType: "json",
				//				cache:false,
				success: function(data) {
					self.put(lang, data).t();
				}
				,
				error: function(err) {
					console.log(err);
				}
			});
			return this;
		},
		put: function(lang, data) {
			if (typeof lang === 'string' && typeof data === 'object') {
				var obj = {};
				obj[lang] = data;
			} else
				obj = lang;
			this.text = $.extend(true, this.text, obj);
			return this;
		},
		get: function(key) {
			var keys = key.split('.'),
				lang = this.getLang(),
				obj = this.text[lang];
			while (typeof obj !== 'undefined' && keys.length > 0)
				obj = obj[keys.shift()];
			return typeof obj === 'undefined' ? lang + '.' + key : obj;
		},
		t1: function(item) {
			if (typeof item === 'object' && item instanceof Element) {
				var it = $(item),
					key = it.attr('i18n');
				it.removeClass('I18N');
				//				if (typeof key === 'undefined')
				if (!key) {
					key = it.text();
				}

				it.attr('i18n', key).text(this.get(key));
			}
			return this;
		},
		t: function(item) {
			if (typeof this.text[this.getLang()] === 'undefined') {
				this.load();
				return this;
			}
			if (typeof item === 'undefined') {
				item = $('.I18N');
			}
			for (var i in item) {
				this.t1(item[i]);
			}

			//			if(item instanceof $){
			//				for(var i in item){
			//					this.t1(item[i]);
			//				}
			//			}else{
			//				this.t1(item);
			//			}


			//			if (typeof item === 'undefined') {
			//				item = $('[I18N]');
			//				$('.I18N').each(function() {
			//					if (!$.contains($(item), this)) {
			//						item = item.add(this);
			//					}
			//				});
			//			}
			//			if (item instanceof $) {
			//				for (var i in item) {
			//					this.t1(item[i]);
			//				}
			//			} else {
			//				this.t1(item);
			//			}
			return this;
		}
	};


})(window, document, $)