
// ==========================================================================
// The M-Project - Mobile HTML5 Application Framework
// Generated with: Espresso 
//
// Project: SmartSat
// Model: Entidad
// ==========================================================================

SmartSat.Entidad = M.Model.create({

	/* Define the name of your model. Do not delete this property! */
	__name__: 'Entidad',

	/* Sample model properties: */

	mo_id: M.Model.attr('Integer',{isRequired:YES}),

	mo_idcliente: M.Model.attr('String'),
	
	mo_cliente: M.Model.attr('Integer'),

	mo_lat: M.Model.attr('Float',{isRequired:YES}),

	mo_lon: M.Model.attr('Float',{isRequired:YES}),
	
	mo_domicilio: M.Model.attr('String'),
	
	mo_barrio: M.Model.attr('String'),
	
	mo_velocidad: M.Model.attr('Integer'),
	
	mo_image_velocidad:M.Model.attr('String')

}, M.DataProviderRemoteStorage.configure({
	'Entidad': {
		url: 'http://190.105.232.200/restConsatServer/public',
		read: {
			url: {
				all: function(data) {
					return 'entidad';
				}
			},
			map:function(data){
				return data;
			}
		}
	}
}));

// ==========================================================================
// The M-Project - Mobile HTML5 Application Framework
// Generated with: Espresso 
//
// Project: SmartSat
// Model: Usuario
// ==========================================================================

SmartSat.Usuario = M.Model.create({

    /* Define the name of your model. Do not delete this property! */
    __name__: 'Usuario',

    /* Sample model properties: */

    cl_nro: M.Model.attr('Integer',{isRequired:YES}),

    cl_razon: M.Model.attr('String', {isRequired:YES}),
    
    cl_usuario: M.Model.attr('String', {isRequired:YES})

},M.DataProviderRemoteStorage.configure({
	'Usuario': {
		isAsync:true,
		url: 'http://190.105.232.200/restConsatServer/public',
		read: {
			url: {
				all: function(data) {
					return 'usuario';
				}
			},
			map:function(data){
				return data;
			}
		}
	}
}));

// ==========================================================================
// The M-Project - Mobile HTML5 Application Framework
// Generated with: Espresso 
//
// Project: SmartSat
// Controller: EntidadC
// ==========================================================================

SmartSat.EntidadC = M.Controller.extend({

	/* sample controller property */
	Entidades: '',

	/*
	 * Sample function
	 * To handle the first load of a page.
	 */
	init: function(isFirstLoad) {
		if(isFirstLoad){
			this.sincroEntidades();
		}
	},
	
	onSuccess:function(data){
		M.LoaderView.hide();
		this.set('Entidades',data);
		/** Activamos el Paginador **/
		SmartSat.PaginadorC.initPaginador();
	},
	
	onError:function(error){
    	M.LoaderView.hide();
    	M.DialogView.alert({
    	    title: 'Error',
    	    message: error.errObj.responseText,
    	    confirmButtonValue: 'Ok.',
    	    callbacks: {
    	        confirm: {
    	            action: function() {
    	                return false;
    	            }
    	        }
    	    }
    	});
    },

	showMapa:function(id,m_id){
		var record = [SmartSat.Entidad.recordManager.getRecordForId(m_id)];
		SmartSat.MapaC.set('entidadesForDisplay',record);
		this.switchToPage('MapaEntidades');
	},
	
	renderFlota:function(){
		SmartSat.MapaC.set('entidadesForDisplay',this.Entidades);
		this.switchToPage('MapaEntidades');
	},
	
	sincroEntidades:function(){
		M.LoaderView.show('Conectando...');
		SmartSat
		.Entidad
		.find({query:[
                      {identifier:'Cliente',operator:'=',value:SmartSat.LoginC.get('User')[0].get('cl_nro')}
                      ],
			onSuccess:function(data){
				SmartSat.EntidadC.onSuccess(data);
			},
			onError:{
            	target:SmartSat.EntidadC,
            	action:'onError'
            }
		});
	},
	search:function(id,e){
		var value =String(M.ViewManager.findViewById(id).value);
		var result = new Array();
		$.each(SmartSat.Entidad.recordManager.records,function(){
			if(typeof(this.get('mo_idcliente')) == 'string'){
				if(this.get('mo_idcliente').indexOf(value) != -1) result.push(this);
			}
		});
		this.set('Entidades',result);
		/** @todo Cambiar la busqueda en el paginador **/
		SmartSat.PaginadorC.initPaginador();
	}

});

// ==========================================================================
// The M-Project - Mobile HTML5 Application Framework
// Generated with: Espresso 
//
// Project: SmartSat
// Controller: LoginC
// ==========================================================================

SmartSat.LoginC = M.Controller.extend({

    /* sample controller property */
    User: '',

    /*
    * Sample function
    * To handle the first load of a page.
    */
    init: function(isFirstLoad) {
        if(isFirstLoad) {
            /* do something here, when page is loaded the first time. */
        }
        /* do something, for any other load. */
    },
    
    validarAcceso:function(e){
    	var form = M.ViewManager.getView(SmartSat.Login, 'frmLogin');
		if(form.validate()){
			var data = form.getFormValues();
			M.LoaderView.show('Conectando...');
			SmartSat.Usuario.find({query:[
    	                                  {identifier:'Nombre',operator:'=',value:data.usuario},
    	                                  {identifier:'Password',operator:'=',value:data.password}
    	                                  ],
    	                                onSuccess:function(data){
    	                                	SmartSat.LoginC.onSuccess(data);
    	                                },
    	                                onError:{
    	                                	target:SmartSat.LoginC,
    	                                	action:'onError'
    	                                }
										});
		}
		form.clearForm();
    },
    
    onSuccess:function(data){
    	M.LoaderView.hide();
    	this.set('User',data);
    	this.switchToPage('ListEntidades');
    },
    
    onError:function(error){
    	M.LoaderView.hide();
    	M.DialogView.alert({
    	    title: 'Error',
    	    message: error.errObj.responseText,
    	    confirmButtonValue: 'Ok.',
    	    callbacks: {
    	        confirm: {
    	            action: function() {
    	                return false;
    	            }
    	        }
    	    }
    	});
    }
});

// ==========================================================================
// The M-Project - Mobile HTML5 Application Framework
// Generated with: Espresso 
//
// Project: SmartSat
// Controller: MapaC
// ==========================================================================

SmartSat.MapaC = M.Controller.extend({
	
	entidadesForDisplay:[],
	marks:null,
	message:'',
	map:null,
	
    /*
    * Sample function
    * To handle the first load of a page.
    */
    init: function(isFirstLoad) {
    	if(isFirstLoad){
    		this.map = M.ViewManager.getView('MapaEntidades', 'map');
    		this.map.initMap({
    			showMapTypeControl: YES,
    			showStreetViewControl: NO,
    			showNavigationControl: YES,
    			mapType: M.MAP_ROADMAP,
    			zoomLevel: 8,
    			isDraggable: YES,
    			initialLocation: M.Location.extend({
    				latitude: -34.589746,
    				longitude: -58.386072
    			}),
    			callbacks: {
    			    success: {
    			        target: this,
    			        action:'renderInMap'
    			    },
    			    error: {
    			        target: this,
    			        action: 'renderError'
    			    }
    			}
    		});
    	}else{
    		this.renderInMap();
    	}
    },
    
    renderError: function(){
    	console.log('Error');
    },
    
    renderInMap:function(){
    	var map = M.ViewManager.getView('MapaEntidades', 'map');
    	var marks = [];
    	var entidades = this.get('entidadesForDisplay');
    	$.each(this.get('entidadesForDisplay'),function(i){
    		var that = this;
    		marks[i] = (M.MapMarkerView.init({
        	    location: M.Location.init(that.get('mo_lat'), that.get('mo_lon')),
        	    map: map,
        	    title: that.get('mo_idcliente'),
        	    message: 'Domicilio:'+that.get('mo_domicilio'),
        	    icon:'./theme/images/mark_map.png'
        	}));
    	});
    	this.map.updateMap({initialLocation:marks[0].location});
    	this.set('marks',marks);
    },
    back:function(){
    	this.switchToPage('ListEntidades');
    }

});

// ==========================================================================
// The M-Project - Mobile HTML5 Application Framework
// Generated with: Espresso 
//
// Project: SmartSat
// Controller: Menu
// ==========================================================================

SmartSat.MenuC = M.Controller.extend({

    /* sample controller property */
    myControllerProperty: '',

    /*
    * Sample function
    * To handle the first load of a page.
    */
    init: function(isFirstLoad) {
        if(isFirstLoad) {
            /* do something here, when page is loaded the first time. */
        }
        /* do something, for any other load. */
    },
    
    show:function(){
    //	this.changeToPage('grfflota');
   	 M.DialogView.actionSheet({
           title: 'Menu',
           cancelButtonValue: 'Cancelar',
           otherButtonValues: ['Listar Flota', 'Graficar Flota', 'Neo'],
           otherButtonTags: ['lstflota', 'grfflota', 'neo'],
           callbacks: {
               cancel: {
                   target: this,
                   action: function(){return false;}
               },
               other: {
                   target: this,
                   action: 'changeToPage'
               }
           }
       });
   },
   
   changeToPage: function(option){
	   switch (option) {
	   case 'lstflota':
		   	this.switchToPage('ListEntidades');
		   break;
	   case 'grfflota':
		   SmartSat.EntidadC.renderFlota();
		   break;
	   default:
		   return false;
		   break;
	   }
   }

});

// ==========================================================================
// The M-Project - Mobile HTML5 Application Framework
// Generated with: Espresso 
//
// Project: SmartSat
// Controller: PaginadorC
// ==========================================================================

SmartSat.PaginadorC = M.Controller.extend({

    /* sample controller property */
    totalRows: 0,
    currentPage:1,
    maxRecordForPage:10,
    recordsInPage:null,
    totalPages: 0,
    start: 0,
    limit:10,
    lblPager:'Pagina 0 de 0',
    
    /** Inicia el Paginador **/
    initPaginador: function(){
		this.set('totalRows',SmartSat.EntidadC.get('Entidades').length);
		this.set('maxRecordForPage',10);
		this.set('recordsInPage',SmartSat.EntidadC.get('Entidades').slice(this.get('start'),this.get('limit')));
		this.set('totalPages',M.Math.round((this.get('totalRows')/SmartSat.PaginadorC.get('maxRecordForPage')),M.ROUND,0));
		this.set('currentPage',1);
		this.setLabelPager();
		this.setEstatusButtonsNav();
	},
	
	/** Setea el Label del Paginador **/
	setLabelPager:function(){
		var text = this.get('currentPage') +' de '+ this.get('totalPages');
		this.set('lblPager',text);
	},
	/** Mueve una Pagina **/
	nextPage:function(){
		this.set('start',this.get('limit')+1);
		this.set('limit',this.get('start')+this.get('maxRecordForPage'));
		this.set('recordsInPage',SmartSat.EntidadC.get('Entidades').slice(this.get('start'),this.get('limit')));
		this.set('currentPage',this.get('currentPage')+1);
		this.setLabelPager();
		this.setEstatusButtonsNav();
	},
	/** Retrocede una Pagina **/
	prevPage:function(){
		this.set('start',this.get('start')-this.get('maxRecordForPage')-1);
		this.set('limit',this.get('limit')-this.get('maxRecordForPage'));
		this.set('recordsInPage',SmartSat.EntidadC.get('Entidades').slice(this.get('start'),this.get('limit')));
		this.set('currentPage',this.get('currentPage')-1);
		this.setEstatusButtonsNav();
		this.setLabelPager();
	},
	/** Pone disabled y enabled los botones de paginado **/
	setEstatusButtonsNav:function(){
		btnPrevPage = M.ViewManager.getView('ListEntidades', 'btnPagePrev');
		btnNextPage = M.ViewManager.getView('ListEntidades', 'btnPageNext');
		if(this.get('totalPages') == 1){
			btnNextPage.disable();
			btnPrevPage.disable();
		}else{
			if(this.get('currentPage')== 1){
				btnNextPage.enable();
				btnPrevPage.disable();
			}else{
				if(this.get('currentPage') < this.get('totalPages')){
					btnNextPage.enable();
					btnPrevPage.enable();
				}else{
					btnNextPage.disable();
					btnPrevPage.enable();
				}
			}
		}
	}

});

// ==========================================================================
// The M-Project - Mobile HTML5 Application Framework
// Generated with: Espresso 
//
// Project: SmartSat
// View: EntidadSearchBar
// ==========================================================================

SmartSat.EntidadSearchBar = M.SearchBarView.design({
	cssClass: 'MargginBar',
	isListViewSearchBar: YES,
    events: {
        keyup: {
            target: SmartSat.EntidadC,
            action: 'search'
        },
        focus:{
            target: SmartSat.EntidadC,
            action: 'search'
        }
    }
});


// ==========================================================================
// The M-Project - Mobile HTML5 Application Framework
// Generated with: Espresso 
//
// Project: SmartSat
// View: Head
// ==========================================================================
SmartSat.Head =M.ToolbarView.design({
	childViews : 'lblAppName btnMenu',

	lblAppName : M.LabelView.design({
		anchorLocation : M.CENTER,
		value : ''
	}),

	btnMenu : M.ButtonView.design({
		anchorLocation : M.LEFT,
		isIconOnly: NO,
		value:'Graficar Flota',
		icon : 'grid',
        events: {
            tap: {
            	target: SmartSat.MenuC,
            	action:'show'
            }
        }
	})
});


// ==========================================================================
// The M-Project - Mobile HTML5 Application Framework
// Generated with: Espresso 
//
// Project: SmartSat
// View: Footer
// ==========================================================================

SmartSat.Footer = M.ToolbarView.design({
        value: '',
        anchorLocation: M.BOTTOM
});


// ==========================================================================
// The M-Project - Mobile HTML5 Application Framework
// Generated with: Espresso 
//
// Project: SmartSat
// View: Login
// ==========================================================================
SmartSat.Login = M.PageView.design({

    /* Use the 'events' property to bind events like 'pageshow' */
    events: {
        pageshow: {
            target: SmartSat.LoginC,
            action: 'init'
        }
    },

    childViews: 'header content footer',

    header: M.ToolbarView.design({
        value: 'SmartSat',
        anchorLocation: M.TOP
    }),

    content: M.FormView.design({
    	childViews:'frmLogin',
    	frmLogin: M.FormView.design({
        	showAlertDialogOnError: YES,
        	alertTitle:'Error(s)',
            childViews: 'imgApp usuario password btnLoguear',
            imgApp: M.ImageView.design({
    			cssClass:'imgCenter',
    			value: './theme/images/imgApp.png'
    		}),
            usuario: M.TextFieldView.design({
            	initialText: 'Usuario',
            	validators: [M.PresenceValidator]
            }),
            password: M.TextFieldView.design({
            	initialText: 'Password',
            	inputType: M.INPUT_PASSWORD,
            	validators: [M.PresenceValidator]
            }),
            btnLoguear: M.ButtonView.design({
                value: 'Login',
                icon: 'check',
                events: {
                    tap: {
                    	target: SmartSat.LoginC,
                    	action:'validarAcceso'
                    }
                }
            })
        })    	
    }),

    footer: M.ToolbarView.design({
        value: 'SmartSat',
        anchorLocation: M.BOTTOM
    })

});


// ==========================================================================
// The M-Project - Mobile HTML5 Application Framework
// Generated with: Espresso 
//
// Project: SmartSat
// View: MapaEntidades
// ==========================================================================

SmartSat.MapaEntidades = M.PageView.design({
    
    cssClass: 'MapaEntidades',
    
    events: {
        pageshow: {
            target: SmartSat.MapaC,
            action: 'init'
        }
    },

    childViews: 'headmap map footermap',
    
    headmap:M.ToolbarView.design({
		childViews : 'lblApp btnBack',
		
		lblApp : M.LabelView.design({
			anchorLocation : M.CENTER,
			value : ''
		}),
		
		btnBack:M.ButtonView.design({
		anchorLocation : M.LEFT,
		isIconOnly: NO,
		value:'Volver',
		icon : 'back',
		events : {
			tap : {
				target : SmartSat.MapaC,
				action : 'back'
			}
		}
		})
    }),

    map: M.MapView.design({
            cssClass: 'map',
            isInset: YES,
            contentBinding: {
                target: SmartSat.MapaC,
                property: 'marks'
            }
    }),
    
    footermap:M.ToolbarView.design({
        anchorLocation: M.BOTTOM,
        childViews : 'lblAppName btnActMapEntidad',

    	lblAppName : M.LabelView.design({
    		anchorLocation : M.CENTER,
    		computedValue: {
        		valuePattern:'<%= message %>',
                value: '',
                operation: function(v) {
                    //console.log(v);
                }
        	}
    	}),

    	btnActMapEntidad : M.ButtonView.design({
    		anchorLocation : M.LEFT,
    		isIconOnly: NO,
    		value:'Actualizar',
    		icon : 'refresh',
            events: {
                click: {
                	target: SmartSat.EntidadC,
                	action:'sincroEntidades'
                }
            }
    	})
    })
});


// ==========================================================================
// The M-Project - Mobile HTML5 Application Framework
// Generated with: Espresso 
//
// Project: SmartSat
// View: RowsEntidades
// ==========================================================================

SmartSat.RowsEntidades = M.ListItemView.design({

	childViews: 'rowsEntidades iconVelocidad',
	isSelectable: YES,
    events: {
        tap: {
            target: SmartSat.EntidadC,
            action:'showMapa'
        }
    },

	rowsEntidades: M.LabelView.design({
        valuePattern: 'Movil: <%= mo_idcliente %> - Barrio: <%= mo_barrio %>'
    }),
    
    iconVelocidad:M.ImageView.design({
    	computedValue: {
    		valuePattern:'<%= mo_velocidad %>',
            value: '',
            operation: function(v) {
                return (v > 0)?'./theme/images/icono_green.png': './theme/images/icono_red.png';
            }
    	}
    })

});


// ==========================================================================
// The M-Project - Mobile HTML5 Application Framework
// Generated with: Espresso 
//
// Project: SmartSat
// View: ListEntidades
// ==========================================================================
m_require('app/views/Head.js');
m_require('app/views/RowsEntidades.js');
m_require('app/views/EntidadSearchBar.js');
SmartSat.ListEntidades = M.PageView.design({

    /* Use the 'events' property to bind events like 'pageshow' */
    events: {
        pageshow: {
            target: SmartSat.EntidadC,
            action: 'init'
        }
    },
    
    cssClass: 'ListEntidades',

    childViews: 'header content footer',

    header: SmartSat.Head,
    
    content: M.ScrollView.design({
        childViews: 'gridEntidades',
        gridEntidades: M.ListView.design({
    		  listItemTemplateView: SmartSat.RowsEntidades,
      		  hasSearchBar: YES,
      		  isInset: YES,
      		  usesDefaultSearchBehaviour:NO,
      		  searchBar: SmartSat.EntidadSearchBar,
    		  contentBinding: {
    					target: SmartSat.PaginadorC,
    					property: 'recordsInPage'
    		  }
        })
    }),    	

    footer: M.ToolbarView.design({
    	childViews: 'btnPagePrev textPage btnPageNext',
    	anchorLocation: M.BOTTOM,
    	
    	btnPagePrev:M.ButtonView.design({
    		anchorLocation : M.LEFT,
            value: 'Anterior',
            icon: 'arrow-l',
            isIconOnly: NO,
            events: {
                tap: {
                	target: SmartSat.PaginadorC,
                	action:'prevPage'
                }
            }
        }),
        
        textPage:M.LabelView.design({
			anchorLocation : M.CENTER,
		    contentBinding: {
		            target: SmartSat.PaginadorC,
		            property: 'lblPager'
		     }
		}),
        
    	btnPageNext:M.ButtonView.design({
    		anchorLocation : M.RIGHT,
            value: 'Siguiente',
            icon: 'arrow-r',
            isIconOnly: NO,
            events: {
                tap: {
                	target: SmartSat.PaginadorC,
                	action:'nextPage'
                }
            }
        })
    })

});


// ==========================================================================
// The M-Project - Mobile HTML5 Application Framework
// Generated with: Espresso 
//
// Project: SmartSat 
// ==========================================================================

var SmartSat  = SmartSat || {};

SmartSat.app = M.Application.design({

    /* Define the entry/start page of your app. This property must be provided! */
    entryPage : 'Login',

    Login: SmartSat.Login,
    
    Head: SmartSat.Head,
    
    Footer: SmartSat.Footer,
    
    ListEntidades: SmartSat.ListEntidades,
    
    RowEntidades: SmartSat.RowEntidades,
    
    MapaEntidades: SmartSat.MapaEntidades,
    
    EntidadSearchBar: SmartSat.EntidadSearchBar

});