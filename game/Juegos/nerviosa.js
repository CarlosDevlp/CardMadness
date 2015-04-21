/*Mano nerviosa*/
Nerviosa={
         "Name":Array("Mano Nerviosa" , "Nervous"),
         "Instructions":Array("Se tan rapido como puedas tocando la carta cuando tenga el mismo valor que el cuadro de la izquierda, obtendras muchos puntos si no tocas la carta con un valor diferente al cuadro izquierdo.","Be as fast as possible touching the card if it has the same value as in the box nex to it, you'll get a lot of points if you don't touch the one that doesn't have the same value."),
         "Card":null,
         "Score":{
	          "Points":0,
	          "Counter":0,
	          "Bonus":0,
	          "ExtraBonus":0,//bonus que te da el nivel en el que estas
	          "Touch":false //permisos para tocar la carta
	         },
         "Rules":{
	          "GameOver": function()
	                      {
				  
				  if(!Nerviosa.Clock.Sec)// cuando el tiempo es cero
				  {
				      		     //Mostrar que jugador gano 
					     W=300*WINDOW.WPercent;	
					     H=200*WINDOW.HPercent;
					     X=(CANVAS.width-W)/2;
  					     Y=(CANVAS.height-H)/2;		
					     //fondo	
					     Intf.Sprite.Draw(1,X,Y,W,H);
					     //texto	
					     Texto.Style(Texto.Font.Family,24*WINDOW.WPercent+"px","white");
					     Texto.Output(7,X+50*WINDOW.WPercent,Y+50*WINDOW.HPercent);
  					     Texto.Output(0,(CANVAS.width-(String(Nerviosa.Score.Points).length*15*WINDOW.WPercent))/2,Y+100*WINDOW.HPercent," "+Nerviosa.Score.Points);
					     //boton para volver al menu					     
					     Texto.Style(Texto.Font.Family,14*WINDOW.WPercent+"px","white");
			     		     Intf.Sprite.Draw(this.BtnMenu.SubImg,this.BtnMenu.X,this.BtnMenu.Y,this.BtnMenu.Width,this.BtnMenu.Height);
	     				     Texto.Output(11,this.BtnMenu.X+30*WINDOW.WPercent,this.BtnMenu.Y+(this.BtnMenu.Height/2));
			
				  } 
			      },
	             "Input": function()
	                      {
			      	  if(!Nerviosa.Clock.Sec)
				  {	 
				      if(Mouse.Move)
					  this.BtnMenu.SubImg=(this.BtnMenu.Collision(Mouse,1)? 3 : 2);
				      
			              if(Mouse.Click && this.BtnMenu.SubImg==3)
					  {
					      User.AddPoints(Nerviosa.Score.Points);				 
					      Room.Index=1;
					  }    
				  }

  				      if(Mouse.Move)
					  this.BtnGiveUp.SubImg=(this.BtnGiveUp.Collision(Mouse,1)? 3 : 2);
				  
				      if(Mouse.Click && this.BtnGiveUp.SubImg==3)
					  Nerviosa.Clock.Sec=0;
				     
			      },
	             "Output": function()
	                     {
				 //Boton para rendirse
				 Btn=this.BtnGiveUp;
				 Intf.Sprite.Draw(Btn.SubImg,Btn.X,Btn.Y,Btn.Width,Btn.Height);
				 Games.Source.Draw(3,Btn.X+Btn.Width/4,Btn.Y+Btn.Height/4,Btn.Width/2,Btn.Height/2);
				 //Game Over
				 this.GameOver();
			     } 
	     
	         },
         "Clock"://el tiempo que se le da al jugador para hacer puntos
                 { 
		   "Sec":100,  
		   "Time": function()  
		             {
				 //obtener tiempo en formato H/M/S a partir de los segundos
				 //de los segundos
				 S=this.Sec;
				 H=M=0;
				 
				 //obtener horas
				 while(S>=3600)
				 {
				     S-=3600;
				     H++;
				 }   
				 //obtener minutos
				 while(S>=60)
				 {
				     S-=60;
				     M++;
				 }    
				 //el resto de segundos
				 
				 return String(""+H+":"+M+":"+S);
			     },
		   "Output": function()  
		             {

				 //renderizar tile
				 Games.Source.Draw_ext(0,this.X,this.Height,this.Width,this.Height,false,false,false,false,180);
				 Games.Source.Draw(1,this.X-1,this.Y,this.Width2,this.Height);
				 //renderizar texto
				 Texto.Style(Texto.Font.Family,22*WINDOW.WPercent+"px","white");
				 Texto.Output(0,this.X-this.Width+this.Width/5,this.Height/1.4,this.Time());
				 
				 if(this.Timer.Alarm())
			             this.Sec-=(Nerviosa.Clock.Sec? 1:0);				     

		            
			     } 
		 },  
         "Alarm":{
	          "Times":0,
	          "Timer":0,
	          "Delay":1000,  
	          "Play": function(Delay,Script,Args)	 
	                  {
 			      //retornar fallas si es que se espera una ejecucion en menor tiempo q la velocidad de la room
			       if(Delay<Room.Speed)
				  return false;
			      //revisar si es que se ingresan argumentos
			      Args= Args || false;
			     


			      this.Timer++;
			      if (Delay<this.Timer*Room.Speed)
			      {
				  // Tiempo cumplido de la alarma
				if(Args) 
				  Script(Args);
				else  
				  Script();

				this.Timer=0;
				this.Times++;//cuantas veces se esta ejecutando este codigo  
			      }	  
			
			      return this.Timer;
			      
			  }
	         },
         "Reset": function(Level)
                {
		    this.Score.Touch=true;
		    switch(Level)
		    {
		     case "easy":
			//setear tiempo de rapidez para la aparicion de las cartas
			this.Alarm.Delay=1000;
			//resetear tiempo
			this.Clock.Sec=120;
			this.Score.ExtraBonus=1;
		     break;
	             case "normal":
			//setear tiempo de rapidez para la aparicion de las cartas
			this.Alarm.Delay=700;
			//resetear tiempo
			this.Clock.Sec=100;
			this.Score.ExtraBonus=2;
   	             break;	
		     case "hard":
			//setear tiempo de rapidez para la aparicion de las cartas
			this.Alarm.Delay=400;
			//resetear tiempo
			this.Clock.Sec=60;
			this.Score.ExtraBonus=4;
 		     break;	
		    }
		    //resetear score
		    this.Score.Points=0;

		    //resetear baraja
		    this.Score.Counter=0;
		},
         "Init": function()
                {
		    //crear juego
		    //crear Cartas de la baraja
		    var Ancho=120*WINDOW.WPercent,Largo=160*WINDOW.HPercent;
		    this.Card=new Objeto(Ancho, Largo,CANVAS.width/2-Ancho/2,CANVAS.height/2-Largo/2);
		    this.Card.SubImg=1;
		    this.Card.Value=1;
		    this.Card.Suit=1;
		    //iniciar y/o definir las propiedades del reloj
		    this.Clock.Y=0;
		    this.Clock.Width=100*WINDOW.WPercent;
		    this.Clock.Width2=this.Clock.Width/3;
		    this.Clock.Height=40*WINDOW.HPercent;
    		    this.Clock.X = CANVAS.width-this.Clock.Width2;
		    //Boton Menu
		    this.Rules.BtnMenu=new Objeto(260*WINDOW.WPercent,40*WINDOW.HPercent,0,CANVAS.height/1.6);
		    this.Rules.BtnMenu.X=(CANVAS.width-this.Rules.BtnMenu.Width)/2;
		    this.Rules.BtnMenu.SubImg=2;
		    //Boton Give Up
		    this.Rules.BtnGiveUp=new Objeto(70*WINDOW.WPercent,50*WINDOW.HPercent,0,0);
		    this.Rules.BtnGiveUp.X=CANVAS.width-this.Rules.BtnGiveUp.Width;
		    this.Rules.BtnGiveUp.Y=CANVAS.height-this.Rules.BtnGiveUp.Height;
		    this.Rules.BtnGiveUp.SubImg=2;
		    //Timer para el reloj
		    this.Clock.Timer=new Timer(Room.Speed,1000);
		},
         "Input": function()
                {
		    //viendo si hago click justo cuando el numero al costado coincide con el valor de la carta
		    if(Mouse.Click && Nerviosa.Clock.Sec)
			if(this.Card.Collision(Mouse,1) && this.Score.Touch)
			    {
				this.Score.Touch=false;
				if(this.Score.Counter==this.Card.Value)
				{
				    this.Score.Points+=1+this.Score.Bonus;
				    this.Score.Bonus+=(1*this.Score.ExtraBonus);
				}    
				else
				    this.Score.Bonus=0;
		            }		

		    
		    this.Rules.Input();
		},
         "Output": function()
                {
		    
		  
		    //Games.Deck.Sprite.Draw(1,this.Card.X,this.Card.Y,this.Card.Width,this.Card.Height);
		    
		    Card=this.Card;
		    //alarma 1 para el calculo de aparicion de las cartas
		    if(Nerviosa.Clock.Sec)
	 	    {	
		    this.Alarm.Play(
			            this.Alarm.Delay,
			            function (Card)
				    {
					

					//resetear el random para evitar errores y para manejar la salida de las cartas
					if(Nerviosa.Alarm.Times%13==0)
					   {
					       ccl.Random.Reset();
					       Nerviosa.Score.Counter=0;
					       Card.SubImg=0;
					       if (Card.Suit>4)
					          Card.Suit=1;
					   }    
					Nerviosa.Score.Touch=true;
   					Nerviosa.Score.Counter++;
					Card.Suit=ccl.Random.Next(1,4);
					Card.Value=ccl.Random.Next(1,13,"NoRepeat");
					

				    }
				    ,Card);
			}
		         //renderizar
		            //Cartas
		            Games.Deck.Sprite.Draw(Card.SubImg,Card.X,Card.Y,Card.Width,Card.Height,(Card.Value-1)*225,(Card.Suit-1)*315,225,315);
		            //barra1
		            Games.Source.Draw(0,0,0,70*WINDOW.WPercent,40*WINDOW.HPercent);
		            //barra2
          		    Games.Deck.Sprite.Draw(2,Card.X-Card.Width,Card.Y,Card.Width,Card.Height);
		           //Reloj
		          this.Clock.Output();
		    
		    //          		    Games.Source.Draw(1,Card.X-Card.Width,Card.Y,Card.Width,Card.Height);
		        //renderizar letras
   		                   
		    
		                    //Puntos
		                     Texto.Style(Texto.Font.Family,28*WINDOW.WPercent+"px","white");
				     Texto.Output(0,15*WINDOW.WPercent,30*WINDOW.HPercent," "+this.Score.Points);
		            
		                    //Canto
		                     Texto.Style(Texto.Font.Family,36*WINDOW.WPercent+"px","white");
		                     Texto.Output(0,Card.X-(90*WINDOW.WPercent),Card.Y+(Card.Height/2)," "+this.Score.Counter);
		                    //Texto.Output(0,,30*WINDOW.HPercent," "+this.Score.Counter);
		       //Reloj
		    
		    this.Rules.Output();
	        }
         
         };
