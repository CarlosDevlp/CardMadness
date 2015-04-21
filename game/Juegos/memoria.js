/*MEMORIA*/

Memoria={
		        "Name": Array("Memoria","Memory"),
                        "Instructions":Array("Obten la mayor cantidad de puntos encontrando las parejas de cartas con el mismo valor,obtendras una bonificacion en el puntaje mientras no falles.","Get a lot of points looking for the couples of cards with the same value, you'll get extra points if you don't fail."),
			"Card": Array(),
                        "Bold":false, 
			"Score": {
			          "Card":Array({"Value":0,
						"Row":0,
						"Col":0,
						"Free":true
					       },
					      {"Value":0,
						"Row":0,
						"Col":0,
						"Free":true
					       }),
			           "Bonus":0,
			           "ExtraBonus":0,//bonus segun el nivel
			           "Points":0,
			           "Chosen":0,
			           "Equal":false
			         }, 
			"Dimension":{
			             "Row":3,
			             "Col":6
			             },
                        "Reset":  function(level)
                                  {
				      this.Rules.GameOver=false;
				      Card=this.Card;
				      this.Bold=false;
				      //el nivel decide como el juego sera
				      switch(level)
				      {
					  case "easy":
					  this.Dimension.Row=2;
					  this.Dimension.Col=3;
					  this.Score.ExtraBonus=1;
					  break;
					  case "normal":
					  this.Dimension.Row=3;
					  this.Dimension.Col=4;
					  this.Score.ExtraBonus=2;
					  break;
					  case "hard":
					  this.Dimension.Row=3;
					  this.Dimension.Col=6;
					  this.Score.ExtraBonus=3;
					  if(CANVAS.width<500 || CANVAS.height<400)
					      this.Bold=true;
					  break;
				      }

				      var  Ancho=100,Largo=150;
				      
				      AnchoTotal= this.Dimension.Col*Ancho*WINDOW.WPercent;
				      LargoTotal= this.Dimension.Row*Largo*WINDOW.HPercent;
				      
				      if(AnchoTotal>CANVAS.width)  
				      {	
					  Ancho=Math.floor(CANVAS.width/this.Dimension.Col);
					  AnchoTotal= CANVAS.width;	
				      }
				      if (LargoTotal>CANVAS.height)
				      {		
				          Largo=Math.floor(CANVAS.height/this.Dimension.Row);
				          LargoTotal= CANVAS.height;
				      }	
				      
 				      CX=AnchoTotal;
				      CY=LargoTotal;
				      CX=Math.abs(CX-CANVAS.width);
				      CY=Math.abs(CY-CANVAS.height);

			              //Resetear todo el juego para un juego nuevo
				      var  N=this.Dimension.Col*this.Dimension.Row,Values=Array(),k=0;//numero de elementos de la matriz     
           			      ccl.Random.Reset();	      
				      for(var j=0;j<2;j++)	  
				          for(var jj=0;jj<N/2;jj++)
					      Values[ccl.Random.Next(0,N,"NoRepeat")]=jj+1;

				      k=0;
			//	      alert("holi");
				      
				      for(var i=0;i<this.Dimension.Row;i++)//Y
					  for(var ii=0;ii<this.Dimension.Col;ii++)//X
				          {  
					      this.Card[i][ii].Width=Ancho;
					      this.Card[i][ii].Height=Largo;
					      this.Card[i][ii].X=(CX/2)+ii*Ancho;
					      this.Card[i][ii].Y=(CY/2)+i*Largo;
					      this.Card[i][ii].SubImg=1;
					      this.Card[i][ii].Value=Values[k];
					      this.Card[i][ii].Enabled=true;
					      k++;
					  } 		
			
				      //resetear puntuacion
				      this.Score.Points=0;
      				      this.Score.Bonus=0;


                                  },  
			"Init":   function ()
			          {

				      //crear el juego

				      //Crear Cartas de la baraja
			
				    var  Ancho=100,Largo=150;
				    
				    AnchoTotal= this.Dimension.Col*Ancho*WINDOW.WPercent;
				    LargoTotal= this.Dimension.Row*Largo*WINDOW.HPercent;
				      
				    if(AnchoTotal>CANVAS.width)  
				    {	
					Ancho=Math.floor(CANVAS.width/this.Dimension.Col);
					AnchoTotal= CANVAS.width;	
				    }
				    if (LargoTotal>CANVAS.height)
				    {		
				        Largo=Math.floor(CANVAS.height/this.Dimension.Row);
				        LargoTotal= CANVAS.height;
				    }	
 
 				     CX=AnchoTotal;
				     CY=LargoTotal;
				     CX=Math.abs(CX-CANVAS.width);
				     CY=Math.abs(CY-CANVAS.height);


				   var  N=this.Dimension.Col*this.Dimension.Row,Values=Array(),k=0;//numero de elementos de la matriz
				   //for (var k=0;k<N/2;k++)
				      //distribuir valor de las cartas
				      /*
				       la mitad de la cantidad de cartas tienen la misma que la otra mitad
				       */
				      for(var j=0;j<2;j++)	  
				         for(var jj=0;jj<N/2;jj++)
							Values[ccl.Random.Next(0,N,"NoRepeat")]=jj+1;
					

				      //crear las cartas
				      for(var i=0;i<this.Dimension.Row;i++)//Y
				      {
					  this.Card.push(Array());
					  for(var ii=0;ii<this.Dimension.Col;ii++)//X
					    {  
			                      this.Card[i].push(new Objeto(Ancho, Largo, (CX/2)+ii*Ancho, (CY/2)+i*Largo));
					      this.Card[i][ii].Value=Values[k];//valor de la carta
					      this.Card[i][ii].SubImg=1;//las cartas estan boca abajo por defecto
					      this.Card[i][ii].Enabled=true;//cartas displonibles para su uso	
					      k++;	
					    }
				      }	  
				      
				     // delete Values;
				      
                                      //alert(ccl.var_dump(ccl.Random.Backup));
				      //Boton Menu
				      this.Rules.BtnMenu=new Objeto(260*WINDOW.WPercent,40*WINDOW.HPercent,0,CANVAS.height/1.6);
				      this.Rules.BtnMenu.X=(CANVAS.width-this.Rules.BtnMenu.Width)/2;
				      this.Rules.BtnMenu.SubImg=2;
				      //inicializar a la interfaz de configuracion del juego Memoria


				  },
			"Rules": {
			         "GameOver": false,
			         "GameEnd": function()
			          {
				      //cuando el juego termine
				      AllCorrect=true;
				      Card=Memoria.Card;
				      Score=Memoria.Score;				      

				      for(var i=0;i<Memoria.Dimension.Row;i++)
					  for(var ii=0;ii<Memoria.Dimension.Col;ii++)
					      if(Card[i][ii].SubImg)
						  AllCorrect=false;
				      
				      this.GameOver=false;
				      //score final
				      if(AllCorrect)
					 { 
					     
					     this.GameOver=true;
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
  					     Texto.Output(0,(CANVAS.width-(String(Score.Points).length*15*WINDOW.WPercent))/2,Y+100*WINDOW.HPercent," "+Score.Points);
					     //boton para volver al menu					     
					     Texto.Style(Texto.Font.Family,14*WINDOW.WPercent+"px","white");
			     		     Intf.Sprite.Draw(this.BtnMenu.SubImg,this.BtnMenu.X,this.BtnMenu.Y,this.BtnMenu.Width,this.BtnMenu.Height);
	     				     Texto.Output(11,this.BtnMenu.X+30*WINDOW.WPercent,this.BtnMenu.Y+(this.BtnMenu.Height/2));
					 }    

				  },
			          "Flip": function(Card1,row,col)
			          {
				      /*
				       Reglas de MEMORIA:
				       -Si escoges cartas iguales entonces se sumara un punto a tu bonus y otro a tu score
				       -Si tienes varias iguales sin equivocarte se agranda tu bonus para añadirlo a tu score
				       -Si fallas las cartas que fallaste se voltean y tu bonus se reduce a cero.
				       */
				       SCard=Memoria.Score.Card;//carta temporal  
				       Card1.SubImg=0;//carta de ahora				      					      
				       Score=Memoria.Score;
				       Card=Memoria.Card;

				        if (!(SCard[0].Free || SCard[1].Free))
					    {	 

						
						//volver a voltear las cartas
						if(Card[SCard[0].Row][SCard[0].Col].Enabled)
						  {  
						    Card[SCard[0].Row][SCard[0].Col].SubImg=1;
						      
					    	      //Bonus a cero
						      Score.Bonus=0;
						  }   
						if(Card[SCard[1].Row][SCard[1].Col].Enabled)		
						  {  
						    Card[SCard[1].Row][SCard[1].Col].SubImg=1;	
						     //Bonus a cero
						      Score.Bonus=0;
						  }
						
						SCard[0].Free=true;
    						SCard[1].Free=true;
					    }	
				      



				       //si esta libre una de las dos cartas lo escoge
				            
				      
				      
					    for(var i=0;i<2;i++)
					    {	

					      if(SCard[i].Free)
					      {
						  
						 with(SCard[i])
						 { 
						 
							
						    //actualizar
						    Value=Card1.Value;
						    Row=row;
						    Col=col;
						    Free=false;

						 }
					        break;
						  
					      }	  

						
					    }	
				     


				         if(!(SCard[0].Free || SCard[1].Free))//si ya hay una carta tomada sumada con esta
					{    
					
					  cond1=SCard[0].Value==SCard[1].Value;
				          cond2=!(SCard[0].Row==SCard[1].Row && SCard[0].Col==SCard[1].Col);
					  cond3=Card[SCard[0].Row][SCard[0].Col].SubImg==0 && Card[SCard[0].Row][SCard[0].Col].SubImg==0;  
					
			                  if(cond1 && cond2 && cond3)
					    {	
						//puntaje acumulando
						Score.Bonus+=(1*Score.ExtraBonus);
						Score.Points+=Score.Bonus;	
						//acumulando cartas volteadas eternamente
						Score.Chosen+=2;
						//anular toda colision de ambas cartas
						Card[SCard[0].Row][SCard[0].Col].Enabled=false;
						Card[SCard[1].Row][SCard[1].Col].Enabled=false;
						Card[SCard[0].Row][SCard[0].Col].SubImg=0;
						Card[SCard[1].Row][SCard[1].Col].SubImg=0;
						//alert(this.Score.Bonus);
						Score.Equal=true;
					    }	
					   
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
						 User.AddPoints(Memoria.Score.Points);				 
						 Room.Index=1;
					     }	 
				     }	     
				 }
			        },
			"Input": function()
		                  {
				      
				      
				    if(Mouse.Click && !this.Rules.GameOver)
			            {		
				      for(var i=0;i<this.Dimension.Row;i++)
				  	for(var ii=0;ii<this.Dimension.Col;ii++) 
					    if(this.Card[i][ii].Collision(Mouse,1) && this.Card[i][ii].Enabled)
						{
						   // alert(this.Card[i][ii].Value);
					    	  //  this.Card[i][ii].SubImg=0; //voltear la carta
						    this.Rules.Flip(this.Card[i][ii],i,ii);
						}   

				    }

				      this.Rules.Input();
				  },
			       
			"Output": function()
			          {
				    Card=this.Card;
 			      //Renderizar las cartas
				    for(var i=0;i<this.Dimension.Row;i++)
				  	for(var ii=0;ii<this.Dimension.Col;ii++)
					    
					  switch(Card[i][ii].SubImg)
				          {
					    case 0://cara
					      Games.Deck.Sprite.Draw(0,Card[i][ii].X,Card[i][ii].Y,Card[i][ii].Width,Card[i][ii].Height,
								    (Card[i][ii].Value-1)*225,0,225,315);
					      if(this.Bold)
						  {						      
						      Texto.Style(Texto.Font.Family,30*WINDOW.WPercent+"px","black");
						      Texto.Output(0,Card[i][ii].X+(Card[i][ii].Width/4),Card[i][ii].Y+(Card[i][ii].Height/2)," "+Card[i][ii].Value);
						  }    
					    break;  
					    case 1: //sello 
					      Games.Deck.Sprite.Draw(1,Card[i][ii].X,Card[i][ii].Y,Card[i][ii].Width,Card[i][ii].Height);
					    break;  
					  } 
					   
				//Renderizar texto	    
				     //dibujar barra de puntuacion 
				     Games.Source.Draw(0,0,0,70*WINDOW.WPercent,40*WINDOW.HPercent);
				     //Mostrar puntuacion 
				     Texto.Style(Texto.Font.Family,28*WINDOW.WPercent+"px","white");
				     Texto.Output(0,15*WINDOW.WPercent,30*WINDOW.HPercent," "+this.Score.Points);
				      //GAME OVER
				      this.Rules.GameEnd();
				      
				  }
		       };
