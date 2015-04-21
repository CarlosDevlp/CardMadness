//interfaz de el lienzo del juego
var  CANVAS= document.getElementById("game");
var  GAME = CANVAS.getContext("2d");


GAME.fillStyle ='white';
CANVAS.width  = window.innerWidth;
CANVAS.height = window.innerHeight;




//cargando recursos
window.onload=function(e)
              {
		  //cargar propiedades para el canvas
		   Mouse.Box= ccl.Mouse.Box=CANVAS.getBoundingClientRect();
		  //Configurar el tamaño del canvas con respecto al tamaño del navegador
		  WINDOW.Init();
		  //Inicializar configuracion del texto
		  Texto.Init();
		  //Carga de Sprites
   		    //backgrounds
		    for(var i=1;i<=2;i++)
		    {	
			img= new Image();
 			img.src="sprites/back"+i+".jpg";
  			Plataform.Sprite.Index.push(img);
  			img=null;
		    }	
		   //INTF
		    //Titulo
		    img=new Image();
		    img.src="sprites/Title.png";
		    Intf.Sprite.Index.push(img);  
		    img=null;
		    //Panel
		    img= new Image();
		    img.src="sprites/panel2.png";
		    Intf.Sprite.Index.push(img);
		    img=null;
		    //botones
		    for(var i=1;i<=4;i++)
		    {	
			img= new Image();
			img.src="sprites/btn"+i+".png";
			Intf.Sprite.Index.push(img);
			img=null;
		    }

		    Intf.Init();
		   //Games
		    Games.Init();
		      //la baraja
		      for(var i=1;i<=3;i++)
                      {
			 img=new Image();
			 img.src="sprites/baraja"+i+".png";
			 Games.Deck.Sprite.Index.push(img);
			 img=null;
		      }	
		      //source
		      //barras de puntuacion
  		      for(var i=1;i<=7;i++)
                      {

		          img=new Image();
		          img.src="sprites/bar"+i+".png";			  
			  Games.Source.Index.push(img);
  			  img=null;
		      }  
		    //Intf2
    		    Intf2.Init();
		      //otros tipos de imagenes
		        //GIFS
  		        for(var i=1;i<=4;i++)
                        {

		            img=new Image();
		            img.src="sprites/game"+i+".png";
			    Intf2.Source.Index.push(img);
  			    img=null;
		        }  

		     //Interfaz de Data(para obtener datos guadados de las partidas jugador)  
		     DataIntf.Init();
		    
		  };



//En Juego

//--------------------------------ENTRADA------------------------------

//Eventos del Mouse y del Touch
/*
La funcion general de entrada es la que recibe datos de entrada de ciertos elementos fisicos
los cuales son llevados a los objetos principales del juego.
Los datos obtenidos de entrada son otorgados por los eventos por lo que cada uno es particular, por lo tanto todos los evento deben tener la siguiente funcion mas su respectiva informacion.
*/
//funcion general de entrada de datos
                       function Input(e)
                       {

			 if(!DataIntf.Enabled)   
			   {    
			       Mouse.getXYPosition(e);
			       ccl.Mouse.getXYPosition(e);
			       //ROOMS
  			       switch(Room.Index)
			       {
			       case 0://menu principal
				   Intf.Input();
				   break;
				   
			       case 1:
			      	   Intf2.Input();
				   break;
			       case 2://el juego seleccionado
			           Games.Input();
				   break;
				   
			       }
  			       Mouse.Click=false;
                        }
                       }
//Funcion secundaria para el ingreso de datos
         function Input2(e)
         {

	     Mouse.getXYPosition(e);
	     ccl.Mouse.getXYPosition(e);
	     if(Games.Play>1)
             {   
		 Mouse.Pressed=true;	  
		 Games.Index[Games.Play].Board.Scroll();
		 try
		 {
		     Games.Index[Games.Play].Player[0].Panel.Scroll();
		 }
		 catch(evt)
		 {
		     //alert("normal");
		 }
	     }	 
	 }
//click
/*
  Nota: este evento se ejecuta cuando hago click y suelto el mouse
*/
document.onclick= function (e) { 
                                Mouse.Click=true;                           
                                     Input(e); 
				     //codigo propio de este evento                               
                                Mouse.Pressed=false;
                               }; 

//movimiento 
document.onmousemove= function (e) {
                                   Mouse.Move=true; 
                                   //Games.Index[0].Board.Scroll();  
                                   Input(e);

				   };         
//presionando el click
/*
  Nota: este evento se ejecuta cuando hago click exactamente
*/
document.onmousedown= function(e)
                               {
				   Input2(e);
			       }; 
//para dispositivos moviles

//toque del movil 
document.addEventListener("touchstart",function(e){Input2(e);});

//movimiento del dedo en el movil
document.addEventListener("touchmove",function(e){Mouse.Move=true;                                   
						 Input(e);});

//document.onmouseup= function(e)
                      


                       


//-----------------------SALIDA----------------------------------
setInterval(function ()
                 {

		    GAME.clearRect(0,0,CANVAS.width,CANVAS.height);
                   //BACKGROUND
                    Plataform.Output();
		   //ROOMS
		   switch(Room.Index)
		   {
		       case 0: //menu principal
		        Texto.Style();
		        Intf.Output();
		        DataIntf.Output();
		       break;
		       case 1://menu de seleccion de juegos
		        Intf2.Output();
		       break;
		       case 2://el juego seleccionado
		        Games.Output();
		       break;
		   }


	 	    //ccl.Mouse.Output(CANVAS);
	  	     Mouse.Click=false;
		     Mouse.Move=false;
		 },Room.Speed);


//Testeo
//alert(ccl.var_dump(P1));
//alert(P1.life);
//alert(P1 instanceof Items);
//alert(P1 instanceof Character);
