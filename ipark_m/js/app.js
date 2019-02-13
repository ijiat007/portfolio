'use strict';;
( function() {
	dk.isDebug( true );

	// Pop--------------------------------------------------------------------------------------//
	dk.makeClass( 'Pop', ( function() {
		var factory;
		var _checkOption, _checkCookie, _getDom;
		var Pop, fn;

		factory = function( opt ) {
			opt = _checkOption( opt );
			if( !_checkCookie( opt.name ) ) return;
			new Pop( _getDom(), opt );
		};

		_checkOption = function( opt ) {
			if( opt.name == undefined ) return dk.err( 'Pop : name 값이 있어야 합니다.' );
			if( opt.left == undefined ) return dk.err( 'Pop : left 값이 있어야 합니다.' );
			if( opt.top == undefined ) return dk.err( 'Pop : top 값이 있어야 합니다.' );
			if( opt.list == undefined || opt.list.length < 1 ) return dk.err( 'Pop : list가 1개 이상이어야 합니다.' );

			var i, j, leng, leng2;
			var list;
			leng = opt.list.length;
			for( i = 0; i < leng; i++ ) {
				list = opt.list[ i ];
				if( list.img == undefined ) return dk.err( 'Pop : list img 값이 있어야 합니다.' );
				if( list.bts == undefined || list.bts.length < 1 ) continue;
				leng2 = list.bts.length;
				for( j = 0; j < leng2; j++ ) list.bts[ j ] = $.extend( {
					href: '#',
					target: '_self',
					style: 'width: 100%; height: 100%; left: 0; top: 0;'
				}, list.bts[ j ] );
			}
			return opt;
		};

		_checkCookie = function( name ) {
			if( dk.Cookie.get( name ) == 'done' ) return false;
			else return true;
		};

		_getDom = ( function() {
			var _templete;
			return function() {
				if( _templete ) return _templete.clone();
				_templete = $( '.pop' );
				_templete.remove();
				if( _templete.length < 1 ) return dk.err( 'Pop : .pop templete html 이 있어야 합니다' );
				return _templete.clone();
			};
		} )();

		Pop = function( $dom, opt ) {
			this.$dom = $dom;
			this.opt = opt;
			this._initPosition();
			this._initClose();
			this._initToday();
			this._initList();
			$( 'body' ).append( $dom.show() );
		};

		fn = Pop.prototype;

		fn._initPosition = function() {
			this.$dom.css( { left: this.opt.left, top: this.opt.top } );
		};

		fn._initClose = function() {
			var self = this;
			this.$dom.find( '.close' ).on( 'click', function( e ) {
				e.preventDefault();
				self.$dom.remove();
			} );
		};

		fn._initToday = function() {
			var self = this;
			this.$dom.find( '.today' ).on( 'click', function( e ) {
				e.preventDefault();
				dk.Cookie.set( self.opt.name, 'done', 1 );
				self.$dom.remove();
			} );
		};

		fn._initList = function() {
			var i, leng;
			var $ul = this.$dom.find( '.list' );
			var $li;
			leng = this.opt.list.length;
			for( i = 0; i < leng; i++ ) {
				$li = $( '<li><img src="' + this.opt.list[ i ].img + '"></li>' );
				this._addBts( $li, this.opt.list[ i ].bts );
				$ul.append( $li );
			}
			if( leng > 1 ) {
				$ul.slick( this.opt.slickOption );
			}
		};

		fn._addBts = function( $li, bts ) {
			if( !bts ) return;
			var i = bts.length;
			var $a;
			while( i-- ) {
				$a = $( '<a class="bt_alpha" style="' + bts[ i ].style + '"></a>' ).attr( {
					href: bts[ i ].href,
					target: bts[ i ].target
				} );
				$li.append( $a );
			}
		};

		return factory
	} )() );

	// LocationId--------------------------------------------------------------------------------------//
	dk.makeClass( 'LocationId', ( function() {
		var init, getId;
		var $sel;
		var _actId = null;
		var _locationId;

		/**
		 * @method	: init
		 */
		init = function() {
			$sel = {
				depth1Li: $( '.gnb .depth1>li' ),
				depth2Ul: $( '.gnb .depth1>li .depth2' )
			};
			if( _actId === null ) _actId = _locationId(); // 결과값이 없을때만 계산
			log( 'LocationId : ' + _actId );
		};

		/**
		 * @method	: getId
		 * @return	: array - [ id0, id1 ]
		 */
		getId = function() {
			if( _actId === null ) {
				log( 'LocationId : 초기화가 필요합니다.' );
				return;
			}

			return _actId.slice();
		};

		_locationId = function() {
			var pathName = location.pathname; // 현재 페이지 주소
			var id0 = -1,
				id1 = -1;

			// index 페이지 일때
			if( pathName === "/ipark_m" || pathName === "/ipark_m/index" ) {
				id0 = -2;
				return [ id0, id1 ];
			}

			$sel.depth1Li.each( function( i ) {
				// li>a 구조
				var $a = $( this ).find( '>a' );
				var href = $a.prop( 'pathname' );
				var dataLink = $a.attr( 'data-link' ) || '';


				if( $a.attr( 'href' ) == '/' ) return true;
				if( pathName.indexOf( href ) > -1 ) {
					id0 = i;
					return false;
				}
				if( dataLink != '' && pathName.indexOf( dataLink ) > -1 ) {
					id0 = i;
					return false;
				}
			} );

			$sel.depth2Ul.each( function( i ) {
				// ul>li>a 구조
				$( this ).find( '>li' ).each( function( j ) {
					var $a = $( this ).find( '>a' );
					var href = $a.prop( 'pathname' );
					var dataLink = $a.attr( 'data-link' ) || '';
					// gnb에 노출되지 않는 페이지 처리
					// attribute data-link 값으로 처리 ( data-link 가 포함 된 주소 활성화 )
					// <a href="url0" data-link="url"></a>

					if( $a.attr( 'href' ) == '/' ) return true;
					if( pathName.indexOf( href ) > -1 ) {
						id0 = i;
						id1 = j;
						return false;
					}
					if( dataLink != '' && pathName.indexOf( dataLink ) > -1 ) {
						id0 = i;
						id1 = j;
						return false;
					}

				} );
			} );

			return [ id0, id1 ];
		};

		return {
			init: init,
			getId: getId
		}
	} )() );

	// Gnb --------------------------------------------------------------------------------------//
	dk.makeClass( 'Gnb', ( function() {
		var init, getActA, getActDepth1UlLi;
		var $sel;
		var _isInitialized, _actId;
		var _act;
		var _initMega, _addEventMega, _addEvent;

		/**
		 * @method	: init
		 * @param	: $gnb - gnb 제이쿼리
		 * @param	: $depth1Li - 뎁스0 li 제이쿼리
		 * @param	: $depth2Ul - 뎁스1 ul 제이쿼리
		 */
		init = function() {
			if( _isInitialized ) return;
			_isInitialized = true;

			_actId = dk.LocationId.getId();

			$sel = {
				gnb: $( '.gnb' ),
				gnbIn: $( '.gnb .gnb_in' ),
				depth1Li: $( '.gnb .depth1>li' ),
				depth2Ul: $( '.gnb .depth1>li .depth2' ),
				bt: $( 'header .mega button' ),
				close: $( '.gnb .btn_x' )
			};

			_initMega();
			_addEventMega();
			_addEvent();
			_act( _actId[ 0 ], _actId[ 1 ] );
		};

		/**
		 * @method	: getActA
		 * @return	: jquery a element - 현재 페이지 해당 a 엘리먼트
		 */
		getActA = function() {
			var $depth1A, $depth2A;
			if( _actId[ 0 ] == -1 ) return;
			$depth1A = $sel.depth1Li.eq( _actId[ 0 ] ).find( '>a' );
			$depth2A = $sel.depth2Ul.eq( _actId[ 0 ] ).find( '>li' ).eq( _actId[ 1 ] ).find( '>a' );
			if( _actId[ 1 ] == -1 ) {} else {}
			return [ $depth1A.clone(), $depth2A.length > 0 ? $depth2A.clone() : false ];
		};

		/**
		 * @method	: getActDepth1UlLi
		 * @return	: jquery li list element - 현재 페이지 해당 depth2 li 리스트
		 */
		getActDepth1UlLi = function() {
			return $sel.depth2Ul.eq( _actId[ 0 ] ).find( '>li' ).clone();
		};

		_initMega = function() {
			TweenLite.set( $sel.gnbIn, { x: '100%' } );
		};

		_addEventMega = function() {
			$sel.bt.on( 'click', function( e ) {
				e.preventDefault();
				TweenLite.to( $sel.gnb, 1, { autoAlpha: 1, ease: Power2.easeOut } );
				TweenLite.to( $sel.gnbIn, 1, { x: '0%', ease: Power4.easeOut } );
			} );

			$sel.close.on( 'click', function( e ) {
				e.preventDefault();
				TweenLite.to( $sel.gnb, 1, { autoAlpha: 0, ease: Power2.easeOut } );
				TweenLite.to( $sel.gnbIn, 1, { x: '100%', ease: Power4.easeOut } );
			} );
		};

		_addEvent = function() {
			$sel.depth1Li.each( function( i ) {
				var $this = $( this );
				$this.find( '>a' ).on( 'click', function( e ) {
					e.preventDefault();
					_act( i );
				} );
			} );
		};

		_act = function( id0, id1 ) {
			log( 'Gnb act : ' + id0 + ', ' + id1 );
			var $actDepth1Ul, $actDepth1UlLi;

			// depth1
			$sel.depth1Li.removeClass( 'on' );
			if( id0 > -1 ) $sel.depth1Li.eq( id0 ).addClass( 'on' );

			// depth2
			$sel.depth2Ul.each( function( i ) {
				var $this = $( this );
				if( i == id0 ) {
					$actDepth1UlLi = $this.find( '>li' );
					if( $actDepth1UlLi.length != 0 ) {
						$this.slideDown( 200 );
						$actDepth1UlLi.eq( id1 ).addClass( 'on' );
					}
				} else {
					$this.slideUp( 200 );
				}
			} );
		};

		return {
			init: init,
			getActA: getActA,
			getActDepth1UlLi: getActDepth1UlLi
		}
	} )() );

	// SubTitle --------------------------------------------------------------------------------------//
	dk.makeClass( 'SubTitle', ( function() {
		var init;
		var _isInitialized;

		init = function() {
			if( _isInitialized ) return;
			_isInitialized = true;

			var $arr = dk.Gnb.getActA();
			var r;
			if( $arr[ 1 ] ) {
				r = $arr[ 1 ].data( 'title' ) || $arr[ 0 ].text();
			} else {
				r = $arr[ 0 ].text();
			}
			$( 'header h2' ).text( r );
		};

		return {
			init: init
		}
	} )() );

	// Lnb --------------------------------------------------------------------------------------//
	dk.makeClass( 'Lnb', ( function() {
		var init;
		var $sel;
		var _isInitialized;
		var _addList, _addEvent;

		init = function() {
			if( _isInitialized ) return;
			_isInitialized = true;

			$sel = {
				lnb: $( '#lnb' ),
				ul: $( '#lnb>ul' )
			};
			if( $sel.lnb.length == 0 ) return;

			_addList();
		};

		_addList = function() {
			var $depth1UlLi = dk.Gnb.getActDepth1UlLi();
			if( $depth1UlLi.length <= 1 ) return;
			$sel.ul.empty();
			$depth1UlLi.each( function( i ) {
				$( this ).css( 'left', ( i * 50 ) + '%' );
			} );
			$sel.ul.append( $depth1UlLi );
			if( $depth1UlLi.length > 2 ) _addEvent( $depth1UlLi.length );
		};

		_addEvent = function( leng ) {
			var id = dk.LocationId.getId()[ 1 ];
			var ulWidth, endX, posX = 0;
			var resize, move, end;

			// init
			( function() {
				endX = id * -50;
				endX = endX > 0 ? 0 : endX;
				endX = endX < ( ( leng - 2 ) * -50 ) ? ( ( leng - 2 ) * -50 ) : endX;
				posX += endX;
				TweenLite.set( $sel.ul, { x: endX + '%' } );
			} )();

			resize = function() {
				ulWidth = $sel.ul.width();
			};
			$( window ).on( 'resize', resize );
			resize();

			move = function( direction, distance ) {
				var ratio = distance / ulWidth;
				posX = ratio * 100;
				if( direction == 'left' ) posX = posX * -1;
				posX += endX;
				TweenLite.set( $sel.ul, { x: posX + '%' } );
			};

			end = function( direction, distance ) {
				var gap;
				endX = posX;
				gap = endX % 50;
				endX = gap < -25 ? endX - gap - 50 : endX - gap;
				endX = endX > 0 ? 0 : endX;
				endX = endX < ( ( leng - 2 ) * -50 ) ? ( ( leng - 2 ) * -50 ) : endX;
				TweenLite.to( $sel.ul, 0.5, { x: endX + '%', ease: Power4.easeOut } );
			};

			$sel.ul.swipe( {
				swipeStatus: function( event, phase, direction, distance, duration, fingers, fingerData, currentDirection ) {
					if( phase == 'move' ) {
						if( direction != 'left' && direction != 'right' ) return;
						move( direction, distance );
					}
					if( phase == 'cancel' || phase == 'end' ) {
						end( direction, distance );
					}
				}
			} );
		};

		return {
			init: init
		}
	} )() );

	// goTop --------------------------------------------------------------------------------------//
	dk.makeFunction( 'goTop', function() {
		window.scrollTo( 0, 0 );
	} );

	// faq --------------------------------------------------------------------------------------//
	dk.makeFunction( 'faq', function() {
		var $dt = $( '.lst_faq dt' );
		var $dtA = $( '.lst_faq dt a' );
		$dtA.on( 'click', function( e ) {
			e.preventDefault();
			var $this = $( this );
			var $parent = $this.parent( 'dt' );
			$dt.removeClass( 'on' );
			$parent.addClass( 'on' );
		} );
		$dtA.eq( 0 ).trigger( 'click' );
	} );

	// agree
	dk.makeFunction( 'agree', function() {
		$( '#agree_all' ).click( function() {
			if( $( this ).prop( 'checked' ) ) {
				$( '.lst_agree input[type=checkbox]' ).prop( 'checked', true );
			} else {
				$( '.lst_agree input[type=checkbox]' ).prop( 'checked', false );
			}
		} );
		$( '.lst_agree input[type=checkbox]' ).click( function() {
			if( $( "input[name='agree']:checked" ).length == 4 ) {
				$( '#agree_all' ).prop( 'checked', true );
			} else {
				$( '#agree_all' ).prop( 'checked', false );
			}
		} );
		$( '.agree .btn' ).on( 'click', function() {
			var $this = $( this );
			var $terms = $this.parents( '.lst_agree' ).find( '.terms' );
			var $other = $this.parents( '.lst_agree' ).siblings();
			$this.toggleClass( 'on' );
			$terms.toggle();
			$other.find( '.btn' ).removeClass( 'on' );
			$other.find( '.terms' ).hide();
		} );
	} );

	// 중도금
	dk.makeFunction( 'payment', function() {
		var $payment = $( '.lst_payment > li' );
		var $btn = $payment.find( '[role="button"]' );
		$btn.on( 'click', function() {
			var $lst = $( this ).parent( 'li' );
			$lst.toggleClass( 'active' );
			$lst.siblings().removeClass( 'active' );
		} );
	} );

	// layer popup
	dk.makeFunction( 'layerpop', function() {
		var $target = $( '.brand_lst a, .bx_video .btn_play' );
		var $target2 = $( '.my-interest' );
		var $close = $( '.layer .btn_x' );
		$target.on( 'click', function( e ) {
			e.preventDefault();
			TweenLite.to( $( '.layer-pr' ), 0.5, { autoAlpha: 1, ease: Power2.easeOut } );
			$( '.brand_print' ).resize();
		} );
		$target2.on( 'click', function( e ) {
			e.preventDefault();
			TweenLite.to( $( '.layer-interest' ), 0.5, { autoAlpha: 1, ease: Power2.easeOut } );
		} );
		$close.on( 'click', function() {
			TweenLite.to( $( '.layer' ), 0.5, { autoAlpha: 0, ease: Power2.easeOut } );
		} );
	} );

	// file
	dk.makeClass( 'Form', ( function() {
		var styleFile = function( $ele ) {
			$ele.change( function() {
				var name = $( this ).val();
				var val = name.substring( name.lastIndexOf( "\\" ) + 1 );

				$( this ).siblings( "span" ).text( val );
			} );
		};

		// 파일찾기 제거
		var fileRemove = function( $con, maxLeng ) {
			var removeEvent = function( $el ) {
				$el.each( function( i ) {
					var $this = $( this );
					var $delCode = $this.find( '.btn_minus' );
					$delCode.on( 'click', function() {
						$( this ).off();
						$this.remove();
					} );
				} );
			};

			$con.each( function( i ) {
				var $this = $( this );
				var $add_plus = $this.find( '.ico_plus' );
				var $ul = $this.find( '.upload' );
				var $li = $this.find( '.upload>li' );
				var $clone = $ul.find( '.clone' ).eq( 0 ).clone();
				$ul.find( '.clone' ).remove();
				removeEvent( $li );
				$add_plus.on( 'click', function() {
					if( $ul.children().length >= maxLeng ) return;
					var $clone2 = $clone.clone();
					$ul.append( $clone2 );
					styleFile( $clone2.find( 'input[type=file]' ) );
					removeEvent( $clone2 );
				} );
			} );
		};
		return {
			styleFile: styleFile,
			fileRemove: fileRemove
		}
	} )() );

	// 초기화 --------------------------------------------------------------------------------------//
	$( function() {
		dk.LocationId.init();
		dk.Gnb.init();

		if( dk.LocationId.getId()[ 0 ] == -2 ) {
			// 메인일때 종료
			// $( 'body' ).addClass( 'main' );
			return;
		} else if( dk.LocationId.getId()[ 0 ] == -1 ) {
			// 메뉴에 없는 페이지 일때 종료
			return;
		}
		dk.SubTitle.init();
		dk.Lnb.init();
	} );
} )();
