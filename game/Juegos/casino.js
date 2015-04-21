/*
  CASINO
 */
//Casino.Configuration.NCards
Casino={
       "Name":"Casino",
       "Instructions": Array("Selecciona las cartas de las mesa que sean identicas a las tuyas o que sumadas den el valor de tu carta (maximo puedes seleccionar 6 cartas de la mesa por turno), si ganas el juego a la maquina Obtendras puntos extra.","Select the cards from the table that has the same value than yours(selection of 6 cards maximun per turn),if you win the game you'll have extra points.")
        ,
       "Score":{
	        "Points":0,//puntaje del jugador
	        "Bonus":0 //bonus que se le multiplicara al puntaje del jugador
               },
       "Board":{
	       "Cards":  Array(),
	       "X": 0 ,
	       "Y": 0,
	       "Width":  0 ,
	       "Height": 0 ,
	       "Temp": {
		         "Move":0,
		         "Overflow":0,//diferencia entre la altura de la pizarra y de todas las cartas
		         "CHeight":0,//altura de todas las cartas
		         "CYPrevious":0,
		         "CSelected":0,//numero de cartas seleccionadas
		         "Cond":false,
		         "Pos":0,
		         "XCValue":0,//valor de la carta enviada
		         "Counter":0,//contador (eliminarlo)
		         "Sum":" ",//sumador(eliminarlo)
		         "CRow":0 //cartas por fila
	                },
	       "Btns": Array(),  
	       "Cover": Array(),
	       "Reset": function(tam)
	             {
			
			 //cartas a la mesa
			 var Ancho=80*WINDOW.WPercent,Largo=110*WINDOW.HPercent;
			 
			 
			 //maximo 5 cartas por fila
			 for(var i=5;i>1;i--)
			 {
			     Ancho=this.Width/i;
			     this.Temp.CRow=i;
			     if(Ancho>80) 
				 break;
			 }	 

			 this.Cards=[];
			     
			 Row=0;//siguiente fila
			 Col=0;

			 if(tam)
			     for(var i=0;i<tam;i++)
			     {	   
				 if(i!=0 && i!=1 && i%this.Temp.CRow==0)//sgte fila, primera columna
				 {
				     Row++;
				     Col=0;
				 }   
				 Col++;//sgte columna
				 this.Cards.push(new Objeto(Ancho, Largo,this.X+Ancho*(Col-1),this.Y+3+Largo*Row));
				 this.Cards[i].SubImg=0;
				 Casino.Rules.Choose.Range(1,52,52);
  				 this.Cards[i].Value=Casino.Rules.Choose.Next("NoRepeat");//ccl.Random.Next(1,52,"NoRepeat");
				 this.Cards[i].Enabled=true;
				 this.Cards[i].Selected=false;//si es que ha sido seleccionado al hacer click

			     }
			 else
			     {
				 this.Cards.push(new Objeto(Ancho, Largo,this.X,this.Y+3));
			     	 this.Cards[0].SubImg=2;
				 this.Cards[0].Value=0;
			     }


		     },
	       "Init": function()
	             {


	 		 //Inicializar dimensiones de la pizarra principal	 
  			 this.X= (CANVAS.width/2)-150*WINDOW.WPercent;
			 this.Y= 60*WINDOW.HPercent;
			 this.Width=  300*WINDOW.WPercent;
			 this.Height= Casino.Player[0].Cards[0].Y-this.Y;
			 //Crear cubiertas para evitar colision con cartas fuera de su area real
  			 //parte superior
 			 this.Cover.push(new Objeto(this.Width+5*WINDOW.WPercent,this.Y,this.X,0));
			 //parte Inferior
  			 this.Cover.push(new Objeto(this.Width+5*WINDOW.WPercent,Casino.Player[0].Cards[0].Height,this.X,this.Y+this.Height));
 			 this.XMouse=this.Y;			 

			 //crear botones arriba y abajo
			 for(var i=0;i<2;i++)
			 { 
			     this.Btns.push(new Objeto(30*WINDOW.WPercent,this.Height/2,this.X+this.Width,this.Y+i*(this.Height/2)));
			     this.Btns[i].SubImg=2;
			 }	
		     },
	       "Overflow": function()
	                   {
			       var collision=false;
			        Cards=this.Cards;

    			     //detectar colision
    				  for(var i=0;i<Cards.length;i++)
				      if(Cards[i].Collision(Mouse,1))
					      collision=true;
			        
			        var Row=0;
			     //condicion para el overflow
			       //ANTIBUG 0
			       if(collision &&  Mouse.Pressed  && !(this.Cover[0].Collision(Mouse,1) ||  this.Cover[1].Collision(Mouse,1)) )
				   {
				      
				      
				        Cards[0].Y=Mouse.Y-this.Temp.Move;
				      if(this.Temp.Overflow<0) 
					  Cards[0].Y=(Cards[0].Y<this.Y ? this.Y :Cards[0].Y+this.Temp.CHeight>this.Y+this.Height ? this.Y+this.Height-this.Temp.CHeight : Cards[0].Y);
				       else
			       		   Cards[0].Y=(Cards[0].Y<this.Y-this.Temp.Overflow ? this.Y-this.Temp.Overflow : Cards[0].Y+this.Temp.CHeight>this.Y+this.Height+this.Temp.Overflow? this.Y :Cards[0].Y );

				    }     
					 // this.Temp.CYPrevious=Cards[0].Y;
					 // Cards[0].Y=Mouse.Y-this.Temp.Move;



			       //organizar posiciones
				  for(var i=0;i<Cards.length;i++)
				     {
				       if(i%this.Temp.CRow==0 && i!=1 && i!=0)
					   Row++; 
					 
			 		 if(collision && Mouse.Pressed && Mouse.Move && !(this.Cover[0].Collision(Mouse,1) ||  this.Cover[1].Collision(Mouse,1)) )
				           {
					       //scrolling
					       if(i!=0)
						   Cards[i].Y=Cards[0].Y+Row*Cards[0].Height;
					  
					   }   
					 //Renderizar cartas que estan la mesa
					
					

			 	     }	 
			 },
	       "Scroll": function()//primer input en un ouput
	                 {
			   //crear scrolling para ver el resto de cartas
			     //posicion de las cartas con respecto al del mouse
			      
			       var collision=false;//XCard: carta seleccionada
			         Cards=this.Cards;

			     if(Mouse.Pressed && !Mouse.Move)
			     {
			     	    // this.Move=Math.floor(Math.abs(Cards[0].Y-Mouse.Y));
				 //overflow
				 this.Temp.CHeight=this.Cards[0].Height;
				 var Row=0;
    				 for(var i=0;i<Cards.length;i++)
				      if(i!=0 && i!=1 && i%this.Temp.CRow==0)
					  this.Temp.CHeight+=Cards[0].Height;
				 this.Temp.Overflow=this.Temp.CHeight-this.Height;
				 this.Temp.Move=Mouse.Y-Cards[0].Y;
			     }   
			     
			     this.Overflow();
			         
			 },
	       "ReSearch": function( MyDeck,Value, MaxValue, Repeating,  IDs,temp)
	                 {
			     //buscar si el valor de las cartas son similares a la mia sumandolas
			     IDs= IDs || [];
			     temp= temp || " ";
			     this.Temp.Counter++;   
			     for(var i=0; i< MyDeck.length; i++)
				 {
				     if(Repeating.length>0)
			             {	
					var diferente=true; 
					for(var ii=0;ii<Repeating.length;ii++)  
					     if(Repeating[ii]==MyDeck[i].Value)
						 diferente=false;
					 
					 if(diferente)
					  {  
	
					      
					       if(this.Temp.XCValue==MyDeck[i].Value+Value)
						   {
						       str=temp+MyDeck[i].Id;
						      // alert(str);
						       numx=str.split(".");
						       
						       Available=true;
						       for(var jj=0;jj<numx.length;jj++)
							  { 
							   numx[jj]=Number(numx[jj]);
							   if(this.Cards[numx[jj]].Selected)
							       Available=false;
							  }    
						      // A=true;
						      if(Available)
						       for(var jj=0;jj<numx.length;jj++)
							   if(!this.Cards[Number(numx[jj])].Selected)
							       this.Cards[Number(numx[jj])].Selected=true;

						          //a=false;//si todas las cartas que forman parte del sumando estan disponibles
						       /*if(A)
						       	  for(var j=0;j<IDs.length;j++)
						      	      if(!this.Cards[IDs[j]].Selected)
								      this.Cards[IDs[j]].Selected=true;
							*/	  
								  

						       this.Temp.Sum+="->";
						   }
					      
					       if(MyDeck[i].Value+Value>=MaxValue)
					           {
						       return 0;
						   }
           				       IDs.push(MyDeck[i].Id);
					       Repeating.push(MyDeck[i].Value);
					       this.Temp.Sum+=(MyDeck[i].Value+Value)+", ";
					       this.ReSearch(MyDeck,MyDeck[i].Value+Value,MaxValue,Repeating,IDs,temp+MyDeck[i].Id+".");
					       Repeating.pop();
					       IDs.pop();
					   } 
				      }	  
				     else
					 {

					     Repeating.push(MyDeck[i].Value);
					     IDs.push(MyDeck[i].Id);
					     this.ReSearch(MyDeck,MyDeck[i].Value+Value,MaxValue,Repeating,IDs,MyDeck[i].Id+".");
    					     Repeating=[];
					     IDs=[];


					 }
				     
				 }		 
			     			    

			 },
	       "AddCard": function (Value)
	                 {
			     //tratar al objeto para que se parezca a los demaz objetos de las cartas de la mesa
 			     //XCard=(JSON.parse(JSON.stringify(Card));
			     if(this.Cards[0].Value)
			     {	 
				 var Ancho=this.Cards[0].Width,Largo=this.Cards[0].Height;//this.X
				 ind=this.Cards.length-1;
				 X=0;
				 Y=0;

				 //LOCALIZAR A LA CARTA
				 if(this.Cards[ind].X+Ancho>=this.X+this.Width) //sgte fila
				 {
				     X=this.X;
			             Y=this.Cards[ind].Y+Largo;
				 }
				 else
				 {
				     X=this.Cards[ind].X+Ancho;
			             Y=this.Cards[ind].Y;//this.Temp.CHeight;   
				 }
				 
				 XCard=new Objeto(Ancho, Largo,X,Y);
				 XCard.SubImg=0;
				 XCard.Enabled=true;
				 XCard.Value=Value;	
				 XCard.Selected=false;
				 
  				 // añadir carta del jugador a la mesa
				 this.Cards.push(XCard);
			     }
			     else
			     {
				 this.Cards[0].Value=Value;
 				 this.Cards[0].SubImg=0;
			     }	 

			 },
	       "PickCard":function(Player,Value)
	                 {
			     //control (borrarlo)
			     this.Temp.Counter=0;
			     this.Temp.Sum=" ";
			     //coger una carta si es que mi carta coincide en el mismo valor

			     //calcular el valor real de mi carta

	 		     N=Value-(Math.floor(Value/13)*13);
			     Value=(N==0 ? 13 : N);
			     Value=(Value==1 ? 14 : Value);//convertir el 1 a 14 en mano a mesa
			     this.Temp.XCValue=Value;
			     
			     //ver coincidencias sobre mi carta
			     Cards=this.Cards;			     
			     k=0;//iterador
			     ncards=0;//numero de cartas a eliminar
			     Coincide=false;//busca las coincidencias
			     Row=0;
			     Col=0;
			     Deck1=Array();//
			     Sum=0;
			        //ver coincidencias
     			        for(var i=0;i<Cards.length;i++)
				 {   
				    NCard=Cards[i].Value;
	 		            N=NCard-(Math.floor(NCard/13)*13);
			            CValue=(N==0?13:N);


			            if(CValue<Value && Cards[i].Selected)
                		      {
					 
					  Deck1.push({"Value":CValue,"Id":i});
					  Sum+=CValue;
				      }	   
   				    Cards[i].Selected=(CValue==Value && Cards[i].Selected?true:false);
				  }
			     if(Sum==Value)
				 for(var i=0;i<Deck1.length;i++)
				     Cards[Deck1[i].Id].Selected=true;
				     
			     else
				 this.ReSearch(Deck1,0,Sum,Array());
			     //alert(this.Temp.Sum);
			     //ordenar las cartas que quedarian antes de borrarlas

			     for(var i=0;i<Cards.length;i++)
			     {	  
				 if(Cards[i].Selected)
				 {
				     Player.Score.Points++;
				     ncards++;//eliminar ultima carta
				     Coincide=true;
				 }     
				 else
				 {
					 X2=Cards[k].X;
				     if(k%this.Temp.CRow==0 && k!=1 && k!=0)
					{
					    Row++; 
					    Col=0;
					}   
				     
				     
				     Cards[k]=Cards[i]; 
				     
				     if(k==0)
					 {
					     Cards[0].Y=Mouse.Y-this.Temp.Move;
					     Cards[0].X=this.X;
					 }    
				     else
					 {
					     Cards[k].Y=Cards[0].Y+Row*Cards[0].Height;
					     Cards[k].X=this.X+Col*Cards[0].Width;

					 }
				     k++;
				     Col++;
			         }		 
				 Cards[i].Selected=false;//deseleccionar todas las cartas
			     }
			  
			     for(var i=0;i<ncards;i++)
				 if(Cards.length==1)
				 {    
				     Cards[0].SubImg=2;
				     Cards[0].Value=0;
		//		     alert("holi");
				     break;
				 }    
				 else   
				      Cards.pop();

		//	     alert(Cards.length);
			     return Coincide;

			     /*retorna true si es que hubieron coincidencias;por lo tanto, todas las cartas participes de 
			       esa coincidencia se eliminan. mientras tanto, si no hay coincidencia la carta se deja en la mesa. */
			 },
	   "SortPos":  function()
	                 {
			     //ordenar cartas forzosamente

			     Cards=this.Cards;
			     Row=0;
			     //organizar posiciones
			     for(var i=1;i<Cards.length;i++)
			     {
				 if(i%this.Temp.CRow==0 && i!=1 && i!=0)
				     Row++; 

				 Cards[i].Y=Cards[0].Y+Row*Cards[0].Height;
			     }	 
			 },

	       "Input":  function()
	                 {
			     
			     if(Mouse.Click)
			     {   
				 Cards=this.Cards;
				 OverSelected=this.Temp.CSelected>5;//seleccionados demas
				 for(var i=0;i<Cards.length;i++)
				     if(!OverSelected && Cards[i].Collision(Mouse,1) && !(this.Cover[0].Collision(Mouse,1) || this.Cover[1].Collision(Mouse,1)))
				 {
				     Cards[i].Selected=!Cards[i].Selected;
				     this.Temp.CSelected=(Cards[i].Selected ? this.Temp.CSelected+1: this.Temp.CSelected-1);	
				 }
			         else
				     if(OverSelected)
				 {    
				     Cards[i].Selected=false;
				     this.Temp.CSelected=0;
				 }    					 
                             }
			     if(Mouse.Move)
				 for(var i=0;i<2;i++)
				     this.Btns[i].SubImg=(this.Btns[i].Collision(Mouse,1)? 3 : 2);
			     
    			     if(Mouse.Click)
			         for(var i=0;i<2;i++)
				     if(this.Btns[i].SubImg==3)
		           	     {  
					 switch(i)
					 {
					 case 0: //arriba
					     this.Cards[0].Y=this.Y;
					     break;
					 case 1: //abajo
					     this.Cards[0].Y=(this.Temp.Overflow<0? this.Y+this.Height-this.Cards[0].Height : this.Y-this.Temp.Overflow);				          break; 	 
					     
					 }  
					 this.SortPos();
				     }
			     
			 },
	       "Output2": function()
	                 {
			     //Botones para arriba y abajo
			     for(var i=0;i<2;i++)
			     {
				 Intf.Sprite.Draw(this.Btns[i].SubImg,this.Btns[i].X,this.Btns[i].Y,this.Btns[i].Width,this.Btns[i].Height);
				 Texto.Style(Texto.Font.Family,(i?19:24)*WINDOW.WPercent+"px","white");
			     	 Texto.Output(0,this.Btns[i].X+(i?this.Btns[i].Width/3.5:this.Btns[i].Width/5),this.Btns[i].Y+(this.Btns[i].Height/2),(!i?"^":"v"));        
			     }    		
			 },
	       "Output": function()
	                 {
			     //Mover y Renderizar
			     
			     //ANTIBUG COLISION
			     if(!Casino.Rules.GameOver)  
                             {
				 Cards=this.Cards;
				 if(this.Temp.Overflow<0)
				     Cards[0].Y=(Cards[0].Y<this.Y ? this.Y :Cards[0].Y+this.Temp.CHeight>this.Y+this.Height ? this.Y+this.Height-this.Temp.CHeight : Cards[0].Y); 
				 else
				     Cards[0].Y=(Cards[0].Y<this.Y-this.Temp.Overflow ? this.Y-this.Temp.Overflow : Cards[0].Y+this.Temp.CHeight>this.Y+this.Height+this.Temp.Overflow? this.Y :Cards[0].Y );

				 this.Overflow();
			     }
				 this.SortPos();

			     //RENDERIZACION
    			   if(Cards[0].Value)
			    for(var i=0;i<Cards.length;i++)
			    {	
			     NCard=Cards[i].Value;
	 		     N=NCard-(Math.floor(NCard/13)*13);
			     Games.Deck.Sprite.Draw(Cards[i].SubImg,Cards[i].X,Cards[i].Y,Cards[i].Width,Cards[i].Height,((N==0?13:N)-1)*225,(Math.ceil(NCard/13)-1)*315,225,315,-1);
			    if(Cards[i].Selected)	
				Games.Source.Draw(2,Cards[i].X,Cards[i].Y,Cards[i].Width,Cards[i].Height);
			    }
			
			     //Borde
			     //Parte superior
			     Plataform.Sprite.Draw(1,0,this.Cover[0].Y,CANVAS.width,this.Cover[0].Height,0,0,2272,213);
			     //parte inferior 
			     Plataform.Sprite.Draw(1,0,this.Cover[1].Y,CANVAS.width,this.Cover[1].Height,0,964,2272,740);	 


			 }
	       },
       "Alarm":{
	       "Times":0
               },
       "Configuration":// configuracion de este juego
               {
		 "NCards":4//cartas por jugador  
	       },
       "Player": Array(),//Jugadores del juego 1:jugador humano, 2:pc, 3:pc
       "Rules": {
	          "Times":0, //numero de cartas que ya salieron (52 maximo)
	          "GameOver":false,
	          "UserWins":false,
	          "Choose":new Random,
	          "Shuffle": function()//barajear cartas
	              {
			  		       
			       this.Choose.Reset();
			       //entrega de cartas a los jugadores  
			       for(var i=0;i<Casino.Player.length;i++)
				   for(var ii=0;ii<Casino.Configuration.NCards;ii++)
				       {
					   Casino.Player[i].Cards[ii].SubImg=(i? 1: 0);
					   this.Choose.Range(1,52,52);
					   Casino.Player[i].Cards[ii].Value=this.Choose.Next("NoRepeat");
				       }
			       
     
			       
		      },
	          "Turn": function(Player,Card)//Turno para elegir cartas entre otras cosas
	                {
			    /*
			      El "Jugador" elige una "carta" y realiza
			      una accion.
			     */
      			    if(!Casino.Board.PickCard(Player,Card.Value))
				Casino.Board.AddCard(Card.Value);//deja su carta en la mesa
			    else
				Player.Score.Points++;//se lleva la carta que ha puesto a la mesa
			},
	          "NextTurn": function()
	                {
			    Player=Casino.Player;
			    //otorgar el turno al siguiente jugador
			   for(var i=0;i<Player.length;i++) 
			       if(Player[i].Turn)
				  { 
				      Player[i].Turn=false;//ok ya acabe mi turno
				      Player[(i< Player.length-1 ? i+1 : 0)].Turn=true;//ahora es el turno del siguiente jugador
				      break;
			          }
			}
	                 ,
	          "IA": function()
	                {
 			    //descubrir quien es el ganador
			    var winner=null,Mayor=0;

			    //se ejecuta todas las decisiones que tomare los npc
			    Player=Casino.Player;
			    for(var i=1;i<Player.length;i++)  
				if(Player[i].Turn)
				    {
					Player[i].IA();
				    } 
			    
    			    //ver si se debe repartir cartas otra vez
			    Distribute=true;			    
			    for(var i=0;i<Player.length;i++)
				{
				    if(Player[i].Score.Points>Mayor)
					{
					    Mayor=Player[i].Score.Points;
					    this.UserWins=!Boolean(i);
					}   
				    
				    for(var ii=0;ii<Casino.Configuration.NCards;ii++)
					if(!Player[i].Cards[ii].SubImg)
					    Distribute=false;
				    
				}    
  			       //entrega de cartas a los jugadores 

			    if(Distribute && !this.GameOver)
				for(var i=0;i<Casino.Player.length;i++)
				{    
				 if(i)   
				     Casino.Player[i].Choose.Reset();

				    for(var ii=0;ii<4;ii++)//Casino.Player[i].Cards.length
				       {
					   if(this.Choose.Range(1,52,52))
					     {  
					      this.GameOver=true;//fin del juego
				              break;		  
				             }		  
					   Casino.Player[i].Cards[ii].SubImg=(i? 1: 0);					   
					   Casino.Player[i].Cards[ii].Value=this.Choose.Next("NoRepeat");
				       }
				    if(this.GameOver)
					break;
				}    


			},
	          "GameEnd": function()
	                    {/*
			       GameEnd: muestra el score final despues de haber seguido
			       el objetivo del juego
			      */
			    
                            //APLICANDO EL BONUS AL PUNTAJE DEL JUGADOR
 			    	Casino.Score.Points=Math.floor((this.UserWins?Casino.Score.Bonus:0)*Casino.Player[0].Score.Points);
			    Player=Casino.Player;	
			    W=300*WINDOW.WPercent;	
		            H=200*WINDOW.HPercent;
		            X=(CANVAS.width-W)/2;
  		            Y=(CANVAS.height-H)/2;		
			    //fondo	
			    Intf.Sprite.Draw(1,X,Y,W,H);
			    //texto	
			    Texto.Output(7,X+50*WINDOW.HPercent,Y+40*WINDOW.HPercent);
				for(var i=0;i<Player.length;i++)	
				{   
				    Texto.Output(0,X+70*WINDOW.HPercent,Y+(70+20*i)*WINDOW.HPercent,(User.Name && !i?User.Name:Player[i].Type)+(i?""+i:"")+" : "+Player[i].Score.Points+(User.Name && !i && this.UserWins?"x"+Casino.Score.Bonus+"("+Casino.Score.Points+")":""));

				}

			   //inhabilitar las cartas	
					    
			    for(var i=0;i<Player.length;i++)  
				for(var ii=0;ii<Casino.Configuration.NCards;ii++)
				    Player[i].Cards[ii].SubImg=2;
		           	//Boton para regresar al menu
				Texto.Style(Texto.Font.Family,14*WINDOW.WPercent+"px","white");
				Intf.Sprite.Draw(this.BtnMenu.SubImg,this.BtnMenu.X,this.BtnMenu.Y,this.BtnMenu.Width,this.BtnMenu.Height);
	     			Texto.Output(11,this.BtnMenu.X+30*WINDOW.WPercent,this.BtnMenu.Y+(this.BtnMenu.Height/2));  		
			    },
	          "Input":  function()
	                    {
			    	if(this.GameOver)
				{	 
				    if(Mouse.Move)
					this.BtnMenu.SubImg=(this.BtnMenu.Collision(Mouse,1)? 3 : 2);
				    
			            if(Mouse.Click && this.BtnMenu.SubImg==3)
					{
					    User.AddPoints(Casino.Score.Points);
					    Room.Index=1;
					}   
				}	     
			    },   
                  "Output": function()
	                    {
				//si el juego todavia no ha acabado	
			    if(!this.GameOver)
				    this.IA();
				    

			    }
                },
       "Reset": function(Level)
               {
	        //Iniciar un nuevo juego del juego
		   //segun el nivel de dificultad
		   var tam=0;
		   this.Rules.UserWins=false;
		   switch(Level)
		   {
		   case "easy":
		       tam=4;  
		       Casino.Configuration.NCards=4;
		       this.Score.Bonus=1.1;
		       break;
		   case "normal":
		       tam=2;
		       Casino.Configuration.NCards=3;   
		       this.Score.Bonus=1.5;
		       break;
		   case "hard":
		       tam=0;  
		       Casino.Configuration.NCards=3;    
		       this.Score.Bonus=2.5;
		       break;   
		   } 
		//resetear cartas de las personas
		this.Rules.GameOver=false;
		this.Rules.Choose.Reset();   
		this.Rules.Shuffle();
		//resetear cartas en la mesa   
		this.Board.Reset(tam);
		//resetear a los jugadores
		for(var i=0;this.Player.length;i++) 
		   {
		     this.Player[i].Score.Points=0;  
		   if(i)    
		    this.Player[i].Choose.Reset();
		       
		   }
	       },
       "Init": function()
               {
		      
		   //Crear Datos de los jugadores
		     //2 jugadores minimos

		   for(var i=0;i<3;i++)		       
		   {   
		       //tamaño para las cartas
		       Ancho=(i?50*WINDOW.WPercent:100*WINDOW.WPercent),Largo=(i?90*WINDOW.HPercent:140*WINDOW.HPercent);

		       this.Player.push({});// asignarle objeto
		       //propiedades
		       this.Player[i].Cards=Array();//baraja de cartas del jugador
		       this.Player[i].Type=(i?"PC":"Human");
		       this.Player[i].Turn=(i? false:true);//turno del jugador
		       Margin=(i?CANVAS.height/2-Ancho*this.Configuration.NCards/2:CANVAS.width/2-Ancho*this.Configuration.NCards/2);
		         
		        for(var ii=0;ii<this.Configuration.NCards;ii++)
			  {
			     if(i) 
			      this.Player[i].Cards.push(new Objeto(Ancho, Largo,(i-1? CANVAS.width:Largo) ,Margin+(Ancho)*ii));	 
			     else	 
 			      this.Player[i].Cards.push(new Objeto(Ancho, Largo,Margin+(Ancho)*ii,CANVAS.height-Largo));

			      //propiedades de las cartas
			      this.Player[i].Cards[ii].Value=1;
			      this.Player[i].Cards[ii].SubImg=(i?1:i);

			  }    
		       //incluir la el score
		       this.Player[i].Score={
			                     "Points":0,
			                     "Bar":{
						     "X":Casino.Player[i].Cards[0].X-(i? Casino.Player[i].Cards[0].Height:0),
						     "Y":(i? Casino.Player[i].Cards[0].Y :CANVAS.height),
						     "W":60*WINDOW.WPercent,
						     "H":50*WINDOW.HPercent
					            },
			                    "Output": function(TIPO)
			                            {
							
						     //Renderizar	
							//barra de score de cada player
							if(TIPO=="PC")
							  {  
							    Games.Source.Draw_ext(0,this.Bar.X,this.Bar.Y,this.Bar.W,this.Bar.H,false,false,false,false,270);		 
							   
   							    Texto.Style(Texto.Font.Family,24*WINDOW.WPercent+"px","white");
							    Texto.Output(0,this.Bar.X+(this.Bar.H/4),this.Bar.Y-(this.Bar.W/2),""+this.Points);   
							  }    
							else
							  {  
						            Games.Source.Draw_ext(0,this.Bar.X,this.Bar.Y,this.Bar.W,this.Bar.H,false,false,false,false,180);		 
							    Texto.Output(0,this.Bar.X-(this.Bar.W/1.5),this.Bar.Y-(this.Bar.H/4),""+this.Points);     
							  }   
							   // Games.Source.Draw(0,this.Bar.X,this.Bar.Y,this.Bar.W,this.Bar.H);
						    }
                                             
		                             };
		       //metodos		       
		       this.Player[i].Output=function ()
		                            {

						 Cards=this.Cards;
						
						 //renderizar las cartas
						 for(var i=0;i<Casino.Configuration.NCards;i++)
						     switch(Cards[i].SubImg)
						     {

							 case 0://cara
 							     NCard=Cards[i].Value;
					 		     N=NCard-(Math.floor(NCard/13)*13);
							     if(this.Type=="PC")
							     Games.Deck.Sprite.Draw_ext(Cards[i].SubImg,Cards[i].X,Cards[i].Y,Cards[i].Width,Cards[i].Height,((N==0?13:N)-1)*225,(Math.ceil(NCard/13)-1)*315,225,315,90);		 
							     else
							     Games.Deck.Sprite.Draw(Cards[i].SubImg,Cards[i].X,Cards[i].Y,Cards[i].Width,Cards[i].Height,((N==0?13:N)-1)*225,(Math.ceil(NCard/13)-1)*315,225,315,-1);	

							 
							 break;
						         default: //sello o nada
							     if(this.Type=="PC")
					                     Games.Deck.Sprite.Draw_ext(Cards[i].SubImg,Cards[i].X,Cards[i].Y,Cards[i].Width,Cards[i].Height,false,false,false,false,90);
							     else
							     Games.Deck.Sprite.Draw(Cards[i].SubImg,Cards[i].X,Cards[i].Y,Cards[i].Width,Cards[i].Height);

						     } 
						 
						this.Score.Output(this.Type);
					     };
		      if(i)
			{  
			    this.Player[i].Choose=new Random;
			    this.Player[i].IA= function()
		            {
				//this.Choose.Range(0,4,4);
				Card=this.Choose.Next("NoRepeat",0,4);
				this.Cards[Card].SubImg=2;

				Value=this.Cards[Card].Value;
	 			N=Value-(Math.floor(Value/13)*13);
				Value=(N==0 ? 13 : N);
				for(var i=0;i<Casino.Board.Cards.length;i++)
				    {
					CValue=Casino.Board.Cards[i].Value;
					N=CValue-(Math.floor(CValue/13)*13);
					CValue=(N==0 ? 13 : N);
					if(Value==CValue)
					    Casino.Board.Cards[i].Selected=true;
				    }
				    
				Casino.Rules.Turn(this,this.Cards[Card]);
				//buscar cartas identicar para llevarselas
				Casino.Rules.NextTurn();//le otorgo el turno al siguiente jugador

			    };
		       }
	           } 
		       //Funcion exclusiva para el player 0
		       this.Player[0].Input=function ()
		                            {

					      Cards=this.Cards;	
					      for(var i=0;i<Casino.Configuration.NCards;i++)
						  if(Cards[i].Collision(Mouse,1) && this.Cards[i].SubImg!=2)
						    {
							this.Cards[i].SubImg=2;
							Casino.Rules.Turn(this,Cards[i]);//este es mi turno y lo usare
							Casino.Rules.NextTurn();//le otorgo el turno al siguiente jugador
						    }	
						
					    };

		   //Crear mesa
		   this.Board.Init();
		   
		   //crear boton para volver al menu
		   this.Rules.BtnMenu=new Objeto(260*WINDOW.WPercent,40*WINDOW.HPercent,0,CANVAS.height/1.6);
		   this.Rules.BtnMenu.X=(CANVAS.width-this.Rules.BtnMenu.Width)/2;
		   this.Rules.BtnMenu.SubImg=2;

	       },
       "Input": function()
               {
		 if(!this.Rules.GameOver)  
		   {   
		       //Al hacer click  
		       if(Mouse.Click)
   			   //Entrada de datos del jugador principal		 
			   this.Player[0].Input();
		       
		       //INPUT DE LA MESA
		       this.Board.Input();
		   }

		   this.Rules.Input();
	       },	   
       "Output": function()
               {

		   Card=this.Card;
		   var NCarta;//numero de carta

		   //Aplicar Reglas
		   this.Rules.Output();
		  
		   //OUTPUT DE LA MESA
		   this.Board.Output();

		   //OUPUT DE LOS PLAYER PC
		   for(var i=1;i<this.Player.length;i++)
		       this.Player[i].Output(); 

		   //botones del la mesa
		   this.Board.Output2();

		   //OUPUT DEL PLAYER HUMAN
		   this.Player[0].Output(); 		  
		   
		   //renderizar escore fin del juego
		   if(this.Rules.GameOver)
		       this.Rules.GameEnd();
	       }
       };
