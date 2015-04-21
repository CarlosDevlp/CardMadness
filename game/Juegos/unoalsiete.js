/*
Del uno al siete
*/

UnoAlSiete=
    { 
     "Name":Array("Uno Al Siete","OneToSeven"), 	
     "Instructions":Array("Consigue las cartas que valen desde 1 hasta el numero de cartas que tienes,intercambia las cartas con la mesa y/o toca la primera carta de la mesa para que agrege una carta extra en esta misma.","Get the cards what are from 1 to the number of cards you have,exchange the cards what are from the table or/and touch the first card to get more cards in the table itself."),	
     "Configuration": //configuracion del juego	
	    {
		"NPlayers":3,
		"NCards":10
	    },//UnoAlSiete.Configuration.NCards
     "Score": {
	        "Points":0,
              },	 
     "IA": //algoritmo de inteligencias artificial que genera que la pc juege de un modo diferente
	 {
	  "Rate":0,//ratio de probabilidades para usar el movimiento   
	  "Func":Array(function () //IA
		       {
			   
		    with(UnoAlSiete)
		    {	     
			//agregar una nueva carta
			Board.AddCard(Rules.GetCard());
			//buscar si tengo cartas que no me comvienen para cambiarlas
 			//buscar si en la mesa hay cartas que me combienen y almacenarlo
			  
			if(ccl.Random.Next(1,100)<=IA.Rate)
			{

			for(var i=1;i<Board.Cards.length;i++)//mesa
			{ 
			    cardsx=[];//comparar mis cartas repetidas
			    NewValue=Rules.ConvertValue(Board.Cards[i].Value);
			    if(NewValue <= Configuration.NCards)
  				for(var ii=0;ii<Configuration.NCards;ii++)
			    {
				OldValue=Rules.ConvertValue(this.Cards[ii].Value);
				cardsx[OldValue]=(cardsx[OldValue]!=undefined ? cardsx[OldValue]+1 : 1);   
       				if(OldValue > Configuration.NCards ||  cardsx[OldValue]>1)
				{   
				    Board.Temp.SCId=i;
				    this.Cards[ii].Value=Board.Swap(this.Cards[ii].Value);
				    
				}    
				
			    }

                        }
		      }
			//permitir al usuario agregar cartas
			Board.Temp.UAllow=true;
			//otorgar el turno
			Rules.NextTurn();

		    }	    
		}, 
		function()
	        {
		   
		    Board=UnoAlSiete.Board;
		    Rules=UnoAlSiete.Rules;
		    //agregar una nueva carta
		    Board.AddCard(Rules.GetCard());
		    //cartas a intercambiar por
		    MyCard=ccl.Random.Next(1,UnoAlSiete.Configuration.NCards-1);
		    Board.Temp.SCId=ccl.Random.Next(0,Board.Cards.length-1);

		    //intercambio de cartas
		    this.Cards[MyCard].Value=Board.Swap(this.Cards[MyCard].Value);
		    

		    //finalizando el turno
		    //permitir al usuario agregar cartas
		    Board.Temp.UAllow=true;

		    //otorgar el turno
		    Rules.NextTurn();
		    
		    
		}
	       ) 
	   }  
	  ,	
     "Rules": //objeto para el cumplimiento de reglas
	    {
	     "Choose": new Random(),
             "GameOver": false,
 	     "UserWins": false,	
	     "GetCard": function()	
		      {
			  this.Choose.Range(1,52,52);
			  return this.Choose.Next("NoRepeat");
		      },
	     "ConvertValue": function(Value)	
		      {
    			  NCard=Value;
	 		  N=NCard-(Math.floor(NCard/13)*13);
			  Value=(N==0? 13 : N);
			  return Value;		 
		      },
	     "Shuffle": function()	
	              {
			  //entregar todas las cartas a los jugadores
			  this.Choose.Reset();
			  Player =UnoAlSiete.Player;
			  for(var i=0;i<Player.length;i++)
			      for(var ii=0;ii<UnoAlSiete.Configuration.NCards;ii++)
				  Player[i].Cards[ii].Value=this.GetCard();			      
		      },
	     "NextTurn": function()	
		      {
			  //pasar el turno al siguiente jugador
			  Player =UnoAlSiete.Player;
			   for(var i=0;i<Player.length;i++) 
			       if(Player[i].Turn)
				  { 
				      Player[i].Turn=false;//ok ya acabe mi turno
				      Player[(i< Player.length-1 ? i+1 : 0)].Turn=true;//ahora es el turno del siguiente jugador
				      break;
			          }	    

		      },
	     "GameEnd": function()	
		      {
			  //chekear si es que un jugador tiene todas las cartas necesarias para terminar el juego
  			  Player =UnoAlSiete.Player;
			  var winner=false,n;//datos del jugador ganador
			  var correct=true;
			  var cardsx= Array();//baraja temporal para identificar cuantas unidades de esa existen
			  for(var i=0;i<Player.length;i++)//cada jugador
			     { 
				 
				 correct=true;
				 cardsx=[];
				 for(var ii=0;ii<UnoAlSiete.Configuration.NCards;ii++)//c/u de sus cartas
				 { 
				  MyCardValue= this.ConvertValue(Player[i].Cards[ii].Value); 
				  
				  cardsx[MyCardValue]=(cardsx[MyCardValue]!=undefined ? cardsx[MyCardValue]+1 : 1);   

				     if( MyCardValue> UnoAlSiete.Configuration.NCards || cardsx[MyCardValue]>1)//revisar cada valor de la cartas                          
					   correct=false;
				     
				 }    
				 if(correct)
				    { 
				     winner=Player[i];
			             n=i;		
				     break;
				    	
			            }		
		             }		  


			  this.GameOver=false;	  


			if(winner)	     
			  {  
			      //Ordenar todas las cartas del ganador de forma ascendente (izq a der)
			      /*Metodo de ordenamiento burbuja*/
			      Cards=winner.Cards;
     			         for(var i=1;i<UnoAlSiete.Configuration.NCards;i++)
			             for(var ii=0;ii<UnoAlSiete.Configuration.NCards-1;ii++)					 
					 if(this.ConvertValue(Cards[ii].Value)>this.ConvertValue(Cards[ii+1].Value))
					     {
						 Temp=Cards[ii].Value;
						 Cards[ii].Value=Cards[ii+1].Value;//atras el menor
						 Cards[ii+1].Value=Temp;//adelante el mayor
					     }
			     //Mostrar que jugador gano 
			    W=300*WINDOW.WPercent;	
		            H=200*WINDOW.HPercent;
		            X=(CANVAS.width-W)/2;
  		            Y=(CANVAS.height-H)/2;		
			    //fondo	
			    Intf.Sprite.Draw(1,X,Y,W,H);
			    //texto	
			    Texto.Style(Texto.Font.Family,24*WINDOW.WPercent+"px","white");
			    Texto.Output(8,X+105*WINDOW.HPercent,Y+50*WINDOW.HPercent);

			    if(User.Name && winner.Type=="Human")
				Texto.Output(0,(CANVAS.width-(User.Name.length*15*WINDOW.WPercent))/2,Y+100*WINDOW.HPercent,User.Name+"\n"+UnoAlSiete.Score.Points+"pts");	
			    else		
  				Texto.Output(0,(CANVAS.width-(Player[0].Type.length*15*WINDOW.WPercent))/2,Y+100*WINDOW.HPercent," "+winner.Type+(n?""+n:""));
			    //Boton para regresar al menu
			      Texto.Style(Texto.Font.Family,14*WINDOW.WPercent+"px","white");
			      Intf.Sprite.Draw(this.BtnMenu.SubImg,this.BtnMenu.X,this.BtnMenu.Y,this.BtnMenu.Width,this.BtnMenu.Height);
	     		      Texto.Output(11,this.BtnMenu.X+30*WINDOW.WPercent,this.BtnMenu.Y+(this.BtnMenu.Height/2)); 
			      this.GameOver=true;
			      if(winner.Type=="Human")
				  this.UserWins=true;
			 } 
			  
    
			  
		      },
		"Input": function()
		         {
			     if(this.GameOver)
			      {	 
				 if(Mouse.Move)
				     this.BtnMenu.SubImg=(this.BtnMenu.Collision(Mouse,1)? 3 : 2);
			     
			         if(Mouse.Click && this.BtnMenu.SubImg==3)
				     {
					 User.AddPoints((this.UserWins? UnoAlSiete.Score.Points : 0));
					 Room.Index=1;
				     }	  
			      }	     
			         
			 },
		"Output": function()
		     {
			 Player =UnoAlSiete.Player;
			 for(var i=1;i<Player.length;i++)
			     if(Player[i].Turn)
				 Player[i].IA();
			 this.GameEnd();
		     }
		
	    },
     "Player": Array(),	
     "Board": //Cartas en la mesa
	    {
		
	       "Cards":  Array(),
	       "X": 0 ,
	       "Y": 0 ,
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
		         "SCId":0,//valor ide de la carta seleccionada
		         "UAllow":true,//permitir al usuario agregar cartas a la mesa
		         "CRow":0,//cards por fila
	                },
	       "Btns": Array(),// 2 botones para llevar de arriba a abajo
	       "Cover": Array(),
	       "Init": function()
	             {
		
	 		 //Inicializar dimensiones de la pizarra principal	 
  			 this.X= (CANVAS.width/2)-150*WINDOW.WPercent;
			 this.Y= 30*WINDOW.HPercent;
			 this.Width=  300*WINDOW.WPercent;
			 this.Height= UnoAlSiete.Player[0].Cards[0].Y-this.Y;
			 //Crear cubiertas para evitar colision con cartas fuera de su area real
  			 //parte superior
 			 this.Cover.push(new Objeto(CANVAS.width,this.Y,0,0));
			 //parte Inferior
  			 this.Cover.push(new Objeto(CANVAS.width,UnoAlSiete.Player[0].Cards[0].Height,0,this.Y+this.Height));
 			 this.XMouse=this.Y;
			 //La primera carta es la que es la que esta boca abajo y la que al hacer click me muestra otra carta al final de la cola
			 var Ancho=60*WINDOW.WPercent,Largo=110*WINDOW.HPercent; 
			 //maximo 5 cartas por fila
			 for(var i=5;i>1;i--)
			     {
				 Ancho=this.Width/i;
				 this.Temp.CRow=i;
				 if(Ancho>80) 
				     break;
			     }	 
			 this.Cards=[];
			 this.Cards.push(new Objeto(Ancho, Largo,this.X,this.Y+3));
			 this.Cards[0].Value=0;
			 this.Cards[0].SubImg=1;
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
			     //ARRIBA
			          cond1=(this.Temp.Overflow>0? this.Cards[0].Y < this.Y-this.Temp.Overflow: this.Cards[0].Y< this.Y);
			          pos1=(this.Temp.Overflow>0? this.Y-this.Temp.Overflow: this.Y);
			         //ABAJO
			          cond2=(this.Temp.Overflow>0? this.Cards[0].Y+this.Temp.CHeight > this.Y+this.Height+this.Temp.Overflow: this.Cards[0].Y+this.Temp.CHeight >this.Y+this.Height);
			          pos2=(this.Temp.Overflow>0? this.Y : this.Y+this.Height-this.Cards[0].Height);
			          cond3= cond1 || cond2;
			          this.Temp.Cond  = cond3;
			         // this.Temp.Pos=(cond1? pos1: cond2? pos2:Cards[0].Y);
			       //ANTIBUG 0

			       if(collision &&  Mouse.Pressed  && !(this.Cover[0].Collision(Mouse,1) ||  this.Cover[1].Collision(Mouse,1)) )
				   {
				        Cards[0].Y=Mouse.Y-this.Temp.Move;
				      if(this.Temp.Overflow<0) 
					  Cards[0].Y=(Cards[0].Y<this.Y ? this.Y :Cards[0].Y+this.Temp.CHeight>this.Y+this.Height ? this.Y+this.Height-this.Temp.CHeight : Cards[0].Y);
				       else
			       		   Cards[0].Y=(Cards[0].Y<this.Y-this.Temp.Overflow ? this.Y-this.Temp.Overflow : Cards[0].Y+this.Temp.CHeight>this.Y+this.Height+this.Temp.Overflow? this.Y :Cards[0].Y );

				    }     
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
			 	     }	 
			 },
	       "Scroll": function()
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
		"AddCard": function (Value)
	                 {
			     //tratar al objeto para que se parezca a los demaz objetos de las cartas de la mesa
 			   	 //var Ancho=60*WINDOW.WPercent,Largo=100*WINDOW.HPercent;
				 ind=this.Cards.length-1;
				 X=0;
				 Y=0;
				 //LOCALIZAR A LA CARTA
				 if(this.Cards[ind].X+this.Cards[0].Width>=this.X+this.Width) //sgte fila
				 {
				     X=this.X;
			             Y=this.Cards[ind].Y+this.Cards[0].Height;
				 }
				 else
				 {
				     X=this.Cards[ind].X+this.Cards[0].Width;
			             Y=this.Cards[ind].Y;//this.Temp.CHeight;   
				 }
				 
				 XCard=new Objeto(this.Cards[0].Width, this.Cards[0].Height,X,Y);
				 XCard.SubImg=0;
				 XCard.Enabled=true;
				 XCard.Value=Value;	
				 XCard.Selected=false;
				 
  				 // añadir carta del jugador a la mesa
				 this.Cards.push(XCard);
			 },
		"Swap" : function(Value)
		         {
			     //intercambio de cartas entre la mesa y el usuario
			     var Temp;
			     if(this.Temp.SCId)
				 {
				     Temp=Value;
				     Value=this.Cards[this.Temp.SCId].Value;
				     this.Cards[this.Temp.SCId].Value=Temp;	
				     this.Temp.SCId=0;
			         }		 


			     return Value;
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
				for(var i=0;i<Cards.length;i++)
			        {	 
				    
				    if(Cards[i].Collision(Mouse,1) && !(this.Cover[0].Collision(Mouse,1) || this.Cover[1].Collision(Mouse,1)))	 
				    {   
					if(!i && this.Temp.UAllow)//agregar una carta
					{
					    this.AddCard(UnoAlSiete.Rules.GetCard());
					    this.Temp.UAllow=false;
					}    

					else//seleccionar una carta
					{
					    Cards[i].Selected=!Cards[i].Selected;
					    this.Temp.SCId= (Cards[i].Selected ? i : 0);

					}     
			            }		 
				    else    
					Cards[i].Selected=false;   
			        }	 	 
			    }
			     //botones de arriba y abajo
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
	       "Output": function()
	                 {
			     //Mover y Renderizar
			     //ANTIBUG COLISION
			     if(!UnoAlSiete.Rules.GameOver)
			     {	 
				 Cards=this.Cards;
				 if(this.Temp.Overflow<0)
				     Cards[0].Y=(Cards[0].Y<this.Y ? this.Y :Cards[0].Y+this.Temp.CHeight>this.Y+this.Height ? this.Y+this.Height-this.Temp.CHeight : Cards[0].Y); 
				 else
				     Cards[0].Y=(Cards[0].Y<this.Y-this.Temp.Overflow ? this.Y-this.Temp.Overflow : Cards[0].Y+this.Temp.CHeight>this.Y+this.Height+this.Temp.Overflow? this.Y :Cards[0].Y );
				 this.Overflow();
			     }
			     //RENDERIZACION

			    for(var i=0;i<Cards.length;i++)
			    {
				switch(Cards[i].SubImg)	
				{	
				case 0:	//cara
				    NCard=Cards[i].Value;
	 			    N=NCard-(Math.floor(NCard/13)*13);
				    Games.Deck.Sprite.Draw(Cards[i].SubImg,Cards[i].X,Cards[i].Y,Cards[i].Width,Cards[i].Height,((N==0?13:N)-1)*225,(Math.ceil(NCard/13)-1)*315,225,315,-1);
			    	    
				    if(Cards[i].Selected)	
					Games.Source.Draw(2,Cards[i].X,Cards[i].Y,Cards[i].Width,Cards[i].Height);
 			        break;	
				default: //sello      
				    Games.Deck.Sprite.Draw(Cards[i].SubImg,Cards[i].X,Cards[i].Y,Cards[i].Width,Cards[i].Height);
				     
			        }	
			    }
			     //Foreground para tapar a las demas cartas
			       Plataform.Sprite.Draw(1,this.Cover[0].X,this.Cover[0].Y,this.Cover[0].Width,this.Cover[0].Height,0,0,2272,213);
			       Plataform.Sprite.Draw(1,this.Cover[1].X,this.Cover[1].Y,this.Cover[1].Width,this.Cover[1].Height,0,964,2272,740);
			     //Botones para arriba y abajo
			       for(var i=0;i<2;i++)
				   {
				       Intf.Sprite.Draw(this.Btns[i].SubImg,this.Btns[i].X,this.Btns[i].Y,this.Btns[i].Width,this.Btns[i].Height);
				       Texto.Style(Texto.Font.Family,(i?19:24)*WINDOW.WPercent+"px","white");
			     	       Texto.Output(0,this.Btns[i].X+(i?this.Btns[i].Width/3.5:this.Btns[i].Width/5),this.Btns[i].Y+(this.Btns[i].Height/2),(!i?"^":"v"));        
				   }    
			 }

	    },	
     "Reset": function(Level)
	    {
		IA=0;//algoritmo a escoger para que la pc juege
		Rate=0;//ratio que se proporciona para utilizar el algoritmo clave de la pc
		this.Rules.GameOver=false;
		this.Rules.UserWins=false;
		switch(Level)
		{
		 case "easy":
		    UnoAlSiete.Configuration.NCards=7;
		    this.Score.Points=80;
		    IA=1;
		 break;  
		 case "normal":
		    UnoAlSiete.Configuration.NCards=8;
		    this.Score.Points=200;
		    IA=0;
		    Rate=20;//20 % de probabilidades
		 break;
		 case "hard":
		    UnoAlSiete.Configuration.NCards=10;
		    this.Score.Points=700;
		    IA=0;
		    Rate=80;//80 % de probabilidades
		 break;   
		    //nivel Madness Hardcore 100% de probabilidades
		}    
		
		//un juego nuevo
		//eliminar o agregar scrolling horizontal
		Margin=(CANVAS.width/2-this.Player[0].Cards[0].Width*this.Configuration.NCards/2);
		
		for(var i=0;i<UnoAlSiete.Configuration.NCards;i++)
 			      this.Player[0].Cards[i].X=Margin+(this.Player[0].Cards[0].Width)*i;


		delete this.Player[0].Panel;
		Tam= UnoAlSiete.Configuration.NCards*this.Player[0].Cards[0].Width;
		//this.Player[0].Cards[0].X=CANVAS.width/2;
		if(Tam>CANVAS.width)
		    this.Player[0].Panel={
			"AllCards":{
  			    "Width":UnoAlSiete.Configuration.NCards*UnoAlSiete.Player[0].Cards[0].Width,
			    "Overflow":UnoAlSiete.Configuration.NCards*UnoAlSiete.Player[0].Cards[0].Width-CANVAS.width,
			    "Move":0
			},
			"Scroll": function()
			{
			    var collision=false;
			    Cards=UnoAlSiete.Player[0].Cards;
			    
			    //Obtener coordenadas del mouse
			    if(Mouse.Pressed && !Mouse.Move)
				this.AllCards.Move=Mouse.X-Cards[0].X;

    			    //detectar colision
    			    for(var i=0;i<UnoAlSiete.Configuration.NCards;i++)
				if(Cards[i].Collision(Mouse,1))
				    collision=true;

			    //condicion para el overflow
			    if(collision &&  Mouse.Pressed)
			    {
				Cards[0].X=Mouse.X-this.AllCards.Move;
 		       		Cards[0].X=(Cards[0].X<0-this.AllCards.Overflow ? 0-this.AllCards.Overflow : Cards[0].X+this.AllCards.Width > CANVAS.width + this.AllCards.Overflow? 0 : Cards[0].X );

				//organizar posiciones
     				//scrolling
				for(var i=1;i<UnoAlSiete.Configuration.NCards;i++)						       
			 	    if(Mouse.Move)
					Cards[i].X=Cards[0].X+i*Cards[0].Width;
			    }    
			    

			},
			"SortPos":function()
			{
			    Cards=UnoAlSiete.Player[0].Cards;
			    for(var i=1;i<UnoAlSiete.Configuration.NCards;i++)
			    	Cards[i].X=Cards[0].X+i*Cards[0].Width;
			} 
		    }; 
		//resetear entrega de cartas
		this.Rules.Shuffle();
		//resetear cartas en la mesa
		this.Board.Init();
		//resetear Inteligencia artificial de los player pc
		this.IA.Rate=Rate;
		for(var i=1;i<this.Player.length;i++)
		   { 
		       delete this.Player[i].IA; 
		       this.Player[i].IA=this.IA.Func[IA];
		   }     
	    },
     "Init": function()//funcion principal de inicializacion del juego actual
	    {

		   //Inicializar los personajes
		   //Crear Datos de los jugadores
		     //2 jugadores minimos
		   for(var i=0;i<this.Configuration.NPlayers;i++)		       
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
		       //metodos		       
		       this.Player[i].Output=function ()
		                            {
						 Cards=this.Cards;
						 //renderizar las cartas
						 for(var i=0;i<UnoAlSiete.Configuration.NCards;i++)
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
						 
		
					     };
		       if(i)
			   this.Player[i].IA=function ()
		           {
			       
			       with(UnoAlSiete)
			       {	     
				   //agregar una nueva carta
				   Board.AddCard(Rules.GetCard());
				   //buscar si tengo cartas que no me comvienen para cambiarlas
 				   //buscar si en la mesa hay cartas que me combienen y almacenarlo
				
				   for(var i=1;i<Board.Cards.length;i++)//mesa
				      { 
					   cardsx=[];//comparar mis cartas repetidas
					   NewValue=Rules.ConvertValue(Board.Cards[i].Value);
					  if(NewValue <= Configuration.NCards)
  					      for(var ii=0;ii<this.Cards.length;ii++)
				               {
						  OldValue=Rules.ConvertValue(this.Cards[ii].Value);
						  cardsx[OldValue]=(cardsx[OldValue]!=undefined ? cardsx[OldValue]+1 : 1);   
       						   if(OldValue > Configuration.NCards ||  cardsx[OldValue]>1)
						   {   
						       Board.Temp.SCId=i;
						       this.Cards[ii].Value=Board.Swap(this.Cards[ii].Value);
						  
						   }    
				   
				               }

                                      }
				   //permitir al usuario agregar cartas
				   Board.Temp.UAllow=true;
				   //otorgar el turno
				   Rules.NextTurn();

			       }	    
			   };  
		       else
			   this.Player[0].Input=function ()
		           {

			       Cards=this.Cards;	
			       for(var i=0;i<UnoAlSiete.Configuration.NCards;i++)
				   if(Cards[i].Collision(Mouse,1))
			       {
				   OldValue=this.Cards[i].Value;
				   NewValue=UnoAlSiete.Board.Swap(this.Cards[i].Value);
				   this.Cards[i].Value=NewValue;
				   //otorgar mi turno a otro jugador
				   if(OldValue!=NewValue)
					   UnoAlSiete.Rules.NextTurn();

			       }	
			   
		           };
		}        
		         //Crear Scrolling para Usuario si es que no se logra visualizar el resto de las cartas en el juego
		
		         Tam= UnoAlSiete.Configuration.NCards*this.Player[0].Cards[0].Width;
		         if(Tam>CANVAS.width)
			     this.Player[0].Panel={
				              "AllCards":{
  						          "Width":UnoAlSiete.Configuration.NCards*UnoAlSiete.Player[0].Cards[0].Width,
						          "Overflow":UnoAlSiete.Configuration.NCards*UnoAlSiete.Player[0].Cards[0].Width-CANVAS.width,
						          "Move":0
			                                 },
				              "Scroll": function()
				               {
						   var collision=false;
						   Cards=UnoAlSiete.Player[0].Cards;
						   
						   //Obtener coordenadas del mouse
						   if(Mouse.Pressed && !Mouse.Move)
						       this.AllCards.Move=Mouse.X-Cards[0].X;

    						   //detectar colision
    						   for(var i=0;i<UnoAlSiete.Configuration.NCards;i++)
						       if(Cards[i].Collision(Mouse,1))
							   collision=true;

						   //condicion para el overflow
						   if(collision &&  Mouse.Pressed)
						   {
						       Cards[0].X=Mouse.X-this.AllCards.Move;
 		       				       Cards[0].X=(Cards[0].X<0-this.AllCards.Overflow ? 0-this.AllCards.Overflow : Cards[0].X+this.AllCards.Width > CANVAS.width + this.AllCards.Overflow? 0 : Cards[0].X );

						       //organizar posiciones
     						       //scrolling
						       for(var i=1;i<UnoAlSiete.Configuration.NCards;i++)						       
			 				   if(Mouse.Move)
							       Cards[i].X=Cards[0].X+i*Cards[0].Width;
						   }    
						   
						     for(var i=1;i<UnoAlSiete.Configuration.NCards;i++)						   
							       Cards[i].X=Cards[0].X+i*Cards[0].Width;
					       }
			                     }; 
		
		         
		//Inicializar la mesa
		this.Board.Init();
		//Inicializar el valor de las cartas de los jugadores
		this.Rules.Shuffle();
		//crear el boton para regresar al menu
		this.Rules.BtnMenu=new Objeto(260*WINDOW.WPercent,40*WINDOW.HPercent,0,CANVAS.height/1.6);
		this.Rules.BtnMenu.X=(CANVAS.width-this.Rules.BtnMenu.Width)/2;
		this.Rules.BtnMenu.SubImg=2;
	    },
     "Input": function()//funcion principal de entrada del juego actual	
	    {
		if(!this.Rules.GameOver)
		{    
		    if(Mouse.Click)	
		    {    
			this.Player[0].Input();

		    }    
		    this.Board.Input();

		    try
		    {    
			this.Player[0].Panel.SortPos();
		    }   
		    catch(evt)
		    {
		    }    
		    

		}    
		this.Rules.Input();
	    },
     "Output": function()//funcion principal de salida del juego actual
  	    {
		//Renderizar todo el juego
		
		for(var i=1;i<this.Player.length;i++)
		    this.Player[i].Output();
		this.Board.Output();
		try
		{    
		    this.Player[0].Panel.Scroll();
		}   
		catch(evt)
		{
		}    
		this.Player[0].Output();
		this.Rules.Output();
		//Texto.Output(0,15*WINDOW.WPercent,30*WINDOW.HPercent,this.Name);
	    }
    };

