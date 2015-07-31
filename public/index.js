

var qno = 1;
var url = ['8f5dc04c44e2a832','true'];
var PieChart = ReactD3.PieChart;
var cookieData = reactCookie.load('qid');
var qAnsOrNot=false;
if(cookieData!=undefined){
if(cookieData.search(url[0])>-1){
qAnsOrNot = true;
}else{
  reactCookie.save('qid','');
}
}
else{
   reactCookie.save('qid','');
}




var Component  = React.createClass({
getInitialState:function(){
return({qno:1,id:this.props.id,question : '',options:[],optionCountAns:[]})
  },
componentDidMount:function(){
},
componentWillMount:function(){
   url[0] = this.props.id;
  var a  = this;
  console.log(this.state.id);
dpd.ques.get(this.state.id,function(result){
    if(result.optionChoice=='1')
  a.setState({question:result.question,options:result.options,optionCountAns:result.countYN});
  else
  a.setState({question:result.question,options:result.options,optionCountAns:result.countMultipleChoice});
  });

},
updateState:function(){
  var a  = this;
  url[0] = this.props.id;
    dpd.ques.get(url[0],function(result){
    if(result.optionChoice=='1')
  a.setState({question:result.question,options:result.options,optionCountAns:result.countYN});
  else
  a.setState({question:result.question,options:result.options,optionCountAns:result.countMultipleChoice});
  });

},
componentDidMount:function(){
dpd.on('message',this.updateState);
},
onClickNext:function(){

var a=this;
dpd.ques.get(function(result){
  if(qno>=result.length)
    qno=0;
url = [result[qno++].id,'false'];
cookieData = reactCookie.load('qid');
 qAnsOrNot=true;
if(cookieData!=undefined){
if(cookieData.search(url[0])>-1){
qAnsOrNot = true;
}else{
  reactCookie.save('qid','');
}
}
else{
  reactCookie.save('qid','');
}

setTimeout(this.updateState, 100);
console.log(url[0]);
dpd.ques.get(url[0],function(result){
    if(result.optionChoice=='1')
  a.setState({qno:qno,question:result.question,options:result.options,optionCountAns:result.countYN});
  else
  a.setState({qno:qno,question:result.question,options:result.options,optionCountAns:result.countMultipleChoice});
  });
});
},
submitAns:function(){

 window.location.href = 'presentQuestion.html?'+this.state.id;

  var optionAns=[];
  var op1=document.getElementsByName(url[0]);

  dpd.ques.get(url[0], function (result) {
  
    if(result.optionChoice==1){
  for(var i=0;i<op1.length-1;i++){
  if(op1[i].checked){
    optionAns.push(result.countYN[i]+1);
  }else{
    optionAns.push(result.countYN[i]);
  }
  }

  dpd.ques.put(url[0], {countYN:optionAns}, function(result, err) {
  if(err) return console.log(err);
 
  });
  }
  else{
  for(var i=0;i<op1.length-1;i++){
  if(op1[i].checked==true){
    optionAns.push(result.countMultipleChoice[i]+1);
  }else{
    optionAns.push(result.countMultipleChoice[i]);
  }
  }

  dpd.ques.put(url[0], {countMultipleChoice:optionAns}, function(result, err) {
  if(err) return console.log(err);
  });
  }
  });
   
   reactCookie.save('qid',cookieData+url[0]);
 
},
render:function(){
console.log(url[0]);
  var i =0;
  var a1=this.state.optionCountAns;
  if(!(url[1]==='true')&&qAnsOrNot==false){
  if(this.state.options[0]=='Yes'){
  var op = this.state.options.map(function(option){
    
return <h5 id={url[0]}>&nbsp;{'('+String.fromCharCode(65+i)+')'}&nbsp;<input type='radio'name={url[0]}/>&nbsp;{option}&nbsp;
<span className = 'badge'>{a1[i++]}</span></h5>


  });
   
   op.push(<form id={'a'+url[0]} method ='put'>&nbsp;&nbsp;<input type='button'className = "btn btn-primary"value = 'Submit'onClick = {this.submitAns} 
      name={url[0]}/><br/><br/></form>);

}else {
var op = this.state.options.map(function(option){
    
return <h5 id={url[0]}>&nbsp;{'('+String.fromCharCode(65+i)+')'}&nbsp;<input type='checkbox'name={url[0]}/>&nbsp;{option}&nbsp;<span className = 'badge'>{a1[i++]}</span></h5>


  });
   
   op.push(<form id={'a'+url[0]}  method ='put'>&nbsp;&nbsp;<input type='button'className = "btn btn-primary"value = 'Submit'onClick = {this.submitAns} 
      name={url[0]}/><br/><br/></form>);
 }
}
else{
var data=[];
var values='';
 var op = this.state.options.map(function(option){
 
return <h5 id={url[0]}>&nbsp;{'('+String.fromCharCode(65+i)+')'}&nbsp;{option}&nbsp;<span className = 'badge'>{a1[i++]}</span>
</h5>
});
i=0;

var chart = '';



var data= this.state.options.map(function(option){

return {x:option,y:a1[i++]};

});

data = {values:data}
console.log(data);

var sort = null; // d3.ascending, d3.descending, func(a,b) { return a - b; }, etc...

var chart = <PieChart
                data={data}
                width={500}
                height={500}
                margin={{top: 10, bottom: 150, left: 150, right: 150}}
                sort={sort} />
//var chart = <BarChart width = {200} height= {100} data = {this.state.optionCountAns} opt ={this.state.options}/>

}
return(
<div>
<h4>
{this.state.question}
</h4>
{op}
<div>
{chart}
</div>
</div>
  );
}

});






var SectionComponent = React.createClass({
render:function(){
return(<div>
  <section>
<Component id = {'8f5dc04c44e2a832'}/>
  </section>
 
  
  </div>
  );
}
}




  );


