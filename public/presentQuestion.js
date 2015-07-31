var id = window.location.search.substring(1);


var url = id.split('?');
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


var socket  = io();

var Component  = React.createClass({
getInitialState:function(){
return({id:url[0],question : '',options:[],optionCountAns:[]})
  },

componentWillMount:function(){
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
submitAns:function(){

 window.location.href = 'presentQuestion.html?'+this.state.id

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
  var i =0;
  var a1=this.state.optionCountAns;
  if(!(url[1]==='true')&&qAnsOrNot==false){
  if(this.state.options[0]=='Yes'){
  var op = this.state.options.map(function(option){
    
return <h3 id={url[0]}>&nbsp;{'('+String.fromCharCode(65+i)+')'}&nbsp;<input type='radio'name={url[0]}/>&nbsp;{option}&nbsp;
<span className = 'badge'>{a1[i++]}</span></h3>


  });
   
   op.push(<form id={'a'+url[0]} method ='put'>&nbsp;&nbsp;<input type='button'className = "btn btn-primary"value = 'Submit'onClick = {this.submitAns} 
      name={url[0]}/><br/><br/></form>);

}else {
var op = this.state.options.map(function(option){
    
return <h3 id={url[0]}>&nbsp;{'('+String.fromCharCode(65+i)+')'}&nbsp;<input type='checkbox'name={url[0]}/>&nbsp;{option}&nbsp;<span className = 'badge'>{a1[i++]}</span></h3>


  });
   
   op.push(<form id={'a'+url[0]}  method ='put'>&nbsp;&nbsp;<input type='button'className = "btn btn-primary"value = 'Submit'onClick = {this.submitAns} 
      name={url[0]}/><br/><br/></form>);
 }
}
else{
var data=[];
var values='';
 var op = this.state.options.map(function(option){
 
return <h3 id={url[0]}>&nbsp;{'('+String.fromCharCode(65+i)+')'}&nbsp;{option}&nbsp;<span className = 'badge'>{a1[i++]}</span>
</h3>
});
i=0;
var chart = '';
var PieChart = ReactD3.PieChart;


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
                margin={{top: 0, bottom: 10, left: 100, right: 100}}
                sort={sort} />
//var chart = <BarChart width = {200} height= {100} data = {this.state.optionCountAns} opt ={this.state.options}/>

}
return(
<div>
<h2>
{this.state.question}
</h2>
{op}
{chart}
</div>
  );
}

});




var Chart = React.createClass({
  render:function(){
    return(<svg width={this.props.width} height = {this.props.height}>{this.props.children}</svg>);
  }
});

var Bar = React.createClass({
  getDefaultProps:function(){
    return{
      width:0,
      height:0,
      offset:0
    }
  },
  render:function(){
    return(
<rect fill={this.props.color}
width={this.props.width}
height={this.props.height}
x ={this.props.offset}
y= {this.props.availableHeight-this.props.height}/>
      );
  }
});
var Text = React.createClass({
  render:function(){
    return(
<text 

x={this.props.offset}
y= {this.props.availableHeight-this.props.height}

>
{this.props.option}
</text>
      );
  }
});
var DataSeries = React.createClass({
  getDefaultProps: function() {
    return {
      title:'',
      data: []
    }
  },

  render: function() {
    var props = this.props;

    var yScale = d3.scale.linear()
      .domain([0, d3.max(this.props.data)])
      .range([0, this.props.height]);

    var xScale = d3.scale.ordinal()
      .domain(d3.range(this.props.data.length))
      .rangeRoundBands([0, this.props.width], 0.05);

    var bars = _.map(this.props.data, function(point, i) {
      return (
        <Bar height={yScale(point)} width={xScale.rangeBand()} offset={xScale(i)} availableHeight={props.height} color={props.color} key={i} />
             )
    });
    var text = _.map(this.props.opt,function(point,i){
      return(<Text height='4'  offset = {xScale(i)+xScale.rangeBand()/2.6} availableHeight={props.height} option = {'('+String.fromCharCode(65+i)+')'} color='#ffffff'/>
        
        )
    });

    return (
      <g id='a'>
      {bars}
      {text}
      </g>
    );
  }
});


var BarChart = React.createClass({
  render: function() {
    return (
      <Chart width={this.props.width} height={this.props.height}>
        <DataSeries opt={this.props.opt} data={this.props.data} width={this.props.width} height={this.props.height}  color="teal" />
      
      </Chart>
    );
  }
});

React.render(<Component/>,document.getElementById("abc"));
