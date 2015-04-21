/*
Libreria creada por el desarrollador: Carlos Chavez Laguna.
2014
var ccl={
"holi":4,
"var_dump":
*/
//nombre de espacios
var ccl={};


ccl.var_dump= function (varx,str,k)
{
  var tipo="",vary;
  str=str || "";
  k=k || 0;
    for (i in varx)
    {
	
	
	       for(j=0;j<k;j++)
		   str+=" ";
		str+="Var: "+i+" ("+typeof varx[i]+")";


	if(typeof varx[i] == "object")
	    {
		vary=varx[i];
		k+=3;
		str+="\n";
		str=this.var_dump(vary,str,k);
		k-=3;
	    }
	else
	  str+=" value: "+varx[i]+"\n";
	    
	
    }

      return str;
};


ccl.Mouse={
               "X":0,
               "Y":0,
               "Box":null,
               "getXYPosition": function(evt,canvas)
                              {

				  canvas=canvas||false;

				  with(this)
				  {    

		    		      X=evt.clientX - Box.left;
		    		      Y=evt.clientY - Box.top;
//				      X = evt.pageX - Box.left;
//				      Y = evt.pageY - Box.top;

				      if(canvas)
					  Output(canvas);
					  	  			    
				       else
					  return "X:"+X+" Y:"+Y;
				  }

			      },
                   "Output":function (canvas)
                           {
			       with(this)
				{   
			        canvas.getContext("2d").fillText("X:"+X+" Y:"+Y,X,Y);	
				}
			   }
               };

//Clase de Random
function Random()
{
             this.Backup=Array();
             this.Start=0;
             this.End=0;
             this.Times=0;
             this.Reset=  function()
                          {
			      this.Times=0;
			      this.Backup=Array();
			  };
             this.Range = function(start,end,range) 
                          {
			      this.Start=start;
			      this.End=end;
			      if(this.Times==range)
				 {     
				     this.Reset();
				     return true;
				 }      
			      return false;
			  } 
             this.Next=   function(mode,start,end)
                          {
			      
			      start= start || this.Start;
			      end= end || this.End;

			      mode= mode || false;		
			      switch(mode)
			      {
			      case "NoRepeat": // Random unico y sin repeticion	    
				  var n=0;
				  
				  do 
				  {
          		              n=Math.floor((Math.random()*(end))+start);

			              if (this.Backup[n]==undefined)
					  this.Backup[n]=0;
				      
           			      this.Backup[n]++;
	         		  }
				  while(this.Backup[n]!=1);			    
				  
				  this.Times++;
				  return n;
             			  break;
			      default:
				  return Math.floor((Math.random()*(end))+start); 
			      }		    
		        };

}
//Random especializado

ccl.Random={ 
             "Backup":Array(),
             "Reset":  function()
                    {
			this.Backup=Array();
		    },
             "Next":   function(start,end,mode)
                    {
			mode= mode || false;		
			switch(mode)
			{
			case "NoRepeat": // Random unico y sin repeticion	    
			  var n=0;
			    
			    do 
			      {
          		            n=Math.floor((Math.random()*(end))+start);

			            if (this.Backup[n]==undefined)
			        	this.Backup[n]=0;
			    
           			    this.Backup[n]++;
	         	       }
			    while(this.Backup[n]!=1);			    

			    return n;
             	        break;
			default:
			    return Math.floor((Math.random()*(end))+start); 
			}		    
		    }
            };


//creaciones de la clase alarma para crear timer
function Timer(RoomSpeed,Delay)
{
    this.Delay= Delay || 0;//tiempo especifico en milisegundos
    this.RoomSpeed=RoomSpeed || 50;//velocidad original en la que esta llendo el room
    this.Times=0;//veces que se esta ejecutando el codigo
    this.TimesToPlay=0;//contador que ayuda a alcanzar el tiempo especificado para ejecutar el codigo
    this.Alarm= function(Delay)//avisar en que momento se esta cumpliendo la alarma
                {
		    //retornar fallas si es que se espera una ejecucion en menor tiempo q la velocidad de la room
		    Delay= Delay|| this.Delay;

		    if(Delay<this.RoomSpeed)
			return false;

		    this.TimesToPlay++;
		    if (Delay<this.TimesToPlay*this.RoomSpeed)
		    {
			this.TimesToPlay=0;
			this.Times++;//cuantas veces se esta ejecutando este codigo  	    
			return true;
		    }
		    else
			return false;

		  
		};
    this.Play= function(Delay,Script,Args)//ejecutar un codigo en momentos especificos	 
    {

	//revisar si es que se ingresan argumentos
	Args= Args || false;

        if(this.Alarm(Delay))
	{
	    // Tiempo cumplido de la alarma
	    if(Args) 
		Script(Args);
	    else  
		Script();

	}	  
	
    };
}

//Funciones de texto para configurarlo en el canvas
ccl.Text={
         
         "Multiline":function(Textox,MaxAncho)//crear texto multilinea
                     { 			 		

			 Str=Textox;
			 DESDE=0;
			 LARGO=0;

			 //si es que el string es mas pequeño que el año
			 if(GAME.measureText(Str).width>MaxAncho)
			 {       

			     //crear saltos de linea al string
			     Textox=Array();
			     for(var ii=0;ii<Str.length;ii++)
			     {
				 LARGO++;
				 if (GAME.measureText(Str.substr(DESDE,LARGO)).width>MaxAncho)
				 {
				     Textox.push(Str.substr(DESDE,LARGO));
				     DESDE=ii+1;
				     LARGO=0;
				 }		
			     }
			     Textox.push(Str.substr(DESDE,Str.length-DESDE));
			 }
			 return Textox;
		     }
         };
