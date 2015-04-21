/*
  MODELO OBJETO
 Declaracion de todos los objetos a usar en el juego
*/


function Sprite()
{

  this.Index=Array();
  this.Draw= function(subimg,X,Y,Width,Height,PartX,PartY,PartW,PartH)
             {             
		 PartX= PartX || 0;
		 PartY= PartY || 0;
		 PartW= PartW || 0;
		 PartH= PartH || 0;
		 
		 if(PartX + PartY +  PartW + PartH ==0)
		       GAME.drawImage(this.Index[subimg],X,Y,Width,Height);
		       
		 else 
                     GAME.drawImage(this.Index[subimg],PartX,PartY,PartW,PartH,X,Y,Width,Height);  
		 
             };
    this.Draw_ext=function (subimg,X,Y,Width,Height,PartX,PartY,PartW,PartH,Rotation)
                   {

		    GAME.save();
		       GAME.translate(X,Y);
		       GAME.rotate(Rotation*Math.PI/180);
		       if(PartX==false && PartY==false && PartW==false && PartH==false)
			   this.Draw(subimg,0,0,Width,Height);
		       else
   			   this.Draw(subimg,0,0,Width,Height,PartX,PartY,PartW,PartH);

		    GAME.restore();   
		   }
       
}

function Objeto(Width,Height,X,Y)
{
  this.X=X || 0;
  this.Y=Y || 0;
  this.Width=Width || 0;
  this.Height=Height || 0;
/*colision entre objetos (Tienen que tener la misma estructura)
o pertenecer al mismo padre o clase
*/
  this.Collision= function (other,npoints)
                  {
		    npoints=npoints || 4; //puntos de colision  
		      
		    colision=false;//sin colision por defecto
		    with(other)
		    {
			//puntos de colision
			Points=Array();
			Points.push(Array(X,Y));
			Points.push(Array(X+Width,Y+Height));
			
			
			for(var i=0;i<1;i++)
			    for(var ii=0;ii<1;i++)
			    {
		      
		 if(Points[i][0]>this.X && Points[i][0]<this.X+this.Width && Points[ii][1]>this.Y && Points[ii][1]<this.Y+this.Height)	
		     colision=true;
		     
		     //si se ha leido todos los puntos
			     npoints--;
			     if(!npoints)
				{ i=2;
				  break;}
			    }
		    }	
		      /*
		       Retorna true si existe una colision entre instancias y false si no existe.
		       */
		      return colision;
		      
		  }
}


//OBJETOS

//Objeto Usuario
/*
  En este objeto se cargan todos los datos pedidos por el juego para su puntuacion
*/
User={
	"Name":"NoName",
	"Points":0,
	"SetData": function(Data)
	           {//setear la data en el objeto user
		     Data=Data.split(" ");  
		     this.Name=Data[0];
		     this.Points=Number(Data[1]);  
		   },
        "AddPoints":function(Pts)
                   {//agregar puntos a su score actual
       		       if(this.Name)
			  { 
			   this.Points+=Pts;
			   this.SaveData();
			  }    
		   }, 
	"SaveData": function()
	           {//grabar la data en la memoria de la pc
		       if(this.Name)
			   localStorage.CMadness=this.Name+" "+this.Points;
		   }
    };
//Objeto Mouse
Mouse={
       "X":0,
       "Y":0,
       "Width":0,
       "Height":0,
       "Box":null,
       "Click":false,
       "Move":false,
       "Pressed":false,
        "getXYPosition": function(evt)
                              {
				  try
				    {

		    			this.X=evt.clientX - this.Box.left;
		    			this.Y=evt.clientY - this.Box.top;		

		     		   	if(evt.clientX==undefined)
					    throw "movil"; 
				    }
				  catch(err)
				    {

					if(evt.targetTouches.length)
					   { 
					    this.X=evt.targetTouches[0].pageX - this.Box.left;
		    			    this.Y=evt.targetTouches[0].pageY - this.Box.top;
					    }   

				    }   
			      }
       /*Api Touch Aqui*/
      };


//Interfaz del menu principal

Intf={
       "Controles":{
     	            "Title":new Objeto(),
	            "Btn": Array(),
	            "Panel":new Objeto()
                   },
       "Sprite":new Sprite(),//0 Titulo 1 Btn1
       "Init":  function()
                {//funcion Inicial
		    //para el titulo
		    this.Controles.Title.X=(WINDOW.Width/2)-200*WINDOW.WPercent;
		    this.Controles.Title.Y=(WINDOW.Height/10)-45*WINDOW.HPercent;
		    this.Controles.Title.Width=400*WINDOW.WPercent;
    		    this.Controles.Title.Height=120*WINDOW.HPercent;
		    //para los botones
		  for(var i=0;i<3;i++)
		   {   
	            this.Controles.Btn.push(new Objeto(200*WINDOW.WPercent,50*WINDOW.HPercent,(WINDOW.Width/2)-100*WINDOW.WPercent,(WINDOW.Height/4)+30*WINDOW.HPercent+(i*55*WINDOW.HPercent)));
		    this.Controles.Btn[i].SubImg=2;   
		   }   
	            //para el panel

		    Panel=this.Controles.Panel;//lo mismo que with
		    Panel.X=0;
		    Panel.Y=0;
		    Panel.Width=CANVAS.width;
		    Panel.Height=CANVAS.height;
		    Panel.Enabled=false;

		    Panel.Intf=Array(); //cada Panel tiene sus propia interfaz con sus propios elementos               
		 
		    Panel.Show=0;//0 Opciones,1 Informacion
		       //Intf del panel Opciones [0]
		     Panel.Intf.push({
		                     "Btn":Array (new Objeto(200*WINDOW.WPercent,50*WINDOW.HPercent,(WINDOW.Width/2)-100*WINDOW.WPercent,(WINDOW.Height)-(55*WINDOW.HPercent)),
					new Objeto(120*WINDOW.WPercent,40*WINDOW.HPercent,70*WINDOW.WPercent,90*WINDOW.HPercent),
				        new Objeto(120*WINDOW.WPercent,40*WINDOW.HPercent,190*WINDOW.WPercent,90*WINDOW.HPercent),
				        new Objeto(120*WINDOW.WPercent,50*WINDOW.HPercent,70*WINDOW.WPercent,210*WINDOW.HPercent) //boton de musica	  
						 ),
			               "Input": function()
			                        {
						    


						  //salir del panel  
						  if (this.Btn[0].Collision(Mouse,1)) //si es clickeado
      	 					     {
							 
							 Intf.Controles.Panel.Enabled=!Mouse.Click;

						      this.Btn[0].SubImg=3;   

						     }//si no es clickeado
						   else //al seguir estando en el panel
						     {  this.Btn[0].SubImg=2;   
							Collisioning=false;
							ID=0;
							//ver si esta colisionando con el mouse y aplicar cambiosfalse
							if(Mouse.Click)
							   { 
							    for(var i=1;i<this.Btn.length-1;i++)
								if(!Collisioning)
                     				                {
							    
								    if(this.Btn[i].Collision(Mouse,1))
								    { 
	     								Collisioning=true;
									ID=i;							
									Texto.Idioma=i-1;	
									i=0;
								    }	
							        }
                        			                else								    
								    this.Btn[i].SubImg=(ID==i?5:4);

							       if(this.Btn[3].Collision(Mouse,1))
								   {
								       this.Btn[3].SubImg=(this.Btn[3].SubImg<6? this.Btn[3].SubImg+1 :4);
								       //manipular el volumen del audio
								       switch(this.Btn[3].SubImg)
								       {
									   case 4://full
									   Games.Sound.volume=1;
									   break;
									   case 5:
									   Games.Sound.volume=0.5;
									   break;
									   case 6:
									   Games.Sound.volume=0.0;
									   break;
								       }

								   }    
							   }	    
						     }
						},
				       "Output": function()
				                {
						        
							//titulo del panel   
							Texto.Output(1,50*WINDOW.WPercent,50*WINDOW.HPercent);   
						        //Idioma:
							Texto.Output(4,70*WINDOW.WPercent,80*WINDOW.HPercent);   
						        //Musica:
							Texto.Output(17,70*WINDOW.WPercent,190*WINDOW.HPercent);   
						    for(var i=0;i<this.Btn.length;i++)
						    {	
						        Btn=this.Btn[i];
							Intf.Sprite.Draw((i!=3? Btn.SubImg: 4),Btn.X,Btn.Y,Btn.Width,Btn.Height);
							if(i!=3)
							    Texto.Output((i? 4+i:3),Btn.X+(Btn.Width/2)-(40*WINDOW.WPercent),Btn.Y+(Btn.Height/2));
							else
							    Games.Source.Draw(Btn.SubImg,Btn.X+Btn.Width/4,Btn.Y+5,Btn.Width/2,40*WINDOW.HPercent);
						    }
						}
		                        });
		          //setear subimg a los botones
		            Panel.Intf[0].Btn[0].SubImg=2;//Valor inicial de la animacion del boton del panel
	                    Panel.Intf[0].Btn[1].SubImg=4;
		            Panel.Intf[0].Btn[2].SubImg=5;
		            Panel.Intf[0].Btn[3].SubImg=4;//boton de volumen de sonido
		    //Intf del Panel informacion[1]
		     Panel.Intf.push({
		                     "Btn":Array (new Objeto(200*WINDOW.WPercent,50*WINDOW.HPercent,(WINDOW.Width/2)-100*WINDOW.WPercent,(WINDOW.Height)-(55*WINDOW.HPercent)) ),
			             "LabelDat":Array("Card Madness:#Desarrollador: Carlos Chavez Laguna.#Musico: BoxCat Games.","Card Madness#Developer: Carlos Chavez Laguna.#Musician: BoxCat Games."), 
			             "LabelDes":Array("Juegos de cartas a su gusto en distintos niveles.Obtenga muchos puntos como pueda,supera la valla de los 7000 puntos para obtener el derecho a jugar contra la maquina en su maximo nivel.",
						   "Card games as you would like in differents levels,Get a lot of points as you can,overcome the limit of 7000 points to obtain the pass to play against the machine in the most difficult level."),
			              "Init":function()
			                    {
						
						GAME.font=""+Math.floor(20*WINDOW.WPercent)+"px  sans-serif";
						MaxAncho=Math.floor(CANVAS.width-140*WINDOW.WPercent);
						for(var i=0;i<this.LabelDes.length;i++)
						    this.LabelDes[i]=ccl.Text.Multiline(this.LabelDes[i],MaxAncho);

				            },
			               "Input": function()
			                        {
						  //salir del panel  
						  if (this.Btn[0].Collision(Mouse,1)) //si es clickeado
      	 					     {
							 
							 Intf.Controles.Panel.Enabled=!Mouse.Click;

						      this.Btn[0].SubImg=3;   

						     }//si no es clickeado
						   else //al seguir estando en el panel
						     {  this.Btn[0].SubImg=2;   
						    
						     }
						},
				       "Output": function()
				                {
						        
							//titulo del panel   
							Texto.Output(2,50*WINDOW.WPercent,50*WINDOW.HPercent);   
						    //datos del desarrollador etc
						    Datos=this.LabelDat[Texto.Idioma];
						    Datos=Datos.split("#");
						    for(var i=0;i<Datos.length;i++)
							Texto.Output(0,70*WINDOW.WPercent,(70+(i? 10:0)+i*20)*WINDOW.HPercent,Datos[i]);
						    
						    //descripcion del juego
						    Text=this.LabelDes[Texto.Idioma];						      
						    if(typeof Text =="object")
							for(var i=0;i<Text.length;i++)							
						            Texto.Output(0,70*WINDOW.WPercent,(150+20*i)*WINDOW.HPercent,Text[i]);
						    else
							Texto.Output(0,70*WINDOW.WPercent,150*WINDOW.HPercent,Text);

						    //renderizacion de los botones
						    for(var i=0;i<this.Btn.length;i++)
						    {	
						        Btn=this.Btn[i];
							Intf.Sprite.Draw(Btn.SubImg,Btn.X,Btn.Y,Btn.Width,Btn.Height);
							Texto.Output((i? 4+i:3),Btn.X+(Btn.Width/2)-(40*WINDOW.WPercent),Btn.Y+(Btn.Height/2));
						    }
						}
		                        });
		    
		          //setear subimg a los botones
		            Panel.Intf[1].Btn[0].SubImg=2;//Valor inicial de la animacion del boton del panel
		            Panel.Intf[1].Init();
	            
		    delete Panel;		  
		},
       "Input": function()
               {//funcion de entrada
		   nbtn=null;
		  //Mascara de colision

		   if(!this.Controles.Panel.Enabled)
		    {   //si no se ejecuta un ponel se ejecuta la mascara de la ventana normal
		       for(var i=0;i<3;i++)
		         if(this.Controles.Btn[i].Collision(Mouse,1))
			  {  
			      this.Controles.Btn[i].SubImg=3;
			      if(Mouse.Click) 
				nbtn=i;
			  } 
			else
   			      this.Controles.Btn[i].SubImg=2;
		    }	
		   else 
		   {    // si se ejecuta un panel hay una nueva mascara de colision
		     this.Controles.Panel.Intf[this.Controles.Panel.Show].Input();
		   
		   }
		   //depende del numero de boton que hayas hecho click se hara
		   
		   switch(nbtn)
		   {
		    case 0://Jugar
		       //abrir la interfaz de cuentas de usuario
		       DataIntf.Enabled=true;		       
		       DataIntf.ContinuePanel=true;
		       //Room.Index=1;
		    break;
		    case 1://opciones
		      this.Controles.Panel.Enabled=true; 
		      this.Controles.Panel.Show=0;
		    break;
		    case 2://Informacion
		      this.Controles.Panel.Enabled=true; 
		      this.Controles.Panel.Show=1;
		      
		    break;   
		   }

	       },
       "Output":function()
                {//funcion de salida
		    

		    with(this.Controles)
		    {	 
			this.Sprite.Draw(0,Title.X,Title.Y,Title.Width,Title.Height);
		    //botones con sus Labels
   		       for(var i=0;i<Btn.length;i++)
			{   
		            this.Sprite.Draw(Btn[i].SubImg,Btn[i].X,Btn[i].Y,Btn[i].Width,Btn[i].Height);
			    Texto.Output(i,Btn[i].X+(Btn[i].Width/2)-((i+1)*(21-i)*WINDOW.WPercent),Btn[i].Y+(Btn[i].Height/2));
		   //Panel
			if(Panel.Enabled)
			   { 
			     this.Sprite.Draw(1,Panel.X,Panel.Y,Panel.Width,Panel.Height);
			     Panel.Intf[Panel.Show].Output();
			   }   

			}
			
                    }
		}
     };
//Interfaz 2 (seleccion de juegos)
/*
  Configuracion, propiedades y entrada al juego en si
 */

Intf2={
    "Source": new Sprite(),//cualquier tipo de imagen
    "Controls": {
	         "Animation": undefined,
	         "Selection":{
		             "Btns": Array(), 
		             },//botones de seleccion
	         "BtnStart": new Objeto(),//boton especificamente para iniciar el juego
	         "BtnBack": new Objeto(),//boton para regresar al room anterior
	         "BtnIns": new Objeto(),//boton para abrir el manual de instrucciones del juego actual
	         "PanelIns": {
		              "Enabled":false,
		              },//panel de instrucciones
	         "SelectLevel":{}
                },
    "Init": function()
    {

	//Inicializar controles
	//Boton empezar
	BtnStart=this.Controls.BtnStart;
	BtnStart.SubImg=2;
	BtnStart.Width=230*WINDOW.WPercent;
	BtnStart.Height=80*WINDOW.HPercent
	BtnStart.X=CANVAS.width/2;
	BtnStart.Y=CANVAS.height-BtnStart.Height;
	BtnStart.Input=function()
	               {
			   if(this.Collision(Mouse,1))
			    {   
				if(Mouse.Move)
				    this.SubImg=3;
				
				if(Mouse.Click)//ir al tercer room de los juegos
				    {
					Room.Index=2;
					Mouse.Pressed=false;
					Mouse.Click=false;
					Mouse.Move=false;
					Games.Reset(Intf2.Controls.SelectLevel.Level);
					
				    }	
				    //alert("Vas a jugar: "+Games.Index[Games.Play].Name);

		            }		
			   else
  			    this.SubImg=2;
			   
		       };
	BtnStart.Draw=function()
	               {
			Intf.Sprite.Draw(this.SubImg,this.X,this.Y,this.Width,this.Height);
  			Texto.Style(Texto.Font.Family,24*WINDOW.WPercent+"px","white");
			Texto.Output(9,(Texto.Idioma*30*WINDOW.WPercent)+this.X+(this.Width/4),this.Y+(this.Height/2));			   
		       };
	//Boton Atras
	BtnBack=this.Controls.BtnBack;
	BtnBack.SubImg=2;
	BtnBack.Width=100*WINDOW.WPercent;
	BtnBack.Height=50*WINDOW.HPercent
	BtnBack.X=20*WINDOW.WPercent;
	BtnBack.Y=CANVAS.height-BtnBack.Height;
	BtnBack.Input=function()
	               {
			   if(this.Collision(Mouse,1))
			    {   
				if(Mouse.Move)
				    this.SubImg=3;
				
				if(Mouse.Click)//ir al tercer room de los juegos
				    Room.Index=0;
				    //alert("Vas a jugar: "+Games.Index[Games.Play].Name);

		            }		
			   else
  			    this.SubImg=2;
			   
		       };
	BtnBack.Draw=function()
	               {
			Intf.Sprite.Draw(this.SubImg,this.X,this.Y,this.Width,this.Height);
  			Texto.Style(Texto.Font.Family,24*WINDOW.WPercent+"px","white");
			Texto.Output(10,+this.X+(this.Width/5),this.Y+(this.Height/1.7));			   
		       };
	
	//Botones de seleccion seleccion
	Selection=this.Controls.Selection;
	
	for(var i=0;i<Games.Index.length;i++)
	    {
		Selection.Btns.push(new Objeto(130*WINDOW.WPercent,55*WINDOW.HPercent,20*WINDOW.WPercent,0));
		Selection.Btns[i].Y=i*Selection.Btns[i].Height+Selection.Btns[i].Height/2+(i? i*5*WINDOW.HPercent :0);
		
		Selection.Btns[i].Text=(typeof Games.Index[i].Name=="object"? Games.Index[i].Name[Texto.Idioma] : Games.Index[i].Name);
		Selection.Btns[i].Selected= !Boolean(i);//type casting (constructor de booleanos)
            }		
	Selection.Input= function()
	                 {
			     Collisioning=false;
			     ID=0;
			     //ver si esta colisionando con el mouse
			     for(var i=0;i<this.Btns.length;i++)
				 if(this.Btns[i].Collision(Mouse,1))
				    { 
	     				Collisioning=true;
					ID=i;
			
			            }	
	
			     //aplicar cambios
			     if(Collisioning && Mouse.Click)
				{ 
				 for(var i=0;i<this.Btns.length;i++)	     
				     this.Btns[i].Selected=ID==i;

		    		Games.Play=ID;	
				}
				     
			 };
	Selection.Output= function()
	                  {
			      for(var i=0;i<this.Btns.length;i++)
				  {
				      Intf.Sprite.Draw((this.Btns[i].Selected?5:4),this.Btns[i].X,this.Btns[i].Y,this.Btns[i].Width,this.Btns[i].Height);
				      this.Btns[i].Text=(typeof Games.Index[i].Name=="object"? Games.Index[i].Name[Texto.Idioma] : Games.Index[i].Name);
				      if(this.Btns[i].Text.length<=7)
	    				  Texto.Style(Texto.Font.Family,24*WINDOW.WPercent+"px","white");
				      else	  
		    			  Texto.Style(Texto.Font.Family,16*WINDOW.WPercent+"px","white");
				      
				      Texto.Output(0,this.Btns[i].X+10*WINDOW.WPercent,this.Btns[i].Y+(this.Btns[i].Height/1.7),this.Btns[i].Text);
				  }    
			  };

      //crear control de animacion
	this.Controls.Animation=   {
   				     "Timer": new Timer(Room.Speed),
				     "Frame":0,
				     "X":CANVAS.width/2-CANVAS.width/8,
				     "Y":10*WINDOW.HPercent,
				     "W":CANVAS.width/2,
				     "H":CANVAS.height/2.2,
 				     "Play": function(img) 
				     {
					 // si no se ha deifinidio creamos una variable
					 MaxFrame=(Intf2.Source.Index[img].width/480)-1;
					 if(this.Timer.Alarm(1000))
					     this.Frame=(this.Frame>=MaxFrame? 0 : this.Frame+1);
					 this.Frame=(this.Frame>MaxFrame? 0: this.Frame);
					 Intf2.Source.Draw(img,this.X,this.Y,this.W,this.H,this.Frame*480,0,480,320);	


				     }
				 };
	//BtnIns
	BtnIns=this.Controls.BtnIns;
	BtnIns.SubImg=2;
	BtnIns.Width=150*WINDOW.WPercent;
	BtnIns.Height=40*WINDOW.HPercent
	BtnIns.X=this.Controls.Animation.X+(this.Controls.Animation.W/2)-(BtnIns.Width/2);
	BtnIns.Y=CANVAS.height/2-BtnIns.Height/2;
	BtnIns.Input=function()
	               {
			   if(this.Collision(Mouse,1))
			    {   
				if(Mouse.Move)
				    this.SubImg=3;
				
				if(Mouse.Click)//ir al tercer room de los juegos
				    Intf2.Controls.PanelIns.Enabled=true;
				    

		            }		
			   else
  			    this.SubImg=2;
			   
		       };
	BtnIns.Draw=function()
	               {
			   Intf.Sprite.Draw(this.SubImg,this.X,this.Y,this.Width,this.Height);
  			   Texto.Style(Texto.Font.Family,16*WINDOW.WPercent+"px","white");
			   Texto.Output(16,this.X+(this.Width/6),this.Y+(this.Height/2));			   
		       };

	//botones de dificultad
	  //calcular tamaño de botones
	tam=3;//numero de botones
	BtnB=this.Controls.Selection.Btns[0];
	X=BtnB.X+BtnB.Width+20*WINDOW.WPercent;
	WIDTH=(CANVAS.width-X-40*WINDOW.WPercent)/tam;
	this.Controls.SelectLevel.Btns=Array();
	  //variable del nivel actual
	this.Controls.SelectLevel.Level="easy";
	for(var i=0;i<tam;i++)
	    {
		this.Controls.SelectLevel.Btns.push(new Objeto(WIDTH,40*WINDOW.HPercent,X+i*(WIDTH+5),CANVAS.height/1.7));
		this.Controls.SelectLevel.Btns[i].Selected=!Boolean(i);
	    }

		this.Controls.SelectLevel.Input= function()
	                 {
			     Niveles=Array("easy","normal","hard","madness");
			     Collisioning=false;
			     ID=0;
			     //ver si esta colisionando con el mouse y aplicar cambiosfalse
			     if(Mouse.Click)
				 for(var i=0;i<this.Btns.length;i++)
				     if(!Collisioning)
                     		     {   
					 if(User.Points<7000 && i==2)
					     continue;
					 if(this.Btns[i].Collision(Mouse,1))
					 { 
	     				     Collisioning=true;
					     ID=i;
					     this.Level=Niveles[i];
					     i=-1;
					 }	
				     }
                        	     else
					 this.Btns[i].Selected=ID==i;



				     
			 };
	
	this.Controls.SelectLevel.Output=function()
	                                 {

				             for(var i=0;i<tam;i++)
						 {
						     Intf.Sprite.Draw((this.Btns[i].Selected?5:4),this.Btns[i].X,this.Btns[i].Y,this.Btns[i].Width,this.Btns[i].Height);
	     		    			     Texto.Style(Texto.Font.Family,16*WINDOW.WPercent+"px",(User.Points<7000 && i==2?"red":"white"));
						     Texto.Output(12+i,this.Btns[i].X+(this.Btns[i].Width/3.4),this.Btns[i].Y+(this.Btns[i].Height/1.7));
						 }

					 };

	//panel de instrucciones
	this.Controls.PanelIns.Btn= new Objeto(200*WINDOW.WPercent,50*WINDOW.HPercent,(WINDOW.Width/2)-100*WINDOW.WPercent,(WINDOW.Height)-(55*WINDOW.HPercent));
	this.Controls.PanelIns.Btn.SubImg=2;
	this.Controls.PanelIns.Input=function()
	                               {
					   if(this.Btn.Collision(Mouse,1))
					       { 
						   this.Btn.SubImg=3;
						   
						   if(Mouse.Click)
						       this.Enabled=false;
					       }
					   else
						   this.Btn.SubImg=2;
				       };
	this.Controls.PanelIns.Output=function()
	                              {
					      //fondo	
					     Intf.Sprite.Draw(1,0,0,CANVAS.width,CANVAS.height);

					  //titulo
					  Texto.Output(16,40*WINDOW.WPercent,60*WINDOW.HPercent);
					  //nombre del juego
					  try
					  {    
					      if(typeof Games.Index[Games.Play].Name != "object")
						  throw "error";
				              Texto.Output(0,60*WINDOW.WPercent,100*WINDOW.HPercent,Games.Index[Games.Play].Name[Texto.Idioma]+":");
					  }    
					  catch (err)
					  {
				              Texto.Output(0,60*WINDOW.WPercent,100*WINDOW.HPercent,Games.Index[Games.Play].Name+":");
					  }     
					     //renderizar las instrucciones del juego actual
					  for(var i=0;i<Games.Index[Games.Play].Instructions[Texto.Idioma].length;i++)
					      Texto.Output(0,60*WINDOW.WPercent,(120+i*20)*WINDOW.HPercent,Games.Index[Games.Play].Instructions[Texto.Idioma][i]);

					  //renderizar boton de aceptar
					     Btn=this.Btn;
					     Intf.Sprite.Draw(Btn.SubImg,Btn.X,Btn.Y,Btn.Width,Btn.Height);
					     Texto.Output(3,Btn.X+(Btn.Width/2)-(40*WINDOW.WPercent),Btn.Y+(Btn.Height/2));
				      };
	
    },
    "Input": function()
    {
	if(!this.Controls.PanelIns.Enabled)
	  {   
	      this.Controls.BtnStart.Input();
	      this.Controls.BtnBack.Input();
	      this.Controls.BtnIns.Input();
	      this.Controls.Selection.Input();
	      this.Controls.SelectLevel.Input();
	  }
	else
	    this.Controls.PanelIns.Input();
    },
    "Output": function()
    {

	Intf.Sprite.Draw(1,0,0,CANVAS.width,CANVAS.height);
	try
	{		 
	    Intf2.Controls.Animation.Play(Games.Play);
	    //Games.Index[Games.Play].Intf.Output();
	}    
	catch(err)
	{

	}    
	this.Controls.BtnStart.Draw();
	this.Controls.BtnBack.Draw();
	this.Controls.BtnIns.Draw();
	this.Controls.Selection.Output();
	this.Controls.SelectLevel.Output();

	//Datos del Usuario
	if(User.Name)
	    {
		Texto.Style(Texto.Font.Family,16*WINDOW.WPercent+"px","white");
		Texto.Output(0,30*WINDOW.WPercent,20*WINDOW.HPercent,User.Name+" ("+User.Points+"pts)");
	    }
	//panel de instrucciones
	if(this.Controls.PanelIns.Enabled)
	    {
		Texto.Style(Texto.Font.Family,(20*WINDOW.WPercent)+"px","white");
		this.Controls.PanelIns.Output();
            }		
    }
    
      };




 //Texto en diferentes Idiomas (0:Español, 1:Ingles)
Texto={
       "Idioma":1,
       "Label":Array(),
       "Font":{
	       "Family":"sans-serif",
	       "Size":20,
	       "Color":"white"
               },
       "Init": function()
             {
	      //Configurando Stilos
		 this.Font.Size=Math.floor(20*WINDOW.WPercent);
	
	      //español 
	      this.Label.push(Array());	 
	      this.Label[0].push("Jugar");
              this.Label[0].push("Opciones");	 	 
	      this.Label[0].push("Informacion");
	      this.Label[0].push("Aceptar");
		 //opciones
		 this.Label[0].push("Idioma:");
		 this.Label[0].push("Español");
		 this.Label[0].push("Ingles");
		 //puntuacion
		 this.Label[0].push("Puntuacion Final:");
 		 this.Label[0].push("Ganador:");
		 //Menu seleccion
 		 this.Label[0].push("Empezar");
		 this.Label[0].push("Atras");
		 //otros
		 this.Label[0].push("Retornar al menu de seleccion");
		 //Niveles
		 this.Label[0].push("Facil");
		 this.Label[0].push("Normal");
		 this.Label[0].push("Dificil");
		 this.Label[0].push("Madness");
		 this.Label[0].push("Instrucciones");
		 this.Label[0].push("Musica");
	      //Ingles
	      this.Label.push(Array());	 
	      this.Label[1].push("Play");
              this.Label[1].push("Options");	 	 
	      this.Label[1].push("Information");
	      this.Label[1].push("Accept");		 
		 //options
		 this.Label[1].push("Language:");
		 this.Label[1].push("Spanish");
		 this.Label[1].push("English");
		 //Score
		 this.Label[1].push("Final Score:");
		 this.Label[1].push("Winner:");
		 //Selection Menu
		 this.Label[1].push("Start");		 
		 this.Label[1].push("Back");
		 //others
 		 this.Label[1].push("Return to the selection menu");
		 //levels
 		 this.Label[1].push("Easy");
 		 this.Label[1].push("Normal");
 		 this.Label[1].push("Hard");
 		 this.Label[1].push("Madness");
 		 this.Label[1].push("Instructions");
		 this.Label[1].push("Music");
	     },
       "Output": function(label,X,Y,str)
             {
	      texto=  str || this.Label[this.Idioma][label];	 
   	      GAME.fillText(texto,X,Y);
	     },
       "Style": function(fontfamily,fontsize,color)//stilo que tendra el texto
             {
		  GAME.fillStyle =color || this.Font.Color;		     

		  GAME.font= (fontsize && fontfamily ? fontsize+" "+fontfamily : this.Font.Size+"px  "+this.Font.Family);


		 
	     }
      };


//Variables Globales del juego
Room={"Index":0, "Speed":50};



//Plataforma del juego
Plataform={

          "Sprite":new Sprite(),
          "Output":function()
                 {
		     
		     //dibujar el background
		     this.Sprite.Draw((Room.Index? 1 :0),0,0,CANVAS.width,CANVAS.height);
		  
		 }
    

          };



//Variable global del juego que indica resolucion y otras configuraciones
WINDOW={
       "Width":0,
       "Height":0,
       "DHeight":0,
       "DWidth":0,
       "WPercent":0.0,
       "HPercent":0.0,
       "Init": function()
               {
		 with(this)
		 {    
		  CANVAS.width  = window.innerWidth;
		  CANVAS.height = window.innerHeight;
		  Width= CANVAS.width;
		  Height= CANVAS.height;
		  DWidth=Math.abs(Width-480);
		  DHeight=Math.abs(Height-320);
		  WPercent=1+DWidth/Width; 
		  HPercent=1+DHeight/Height;   
		    // alert("W: "+WPercent+"H: "+HPercent);
		 } 
		   
	       }
       };



//EL JUEGO EN SI
Games={
       "Deck": new Objeto(),//baraja de cartas
       "Source":new Sprite(),//algunos recursos como sprite
       "Sound": null,//Cargar musica del juego
       "Index": Array(),//Juegos Disponibles
       "Play": 0,//el juego que se esta jugando ahora
       "Reset": function(level)//resetear juego
                {
			this.Index[this.Play].Reset(level);		 
		}, 
       "Init":  function()  
                {
                   //Cargar musica
		    this.Sound= new Audio("music/mtfox.mp3");
		    this.Sound.play();
		    this.Sound.addEventListener('ended', function() {
			this.currentTime = 0;
			this.play();
		    });
		    
		  //Configuracion de la baraja  
		   Deck=this.Deck;
		   Deck.Width=CANVAS.width;
		   Deck.Height=CANVAS.height;
		   Deck.X=0;
		   Deck.Y=0;
		   Deck.Sprite=new Sprite(); //su clase de sprites
		   Deck=null; 
		 //Configuracion de los juegos
		    //memoria
		    this.Index.push(Memoria);
//		    alert("holi");
		    //mano nerviosa
		    this.Index.push(Nerviosa);

                    //casino
		    this.Index.push(Casino);
		    //Del Uno Al Siete
		    this.Index.push(UnoAlSiete);

		    //Setear el juego memoria
		    for(var i=0;i<this.Index.length;i++)
			this.Index[i].Init();

		    //crear multilinea de las instrucciones
		    GAME.font=""+Math.floor(20*WINDOW.WPercent)+"px  sans-serif";		    
		    MaxAncho=Math.floor(CANVAS.width-120*WINDOW.WPercent);
		    for(var i=0;i<this.Index.length;i++)
			for(var ii=0;ii<2;ii++)			    
			    this.Index[i].Instructions[ii]=ccl.Text.Multiline(this.Index[i].Instructions[ii],MaxAncho);
			   


		},
       "Input": function()
                {
		    this.Index[this.Play].Input();
		},
       "Output":function()
                {
		 
		   //toda la baraja
		   // this.Deck.Sprite.Draw(0,this.Deck.X,this.Deck.Y,this.Deck.Width,this.Deck.Height);
		   //una carta
		   // this.Deck.Sprite.Draw(0,this.Deck.X,this.Deck.Y,225,315,1,1,225,315);
		   //la parte trasera de la carta
		   // this.Deck.Sprite.Draw(1,this.Deck.X+225,this.Deck.Y,225,315);
		    //Salida del juego
		    this.Index[this.Play].Output();
		} 
      };

//interfaz para obtencion de data del local stora
//la data es la informacion del usuario acerca de su puntuacion en el juego
DataIntf={
         "Enabled" : false,
         "ContinuePanel":true,
         "Controls": {
	             },  
         "Init": function() 
                 {
		   //Creacion de la interfaz a traves de los nodos de html
		     //Estructura de nodos de html
		     //Inicio

		     //Añadir panel
		     Dad= document.getElementById("Dad");		     
		     Child= document.createElement("div");
		     this.Controls.Panel=Child;
		     with(Child)
	             {
			 with(style)
			 {    
			     position="absolute";
			     width=(400*WINDOW.WPercent)+"px";
			     height=(270*WINDOW.HPercent)+"px";
			     left=((CANVAS.width/2)-(400*WINDOW.WPercent/2))+"px";
			     top=((CANVAS.height/2)-(270*WINDOW.HPercent/2))+"px";
			     opacity="0.9";
			     background="url('sprites/panel2.png') no-repeat";
			     backgroundSize="100% 100%";
			     color="white";
			     fontFamily="helvetica,arial";   
			     fontSize="1.8em"; 
			     display="none";
			 }     

		     }
		     Dad.appendChild(Child);
		     //PANELES varias interfaces que el usuario podra usar
		     
		     this.Controls.Panel.Index=Array();
		     Panel=Array();
		     for(var i=0;i<2;i++)
			{ 
			 Panel.push( document.createElement("div"));		     
			 this.Controls.Panel.Index.push(Panel[i]);
			 Child.appendChild(Panel[i]);
			}   

		     //CONTROLES DEL PANEL1 y 2
		     //añadir label
		      this.Controls.LabelTitle=Array();
		     for(var i=0;i<2;i++)
	             {		 
			 LabelTitle= document.createElement("span");
			 with(LabelTitle)
			 {
			     
			     with(style)
			     {
				 position="absolute";
				 left=(20*WINDOW.WPercent)+"%";   
				 top="10%";
			     }    
			     innerHTML=(i?"Continuar con:":"Ingrese un Nickname");

			 } 		 
			 Panel[i].appendChild(LabelTitle);  
			 this.Controls.LabelTitle.push(LabelTitle);
		     }
		     //añadir Texbox
		     TextNick= document.createElement("input");
		     with(TextNick)
	             {
			 type="text";
			 with(style)
			 {
			     position="absolute";
			     width=(200*WINDOW.WPercent)+"px";
			     height=(40*WINDOW.HPercent)+"px";
			     margin="27%";
			 }    
		     } 		   
		     this.Controls.TextNick=TextNick;
		     Panel[0].appendChild(TextNick);  

		     //añadir boton Ok y Cancel
		     this.Controls.Btns=Array();
		     for(var i=0;i<2;i++)
	 	     {	  
			 BtnOkCancel= document.createElement("button");
			 
			 with(BtnOkCancel)
			 {
			     with(style)
		       	     {
				 position="absolute";
				 width=100*WINDOW.WPercent+"px";
				 height=50*WINDOW.WPercent+"px";  
				 left=(25+i*30)+"%";  
				 top="70%";    

			     } 
			     //caracteristicas de cada uno
			     switch(i)
			     { 
				 case 0:
				 style.fontSize="1.2em";  
				 innerHTML="OK";
				 onclick= function()
                 		          {	
					      
					      //evaluar el string ingresado para ver si es un nick adecuado				 
					      if(DataIntf.Controls.TextNick.value.length>20 || (DataIntf.Controls.TextNick.value.split(" ")).length>=2)
						  DataIntf.Controls.TextNick.value="";
					     else
				             { 		 
						 //Añadir a los datos del juego en el navegador
						 DataIntf.Enabled=false;
						 //crear una nueva cuenta añadiendo los sgtes datos
						 localStorage.CMadness=DataIntf.Controls.TextNick.value+" 0";
						 //setear los datos al objeto usuario
						 User.SetData(localStorage.CMadness);
						 DataIntf.Controls.Panel.style.display="none";
						 Room.Index=1;
					     }
					  };
				 break;
				 case 1:
				 style.fontSize="0.8em";  
				 innerHTML="Cancel";
				 onclick= function()
                    		         {
					     //cancelar y jugar sin cuenta para puntuacion
					     User.Name="";
					     DataIntf.Enabled=false;
					     DataIntf.Controls.Panel.style.display="none";
					     Room.Index=1;
				         };
				 break;
			     }
			 }
			 this.Controls.Btns.push(BtnOkCancel);		 
			 Panel[0].appendChild(BtnOkCancel);  
		     }
		     //CONTROLES DEL PANEL 2
		     //boton cargar datos del usuario  y boton de nuevo usuario
		     for(var i=0;i<2;i++)
	             {		 
			 BtnUser= document.createElement("button");	 
			 with(BtnUser)
	                 {
			     
			     with(style)
			     {
				 position="absolute";
				 width=(250*WINDOW.WPercent)+"px";
				 height=(50*WINDOW.HPercent)+"px";
				 top=(30+i*20)+"%";
				 left="20%";
				 background="black";
				 border="3px inset white";
				 color="white";
				 fontSize="1em";
				 padding="10px 10px 10px 10px";
				 borderRadius="10%";
				 
			     } 	 
			     innerHTML="Nuevo Jugador";
			     
			 }
			 
			 //algunas caracteristicas de cada boton
			 switch(i)
			 {
			     case 0:
			     
			     this.Controls.BtnUser=BtnUser; 
			     BtnUser.onclick=function()
			                     {	
						 //setear data cargada al usuario
						 User.SetData(localStorage.CMadness);
						 //ir a la interfaz de seleccion del juego
						 DataIntf.Enabled=false;				 
						 Room.Index=1;
						 DataIntf.Controls.Panel.style.display="none";
						 
					     }
			     break;
			     case 1:
			     this.Controls.Btns.push(BtnUser);		 
			     BtnUser.onclick=function()
			                     {
						 DataIntf.ContinuePanel=false;				 
						 //delete localStorage.CMadness;
					     };
			     break;
			 }

			 Panel[1].appendChild(BtnUser);
		     }

		     
		     //Fin
		 }, 
         "Traslate": function()//mostrar el texto de los controles en un idioma especifico
                 {

		     switch(Texto.Idioma)
		     {
			 case 0://español
			 this.Controls.LabelTitle[0].innerHTML="Ingrese un Nickname";
			 this.Controls.LabelTitle[1].innerHTML="Continuar con:";
			 this.Controls.Btns[0].innerHTML="OK";
			 this.Controls.Btns[1].innerHTML="Cancelar";		 
			 this.Controls.Btns[2].innerHTML="Nuevo Jugador";
			 break;      
			 case 1://ingles
			 this.Controls.LabelTitle[0].innerHTML="Write a Nickname";
			 this.Controls.LabelTitle[1].innerHTML="Continue with:";
			 this.Controls.Btns[0].innerHTML="OK";
			 this.Controls.Btns[1].innerHTML="Cancel";		 
			 this.Controls.Btns[2].innerHTML="New Player";			 
			 break;
	             }		     
		 },
         "Output":function()
                 {
		     //mostrar o no en la pantalla el panel de data
		     if(this.Enabled)
		     {	 
			 this.Traslate();
			 this.Controls.Panel.style.display="initial";
			 if(localStorage.CMadness && this.ContinuePanel)
			    { 
				
				this.Controls.Panel.Index[0].style.display="none"; 
				this.Controls.Panel.Index[1].style.display="initial"; 
				this.Controls.BtnUser.innerHTML=localStorage.CMadness+"pts";
			
		            } 
			 else
			    { 
				this.Controls.Panel.Index[0].style.display="initial"; 
				this.Controls.Panel.Index[1].style.display="none"; 
		            } 
		     } 	   
		     else
			 this.Controls.Panel.style.display="none";
		 }
         };
