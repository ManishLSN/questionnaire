var data=[];
var ques=[];
var optionChoice=[];
var ids = [];
var options = [];

var q="";
var optionsToBeShown=[],chartToBeShown=[],labelsToBeShown=[];
var divStyle = {
  backgroundColor: '#ffcc99'
};
var currentId='';
var Component = React.createClass({
  
  getInitialState:function(){
  return{ question:[],
    id:ids,options:[]}
  },
  onclick:function(){
  
  },

  updateState:function(){
   this.setState({question:data,id:ids});
   console.log(this.state.question);
  },
    componentWillMount:function(){
      var i=0
    dpd.ques.get(function(result,err){
    data = result;
    for(i;i<result.length;i++)
    {
     ids.push(result[i].id);
     ques.push(result[i].question);

     optionChoice.push(result[i].optionChoice);
     options.push(result[i].options);
    }
    console.log(ques);
        console.log(ids);
            console.log(optionChoice);
                console.log(options);
    
    });
 
 
    },
    
    componentDidMount:function(){
    setTimeout(this.updateState,20);
     
    },
   
    render:function(){
       q = this.state.question.map(function(question){
        return <Question questionTitle={question.question} id = {question.id} options ={question.options} optionChoice = {question.optionChoice}/>;
      });
      return(<ol>
      <form action="/index1.html">
      <input type="submit" value="Post a Question"/>
      </form>
          {q}
        </ol>
        
      );
    }
  });

var Question = React.createClass({
  getInitialState:function(){
  return{options:[],
  random:0
  }
  },
  componentDidMount:function(){
   
  },
  updateState:function(op,ra){
    this.setState({options:op,random:ra});
  },
  submitAns:function(id){
  var optionAns=[];
  var op1=document.getElementsByName(id);

  dpd.ques.get(id, function (result) {
  
    if(result.optionChoice==1){
  for(var i=0;i<op1.length-1;i++){
  if(op1[i].checked){
    optionAns.push(result.countYN[i]+1);
  }else{
    optionAns.push(result.countYN[i]);
  }
  }

  dpd.ques.put(id, {countYN:optionAns}, function(result, err) {
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

  dpd.ques.put(id, {countMultipleChoice:optionAns}, function(result, err) {
  if(err) return console.log(err);
  });
  }
  });

  setTimeout(this.updateState.bind(this,optionsToBeShown,Math.random()), 100);
  setTimeout(function () { window.location.reload(); }, 200);
  },
  
  onclick:function(opti){

   optionsToBeShown=[];
   chartToBeShown=[];
   labelsToBeShown=[];
   currentId = this.props.id;
     for(var i=0;i<opti.length;i++){
      if(opti[0]=='Yes')
      optionsToBeShown.push(<h4 id={this.props.id}>&nbsp;{'('+String.fromCharCode(65+optionsToBeShown.length)+')'}<input type='radio'name={this.props.id}/>{opti[i]}</h4>);
        else{
      optionsToBeShown.push(<h4 id={this.props.id}>&nbsp;{'('+String.fromCharCode(65+optionsToBeShown.length)+')'}<input type='checkbox'name={this.props.id}/>{opti[i]}</h4>);
        }

     console.log(optionsToBeShown);
}
     optionsToBeShown.push(<h4 id={this.props.id}><input type='submit'method= 'post'value = 'Submit'onClick = {this.submitAns.bind(this,this.props.id)} 
      name={this.props.id}/></h4>);


      dpd.ques.get(this.props.id,function(result){
      if(opti[0]=='Yes'){
      chartToBeShown.push(<BarChart width={250} height= {100} data = {result.countYN} opt={result.options}/>);
      }
      else
      chartToBeShown.push(<BarChart width={250} height= {100} data = {result.countMultipleChoice} opt={result.options}/>);
      });


     

     

  setTimeout(this.updateState.bind(this,optionsToBeShown,Math.random()), 50);

  },
  render:function(){
    return(<div  style={divStyle} onClick={this.onclick.bind(this,this.props.options)} id={this.props.id}  >
      <h3>{this.props.questionTitle}</h3>
      <form method='put' id = {this.props.id}>{this.state.options}</form>
      
     {chartToBeShown}
    
      
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

  
